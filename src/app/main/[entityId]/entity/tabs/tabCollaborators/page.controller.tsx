/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { useLayout } from '@/hooks/useLayout';
import IUser from '@/domain/core/auth/IUser';
import { EntityCollaboratorData } from '@/components/features/entity/UserAssignment';
import { useToast } from '@/hooks/useToast';
import { assignedUserToEntity, deleteOwnerOfEntity, fetchAllOwnerOfEntity } from '@/services/core/entity.service';
import IUserEntity from '@/domain/core/auth/IUserEntity';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useAppLocale } from '@/hooks/useAppLocale';

export interface IAssing {
    "role": "admin" | 'owner'
    "email": string
    "entityId": string
}



export const useCollaboratorsController = () => {
    const t = useTranslations();
    const { currentEntity } = useEntity();
    const { token, user } = useAuth()
    const { changeLoaderState } = useLayout()
    const { currentLocale } = useAppLocale()
    const { showToast } = useToast()
    const { closeModal, openModal } = useCommonModal()
    const [loading, setLoading] = useState(false)
    const [currentProject, setCurrentProject] = useState<EntityCollaboratorData>({
        owner: { user: user as IUser, role: 'owner' },
        collaborators: [],
        id: currentEntity?.entity.id as string,
        data: []
    });

    const handleAssign = async ({ email, role, entityId }: { email: string, role: string, entityId: string }) => {
        // API call to assign user

        const data: IAssing = {
            "email": email,
            "role": role as "admin" | 'owner',
            "entityId": entityId,
        }
        setLoading(true)
        try {
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            await assignedUserToEntity(data, token, currentLocale)
            changeLoaderState({ show: false })
            showToast(t('core.feedback.success'), 'success');
            setLoading(false)
            updateColaborators()
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
            setLoading(false)
            changeLoaderState({ show: false })
        }
    };

    const handleRemove = async ({ userId }: { userId: string, entityId: string }) => {
        try {
            const data = currentProject.data.find(e => e.user.id === userId)
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            await deleteOwnerOfEntity(data?.id as string)
            changeLoaderState({ show: false })
            showToast(t('core.feedback.success'), 'success');
            setLoading(false)
            updateColaborators()
            closeModal(CommonModalType.DELETE)

            if (userId === user?.id) {
                openModal(CommonModalType.INFO)
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
            setLoading(false)
            changeLoaderState({ show: false })
        }

    };




    const [pendFetch, setPendFetch] = useState(false)
    const updateColaborators = async () => {
        setPendFetch(true)
        const data: Array<IUserEntity> = await fetchAllOwnerOfEntity(currentEntity?.entity.id as string, currentLocale)
        setCurrentProject({
            owner: {
                user: data.find(e => e.role === 'owner')?.user as IUser,
                role: 'owner'
            },
            collaborators: data.map(e => ({ user: e.user, role: e.role, status: e.status })),
            id: currentEntity?.entity.id as string,
            data
        })
        setPendFetch(false)
    }


    useEffect(() => {
        if (currentEntity?.entity.id) {
            updateColaborators()
        }
    }, [currentEntity?.entity.id])




    return { handleAssign, handleRemove, currentProject, loading, pendFetch }
}

