
'use client'
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCollaboratorsController } from './page.controller';
import UserAssignment, { EntityCollaboratorData } from '@/components/features/entity/UserAssignment';
import IUser from '@/domain/auth/IUser';
import { Grid, Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

const CollaboratorsPreferencesPage = () => {

    const { handleAssign, handleRemove, currentProject, loading } = useCollaboratorsController();
    const { user } = useAuth()
    const t = useTranslations();

    return (
        <Grid container spacing={1} display={'flex'} flexDirection={'column'} justifyContent="flex-start" pb={10}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                <Typography variant='h5'>{t('colaborators.title')}</Typography>
                <Typography variant='body1'>{t('colaborators.text')}</Typography>
            </Box>
            <UserAssignment
                project={currentProject as EntityCollaboratorData}
               
                onAssign={handleAssign}
                onRemove={handleRemove}
                proccesing={loading}
                currentUser={user as IUser} // from your auth context
            />
        </Grid>
    );
};

export default CollaboratorsPreferencesPage;
