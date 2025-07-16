
'use client'
import React from 'react';
import {
    Grid,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEntity } from '@/hooks/useEntity';
import { RenuewCard } from '@/components/common/RenuewCard/RenuewCard';

const RenuewPreferencesPage = () => {
    const t = useTranslations();
    const { entitySuscription } = useEntity()
 
     return (
        <Grid container spacing={1} justifyContent="center">
            {entitySuscription.map((plan, index) => (
                <RenuewCard  key={index} plan={plan}  />
            ))}
        </Grid>
    );
};

export default RenuewPreferencesPage;
