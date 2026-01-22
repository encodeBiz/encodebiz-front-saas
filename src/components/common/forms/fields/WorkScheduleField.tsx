import { Box, Divider, FormControlLabel, Grid, Switch, TextFieldProps, Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Field, FieldProps, useField } from "formik";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAppLocale } from "@/hooks/useAppLocale";

import { esES } from '@mui/x-date-pickers/locales';
import { enUS } from '@mui/x-date-pickers/locales';
import { createDayjsTime } from "@/lib/common/Date";
import { WorkDaySchedule, WorkSchedule } from "@/domain/features/checkinbiz/ISucursal";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

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

const WorkScheduleField: React.FC<FieldProps & TextFieldProps & {
    afterTextField?: string,
    onHandleChange?: (value: any) => void,
    enableDayTimeRange: boolean
    workScheduleEnable: boolean
    renderDayExtras?: (args: {
        dayKey: DayKey;
        dayLabel: string;
        dayValue: any;
        onChange: (updater: (current: any) => any) => void;
    }) => React.ReactNode
}> = ({
    ...props
}) => {

        const { workScheduleEnable, enableDayTimeRange } = props
        const [field, , helper] = useField(props.name as string);
        const fieldValue: WorkSchedule = field.value ?? initialValues;
        const { currentLocale } = useAppLocale()
        const t = useTranslations()

        const updateDay = (dayKey: DayKey, updater: (current: any) => any) => {
            helper.setValue((prev: WorkSchedule) => {
                const base = prev ?? fieldValue ?? initialValues;
                const currentDay = (base as any)[dayKey] ?? { ...defaultDaySchedule };
                const nextDay = updater({ ...currentDay });
                return {
                    ...(base as any),
                    [dayKey]: nextDay
                };
            });
        };



        return (<LocalizationProvider dateAdapter={AdapterDayjs} localeText={currentLocale == 'es' ? esES.components.MuiLocalizationProvider.defaultProps.localeText : enUS.components.MuiLocalizationProvider.defaultProps.localeText}><Box display={'flex'} justifyItems={'center'} alignItems={'center'} >
            <Box alignItems="flex-start" gap={2} justifyContent={'space-evenly'} display={'flex'} flexDirection={'column'} width={'100%'}>

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


            </Box>

        </Box >
        </LocalizationProvider>
        );
    };

export default WorkScheduleField;
