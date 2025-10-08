'use client';
import { Container } from '@mui/material';

import { GenericTable } from "@/components/common/table/GenericTable";
import useEmployeeDetailController from './page.controller';
import { Detail } from './Detail';
 
export default function BranchDetail() {


    const { initialValues, items, topFilter, onRowsPerPageChange, onSort,
        onNext, onBack,
        filterParams,
        columns,
        loading } = useEmployeeDetailController()
    return (
        <Container maxWidth="lg">

            {initialValues?.id && <Detail employee={initialValues as any} >
                <GenericTable
                    data={items}
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



        </Container>
    );
}
