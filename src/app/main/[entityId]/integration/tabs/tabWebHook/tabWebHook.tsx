
'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import { useWebHookTabController } from './page.controller';
import { GenericTable } from '@/components/common/table/GenericTable';
import { Box, Grid } from '@mui/material';
import { SassButton } from '@/components/common/buttons/GenericButton';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { Add } from '@mui/icons-material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import AddWebHook from './AddWebHook/AddWebHook';

const WebHookTab = () => {
    const t = useTranslations();
    const {
        items, deleting, onDelete,
        onNext, onBack, rowAction,
        filterParams, onSort, onRowsPerPageChange,
        columns,
        loading, } = useWebHookTabController();
    const { openModal, open } = useCommonModal()
    return (
        <Grid container spacing={1} display={'flex'} flexDirection={'column'} justifyContent="flex-start" pb={10}>

            <HeaderPage                 
                title={t("webhook.title")}
                description={t("webhook.text")}
                actions={
                    <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
                        <SassButton
                            onClick={() => openModal(CommonModalType.WEBHOOK)}
                            variant='contained'
                            color='primary'
                        > {t('core.button.add')}</SassButton>
                    </Box>
                }
            >
                <GenericTable
                    data={items.map(e=>({...e,subscribedEvents: e.subscribedEvents.join(", ")}))}
                    columns={columns}
                    title={''}
                    keyField="id"
                    loading={loading}
                    page={filterParams.currentPage}
                    rowsPerPage={filterParams.params.limit}
                    onRowsPerPageChange={onRowsPerPageChange}
                    onSorteable={onSort}
                    onBack={onBack}
                    onNext={onNext}
                    rowAction={rowAction}

                />
            </HeaderPage>

            {CommonModalType.DELETE == open.type && <ConfirmModal
                isLoading={deleting}
                title={t('integration.deleteConfirmModalTitle')}
                description={t('integration.deleteConfirmModalTitle2')}
                onOKAction={(args: { data: Array<string> }) => onDelete(args.data)}
            />}

            {CommonModalType.WEBHOOK == open.type && <AddWebHook />}
        </Grid>
    );
};

export default WebHookTab;
