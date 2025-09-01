
'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import { useWebHookTabController } from './page.controller';
import { GenericTable } from '@/components/common/table/GenericTable';
import { Box, Grid } from '@mui/material';
import { SassButton } from '@/components/common/buttons/GenericButton';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { Add } from '@mui/icons-material';

const WebHookTab = () => {
    const t = useTranslations();
    const {
        items,
        onNext, onBack,
        filterParams, onSort, onRowsPerPageChange,
        columns,
        loading, } = useWebHookTabController();

    return (
        <Grid container spacing={1} display={'flex'} flexDirection={'column'} justifyContent="flex-start" pb={10}>

            <HeaderPage
                isForm
                title={t("webhook.title")}
                description={t("webhook.text")}
                actions={
                    <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
                        <SassButton
                            onClick={() => { }}
                            variant='contained'
                            color='primary'
                            startIcon={<Add />}
                        > {t('core.button.add')}</SassButton>
                    </Box>
                }
            >
                <GenericTable
                    data={items}
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
            </HeaderPage>
             

        </Grid>
    );
};

export default WebHookTab;
