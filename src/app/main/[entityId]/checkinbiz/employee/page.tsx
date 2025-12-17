'use client';
import { Container, Box } from '@mui/material';
import { useTranslations } from "next-intl";
import useEmployeeListController from './page.controller';
import { GenericTable } from "@/components/common/table/GenericTable";
import { Add } from '@mui/icons-material';
import { SassButton } from '@/components/common/buttons/GenericButton';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { useLayout } from '@/hooks/useLayout';
import FormModal from './edit/FormModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';
import InfoModal from '@/components/common/modals/InfoModal';
import EmptyList from '@/components/common/EmptyState/EmptyList';
import emptyImage from '../../../../../../public/assets/images/empty/empleados.svg';

export default function EmployeeList() {
  const t = useTranslations();
  const {
    items, rowAction, onRowsPerPageChange, onSort,
    onNext, onBack, addEmployee,
    filterParams, topFilter,
    columns, onSuccess, empthy,
    loading } = useEmployeeListController();
  const { navivateTo } = useLayout()
  const { open } = useCommonModal()

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("employee.list")}
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <SassButton
              onClick={addEmployee}
              variant='contained'
              startIcon={<Add />}
            >{t('employee.add')}</SassButton>
          </Box>
        }
      >

        {empthy && !loading &&
          <EmptyList
            imageUrl={emptyImage}
            title={t('employeeDashboard.employeeNoDataTitle')}
            description={t('employeeDashboard.employeeNoDataText')}
          />}
        {!empthy && <GenericTable
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


        />}
      </HeaderPage>
      {open.type === CommonModalType.FORM && <FormModal onSuccess={onSuccess} />}

      {open.type === CommonModalType.INFO && open.args?.id === 'maxAddEmployee' && <InfoModal
        title={t('employee.freePlanAdviseTitle')}
        description={t('employee.freePlanAdviseText')}
        btnText={t('employee.freePlanAdviseBtn')}
        onClose={() => {
          navivateTo('/checkinbiz/onboarding')
        }}
        btnFill
        closeIcon
      />}
    </Container>
  );
}
