'use client';
import { Container } from '@mui/material';

import { GenericTable } from "@/components/common/table/GenericTable";
import useEmployeeDetailController from './page.controller';
import { Detail } from './Detail';
import useEmployeeResponsabilityController from './detail.controller';
import { useParams } from 'next/navigation';
import FormLink from './components/FormLink';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';

export default function BranchDetail() {
    const { initialValues, rowAction, onSuccess } = useEmployeeDetailController()
    const { id } = useParams<{ id: string }>()
    const { open } = useCommonModal()
    const {
        items, onRowsPerPageChange, onSort,
        onNext, onBack,
        filterParams,
        columns, onSuccessResponsability,
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

            {open.type === CommonModalType.FORM && open.args?.id === 'responsability' && <FormLink onSuccess={onSuccessResponsability} />}

        </Container>
    );
}
