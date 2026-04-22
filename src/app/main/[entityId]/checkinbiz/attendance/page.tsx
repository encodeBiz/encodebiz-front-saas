'use client';
import { Box, Container } from '@mui/material';
import { useTranslations } from "next-intl";
import { GenericTable } from "@/components/common/table/GenericTable";
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import useAttendanceController from './page.controller';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import dynamic from "next/dynamic";
import EmptyList from '@/components/common/EmptyState/EmptyList';
import emptyImage from '../../../../../../public/assets/images/empty/asistencia.svg';
import InfoModal from '@/components/common/modals/InfoModal';
import { useMemo } from 'react';
import { LogDetail } from './LogDetail/LogDetail';
import { UpdateRequest } from './UpdateRequest/UpdateRequest';
import AttendanceSummaryList from './AttendanceSummaryList';
import GenericTabs from '@/components/common/tabs/GenericTabs';
import { TabItem } from '@/components/common/tabs/BaseTabs';

const AttendanceFormModal = dynamic(() => import("./AttendanceFormModal/AttendanceFormModal").then(mod => mod.default), {
  ssr: false,
})

export default function AttendanceList() {
  const t = useTranslations();
  const {
    items, onRowsPerPageChange, onSort,
    onNext, onBack, empthy,
    filterParams, topFilter,
    columns, rowAction, onSuccessCreate,
    loading, setViewMode, summaryItems, summaryPagination } = useAttendanceController();

  const { open, closeModal } = useCommonModal();
  const logDetail = useMemo(() => open.args?.log, [open.args?.log]);
  const tabs: TabItem[] = [
    {
      id: 'summary',
      label: t('attendance.viewModeSummary'),
      content: (
        <Box sx={{ p: '10px' }}>
          <Box sx={{ mb: 2 }}>
            {topFilter}
          </Box>
          <AttendanceSummaryList
            data={summaryItems}
            loading={loading}
            rowAction={rowAction}
            page={summaryPagination.page}
            rowsPerPage={summaryPagination.rowsPerPage}
            onPageChange={summaryPagination.onPageChange}
            onRowsPerPageChange={summaryPagination.onRowsPerPageChange}
          />
        </Box>
      )
    },
    {
      id: 'events',
      label: t('attendance.viewModeEvents'),
      content: (
        <Box sx={{ p: '10px' }}>
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
            paperSx={{ backgroundColor: 'transparent', boxShadow: 'none', borderRadius: 0 }}
          />
        </Box>
      )
    }
  ];
  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 4 } }}>
      <HeaderPage
        title={t("attendance.list")}
      >
        {empthy && !loading &&
          <EmptyList
            imageUrl={emptyImage}
            title={t('employeeDashboard.attendanceNoDataTitle')}
            description={t('employeeDashboard.attendanceNoDataText')}
          />}


         

        {!empthy && (
          <Box sx={{ width: '100%' }}>
            <GenericTabs
              tabs={tabs}
              fullWidth
              scrollable
              syncUrl={false}
              defaultTab={0}
              onChange={(index) => setViewMode(index === 0 ? 'summary' : 'events')}
              panelSx={{ pl: 0, pr: 0, pt: 0 }}
              sx={{ width: '100%' }}
            />
          </Box>
        )}
      </HeaderPage>
      {open.type === CommonModalType.CHECKLOGFORM && <AttendanceFormModal onSuccess={onSuccessCreate} />}
      {open.type === CommonModalType.INFO && !!open.args?.item &&
        <InfoModal
          title={t('attendance.requestUpdates')}
          centerBtn
          htmlDescription={<UpdateRequest logDetail={open.args} />}
          cancelBtn={false}
        />}
      {open.type === CommonModalType.LOGS && !!logDetail && (<InfoModal onClose={() => closeModal(CommonModalType.LOGS)}
        title={t("core.label.viewDetailsTitle")}
        centerBtn
        htmlDescription={<LogDetail logDetail={logDetail} />}
        cancelBtn={false}
      />

      )}

    </Container>
  );
}
