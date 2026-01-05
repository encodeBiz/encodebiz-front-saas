'use client';
import { Container } from '@mui/material';
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
import { useAppLocale } from '@/hooks/useAppLocale';
import { LogDetail } from './LogDetail/LogDetail';

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
    loading } = useAttendanceController();

  const { open, closeModal } = useCommonModal();
  const logDetail = useMemo(() => open.args?.log, [open.args?.log]);
  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("attendance.list")}
      >
        {empthy && !loading &&
          <EmptyList
            imageUrl={emptyImage}
            title={t('employeeDashboard.attendanceNoDataTitle')}
            description={t('employeeDashboard.attendanceNoDataText')}
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
      {open.type === CommonModalType.CHECKLOGFORM && <AttendanceFormModal onSuccess={onSuccessCreate} />}
      {open.type === CommonModalType.INFO && !!open.args?.item &&
        <InfoModal
          title={t('attendance.requestUpdates')}
          centerBtn
          htmlDescription={<LogDetail logDetail={open.args} />}
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


