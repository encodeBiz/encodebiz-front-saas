/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from "@/hooks/useToast";
import { useEntity } from "@/hooks/useEntity";
import { searchLogs, fetchEmployee as fetchEmployeeData } from "@/services/checkinbiz/employee.service";
import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";
import { Column } from "@/components/common/table/GenericTable";
import { format_date, getDateRange } from "@/lib/common/Date";
import { fetchSucursal as fetchSucursalData } from "@/services/checkinbiz/sucursal.service";
import { Box, IconButton, TextField } from "@mui/material";
import SearchFilter from "@/components/common/table/filters/SearchFilter";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { CustomChip } from "@/components/common/table/CustomChip";
import { Edit, Map as MapIcon, ExitToApp } from "@mui/icons-material";
import { onGoMap } from "@/lib/common/maps";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { emptyChecklog } from "@/services/checkinbiz/report.service";
import { HistoryIcon } from "@/components/common/icons/HistoryIcon";
import { fetchUserAccount } from "@/services/core/account.service";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DateRange, DateRangeFilter } from "../panel/components/statsDashboard/DateRangeFilter";
import { buildWorkSessionSummaries, WorkSessionStatus } from "./attendanceSummary";

type AttendanceViewMode = "events" | "summary";

interface EventPaginationState {
  currentPage: number;
  limit: number;
  orderBy: string;
  orderDirection: 'desc' | 'asc';
  startAfter: any;
}

interface CommonAttendanceFilters {
  branchId: string;
  employeeId: string;
}

interface EventFilters extends CommonAttendanceFilters {
  status: string;
  range: { start: Date; end: Date };
}

interface SummaryFilters extends CommonAttendanceFilters {
  day: string;
  status: WorkSessionStatus | "all";
}

const createDefaultEventFilters = (range: { start: Date; end: Date }): EventFilters => ({
  branchId: 'none',
  employeeId: 'none',
  status: 'valid',
  range: { start: range.start, end: range.end },
});

const createDefaultSummaryFilters = (day: string): SummaryFilters => ({
  branchId: 'none',
  employeeId: 'none',
  day,
  status: 'working',
});

const formatDateInputValue = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDayBoundaries = (day: string) => {
  const start = new Date(`${day}T00:00:00`);
  const end = new Date(`${day}T23:59:59.999`);
  return { start, end };
};

const buildEventQueryFilters = (filters: EventFilters) => {
  const queryFilters: Array<{ field: string; operator: any; value: any }> = [
    { field: "status", operator: "==", value: filters.status },
    { field: "timestamp", operator: ">=", value: filters.range.start },
    { field: "timestamp", operator: "<=", value: filters.range.end },
  ];

  if (filters.branchId !== "none") {
    queryFilters.push({ field: "branchId", operator: "==", value: filters.branchId });
  }

  if (filters.employeeId !== "none") {
    queryFilters.push({ field: "employeeId", operator: "==", value: filters.employeeId });
  }

  return queryFilters;
};

const buildSummaryQueryFilters = (filters: SummaryFilters) => {
  const { start, end } = parseDayBoundaries(filters.day);
  const queryFilters: Array<{ field: string; operator: any; value: any }> = [
    { field: "timestamp", operator: ">=", value: start },
    { field: "timestamp", operator: "<=", value: end },
  ];

  if (filters.branchId !== "none") {
    queryFilters.push({ field: "branchId", operator: "==", value: filters.branchId });
  }

  if (filters.employeeId !== "none") {
    queryFilters.push({ field: "employeeId", operator: "==", value: filters.employeeId });
  }

  return queryFilters;
};

const enrichLogs = async (entityId: string, logs: IChecklog[]): Promise<IChecklog[]> => {
  const employeeCache = new Map<string, Promise<any>>();
  const branchCache = new Map<string, Promise<any>>();
  const userCache = new Map<string, Promise<any>>();

  const getEmployee = (employeeId?: string) => {
    if (!employeeId) return Promise.resolve(null);
    if (!employeeCache.has(employeeId)) {
      employeeCache.set(employeeId, fetchEmployeeData(entityId, employeeId));
    }
    return employeeCache.get(employeeId)!;
  };

  const getBranch = (branchId?: string) => {
    if (!branchId) return Promise.resolve(null);
    if (!branchCache.has(branchId)) {
      branchCache.set(branchId, fetchSucursalData(entityId, branchId));
    }
    return branchCache.get(branchId)!;
  };

  const getUser = (userId?: string) => {
    if (!userId) return Promise.resolve(null);
    if (!userCache.has(userId)) {
      userCache.set(userId, fetchUserAccount(userId));
    }
    return userCache.get(userId)!;
  };

  return Promise.all(
    logs.map(async (item) => {
      const [branch, employee] = await Promise.all([
        getBranch(item.branchId),
        getEmployee(item.employeeId),
      ]);

      let requestUpdates: Array<any> = [];
      let requestUpdateData: any;

      if (Array.isArray(item.metadata?.requestUpdates) && item.metadata.requestUpdates.length > 0) {
        requestUpdates = await Promise.all(
          item.metadata.requestUpdates.map(async (requestUpdate: any) => {
            const [requestEmployee, admin] = await Promise.all([
              getEmployee(requestUpdate.data?.employeeId),
              getUser(requestUpdate.updateBy),
            ]);

            return { ...requestUpdate, employee: requestEmployee, admin };
          })
        );

        if (item.requestUpdate) {
          requestUpdateData = requestUpdates.find((requestUpdate) => requestUpdate.id === item.requestUpdate);
        }
      }

      return { ...item, branch, employee, requestUpdates, requestUpdateData };
    })
  );
};

export default function useAttendanceController() {
  const t = useTranslations();
  const { showToast } = useToast();
  const { currentEntity, watchServiceAccess } = useEntity();
  const { openModal } = useCommonModal();

  const [loading, setLoading] = useState<boolean>(true);
  const [empthy, setEmpthy] = useState(false);
  const [viewMode, setViewMode] = useState<AttendanceViewMode>("summary");
  const [refreshToken, setRefreshToken] = useState(0);

  const todayRange = useMemo(() => getDateRange('today'), []);
  const todayDay = useMemo(() => formatDateInputValue(new Date()), []);

  const [eventItems, setEventItems] = useState<IChecklog[]>([]);
  const [, setEventItemsHistory] = useState<IChecklog[]>([]);
  const [summaryLogs, setSummaryLogs] = useState<IChecklog[]>([]);

  const [eventPagination, setEventPagination] = useState<EventPaginationState>({
    currentPage: 0,
    limit: 5,
    orderBy: 'timestamp',
    orderDirection: 'desc',
    startAfter: null,
  });
  const [summaryPage, setSummaryPage] = useState(0);
  const [summaryRowsPerPage, setSummaryRowsPerPage] = useState(5);

  const [eventFilters, setEventFilters] = useState<EventFilters>(() => createDefaultEventFilters(todayRange));
  const [summaryFilters, setSummaryFilters] = useState<SummaryFilters>(() => createDefaultSummaryFilters(todayDay));

  const fetchEventData = useCallback(async (options?: { startAfter?: any; resetHistory?: boolean }) => {
    if (!currentEntity?.entity?.id) return;

    const entityId = currentEntity.entity.id;
    setLoading(true);

    try {
      const [isEmpty, logs] = await Promise.all([
        emptyChecklog(entityId),
        searchLogs(entityId, {
          filters: buildEventQueryFilters(eventFilters),
          startAfter: options?.startAfter ?? null,
          limit: eventPagination.limit,
          orderBy: eventPagination.orderBy,
          orderDirection: eventPagination.orderDirection,
        } as any),
      ]);

      setEmpthy(isEmpty);

      if (logs.length === 0) {
        if (options?.resetHistory) {
          setEventItems([]);
          setEventItemsHistory([]);
        }
        return;
      }

      const data = await enrichLogs(entityId, logs);
      setEventItems(data);
      setEventPagination((prev) => ({
        ...prev,
        startAfter: (logs[logs.length - 1] as any)?.last ?? null,
      }));

      if (options?.resetHistory) {
        setEventItemsHistory(data);
      } else {
        setEventItemsHistory((prev) => [...prev, ...data]);
      }
    } catch (error: any) {
      showToast(error?.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentEntity?.entity?.id, eventFilters, eventPagination.limit, eventPagination.orderBy, eventPagination.orderDirection, refreshToken]);

  const fetchSummaryData = useCallback(async () => {
    if (!currentEntity?.entity?.id) return;

    const entityId = currentEntity.entity.id;
    setLoading(true);

    try {
      const [isEmpty, logs] = await Promise.all([
        emptyChecklog(entityId),
        searchLogs(entityId, {
          filters: buildSummaryQueryFilters(summaryFilters),
          limit: 10000,
          orderBy: 'timestamp',
          orderDirection: 'asc',
          includeCount: false,
        } as any),
      ]);

      setEmpthy(isEmpty);
      const data = await enrichLogs(entityId, logs);
      setSummaryLogs(data);
    } catch (error: any) {
      showToast(error?.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentEntity?.entity?.id, summaryFilters, refreshToken]);

  useEffect(() => {
    if (!currentEntity?.entity?.id) return;
    if (viewMode === "events") fetchEventData({ startAfter: null, resetHistory: true });
    else fetchSummaryData();
  }, [currentEntity?.entity?.id, viewMode, fetchEventData, fetchSummaryData]);

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('checkinbiz');
    }
  }, [currentEntity?.entity?.id]);

  const onEdit = (item: IChecklog) => {
    openModal(CommonModalType.CHECKLOGFORM, { data: item });
  };

  const onCloseShift = (item: IChecklog & any) => {
    const tz = item.metadata?.tz ?? item.branch?.address?.timeZone;
    openModal(CommonModalType.MANUAL_CHECKLOG_REQUEST, {
      checkinId: item.id,
      employeeId: item.employeeId,
      employeeName: item.employee?.fullName ?? item.employeeId,
      branchId: item.branchId,
      branchName: item.branch?.name ?? item.branchId,
      checkinDate: format_date(item.timestamp, 'DD/MM/YYYY', tz),
      checkinTime: format_date(item.timestamp, 'HH:mm', tz),
    });
  };

  const rowAction: Array<any> = [
    {
      actionBtn: true,
      color: 'primary',
      icon: <Edit color="primary" />,
      label: t('core.button.edit'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: IChecklog) => onEdit(item)
    },
    {
      actionBtn: true,
      color: 'primary',
      icon: <MapIcon color="primary" />,
      label: t('sucursal.map'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: IChecklog) => onGoMap(item.geo.lat, item.geo.lng)
    },
    {
      actionBtn: true,
      color: 'warning' as const,
      icon: <ExitToApp color="warning" />,
      label: t('attendance.manualRequest.closeShiftButton'),
      bulk: false,
      allowItem: (row: IChecklog) => row.type === 'checkin' && row.status === 'valid',
      onPress: (item: IChecklog & any) => onCloseShift(item),
    },
    {
      actionBtn: true,
      color: 'primary',
      icon: <InfoOutlinedIcon color="primary" />,
      label: t('core.label.viewDetails'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: IChecklog) => openModal(CommonModalType.LOGS, { log: item })
    }
  ];

  const onNext = async (): Promise<void> => {
    const nextPage = eventPagination.currentPage + 1;
    setEventPagination((prev) => ({ ...prev, currentPage: nextPage }));
    fetchEventData({ startAfter: eventPagination.startAfter, resetHistory: false });
  };

  const onBack = (): void => {
    setEventItemsHistory((prev) => {
      const nextHistory = [...prev];
      nextHistory.splice(-eventItems.length);
      setEventItems([...nextHistory.slice(-eventPagination.limit)]);
      setEventPagination((current) => ({
        ...current,
        currentPage: Math.max(0, current.currentPage - 1),
        startAfter: (nextHistory[nextHistory.length - 1] as any)?.last ?? null,
      }));
      return nextHistory;
    });
  };

  const onSort = (sort: { orderBy: string, orderDirection: 'desc' | 'asc' }) => {
    setEventItemsHistory([]);
    setEventPagination((prev) => ({
      ...prev,
      currentPage: 0,
      startAfter: null,
      orderBy: sort.orderBy,
      orderDirection: sort.orderDirection,
    }));
  };

  const onRowsPerPageChange = (limit: number) => {
    setEventItemsHistory([]);
    setEventPagination((prev) => ({
      ...prev,
      currentPage: 0,
      startAfter: null,
      limit,
    }));
  };

  const eventColumns: Column<any>[] = [
    {
      id: 'branch',
      label: t("core.label.branch"),
      minWidth: 170,
      format: (value, row) => row.branch?.name
    },
    {
      id: 'employee',
      label: t("core.label.employee"),
      minWidth: 170,
      format: (value, row) => row.employee?.fullName ?? ' Supervisor '
    },
    {
      id: 'type',
      label: t("core.label.register"),
      minWidth: 170,
      format: (value, row) => t('core.label.' + row.type)
    },
    {
      id: 'status',
      label: t("core.label.status"),
      minWidth: 170,
      format: (value, row) => <CustomChip role={'text'} background={row.status} label={t('core.label.' + row.status)} />
    },
    {
      id: 'timestamp',
      label: t("core.label.date-hour"),
      minWidth: 200,
      format: (value, row) => (
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
          <span>{format_date(row.timestamp, 'DD/MM/YYYY HH:mm:ss', row.metadata?.tz ?? row.metadata?.etz)}</span>
          {!!row.requestUpdateData && <IconButton onClick={() => {
            openModal(CommonModalType.INFO, { item: row.requestUpdateData })
          }}><HistoryIcon /></IconButton>}
        </Box>
      )
    },
  ];

  const summaryItems = useMemo(() => {
    const sessions = buildWorkSessionSummaries(summaryLogs);
    if (summaryFilters.status === "all") return sessions;
    return sessions.filter((session) => session.status === summaryFilters.status);
  }, [summaryLogs, summaryFilters.status]);

  const onSuccessCreate = () => {
    setRefreshToken((prev) => prev + 1);
    if (viewMode === "events") {
      setEventItemsHistory([]);
      setEventPagination((prev) => ({
        ...prev,
        currentPage: 0,
        startAfter: null,
      }));
    } else {
      setSummaryPage(0);
    }
  };

  const onRequestManual = () => {
    openModal(CommonModalType.MANUAL_CHECKLOG_REQUEST);
  };

  const changeViewMode = (nextViewMode: AttendanceViewMode) => {
    setViewMode(nextViewMode);
    if (nextViewMode === "events") {
      setEventItemsHistory([]);
      setEventPagination((prev) => ({ ...prev, currentPage: 0, startAfter: null }));
      setEventFilters(createDefaultEventFilters(todayRange));
    } else {
      setSummaryPage(0);
      setSummaryFilters(createDefaultSummaryFilters(todayDay));
    }
  };

  const topFilter = (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <SearchFilter
          label={t('core.label.status')}
          value={viewMode === "events" ? eventFilters.status : summaryFilters.status}
          onChange={(value: any) => {
            if (viewMode === "events") {
              setEventItemsHistory([]);
              setEventFilters((prev) => ({ ...prev, status: value }));
              setEventPagination((prev) => ({ ...prev, currentPage: 0, startAfter: null }));
              return;
            }

            setSummaryPage(0);
            setSummaryFilters((prev) => ({ ...prev, status: value ?? 'working' }));
          }}
          options={viewMode === "events" ? [
            { value: 'valid' as string, label: t('core.label.valid') },
            { value: 'failed' as string, label: t('core.label.failed') },
            { value: 'pending-employee-validation' as string, label: t('core.label.pending-employee-validation') },
            { value: 'incomplete_workday' as string, label: t('core.label.incomplete_workday') }
          ] : [
            { value: 'working' as string, label: t('attendance.summaryStatusWorking') },
            { value: 'incident' as string, label: t('attendance.summaryStatusIncident') },
            { value: 'pending' as string, label: t('attendance.summaryStatusPending') },
            { value: 'on_break' as string, label: t('attendance.summaryStatusOnBreak') },
            { value: 'completed' as string, label: t('attendance.summaryStatusCompleted') },
            { value: 'all' as string, label: t('core.label.all') }
          ]}
        />

        <SearchIndexFilter
          key={`branch-${viewMode}`}
          width='auto'
          type="branch"
          label={t('core.label.subEntity')}
          onChange={async (value: ISearchIndex) => {
            const branchId = value?.index ? value.index.split('/').pop() ?? 'none' : 'none';
            setEventItemsHistory([]);
            setEventPagination((prev) => ({ ...prev, currentPage: 0, startAfter: null }));
            setSummaryPage(0);
            if (viewMode === "events") setEventFilters((prev) => ({ ...prev, branchId }));
            else setSummaryFilters((prev) => ({ ...prev, branchId }));
          }}
        />

        <SearchIndexFilter
          key={`employee-${viewMode}`}
          width='auto'
          type="employee"
          label={t('core.label.employee')}
          onChange={async (value: ISearchIndex) => {
            const employeeId = value?.index ? value.index.split('/').pop() ?? 'none' : 'none';
            setEventItemsHistory([]);
            setEventPagination((prev) => ({ ...prev, currentPage: 0, startAfter: null }));
            setSummaryPage(0);
            if (viewMode === "events") setEventFilters((prev) => ({ ...prev, employeeId }));
            else setSummaryFilters((prev) => ({ ...prev, employeeId }));
          }}
        />

        {viewMode === "events" ? (
          <DateRangeFilter
            value={{ from: eventFilters.range.start.toISOString(), to: eventFilters.range.end.toISOString() }}
            onChange={(range: DateRange) => {
              setEventItemsHistory([]);
              setEventFilters((prev) => ({
                ...prev,
                range: { start: new Date(range.from), end: new Date(range.to) }
              }));
              setEventPagination((prev) => ({ ...prev, currentPage: 0, startAfter: null }));
            }}
          />
        ) : (
          <TextField
            size="small"
            type="date"
            label={t('attendance.summaryDay')}
            value={summaryFilters.day}
            onChange={(event) => {
              setSummaryPage(0);
              setSummaryFilters((prev) => ({ ...prev, day: event.target.value }));
            }}
            InputLabelProps={{ shrink: true }}
          />
        )}
      </Box>
    </Box>
  );

  return {
    items: eventItems,
    summaryItems,
    viewMode,
    setViewMode: changeViewMode,
    onSort,
    onRowsPerPageChange,
    topFilter,
    empthy,
    onNext,
    onBack,
    columns: eventColumns,
    rowAction,
    onSuccessCreate,
    onRequestManual,
    loading,
    filterParams: {
      currentPage: eventPagination.currentPage,
      params: {
        limit: eventPagination.limit,
        orderBy: eventPagination.orderBy,
        orderDirection: eventPagination.orderDirection,
      },
    },
    summaryPagination: {
      page: summaryPage,
      rowsPerPage: summaryRowsPerPage,
      onPageChange: setSummaryPage,
      onRowsPerPageChange: (rows: number) => {
        setSummaryRowsPerPage(rows);
        setSummaryPage(0);
      },
    },
  };
}
