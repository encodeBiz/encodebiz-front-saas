'use client'

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { SxProps, Theme } from '@mui/material';
import { configBilling } from '@/services/common/subscription.service';
import { useLayout } from '@/hooks/useLayout';
import IUser, { ICollaborator } from '@/domain/auth/IUser';
import { EntityCollaboratorData } from '@/components/features/entity/UserAssignment';
import { useToast } from '@/hooks/useToast';
import { fetchUsers } from '@/services/common/users.service';

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
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<Array<ICollaborator>>([]);
    const [currentProject, setCurrentProject] = useState<EntityCollaboratorData>({
        owner: { user: user as IUser, role: 'owner' },
        collaborators: [],
        id: currentEntity?.entity.id as string
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

        

    };

    const handleRemove = async ({ userId, projectId }: { userId: string, projectId: string }) => {
        // API call to remove user

    };

    const handleFetchUsers = async () => {
        setLoading(true)
        fetchUsers().then(async res => {
            setUsers(res.map(e => ({ user: e, role: 'admin' })))
        }).catch(e => {
            showToast(e?.message, 'error')
        }).finally(() => {
            setLoading(false)
        })

    };

    useEffect(() => {
        handleFetchUsers()
    }, [currentEntity?.entity.id])



    return { handleAssign, handleRemove, users, currentProject }
}

