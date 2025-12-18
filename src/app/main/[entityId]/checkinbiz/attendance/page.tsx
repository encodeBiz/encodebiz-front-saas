'use client';
import { Box, Container, Typography } from '@mui/material';
import { useTranslations } from "next-intl";
import { GenericTable } from "@/components/common/table/GenericTable";
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import useAttendanceController from './page.controller';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import dynamic from "next/dynamic";
import EmptyList from '@/components/common/EmptyState/EmptyList';
import emptyImage from '../../../../../../public/assets/images/empty/asistencia.svg';
import InfoModal from '@/components/common/modals/InfoModal';
import { format_date } from '@/lib/common/Date';
import { CustomChip } from '@/components/common/table/CustomChip';
import React from 'react';

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

  const { openModal, open } = useCommonModal();

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("attendance.list")}
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <SassButton
              onClick={() => openModal(CommonModalType.CHECKLOGFORM)}
              variant='contained'

            > {t('attendance.add')}</SassButton>
          </Box>
        }
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
      {open.type === CommonModalType.INFO && !!open.args?.item && <InfoModal
        title={t('attendance.requestUpdates')}
        centerBtn

        htmlDescription={<Box display={'flex'} flexDirection={'column'} gap={3}>
         
          <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
            <Typography variant='body1' sx={{ fontSize: 16, color: "#48494C" }}>
              {open.args?.item?.data?.status==='valid'?t('attendance.updateRequestStatusOk'):t('attendance.updateRequestStatusError')}
            </Typography>
          </Box>
          <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
            <Typography variant='body1' sx={{ fontSize: 16, color: "#1C1B1D" }}>
              {t('attendance.updateRequestChanged')}
            </Typography>

           

             <ul style={{ marginLeft: -12, margin: 2 }} >
              <li >
                <Box style={{ display: 'flex', gap: 2 }}>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                     {t('attendance.updateRequestStatus')}:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>
                    {t('core.valid.'+ open.args?.item?.data?.status)}
                  </Typography>
                </Box>
              </li>

              <li >
                <Box style={{ display: 'flex', gap: 2 }}>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                    {t('attendance.updateRequestPreviewStatus')}:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>
                    {t('core.valid.'+ open.args?.item?.previousStatus)}
                  </Typography>
                </Box>
              </li>
            </ul>
            <ul style={{ marginLeft: -12, margin: 2 }} >
              <li >
                <Box style={{ display: 'flex', gap: 2 }}>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                     {t('attendance.updateRequestDate')}:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>
                    {format_date(open.args?.item?.previousDate)}
                  </Typography>
                </Box>
              </li>

              <li >
                <Box style={{ display: 'flex', gap: 2 }}>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                    {t('attendance.updateRequestTime')}:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>
                    {format_date(open.args?.item?.createdAt)}
                  </Typography>
                </Box>
              </li>
            </ul>
          </Box>
          <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
            <Typography variant='body1' sx={{ fontSize: 16, color: "#1C1B1D" }}>
              {t('attendance.updateRequestReason')}:
            </Typography>
            <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C" }}>
              {open.args?.item?.reason}
            </Typography>
          </Box>

          <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
            <Typography variant='body1' sx={{ fontSize: 16, color: "#1C1B1D" }}>              
               {t('attendance.updateRequestValidate')}:
            </Typography>
            <Box style={{ display: 'flex', gap: 2 }}>
              <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                 {t('attendance.updateRequestRequest')}:
              </Typography>
              <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C" }}>
                {open.args?.item?.admin?.fullName}
              </Typography>
            </Box>
            <Box style={{ display: 'flex', gap: 2 }}>
              <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                 {t('attendance.updateRequestRequestDate')}:
              </Typography>
              <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C" }}>
                {format_date(open.args?.item?.createdAt)}
              </Typography>
            </Box>
          </Box>



        </Box>}
        cancelBtn={false}
      />}

    </Container>
  );
}

 
