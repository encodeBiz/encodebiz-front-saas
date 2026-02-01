'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
  TablePagination,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventBusyOutlined from '@mui/icons-material/EventBusyOutlined';
import { useTranslations } from 'next-intl';
import { useEntity } from '@/hooks/useEntity';
import { useAuth } from '@/hooks/useAuth';
import { useAppLocale } from '@/hooks/useAppLocale';
import { useLayout } from '@/hooks/useLayout';
import { useToast } from '@/hooks/useToast';
import { search as searchEmployees } from '@/services/checkinbiz/employee.service';
import { IEmployee } from '@/domain/features/checkinbiz/IEmployee';
import { fetchEffectiveCalendar } from '@/services/checkinbiz/calendar.service';
import SearchIndexFilter from '@/components/common/table/filters/SearchIndexInput';
import { SelectFilter } from '@/components/common/table/filters/SelectFilter';
import { getRefByPathData } from '@/lib/firebase/firestore/readDocument';

type IFilterParams = {
  filter: { status: string };
  params: {
    orderBy: string;
    orderDirection: 'desc' | 'asc';
    startAfter: any;
    limit: number;
    filters: Array<{ field: string; operator: any; value: any }>;
  };
  currentPage: number;
};

type HolidaysState = Record<
  string,
  { loading: boolean; holidays: Array<any> | null; error?: string }
>;

const EmployeeHolidaysTab = () => {
  const t = useTranslations('calendar');
  const tCore = useTranslations('core.label');
  const tTable = useTranslations('core.table');
  const { currentEntity } = useEntity();
  const { token } = useAuth();
  const { currentLocale } = useAppLocale();
  const { changeLoaderState } = useLayout();
  const { showToast } = useToast();

  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [filterParams, setFilterParams] = useState<IFilterParams>({
    filter: { status: 'active' },
    currentPage: 0,
    params: {
      filters: [{ field: 'status', operator: '==', value: 'active' }],
      startAfter: null,
      limit: 10,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    },
  });
  const [holidaysByEmployee, setHolidaysByEmployee] = useState<HolidaysState>(
    {}
  );
  const [expandedId, setExpandedId] = useState<string | false>(false);
  const [page, setPage] = useState(0);
  const [pageCursors, setPageCursors] = useState<any[]>([null]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const buildFilters = useCallback(
    (filter: IFilterParams['filter']) => {
      const filters = [{ field: 'status', operator: '==', value: filter.status }];
      return filters;
    },
    []
  );

  const fetchEmployees = useCallback(
    async (fp: IFilterParams) => {
      if (!currentEntity?.entity?.id) return;
      changeLoaderState({ show: true });
      try {
        const params = {
          ...fp.params,
          filters: buildFilters(fp.filter),
        };
        const list: any[] = await searchEmployees(currentEntity.entity.id, params as any);
        setEmployees(list);
        const lastCursor = list?.length ? (list[list.length - 1] as any)?.last ?? null : null;
        setHasMore(list.length === fp.params.limit && !!lastCursor);
        setPageCursors((prev) => {
          const next = [...prev];
          next[fp.currentPage] = fp.params.startAfter ?? null;
          next[fp.currentPage + 1] = lastCursor;
          return next.slice(0, fp.currentPage + 2);
        });
        // expand first item by default
        const firstId = list[0]?.id ?? false;
        setExpandedId(firstId);
        if (firstId && !holidaysByEmployee[firstId]) {
          await handleLoadHolidays(firstId);
        }
      } catch (error: any) {
        showToast(error.message, 'error');
      } finally {
        changeLoaderState({ show: false });
      }
    },
    [buildFilters, changeLoaderState, currentEntity?.entity?.id, showToast]
  );

  useEffect(() => {
    fetchEmployees(filterParams);
  }, [fetchEmployees, filterParams]);

  useEffect(() => {
    if (expandedId && !holidaysByEmployee[expandedId]?.holidays && !holidaysByEmployee[expandedId]?.loading) {
      handleLoadHolidays(expandedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedId]);

  const handleLoadHolidays = async (employeeId: string) => {
    if (!token || !currentEntity?.entity?.id) return;
    setHolidaysByEmployee((prev) => ({
      ...prev,
      [employeeId]: { loading: true, holidays: prev[employeeId]?.holidays ?? null },
    }));
    try {
      const data = await fetchEffectiveCalendar({
        scope: 'entity',
        entityId: currentEntity.entity.id,
        employeeId,
        token,
        locale: currentLocale,
      });
      setHolidaysByEmployee((prev) => ({
        ...prev,
        [employeeId]: { loading: false, holidays: data?.holidays ?? [] },
      }));
    } catch (error: any) {
      setHolidaysByEmployee((prev) => ({
        ...prev,
        [employeeId]: { loading: false, holidays: [], error: error.message },
      }));
      showToast(error.message, 'error');
    }
  };

  const statusOptions = useMemo(
    () => [
      { label: tCore('active'), value: 'active' },
      { label: tCore('inactive'), value: 'inactive' },
      { label: tCore('vacation'), value: 'vacation' },
      { label: tCore('sick_leave'), value: 'sick_leave' },
      { label: tCore('leave_of_absence'), value: 'leave_of_absence' },
      { label: tCore('paternity_leave'), value: 'paternity_leave' },
      { label: tCore('maternity_leave'), value: 'maternity_leave' },
    ],
    [tCore]
  );

  const handleSearchSelect = useCallback(
    async (indexData: any) => {
      if (!indexData) {
        setHolidaysByEmployee({});
        setPage(0);
        setPageCursors([null]);
        fetchEmployees(filterParams);
        return;
      }
      try {
        changeLoaderState({ show: true });
        const item = await getRefByPathData(indexData.index);
        if (item) {
          setEmployees([item]);
          setHolidaysByEmployee({});
          const firstId = item.id ?? item.uid ?? null;
          setExpandedId(firstId || false);
          if (firstId) await handleLoadHolidays(firstId);
          setHasMore(false);
          setPage(0);
        } else {
          setPage(0);
          setPageCursors([null]);
          fetchEmployees(filterParams);
        }
      } catch (error: any) {
        showToast(error.message, 'error');
      } finally {
        changeLoaderState({ show: false });
      }
    },
    [changeLoaderState, fetchEmployees, filterParams, showToast]
  );

  return (
    <Stack spacing={3} sx={{ pb: 6 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <SearchIndexFilter
          placeholder={t('searchPlaceholder')}
          type="employee"
          onChange={(value: any) => handleSearchSelect(value)}
        />
        <SelectFilter
          label={tCore('status')}
          value={filterParams.filter.status}
          onChange={(value: any) =>
            setFilterParams((prev) => {
              setPage(0);
              setPageCursors([null]);
              return {
                ...prev,
                currentPage: 0,
                filter: { ...prev.filter, status: value },
                params: { ...prev.params, startAfter: null },
              };
            })
          }
          items={statusOptions}
        />
      </Stack>

      <Stack spacing={1.5}>
        {employees.map((emp, idx) => {
          const employeeId = emp.id as string;
          const holidaysState = holidaysByEmployee[employeeId];
          const isExpanded =
            expandedId === false ? idx === 0 : expandedId === employeeId;

          return (
            <Accordion
              key={employeeId}
              expanded={isExpanded}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 0,
                mb: 1,
                '&:before': { display: 'none' }, // quita el separador default
              }}
              onChange={(_, expanded) => {
                setExpandedId(expanded ? employeeId : false);
                if (expanded && !holidaysState?.holidays && !holidaysState?.loading) {
                  handleLoadHolidays(employeeId);
                }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EventBusyOutlined fontSize="small" color="primary" />
                  <Typography fontWeight={600}>{emp.fullName}</Typography>
                  <Chip size="small" color="primary" label={emp.status.toUpperCase()} />
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Typography variant="subtitle2">
                    {t('employeeHolidaysTitle')}
                  </Typography>
                  <Divider />
                  {holidaysState?.loading && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={18} />
                      <Typography variant="body2">{t('loadingHolidays')}</Typography>
                    </Stack>
                  )}
                  {!holidaysState?.loading &&
                    (holidaysState?.holidays?.length ?? 0) === 0 && (
                      <Alert severity="info" icon={<EventBusyOutlined fontSize="small" />}>
                        <Typography variant="body2">{t('holidaysEmpty')}</Typography>
                      </Alert>
                    )}
                  <Grid container spacing={2}>
                    {holidaysState?.holidays?.map((h: any) => (
                      <Grid item xs={12} sm={6} md={4} key={h.id}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 2, height: '100%', boxShadow: 0, borderColor: 'divider' }}
                        >
                          <CardContent>
                            <Stack spacing={1}>
                              <Typography fontWeight={700}>
                                {h.name ?? t('holidayUnknown')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {h.date ??
                                  (h.startDate && h.endDate
                                    ? `${h.startDate} - ${h.endDate}`
                                    : '--')}
                              </Typography>
                              {h.kind && (
                                <Chip
                                  size="small"
                                  color="secondary"
                                  label={
                                    h.kind === 'holiday'
                                      ? t('holidayKind.holiday')
                                      : t('holidayKind.absence')
                                  }
                                />
                              )}
                              {h.description && (
                                <Typography variant="body2" color="text.secondary">
                                  {h.description}
                                </Typography>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>

      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          component="div"
          count={hasMore ? -1 : page * filterParams.params.limit + employees.length}
          page={page}
          onPageChange={(_, newPage) => {
            if (newPage > page && !hasMore) return;
            const startAfter = newPage > page ? pageCursors[newPage] : pageCursors[newPage];
            setPage(newPage);
            const nextParams: IFilterParams = {
              ...filterParams,
              currentPage: newPage,
              params: { ...filterParams.params, startAfter }
            };
            setFilterParams(nextParams);
            fetchEmployees(nextParams);
          }}
          rowsPerPage={filterParams.params.limit}
          onRowsPerPageChange={(e) => {
            const limit = parseInt(e.target.value, 10);
            setPage(0);
            setPageCursors([null]);
            const nextParams: IFilterParams = {
              ...filterParams,
              currentPage: 0,
              params: { ...filterParams.params, limit, startAfter: null }
            };
            setFilterParams(nextParams);
            fetchEmployees(nextParams);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage={tTable('rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} ${tTable('of')} ${count === -1 ? '∞' : count}`
          }
          nextIconButtonProps={{ disabled: !hasMore }}
          sx={{
            '& .MuiTablePagination-toolbar': { pl: 0, pr: 0 },
            '& .MuiTablePagination-actions': { mr: 0.5 },
            '& .MuiTablePagination-selectLabel': { mr: 1 },
            '& .MuiTablePagination-displayedRows': { ml: 1 },
          }}
          slotProps={{
            select: {
              inputProps: { 'aria-label': tTable('rowsPerPage') },
              native: true,
            },
            actions: {
              previousButton: { 'aria-label': tTable('previous') },
              nextButton: { 'aria-label': tTable('next') },
            },
          }}
        />
      </Box>
    </Stack>
  );
};

export default EmployeeHolidaysTab;
