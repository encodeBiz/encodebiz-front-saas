'use client';
import { Container } from '@mui/material';

import { GenericTable } from "@/components/common/table/GenericTable";
 import useEmployeeDetailController from './page.controller';
import { Detail } from './Detail';
import useEmployeeResponsabilityController from './detail.controller';
import { useParams } from 'next/navigation';

export default function BranchDetail() {
    const { initialValues, rowAction, onSuccess } = useEmployeeDetailController()
    const { id } = useParams<{ id: string }>()

    const {
        items, onRowsPerPageChange, onSort,
        onNext, onBack,
        filterParams,
        columns,
        loading } = useEmployeeResponsabilityController(id);


    return (
        <Container maxWidth="lg">

            {initialValues?.id && <Detail branch={initialValues as any} onSuccess={onSuccess} >
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
