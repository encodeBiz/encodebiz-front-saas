
'use client'
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCollaboratorsController } from './page.controller';
import UserAssignment, { EntityCollaboratorData } from '@/components/features/entity/UserAssignment';
import IUser from '@/domain/auth/IUser';

const CollaboratorsPreferencesPage = () => {
 
    const { handleAssign, handleRemove, users, currentProject, loading } = useCollaboratorsController();
    const { user } = useAuth()
   
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
