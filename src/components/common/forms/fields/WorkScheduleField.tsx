import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, Stack, Switch, TextFieldProps, Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useField, useFormikContext } from "formik";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAppLocale } from "@/hooks/useAppLocale";

import { esES } from '@mui/x-date-pickers/locales';
import { enUS } from '@mui/x-date-pickers/locales';
import { createDayjsTime } from "@/lib/common/Date";
import { WorkDaySchedule, WorkSchedule } from "@/domain/features/checkinbiz/ISucursal";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { SassButton } from "@/components/common/buttons/GenericButton";

// Tipos


const DAYS = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
] as const;

type DayKey = typeof DAYS[number]['key'];

// Horas del día (0-23)
const defaultDaySchedule: WorkDaySchedule = {
    enabled: true,
    start: { hour: 9, minute: 0 },
    end: { hour: 17, minute: 0 },
};

const initialValues: WorkSchedule = {
    monday: { ...defaultDaySchedule },
    tuesday: { ...defaultDaySchedule },
    wednesday: { ...defaultDaySchedule },
    thursday: { ...defaultDaySchedule },
    friday: { ...defaultDaySchedule },
    saturday: { ...defaultDaySchedule },
    sunday: { ...defaultDaySchedule, enabled: false },
    notifyBeforeMinutes: 15,
};

type WorkScheduleFieldProps = TextFieldProps & {
    name: string;
    afterTextField?: string,
    onHandleChange?: (value: any) => void,
    enableDayTimeRange: boolean
    workScheduleEnable: boolean
    onBulkApply?: () => void;
    renderDayExtras?: (args: {
        dayKey: DayKey;
        dayLabel: string;
        dayValue: any;
        onChange: (updater: (current: any) => any) => void;
    }) => React.ReactNode
};

const WorkScheduleField: React.FC<WorkScheduleFieldProps> = ({
    ...props
}) => {

        const { workScheduleEnable, enableDayTimeRange, onBulkApply } = props
        const [field, , helper] = useField(props.name as string);
        const fieldValue: WorkSchedule = field.value ?? initialValues;
        const formik = useFormikContext<any>();
        const { currentLocale } = useAppLocale()
        const t = useTranslations()
        const [bulkOpen, setBulkOpen] = useState(false);
        const [bulkStart, setBulkStart] = useState(dayjs().hour(9).minute(0).second(0).millisecond(0));
        const [bulkEnd, setBulkEnd] = useState(dayjs().hour(17).minute(0).second(0).millisecond(0));

        const updateDay = (dayKey: DayKey, updater: (current: any) => any) => {
            const currentSchedule = (formik?.values?.[props.name] as any) ?? fieldValue ?? initialValues;
            const base = currentSchedule ?? initialValues;
            const currentDay = (base as any)[dayKey] ?? { ...defaultDaySchedule };
            const nextDay = updater({ ...currentDay });
            const next = {
                ...(base as any),
                [dayKey]: nextDay,
            };
            if (formik?.setFieldValue) formik.setFieldValue(props.name as string, next, true);
            else helper.setValue(next);
        };

        const applyBulkTimes = (startHour: number, startMinute: number, endHour: number, endMinute: number) => {
            const currentSchedule = (formik?.values?.[props.name] as any) ?? fieldValue ?? initialValues;
            const base = currentSchedule ?? initialValues;
            const next: any = { ...(base as any) };
            DAYS.forEach((day) => {
                const currentDay = (base as any)[day.key] ?? { ...defaultDaySchedule };
                next[day.key] = {
                    ...currentDay,
                    start: { ...(currentDay.start ?? defaultDaySchedule.start), hour: startHour, minute: startMinute },
                    end: { ...(currentDay.end ?? defaultDaySchedule.end), hour: endHour, minute: endMinute },
                    enabled: true,
                    disabled: false,
                };
            });
            if (formik?.setFieldValue) formik.setFieldValue(props.name as string, next, true);
            else helper.setValue(next);
        };



        return (<LocalizationProvider dateAdapter={AdapterDayjs} localeText={currentLocale == 'es' ? esES.components.MuiLocalizationProvider.defaultProps.localeText : enUS.components.MuiLocalizationProvider.defaultProps.localeText}><Box display={'flex'} justifyItems={'center'} alignItems={'center'} >
            <Box alignItems="flex-start" gap={2} justifyContent={'space-evenly'} display={'flex'} flexDirection={'column'} width={'100%'}>

                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" width="100%" spacing={1}>
                    <SassButton
                        type="button"
                        size="small"
                        variant="outlined"
                        disabled={!workScheduleEnable}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setBulkOpen(true);
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        onMouseUp={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        Aplicar a todos los días
                    </SassButton>
                </Stack>

                {DAYS.map((day) => {
                    const dayValue = (fieldValue as any)[day.key] ?? { ...defaultDaySchedule };
                    const startValue = dayValue?.start ? createDayjsTime(dayValue.start.hour as number, dayValue.start.minute as number) : null;
                    const endValue = dayValue?.end ? createDayjsTime(dayValue.end.hour as number, dayValue.end.minute as number) : null;
                    return (
                        <Box key={day.key} sx={{ mb: 3 }} width={'100%'}>
                            <Grid spacing={2} alignItems="center" gap={2} justifyContent={'space-between'} display={'flex'} flexDirection={'row'} width={'100%'}>
                            <Grid display={'flex'} width={'20%'} alignItems="flex-start" justifyContent={'flex-start'} flexDirection={{
                                xs: 'column',
                                sm: 'column',
                                md: 'column',
                                lg: 'row',
                                xl: 'row',
                            }} >
                                        <FormControlLabel
                                            control={
                                            <Switch
                                                disabled={!workScheduleEnable}
                                                checked={!!dayValue?.enabled}
                                                onChange={(e) => {
                                                    updateDay(day.key, (current) => ({
                                                        ...current,
                                                        enabled: e.target.checked,
                                                        disabled: e.target.checked ? false : true,
                                                    }))
                                                }}
                                                color="primary"
                                            />
                                            }
                                            label={
                                                <Typography fontWeight="medium">
                                                    {day.label}
                                                </Typography>
                                            }
                                        />
                            </Grid>



                            <Grid display={'flex'} flexDirection={{
                                xs: 'column',
                                sm: 'column',
                                md: 'column',
                                lg: 'row',
                                xl: 'row',
                            }} >

                                <Grid container spacing={1}>
                                    <TimePicker label={t('core.label.startTime')} localeText={currentLocale == 'es' ? esES.components.MuiLocalizationProvider.defaultProps.localeText : enUS.components.MuiLocalizationProvider.defaultProps.localeText}
                                        //minTime={dayjs(props.name === 'endTime' ? new Date(formStatus?.values?.startTime) ?? new Date() : new Date())}
                                        value={startValue}
                                        onChange={(e) => {
                                            updateDay(day.key, (current) => ({
                                                ...current,
                                                start: {
                                                    ...(current?.start ?? dayValue?.start),
                                                    minute: e?.toDate().getMinutes(),
                                                    hour: e?.toDate().getHours()
                                                }
                                            }))
                                        }}
                                        disabled={!workScheduleEnable || props.disabled || ((props.name === 'endTime' || props.name === 'startTime') && !enableDayTimeRange)}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid display={'flex'} flexDirection={{
                                xs: 'column',
                                sm: 'column',
                                md: 'column',
                                lg: 'row',
                                xl: 'row',
                            }} >

                                <Grid display={'flex'} flexDirection={{
                                    xs: 'column',
                                    sm: 'column',
                                    md: 'column',
                                    lg: 'row',
                                    xl: 'row',
                                }} >
                                    <TimePicker label={t('core.label.endTime')} localeText={currentLocale == 'es' ? esES.components.MuiLocalizationProvider.defaultProps.localeText : enUS.components.MuiLocalizationProvider.defaultProps.localeText}
                                        //minTime={dayjs(props.name === 'endTime' ? new Date(formStatus?.values?.startTime) ?? new Date() : new Date())}
                                        value={endValue}
                                        onChange={(e) => {
                                            updateDay(day.key, (current) => ({
                                                ...current,
                                                end: {
                                                    ...(current?.end ?? dayValue?.end),
                                                    minute: e?.toDate().getMinutes(),
                                                    hour: e?.toDate().getHours()
                                                }
                                            }))
                                        }}
                                        disabled={!workScheduleEnable || props.disabled || ((props.name === 'endTime' || props.name === 'startTime') && !enableDayTimeRange)}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </Grid>

                            {typeof props.renderDayExtras === 'function' && <Box mt={1} width="100%">
                                    {props.renderDayExtras({
                                        dayKey: day.key,
                                        dayLabel: day.label,
                                        dayValue,
                                        onChange: (updater) => updateDay(day.key, updater),
                                    })}
                                </Box>}
                            </Grid>
                            <Divider sx={{ mt: 2 }} />
                        </Box>
                )})}

                <Dialog
                    open={bulkOpen}
                    onClose={(e?: any) => {
                        e?.stopPropagation?.();
                        setBulkOpen(false);
                    }}
                    fullWidth
                    maxWidth="xs"
                >
                    <DialogTitle sx={{ fontWeight: 600 }}>Aplicar horario estándar</DialogTitle>
                    <DialogContent dividers>
                        <Stack spacing={3} mt={1}>
                            <TimePicker
                                label={t('core.label.startTime')}
                                value={bulkStart}
                                onChange={(e) => e && setBulkStart(e)}
                            />
                            <TimePicker
                                label={t('core.label.endTime')}
                                value={bulkEnd}
                                onChange={(e) => e && setBulkEnd(e)}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Esta acción actualiza inicio y fin en todos los días del calendario actual.
                            </Typography>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <SassButton
                            type="button"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setBulkOpen(false);
                            }}
                        >
                            {t('core.button.cancel')}
                        </SassButton>
                        <SassButton
                            type="button"
                            variant="contained"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                const startHour = bulkStart.hour();
                                const startMinute = bulkStart.minute();
                                const endHour = bulkEnd.hour();
                                const endMinute = bulkEnd.minute();
                                applyBulkTimes(startHour, startMinute, endHour, endMinute);
                                setBulkOpen(false);
                                onBulkApply?.();
                            }}
                        >
                            Aceptar
                        </SassButton>
                    </DialogActions>
                </Dialog>


            </Box>

        </Box >
        </LocalizationProvider>
        );
    };

export default WorkScheduleField;
