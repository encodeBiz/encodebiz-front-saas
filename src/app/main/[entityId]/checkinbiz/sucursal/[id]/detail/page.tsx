'use client';
import { Container  } from '@mui/material';
 
import { GenericTable } from "@/components/common/table/GenericTable";
import useEmployeeListController from '../../../employee/page.controller';
import useEmployeeDetailController from './page.controller';
import { Detail } from './Detail';

export default function BranchDetail() {
    
    const {
        items, rowAction, onRowsPerPageChange, onSort,
        onNext, onBack,
        filterParams, topFilter,
        columns,
        loading } = useEmployeeListController();

    const { initialValues } = useEmployeeDetailController()
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
                    topFilter={topFilter}
                    selectable

                />
            </Detail>}

             

        </Container>
    );
}
