/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/useToast';
import { useEntity } from '@/hooks/useEntity';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { searchLogs, fetchEmployee as fetchEmployeeData } from '@/services/checkinbiz/employee.service';
import { fetchSucursal as fetchSucursalData } from '@/services/checkinbiz/sucursal.service';
import { fetchUserAccount } from '@/services/core/account.service';
import { IChecklog } from '@/domain/features/checkinbiz/IChecklog';
import { format_date } from '@/lib/common/Date';
import { CustomChip } from '@/components/common/table/CustomChip';
import { Box, Chip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Column, IRowAction } from '@/components/common/table/GenericTable';

export type ManualRequestStatus = 'pending-employee-validation' | 'valid' | 'failed' | 'all';

export interface ManualChecklogFilters {
  status: ManualRequestStatus;
  employeeId: string;
  from: string;
  to: string;
}

const isRelevantManualRecord = (item: IChecklog & any): boolean => {
  const action = item.metadata?.requestUpdates?.[0]?.action;
  if (item.type === 'checkin') return !action || action === 'manual_request_created';
  if (item.type === 'checkout') return action === 'manual_checkout_created';
  return false;
};

const buildFilters = (filters: ManualChecklogFilters) => {
  const base: Array<{ field: string; operator: any; value: any }> = [
    { field: 'metadata.manualRequest', operator: '==', value: true },
  ];

  if (filters.status !== 'all') {
    base.push({ field: 'status', operator: '==', value: filters.status });
  }

  if (filters.employeeId !== 'none') {
    base.push({ field: 'employeeId', operator: '==', value: filters.employeeId });
  }

  if (filters.from) {
    base.push({ field: 'timestamp', operator: '>=', value: new Date(filters.from + 'T00:00:00') });
  }
  if (filters.to) {
    base.push({ field: 'timestamp', operator: '<=', value: new Date(filters.to + 'T23:59:59') });
  }

  return base;
};

const enrichLogs = async (entityId: string, logs: IChecklog[]): Promise<IChecklog[]> => {
  const employeeCache = new Map<string, Promise<any>>();
  const branchCache = new Map<string, Promise<any>>();
  const userCache = new Map<string, Promise<any>>();

  const getEmployee = (id?: string) => {
    if (!id) return Promise.resolve(null);
    if (!employeeCache.has(id)) employeeCache.set(id, fetchEmployeeData(entityId, id));
    return employeeCache.get(id)!;
  };
  const getBranch = (id?: string) => {
    if (!id) return Promise.resolve(null);
    if (!branchCache.has(id)) branchCache.set(id, fetchSucursalData(entityId, id));
    return branchCache.get(id)!;
  };
  const getUser = (id?: string) => {
    if (!id) return Promise.resolve(null);
    if (!userCache.has(id)) userCache.set(id, fetchUserAccount(id));
    return userCache.get(id)!;
  };

  return Promise.all(
    logs.map(async (item) => {
      const [employee, branch, requestedBy] = await Promise.all([
        getEmployee(item.employeeId),
        getBranch(item.branchId),
        getUser(item.metadata?.requestedByUid),
      ]);
      return { ...item, employee, branch, requestedBy };
    })
  );
};

const defaultFilters = (): ManualChecklogFilters => ({
  status: 'pending-employee-validation',
  employeeId: 'none',
  from: '',
  to: '',
});

export default function useManualChecklogListController(refreshToken: number) {
  const t = useTranslations();
  const { showToast } = useToast();
  const { currentEntity } = useEntity();
  const { openModal } = useCommonModal();

  const [items, setItems] = useState<IChecklog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ManualChecklogFilters>(defaultFilters);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = useCallback(async () => {
    if (!currentEntity?.entity?.id) return;
    setLoading(true);
    try {
      const logs = await searchLogs(currentEntity.entity.id, {
        filters: buildFilters(filters),
        limit: 200,
        orderBy: 'timestamp',
        orderDirection: 'desc',
        includeCount: false,
      } as any);

      const enriched = await enrichLogs(currentEntity.entity.id, logs);
      setItems(enriched.filter(isRelevantManualRecord));
    } catch (error: any) {
      showToast(error?.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentEntity?.entity?.id, filters, refreshToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resolveStatusLabel = (item: IChecklog): string => {
    if (item.status === 'failed' && item.failedCode === 'manual_request_rejected') {
      return t('attendance.manualRequest.statusRejected');
    }
    if (item.status === 'failed') return t('attendance.manualRequest.statusError');
    if (item.status === 'valid') return t('attendance.manualRequest.statusApproved');
    return t('attendance.manualRequest.statusPending');
  };

  const resolveStatusColor = (item: IChecklog): string => {
    if (item.status === 'valid') return 'valid';
    if (item.status === 'failed' && item.failedCode === 'manual_request_rejected') return 'failed';
    if (item.status === 'failed') return 'failed';
    return 'pending-employee-validation';
  };

  const columns: Column<any>[] = useMemo(() => [
    {
      id: 'mode',
      label: t('attendance.manualRequest.modeLabel'),
      minWidth: 140,
      format: (_: any, row: IChecklog & any) => {
        const isModeB = row.type === 'checkout';
        return (
          <Chip
            size="small"
            label={isModeB ? t('attendance.manualRequest.modeB') : t('attendance.manualRequest.modeA')}
            color={isModeB ? 'secondary' : 'primary'}
            variant="outlined"
          />
        );
      },
    },
    {
      id: 'employee',
      label: t('core.label.employee'),
      minWidth: 150,
      format: (_: any, row: IChecklog & any) => row.employee?.fullName ?? row.employeeId,
    },
    {
      id: 'branch',
      label: t('core.label.branch'),
      minWidth: 130,
      format: (_: any, row: IChecklog & any) => row.branch?.name ?? row.branchId,
    },
    {
      id: 'date',
      label: t('core.label.date'),
      minWidth: 110,
      format: (_: any, row: IChecklog & any) =>
        format_date(row.timestamp, 'DD/MM/YYYY', row.metadata?.tz ?? row.branch?.address?.timeZone),
    },
    {
      id: 'checkinAt',
      label: t('core.label.checkin'),
      minWidth: 90,
      format: (_: any, row: IChecklog & any) => {
        if (row.type === 'checkout') return '-';
        return format_date(row.timestamp, 'HH:mm', row.metadata?.tz ?? row.branch?.address?.timeZone);
      },
    },
    {
      id: 'checkoutAt',
      label: t('core.label.checkout'),
      minWidth: 90,
      format: (_: any, row: IChecklog & any) => {
        const tz = row.metadata?.tz ?? row.branch?.address?.timeZone;
        if (row.type === 'checkout') return format_date(row.timestamp, 'HH:mm', tz);
        const checkoutId = row.metadata?.requestUpdates?.[0]?.checkoutId;
        if (!checkoutId) return '-';
        const checkoutTs = row.metadata?.checkoutTimestamp;
        if (!checkoutTs) return '-';
        return format_date(checkoutTs, 'HH:mm', tz);
      },
    },
    {
      id: 'reason',
      label: t('core.label.reason'),
      minWidth: 160,
      format: (_: any, row: IChecklog & any) => row.metadata?.reason ?? '-',
    },
    {
      id: 'requestedBy',
      label: t('attendance.manualRequest.requestedBy'),
      minWidth: 140,
      format: (_: any, row: IChecklog & any) =>
        (row as any).requestedBy?.fullName ?? row.metadata?.requestedByUid ?? '-',
    },
    {
      id: 'status',
      label: t('core.label.status'),
      minWidth: 160,
      format: (_: any, row: IChecklog) => (
        <CustomChip role="text" background={resolveStatusColor(row)} label={resolveStatusLabel(row)} />
      ),
    },
    {
      id: 'timestamp',
      label: t('core.label.createdAt'),
      minWidth: 130,
      format: (_: any, row: IChecklog & any) =>
        format_date(row.timestamp, 'DD/MM/YYYY HH:mm', row.metadata?.tz ?? row.branch?.address?.timeZone),
    },
  ], [t]);

  const rowAction: IRowAction[] = [
    {
      actionBtn: true,
      color: 'primary' as const,
      icon: <InfoOutlinedIcon color="primary" />,
      label: t('core.label.viewDetails'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: IChecklog) => openModal(CommonModalType.MANUAL_CHECKLOG_DETAIL, { log: item }),
    },
  ];

  const paginatedItems = useMemo(
    () => items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [items, page, rowsPerPage]
  );

  return {
    items: paginatedItems,
    totalItems: items.length,
    loading,
    columns,
    rowAction,
    filters,
    setFilters: (partial: Partial<ManualChecklogFilters>) => {
      setPage(0);
      setFilters((prev) => ({ ...prev, ...partial }));
    },
    page,
    rowsPerPage,
    onPageChange: setPage,
    onRowsPerPageChange: (rows: number) => { setRowsPerPage(rows); setPage(0); },
  };
}
