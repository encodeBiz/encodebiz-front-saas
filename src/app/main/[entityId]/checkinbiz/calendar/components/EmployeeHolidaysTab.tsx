'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslations } from 'next-intl';
import { useEntity } from '@/hooks/useEntity';
import { useAuth } from '@/hooks/useAuth';
import { useAppLocale } from '@/hooks/useAppLocale';
import { useLayout } from '@/hooks/useLayout';
import { useToast } from '@/hooks/useToast';
import { search as searchEmployees } from '@/services/checkinbiz/employee.service';
import { search as searchBranch } from '@/services/checkinbiz/sucursal.service';
import { IEmployee } from '@/domain/features/checkinbiz/IEmployee';
import { fetchEffectiveCalendar } from '@/services/checkinbiz/calendar.service';
import SearchIndexFilter from '@/components/common/table/filters/SearchIndexInput';
import { SelectFilter } from '@/components/common/table/filters/SelectFilter';

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
  const { currentEntity } = useEntity();
  const { token } = useAuth();
  const { currentLocale } = useAppLocale();
  const { changeLoaderState } = useLayout();
  const { showToast } = useToast();

  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
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

  const loadBranches = useCallback(async () => {
    if (!currentEntity?.entity?.id) return;
    try {
      const list = await searchBranch(currentEntity.entity.id, { limit: 200 } as any);
      setBranches(list.map((b: any) => ({ id: b.id, name: b.name })));
    } catch {
      setBranches([]);
    }
  }, [currentEntity?.entity?.id]);

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
    loadBranches();
  }, [loadBranches]);

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

  return (
    <Stack spacing={3} sx={{ pb: 6 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <SearchIndexFilter
          placeholder={t('searchPlaceholder')}
          onChange={(value: any) => {
            const filter = { ...filterParams.filter };
            const filters = buildFilters(filter);
            if (value) {
              filters.push({ field: 'search', operator: '>=', value });
            }
            setFilterParams((prev) => ({
              ...prev,
              params: { ...prev.params, filters, startAfter: null },
            }));
          }}
        />
        <SelectFilter
          label={tCore('status')}
          value={filterParams.filter.status}
          onChange={(value: any) =>
            setFilterParams((prev) => ({
              ...prev,
              filter: { ...prev.filter, status: value },
            }))
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
              onChange={(_, expanded) => {
                setExpandedId(expanded ? employeeId : false);
                if (expanded && !holidaysState?.holidays && !holidaysState?.loading) {
                  handleLoadHolidays(employeeId);
                }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography fontWeight={600}>{emp.fullName}</Typography>
                  <Chip size="small" label={emp.status} />
                  {emp.branchId && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={
                        branches.find((b) => b.id === emp.branchId)?.name ?? emp.branchId
                      }
                    />
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Typography variant="subtitle2">
                    {t('employeeHolidaysTitle')}
                  </Typography>
                  <Divider />
                  {holidaysState?.loading && (
                    <Typography variant="body2">{t('loadingHolidays')}</Typography>
                  )}
                  {!holidaysState?.loading &&
                    (holidaysState?.holidays?.length ?? 0) === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        {t('holidaysEmpty')}
                      </Typography>
                    )}
                  <Grid container spacing={2}>
                    {holidaysState?.holidays?.map((h: any) => (
                      <Grid item xs={12} sm={6} md={4} key={h.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Stack spacing={1}>
                              <Typography fontWeight={700}>
                                {h.name ?? t('holidayUnknown')}
                              </Typography>
                              <Typography variant="body2">
                                {h.date ??
                                  (h.startDate && h.endDate
                                    ? `${h.startDate} - ${h.endDate}`
                                    : '--')}
                              </Typography>
                              {h.kind && (
                                <Chip
                                  size="small"
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
    </Stack>
  );
};

export default EmployeeHolidaysTab;
