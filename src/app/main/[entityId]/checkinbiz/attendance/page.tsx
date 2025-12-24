'use client';
import { Box, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Divider, Stack } from '@mui/material';
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
import { format_date, format_date_with_locale } from '@/lib/common/Date';
import { CustomChip } from '@/components/common/table/CustomChip';
import React, { useMemo } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import { onGoMap } from '@/lib/common/maps';
import { useAppLocale } from '@/hooks/useAppLocale';

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

  const { openModal, open, closeModal } = useCommonModal();
  const logDetail = useMemo(() => open.args?.log, [open.args?.log]);
  const { currentLocale } = useAppLocale()
  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("attendance.list")}
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            {/* <SassButton
              onClick={() => openModal(CommonModalType.CHECKLOGFORM)}
              variant='contained'

            > {t('attendance.add')}</SassButton> */}
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
              {open.args?.item?.data?.status === 'valid' ? t('attendance.updateRequestStatusOk') : t('attendance.updateRequestStatusError')}
            </Typography>
          </Box>
          <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
            <Typography variant='body1' sx={{ fontSize: 16, color: "#1C1B1D" }}>
              {t('attendance.updateRequestChanged')}
            </Typography>


            <Typography variant='body1' sx={{ fontSize: 15, fontWeight: 'bold', color: "#1C1B1D" }}>
              {t('attendance.latestData')}
            </Typography>
            <ul style={{ marginLeft: -12, margin: 2 }} >
              <li >
                <Box style={{ display: 'flex', gap: 2 }}>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                    {t('attendance.updateRequestStatus')}:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>
                    {t('core.label.' + open.args?.item?.data?.status)}
                  </Typography>
                </Box>
              </li>

              <li >
                <Box style={{ display: 'flex', gap: 2 }}>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                    {t('attendance.updateRequestDate')}:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>

                    <Typography variant="body2" textTransform={'capitalize'}>{format_date_with_locale(open.args?.item?.previousDate, currentLocale as 'en' | 'es')}</Typography>

                  </Typography>
                </Box>
              </li>


            </ul>

            <Typography variant='body1' sx={{ fontSize: 15, fontWeight: 'bold', color: "#1C1B1D" }}>
              {t('attendance.currentData')}
            </Typography>
            <ul style={{ marginLeft: -12, margin: 2 }} >
              <li >
                <Box style={{ display: 'flex', gap: 2 }}>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                    {t('attendance.updateRequestPreviewStatus')}:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>
                    {t('core.label.' + open.args?.item?.previousStatus)}
                  </Typography>
                </Box>
              </li>

              <li >
                <Box style={{ display: 'flex', gap: 2 }}>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                    {t('attendance.updateRequestTime')}:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>

                    <Typography variant="body2" textTransform={'capitalize'}>{format_date_with_locale(open.args?.item?.data?.timestamp, currentLocale as 'en' | 'es')}</Typography>
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
      {open.type === CommonModalType.LOGS && !!logDetail && (<InfoModal onClose={() => closeModal(CommonModalType.LOGS)}
        title={t("core.label.viewDetails")}
        centerBtn

        htmlDescription={

          <Stack spacing={2.5}>
            <Box>
              <Typography fontWeight={700}>{t('core.label.register')}: {t('core.label.' + (logDetail.type ?? ''))}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('core.label.status')}: {t('core.label.' + (logDetail.status ?? ''))} · {format_date(logDetail.timestamp, 'DD/MM/YYYY HH:mm:ss', logDetail.metadata?.tz ?? logDetail.metadata?.etz)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('core.label.timeZone')}: {logDetail.metadata?.tz ?? logDetail.metadata?.etz ?? '-'}
              </Typography>
            </Box>

            <Divider />
            <Box>
              <Typography fontWeight={700}>{t('sucursal.map')}</Typography>
              <Typography variant="body2" color="text.secondary">
                Lat/Lng: {logDetail.geo?.lat?.toFixed(6)}, {logDetail.geo?.lng?.toFixed(6)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Distancia: {Number(logDetail.metadata?.distance ?? 0).toFixed(2)} m · Sospechoso: {logDetail.isSuspect ? 'Sí' : 'No'}
              </Typography>
              <SassButton size="small" variant="outlined" onClick={() => onGoMap(logDetail.geo?.lat as number, logDetail.geo?.lng as number)} sx={{ mt: 1 }}>
                {t('sucursal.map')}
              </SassButton>
            </Box>

            <Divider />
            <Box>
              <Typography fontWeight={700}>{t('core.label.responsibility')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {logDetail.metadata?.employeeResponsibility?.job ?? '-'} · {logDetail.metadata?.employeeResponsibility?.responsibility ?? '-'} · {logDetail.metadata?.employeeResponsibility?.level ? `${t('core.label.level') ?? 'Nivel'} ${logDetail.metadata?.employeeResponsibility?.level}` : ''}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tarifa: {logDetail.metadata?.employeeResponsibility?.price ?? '-'}
              </Typography>
            </Box>

            <Divider />
            <Box>
              <Typography fontWeight={700}>{t('core.label.setting')}</Typography>
              <Typography variant="body2" color="text.secondary">
                Jornada estricta: {logDetail.metadata?.enableDayTimeRange ? 'Sí' : 'No'} · Tolerancia: {logDetail.metadata?.scheduleApplied?.toleranceMinutes ?? 0} min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Horario aplicado: {`${(logDetail.metadata?.scheduleApplied?.start?.hour ?? 0).toString().padStart(2, '0')}:${(logDetail.metadata?.scheduleApplied?.start?.minute ?? 0).toString().padStart(2, '0')}`} - {`${(logDetail.metadata?.scheduleApplied?.end?.hour ?? 0).toString().padStart(2, '0')}:${(logDetail.metadata?.scheduleApplied?.end?.minute ?? 0).toString().padStart(2, '0')}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trabajo remoto: {logDetail.metadata?.enableRemoteWork ? 'Sí' : 'No'} · Radio: {logDetail.metadata?.ratioChecklog ?? '-'} m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Desactivar geofence: {logDetail.metadata?.disableRatioChecklog ? 'Sí' : 'No'}
              </Typography>
            </Box>

            <Divider />
            <Box>
              <Typography fontWeight={700}>{t('core.label.update')}</Typography>
              <Typography variant="body2" color="text.secondary">
                Actualizado por: {logDetail.metadata?.updated?.uid ?? '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Actualizado en: {logDetail.metadata?.updated?.updatedAt ? format_date(logDetail.metadata?.updated?.updatedAt, 'DD/MM/YYYY HH:mm:ss', logDetail.metadata?.tz ?? logDetail.metadata?.etz) : '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User agent: {logDetail.userAgent ?? '-'}
              </Typography>
            </Box>
          </Stack>}
        cancelBtn={false}

      />

      )}

    </Container>
  );
}


