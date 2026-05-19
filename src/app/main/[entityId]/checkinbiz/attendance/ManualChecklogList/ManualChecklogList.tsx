'use client';
import React, { useMemo } from 'react';
import { Box, TextField, MenuItem, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import { GenericTable } from '@/components/common/table/GenericTable';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import SearchIndexFilter from '@/components/common/table/filters/SearchIndexInput';
import { ISearchIndex } from '@/domain/core/SearchIndex';
import InfoModal from '@/components/common/modals/InfoModal';
import { IChecklog } from '@/domain/features/checkinbiz/IChecklog';
import { format_date } from '@/lib/common/Date';
import { CustomChip } from '@/components/common/table/CustomChip';
import useManualChecklogListController, { ManualRequestStatus } from './ManualChecklogList.controller';

interface Props {
  refreshToken: number;
}

const ManualChecklogDetail = ({ log }: { log: IChecklog & any }) => {
  const t = useTranslations();
  const autofilled: string[] = log.metadata?.autofilledFields ?? [];
  const isRejected = log.status === 'failed' && log.failedCode === 'manual_request_rejected';
  const isApproved = log.status === 'valid';

  const tz = log.metadata?.tz ?? log.branch?.address?.timeZone;

  const rows: Array<{ label: string; value: React.ReactNode }> = [
    { label: t('core.label.employee'), value: log.employee?.fullName ?? log.employeeId },
    { label: t('core.label.branch'), value: log.branch?.name ?? log.branchId },
    {
      label: t('core.label.date'),
      value: format_date(log.timestamp, 'DD/MM/YYYY', tz),
    },
    {
      label: t('core.label.checkin'),
      value: (
        <Box display="flex" alignItems="center" gap={1}>
          {format_date(log.timestamp, 'HH:mm', tz)}
          {autofilled.includes('checkinAt') && (
            <Chip label={t('attendance.manualRequest.autofilled')} size="small" color="info" />
          )}
        </Box>
      ),
    },
    {
      label: t('core.label.checkout'),
      value: (() => {
        const ts = log.metadata?.checkoutTimestamp;
        const val = ts ? format_date(ts, 'HH:mm', tz) : '-';
        return (
          <Box display="flex" alignItems="center" gap={1}>
            {val}
            {autofilled.includes('checkoutAt') && (
              <Chip label={t('attendance.manualRequest.autofilled')} size="small" color="info" />
            )}
          </Box>
        );
      })(),
    },
    { label: t('core.label.reason'), value: log.metadata?.reason ?? '-' },
    {
      label: t('attendance.manualRequest.requestedBy'),
      value: log.requestedBy?.fullName ?? log.metadata?.requestedByUid ?? '-',
    },
    {
      label: t('core.label.status'),
      value: (
        <CustomChip
          role="text"
          background={log.status === 'valid' ? 'valid' : 'failed'}
          label={
            isRejected
              ? t('attendance.manualRequest.statusRejected')
              : isApproved
              ? t('attendance.manualRequest.statusApproved')
              : log.status === 'failed'
              ? t('attendance.manualRequest.statusError')
              : t('attendance.manualRequest.statusPending')
          }
        />
      ),
    },
  ];

  if (isApproved && log.metadata?.resolvedAt) {
    rows.push({
      label: t('attendance.manualRequest.resolvedAt'),
      value: format_date(log.metadata.resolvedAt, 'DD/MM/YYYY HH:mm', tz),
    });
  }

  if (isRejected) {
    if (log.metadata?.rejectionReason) {
      rows.push({ label: t('attendance.manualRequest.rejectionReason'), value: log.metadata.rejectionReason });
    }
    if (log.metadata?.resolvedAt) {
      rows.push({
        label: t('attendance.manualRequest.resolvedAt'),
        value: format_date(log.metadata.resolvedAt, 'DD/MM/YYYY HH:mm', tz),
      });
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 320 }}>
      {rows.map((row) => (
        <Box key={row.label} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Box sx={{ fontWeight: 600, minWidth: 140, color: 'text.secondary', fontSize: 13 }}>{row.label}:</Box>
          <Box sx={{ fontSize: 13 }}>{row.value}</Box>
        </Box>
      ))}
    </Box>
  );
};

const ManualChecklogList = ({ refreshToken }: Props) => {
  const t = useTranslations();
  const { open, closeModal } = useCommonModal();

  const {
    items,
    loading,
    columns,
    rowAction,
    filters,
    setFilters,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
  } = useManualChecklogListController(refreshToken);

  const detailLog = useMemo(() => open.args?.log, [open.args?.log]);

  const topFilter = (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
      <TextField
        select
        size="small"
        label={t('core.label.status')}
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value as ManualRequestStatus })}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="pending-employee-validation">{t('attendance.manualRequest.statusPending')}</MenuItem>
        <MenuItem value="valid">{t('attendance.manualRequest.statusApproved')}</MenuItem>
        <MenuItem value="failed">{t('attendance.manualRequest.statusRejected')}</MenuItem>
        <MenuItem value="all">{t('core.label.all')}</MenuItem>
      </TextField>

      <SearchIndexFilter
        type="employee"
        label={t('core.label.employee')}
        width="auto"
        onChange={(value: ISearchIndex) => {
          const employeeId = value?.index ? value.index.split('/').pop() ?? 'none' : 'none';
          setFilters({ employeeId });
        }}
      />

      <TextField
        size="small"
        type="date"
        label={t('core.label.from')}
        value={filters.from}
        onChange={(e) => setFilters({ from: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        size="small"
        type="date"
        label={t('core.label.to')}
        value={filters.to}
        onChange={(e) => setFilters({ to: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );

  return (
    <>
      <GenericTable
        data={items}
        rowAction={rowAction}
        columns={columns}
        title=""
        keyField="id"
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        onBack={() => onPageChange(Math.max(0, page - 1))}
        onNext={() => onPageChange(page + 1)}
        topFilter={topFilter}
        paperSx={{ backgroundColor: 'transparent', boxShadow: 'none', borderRadius: 0 }}
      />

      {open.type === CommonModalType.MANUAL_CHECKLOG_DETAIL && !!detailLog && (
        <InfoModal
          title={t('attendance.manualRequest.detailTitle')}
          centerBtn
          htmlDescription={<ManualChecklogDetail log={detailLog} />}
          cancelBtn={false}
          onClose={() => closeModal(CommonModalType.MANUAL_CHECKLOG_DETAIL)}
        />
      )}
    </>
  );
};

export default ManualChecklogList;
