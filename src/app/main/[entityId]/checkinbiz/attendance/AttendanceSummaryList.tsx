'use client';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { format_date } from '@/lib/common/Date';
import { CustomChip } from '@/components/common/table/CustomChip';
import { IChecklog } from '@/domain/features/checkinbiz/IChecklog';
import { IRowAction } from '@/components/common/table/GenericTable';
import { WorkSessionSummary, formatMinutesAsHours } from './attendanceSummary';
import { SassButton } from '@/components/common/buttons/GenericButton';

interface AttendanceSummaryListProps {
  data: WorkSessionSummary[];
  loading?: boolean;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  rowAction: IRowAction[];
}

const statusLabelMap: Record<WorkSessionSummary['status'], string> = {
  pending: 'attendance.summaryStatusPending',
  incident: 'attendance.summaryStatusIncident',
  on_break: 'attendance.summaryStatusOnBreak',
  working: 'attendance.summaryStatusWorking',
  completed: 'attendance.summaryStatusCompleted',
};

const statusChipColorMap: Record<WorkSessionSummary['status'], string> = {
  pending: 'pending-employee-validation',
  incident: 'failed',
  on_break: 'failed',
  working: 'pending',
  completed: 'valid',
};

const chipVisualMap: Record<string, { backgroundColor: string; borderColor: string }> = {
  'pending-employee-validation': {
    backgroundColor: 'rgba(121, 123, 125, 0.08)',
    borderColor: 'rgba(121, 123, 125, 0.08)',
  },
  failed: {
    backgroundColor: '#F4AA32',
    borderColor: '#F4AA32',
  },
  pending: {
    backgroundColor: 'rgba(122, 166, 223, 0.65)',
    borderColor: 'rgba(122, 166, 223, 0.65)',
  },
  active: {
    backgroundColor: 'rgba(122, 223, 127, 0.65)',
    borderColor: 'rgba(122, 223, 127, 0.65)',
  },
  valid: {
    backgroundColor: 'rgba(122, 223, 127, 0.65)',
    borderColor: 'rgba(122, 223, 127, 0.65)',
  },
};

const incidentLabelMap: Record<string, string> = {
  failed_log: 'attendance.summaryIncidentFailedLog',
  missing_checkin: 'attendance.summaryIncidentMissingCheckin',
  open_break: 'attendance.summaryIncidentOpenBreak',
  invalid_sequence: 'attendance.summaryIncidentInvalidSequence',
  multiple_checkouts: 'attendance.summaryIncidentMultipleCheckouts',
  cross_branch_session: 'attendance.summaryIncidentCrossBranchSession',
  incomplete_workday: 'core.label.incomplete_workday',
};

const getLogTimezone = (log?: IChecklog) => log?.branch?.address?.timeZone ?? log?.metadata?.tz ?? log?.metadata?.etz;
const getVisibleIncidents = (incidents: WorkSessionSummary['incidents']) =>
  Array.from(new Map(incidents.map((incident) => [incident.code, incident])).values());

export const AttendanceSummaryList = ({
  data,
  loading = false,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowAction,
}: AttendanceSummaryListProps) => {
  const t = useTranslations();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [anchorEl, setAnchorEl] = useState<{ target: null | HTMLElement; key: string }>({ target: null, key: '' });

  const pagedData = useMemo(() => {
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const renderActions = (log: IChecklog) => {
    const availableActions = rowAction.filter((action) => action.allowItem(log));
    if (availableActions.length === 0) return null;

    return (
      <>
        <SassButton
          size="small"
          startIcon={<SettingsOutlined />}
          color='primary'
          variant='outlined'
          onClick={(event) => setAnchorEl({ target: event.currentTarget, key: log.id ?? '' })}
        >
          {t('core.table.actions')}
        </SassButton>
        {anchorEl.key === log.id && (
          <Menu
            anchorEl={anchorEl.target}
            open={Boolean(anchorEl.target)}
            onClose={() => setAnchorEl({ target: null, key: '' })}
            onClick={() => setAnchorEl({ target: null, key: '' })}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 2,
                  px: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {availableActions.map((action, index) => (
              <MenuItem key={`${log.id}-${index}`} onClick={() => action.onPress(log)}>
                <ListItemIcon color={action.color}>{action.icon}</ListItemIcon>
                <Typography color={action.color}>{action.label}</Typography>
              </MenuItem>
            ))}
          </Menu>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography align="center">{t('core.table.loader')}</Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography align="center">{t('attendance.summaryNoData')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {pagedData.map((session) => (
          <Accordion
            key={session.sessionKey}
            expanded={expanded === session.sessionKey}
            onChange={(_, isExpanded) => setExpanded(isExpanded ? session.sessionKey : false)}
            disableGutters
            elevation={0}
            sx={{
              backgroundColor: 'transparent',
              borderRadius: 0,
              boxShadow: 'none',
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
              <Box
                sx={{
                  width: '100%',
                  display: 'grid',
                  gap: 1.5,
                  gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 1.6fr) minmax(120px, 0.8fr) repeat(4, minmax(72px, 0.55fr)) 40px' },
                  alignItems: 'center',
                }}
              >
                <Box sx={{ minWidth: 0, width: '100%' }}>
                  <Typography
                    fontWeight={700}
                    sx={{
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {session.employeeName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {session.branchName ?? t('attendance.summaryMultipleBranches')}
                  </Typography>
                </Box>
                <Box sx={{ justifySelf: 'stretch', display: 'flex', justifyContent: 'flex-start' }}>
                  <CustomChip
                    role="ship"
                    background={statusChipColorMap[session.status]}
                    label={t(statusLabelMap[session.status])}
                    sx={{
                      backgroundColor: chipVisualMap[statusChipColorMap[session.status]]?.backgroundColor,
                      borderColor: chipVisualMap[statusChipColorMap[session.status]]?.borderColor,
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('attendance.summaryStart')}</Typography>
                  <Typography>{session.openingLog ? format_date(session.openingLog.timestamp, 'HH:mm', getLogTimezone(session.openingLog)) : '--:--'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('attendance.summaryEnd')}</Typography>
                  <Typography>{session.closingLog ? format_date(session.closingLog.timestamp, 'HH:mm', getLogTimezone(session.closingLog)) : '--:--'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('attendance.summaryWorked')}</Typography>
                  <Typography>{formatMinutesAsHours(session.workedMinutes)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('attendance.summaryBreak')}</Typography>
                  <Typography>{formatMinutesAsHours(session.breakMinutes)}</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                  {getVisibleIncidents(session.incidents).length > 0 && (
                    <>
                      <WarningAmberOutlined color="warning" fontSize="small" />
                      <Typography variant="body2">{getVisibleIncidents(session.incidents).length}</Typography>
                    </>
                  )}
                </Stack>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {getVisibleIncidents(session.incidents).length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  {getVisibleIncidents(session.incidents).map((incident, index) => (
                    <CustomChip
                      key={`${session.sessionKey}-${incident.code}-${index}`}
                      role="ship"
                      background="failed"
                      size="small"
                      label={t(incidentLabelMap[incident.code] ?? 'attendance.summaryIncidentInvalidSequence')}
                      sx={{
                        backgroundColor: chipVisualMap.failed.backgroundColor,
                        borderColor: chipVisualMap.failed.borderColor,
                      }}
                    />
                  ))}
                </Stack>
              )}

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('core.label.branch')}</TableCell>
                      <TableCell>{t('core.label.register')}</TableCell>
                      <TableCell>{t('core.label.status')}</TableCell>
                      <TableCell>{t('core.label.date-hour')}</TableCell>
                      <TableCell align="right">{t('core.table.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {session.logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.branch?.name ?? '--'}</TableCell>
                        <TableCell>{t(`core.label.${log.type}`)}</TableCell>
                        <TableCell>
                          <CustomChip
                            role="ship"
                            size="small"
                            background={log.status}
                            label={t(`core.label.${log.status}`)}
                            sx={{
                              backgroundColor: chipVisualMap[log.status]?.backgroundColor,
                              borderColor: chipVisualMap[log.status]?.borderColor,
                            }}
                          />
                        </TableCell>
                        <TableCell>{format_date(log.timestamp, 'DD/MM/YYYY HH:mm:ss', getLogTimezone(log))}</TableCell>
                        <TableCell align="right">{renderActions(log)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, nextPage) => onPageChange(nextPage)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
        labelRowsPerPage={t('core.table.rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('core.table.of')} ${count}`}
      />
    </Box>
  );
};

export default AttendanceSummaryList;
