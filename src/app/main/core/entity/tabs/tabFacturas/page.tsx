
'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import { useFacturaController } from './page.controller';
import { GenericTable } from '@/components/common/table/GenericTable';

const FacturasPreferencesPage = () => {
    const t = useTranslations();
    const { 
        items,
        onNext, onBack,
        currentPage,
        columns, 
        loading, rowsPerPage, setRowsPerPage } = useFacturaController();
 
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
