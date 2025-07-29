
'use client'
import React from 'react';
import {
    Box,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useFacturaController } from './page.controller';
import { useAuth } from '@/hooks/useAuth';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useEntity } from '@/hooks/useEntity';
import { BaseButton } from '@/components/common/buttons/BaseButton';
import { GenericTable } from '@/components/common/table/GenericTable';

const FacturasPreferencesPage = () => {
    const t = useTranslations();
    const { 
        items,
        onNext, onBack,
        currentPage,
        columns, 
        loading, rowsPerPage, setRowsPerPage } = useFacturaController();
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    const { openModal } = useCommonModal()
    return (
        <>
            <GenericTable
                data={items}
                columns={columns}
                title={t("renew.title")}
                keyField="id"
                loading={loading}
                page={currentPage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={setRowsPerPage}
                onBack={onBack}
                onNext={onNext}

            />

        </>
    );
};

export default FacturasPreferencesPage;
