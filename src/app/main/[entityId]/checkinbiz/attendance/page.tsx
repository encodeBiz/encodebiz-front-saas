'use client';
import { Box, Container, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
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
      {open.type === CommonModalType.INFO && <InfoModal
        title={t('attendance.requestUpdates')}
        centerBtn

        htmlDescription={<Box display={'flex'} flexDirection={'column'} gap={3}>
          <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
            <CustomChip small background={open.args?.item?.metadata?.requestUpdates[0].data?.status} label={open.args?.item?.metadata?.requestUpdates[0].data?.status} />
            <Typography variant='body1' sx={{ fontSize: 16, color: "#48494C" }}>
              Este registro fue actualizado y validado correctamente.
            </Typography>
          </Box>
          <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
            <Typography variant='body1' sx={{ fontSize: 16, color: "#1C1B1D" }}>
              Cambio realizado
            </Typography>
            <ul style={{ marginLeft:-12, margin:2}} >
              <li >
                <Box style={{ display: 'flex', gap: 2 }}>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                    Fecha y hora anterior:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>
                    {format_date(open.args?.item?.metadata?.requestUpdates[0].previousDate)}
                  </Typography>
                </Box>
              </li>

              <li >
                <Box style={{ display: 'flex', gap: 2 }}>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                    Fecha y hora actual:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>
                    {format_date(open.args?.item?.metadata?.requestUpdates[0].createdAt)}
                  </Typography>
                </Box>
              </li>
            </ul>
          </Box>
          <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
            <Typography variant='body1' sx={{ fontSize: 16, color: "#1C1B1D" }}>
              Motivo
            </Typography>
            <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C" }}>
              {open.args?.item?.metadata?.requestUpdates[0].reason}
            </Typography>
          </Box>

          <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
            <Typography variant='body1' sx={{ fontSize: 16, color: "#1C1B1D" }}>
              Validación
            </Typography>
            <Box style={{ display: 'flex', gap: 2 }}>
              <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                Actualizado por:
              </Typography>
              <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C" }}>
                {open.args?.item?.metadata?.requestUpdates[0].employee?.fullName}
              </Typography>
            </Box>
            <Box style={{ display: 'flex', gap: 2 }}>
              <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                Fecha de validación:
              </Typography>
              <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C" }}>
                {format_date(open.args?.item?.metadata?.requestUpdates[0].createdAt)}
              </Typography>
            </Box>
          </Box>



        </Box>}
        cancelBtn={false}
      />}

    </Container>
  );
}
