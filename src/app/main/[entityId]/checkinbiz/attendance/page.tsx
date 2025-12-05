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
        htmlDescription={<Box>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {open.args?.item?.metadata?.requestUpdates?.map((e: any, i: number) => <ListItem key={i}>

              <ListItemText primary={e.reason} secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                    {e.employee?.fullName}
                  </Typography>
                  {", "+format_date(e.createdAt)} {',  '}
                  <CustomChip small background={e.status} label={e.previousStatus} />
                </React.Fragment>
              }></ListItemText>


            </ListItem>)}
          </List>
        </Box>}
        cancelBtn
      />}

    </Container>
  );
}
