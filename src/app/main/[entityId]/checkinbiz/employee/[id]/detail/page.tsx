'use client';
import { Container } from '@mui/material';

import { GenericTable } from "@/components/common/table/GenericTable";
import useEmployeeDetailController from './page.controller';
import { Detail } from './Detail';
import { useCommonModal } from '@/hooks/useCommonModal';
import AttendanceFormModal from '../../../attendance/AttendanceFormModal/AttendanceFormModal';
import { CommonModalType } from '@/contexts/commonModalContext';

export default function BranchDetail() {
    const { open } = useCommonModal();


    const { initialValues, items, topFilter, onRowsPerPageChange, onSort,
        onNext, onBack,
        filterParams, rowAction,
        columns, onSuccessCreate,onSuccess,
        loading, onResend } = useEmployeeDetailController()
    return (
        <Container maxWidth="lg">

            {initialValues?.id && <Detail onSuccess={onSuccess} onResend={onResend} employee={initialValues as any} >
                <GenericTable
                    data={items}
                    rowAction={rowAction}
                    topFilter={topFilter}
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
            </Detail>}
            {open.type === CommonModalType.CHECKLOGFORM && <AttendanceFormModal onSuccess={onSuccessCreate} />}
        </Container>
    );
}
