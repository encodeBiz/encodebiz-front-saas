'use client';
import { Container } from '@mui/material';

import { GenericTable } from "@/components/common/table/GenericTable";
import useEmployeeListController from '../../../employee/page.controller';
import useEmployeeDetailController from './page.controller';
import { Detail } from './Detail';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import AttendanceFormModal from '../../../attendance/AttendanceFormModal/AttendanceFormModal';

export default function BranchDetail() {

    const {
        items, onRowsPerPageChange, onSort,
        onNext, onBack,
        filterParams,
        columns, 
        loading } = useEmployeeListController();

    const { initialValues, rowAction } = useEmployeeDetailController()

    return (
        <Container maxWidth="lg">

            {initialValues?.id && <Detail branch={initialValues as any} >
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
            </Detail>}



        </Container>
    );
}
