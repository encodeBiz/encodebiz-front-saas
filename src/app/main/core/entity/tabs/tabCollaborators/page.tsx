
'use client'
import React from 'react';
import {
    Box,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useEntity } from '@/hooks/useEntity';
import { BaseButton } from '@/components/common/buttons/BaseButton';
import { useCollaboratorsController } from './page.controller';
import UserAssignment, { EntityCollaboratorData } from '@/components/features/entity/UserAssignment';
import IUser from '@/domain/auth/IUser';

const CollaboratorsPreferencesPage = () => {
    const t = useTranslations();
    const { handleAssign, handleRemove, users, currentProject, loading } = useCollaboratorsController();
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    const { openModal } = useCommonModal()
    return (
        <UserAssignment
            project={currentProject as EntityCollaboratorData}
            users={users}
            onAssign={handleAssign}
            onRemove={handleRemove}
            proccesing={loading}
            currentUser={user as IUser} // from your auth context
        />
    );
};

export default CollaboratorsPreferencesPage;
