'use client'

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { SxProps, Theme } from '@mui/material';
import { useLayout } from '@/hooks/useLayout';
import IUser, { ICollaborator } from '@/domain/auth/IUser';
import { EntityCollaboratorData } from '@/components/features/entity/UserAssignment';
import { useToast } from '@/hooks/useToast';
import { fetchUsers } from '@/services/common/users.service';
import { assignedUserToEntity, deleteOwnerOfEntity, fetchAllOwnerOfEntity } from '@/services/common/entity.service';
import IUserEntity from '@/domain/auth/IUserEntity';
import { useCommonModal } from '@/hooks/useCommonModal';

export interface IAssing {
    "fullName": string
    "email": string
    "role": "admin" | 'owner'
    "phoneNumber": string
    "entityId": string

}

export interface EntityUpdatedFormValues {
    "uid": string
    "name": string
    "active": boolean
    "street": string
    "country": string
    "city": string
    "postalCode": string
    //"region": string
    "taxId": string
    legalName: string
    billingEmail: string
};

export interface BrandFormValues {
    "backgroundColor": string
    "labelColor": string
    "textColor": string
    logoUrl: File | string,
    stripImageUrl: File | string,
    iconUrl: File | string,
};

export type TabItem = {
    label: string | ReactNode;
    icon?: ReactNode;
    content: ReactNode;
    disabled?: boolean;
    sx?: SxProps<Theme>;
};

export const useCollaboratorsController = () => {
    const t = useTranslations();
    const { currentEntity } = useEntity();
    const { token, user } = useAuth()
    const { changeLoaderState } = useLayout()
    const { showToast } = useToast()
    const { closeModal } = useCommonModal()
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<Array<ICollaborator>>([]);
    const [currentProject, setCurrentProject] = useState<EntityCollaboratorData>({
        owner: { user: user as IUser, role: 'owner' },
        collaborators: [],
        id: currentEntity?.entity.id as string,
        data: []
    });

    const handleAssign = async ({ userId, role, projectId }: { userId: string, role: string, projectId: string }) => {
        // API call to assign user
        const userData: IUser = users.find(e => e.user.id === userId)?.user as IUser
        const data: IAssing = {
            "fullName": userData.fullName,
            "email": userData.email,
            "role": role as "admin" | 'owner',
            "phoneNumber": userData.phoneNumber,
            "entityId": projectId,
        }
        setLoading(true)
        try {
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            await assignedUserToEntity(data, token)
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

    const handleRemove = async ({ userId }: { userId: string, projectId: string }) => {
        try {
            const data = currentProject.data.find(e => e.user.id === userId)
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            await deleteOwnerOfEntity(data?.id as string)
            changeLoaderState({ show: false })
            showToast(t('core.feedback.success'), 'success');
            setLoading(false)
            updateColaborators()
            closeModal()
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

    const handleFetchUsers = useCallback(async () => {
        setLoading(true)
        fetchUsers().then(async res => {
            setUsers(res.map(e => ({ user: e, role: 'admin' })))
        }).catch(e => {
            showToast(e?.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }, [showToast]);



    const updateColaborators = useCallback(async () => {
        const data: Array<IUserEntity> = await fetchAllOwnerOfEntity(currentEntity?.entity.id as string)
        setCurrentProject({
            owner: {
                user: data.find(e => e.role === 'owner')?.user as IUser,
                role: 'owner'
            },
            collaborators: data.map(e => ({ user: e.user, role: e.role })),
            id: currentEntity?.entity.id as string,
            data
        })
    }, [currentEntity?.entity.id])


    useEffect(() => {
        if (currentEntity?.entity.id) {
            handleFetchUsers()
            updateColaborators()
        }
    }, [currentEntity?.entity.id, handleFetchUsers, updateColaborators])




    return { handleAssign, handleRemove, users, currentProject, loading }
}

