
'use client'
import React from 'react';
import {
    Box,
    Grid,
    Typography,
} from '@mui/material';
import { useEntity } from '@/hooks/useEntity';
import { RenuewCard } from '@/components/common/RenuewCard/RenuewCard';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import { useTranslations } from 'next-intl';
import { SassButton } from '@/components/common/buttons/GenericButton';

const RenuewPreferencesPage = () => {
    const { entitySuscription } = useEntity()
    const t = useTranslations();
    return (
        <Grid container spacing={1} display={'flex'} flexDirection={'column'} justifyContent="flex-start" pb={10}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                <Typography variant='h5'>{t('renew.title')}</Typography>
                <Typography variant='body1'>{t('renew.text')}</Typography>
            </Box>
            <Box sx={{mt:4}}>
                {entitySuscription.map((plan, index) => (
                    <RenuewCard key={index} plan={plan} />
                ))}
                {entitySuscription.length === 0 && <EmptyState />}
                {entitySuscription.length === 0 && <Box sx={{display:'flex', justifyContent:'center'}} ><SassButton color='primary' variant='contained'>{t('core.button.upgradeSuscription')}</SassButton></Box>}
            </Box>
        </Grid>
    );
};

export default RenuewPreferencesPage;
