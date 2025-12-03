'use client';
import { Container } from '@mui/material';

import { GenericTable } from "@/components/common/table/GenericTable";
import useEmployeeDetailController from './page.controller';
import { Detail } from './Detail';
import useResponseIssueController from './detail.controller';

export default function BranchDetail() {
    const { initialValues, rowAction, onSuccess } = useEmployeeDetailController()
    const {
        items, onRowsPerPageChange, onSort,
        onNext, onBack,
        filterParams,
        columns,
        loading } = useResponseIssueController();


    return (
        <Container maxWidth="lg">
            {initialValues?.id && <Detail  issue={initialValues as any} onSuccess={onSuccess} >
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
