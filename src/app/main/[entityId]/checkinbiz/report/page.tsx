'use client';
import { Box, Container } from '@mui/material';
import { useTranslations } from "next-intl";
import { GenericTable } from "@/components/common/table/GenericTable";
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import useAttendanceController from './page.controller';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';
import ReportFormModal from './ReportFormModal/ReportFormModal';

export default function AttendanceList() {
  const t = useTranslations();
  const {
    items, onRowsPerPageChange, onSort,
    onNext, onBack,topFilter,
    filterParams,  
    columns, rowAction,onSuccessCreate,
    loading } = useAttendanceController();
  const { openModal, open } = useCommonModal()
  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("report.list")}

        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <SassButton
              onClick={() => openModal(CommonModalType.REPORTFORM)}
              variant='contained'

            > {t('report.report')}</SassButton>
          </Box>
        }

      >
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
      </HeaderPage>
      {open.type === CommonModalType.REPORTFORM && <ReportFormModal onSuccess={onSuccessCreate} />}

    </Container>
  );
}
