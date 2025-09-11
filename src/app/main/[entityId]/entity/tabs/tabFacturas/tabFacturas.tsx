
'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import { useFacturaController } from './page.controller';
import { GenericTable } from '@/components/common/table/GenericTable';
import { Box, Grid, Typography } from '@mui/material';

const FacturasPreferencesPage = () => {
    const t = useTranslations();
    const {
        items, rowAction, onRowsPerPageChange, onSort,
        onNext, onBack,
        filterParams,
        columns,
        loading } = useFacturaController();

    return (
        <Grid container spacing={1} display={'flex'} flexDirection={'column'} justifyContent="flex-start" pb={10}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                <Typography variant='h5'>{t('invoice.title')}</Typography>
                <Typography variant='body1'>{t('invoice.text')}</Typography>
            </Box>
            <GenericTable
                data={items}
                rowAction={rowAction}
                columns={columns}
                title={''}
                keyField="id"
                loading={loading}
                page={filterParams.currentPage}
                rowsPerPage={filterParams.params.limit}
                onRowsPerPageChange={onRowsPerPageChange}
                onSorteable={onSort}
                sort={{ orderBy: filterParams.params.orderBy, orderDirection: filterParams.params.orderDirection }}
                onBack={onBack}
                onNext={onNext}
            />

        </Grid>
    );
};

export default FacturasPreferencesPage;
