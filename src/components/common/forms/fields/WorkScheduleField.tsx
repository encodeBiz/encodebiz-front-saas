import { useFormStatus } from "@/hooks/useFormStatus";
import { Alert, Box, Card, CardContent, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Switch, TextField, TextFieldProps, Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Field, FieldProps, useField } from "formik";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAppLocale } from "@/hooks/useAppLocale";

import { esES } from '@mui/x-date-pickers/locales';
import { enUS } from '@mui/x-date-pickers/locales';
import { createDayjsTime } from "@/lib/common/Date";
import { WorkDaySchedule, WorkSchedule } from "@/domain/features/checkinbiz/ISucursal";
import { useTranslations } from "next-intl";

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

// Horas del día (0-23)
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Minutos (0-59, cada 15 minutos)
const MINUTES = [0, 15, 30, 45];

// Valores iniciales
const defaultDaySchedule: WorkDaySchedule = {
    enabled: false,
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
    sunday: { ...defaultDaySchedule },
    notifyBeforeMinutes: 15,
};

const WorkScheduleField: React.FC<FieldProps & TextFieldProps & { afterTextField: string }> = ({
    ...props
}) => {
    const [field, meta, helper] = useField(props.name as string);
    const { touched, error } = meta
    const [fieldValue, setFieldValue] = useState<WorkSchedule>(field.value ?? initialValues)
    const { formStatus } = useFormStatus()
    const { currentLocale } = useAppLocale()
    const t = useTranslations()
    useEffect(() => {
        helper.setValue(fieldValue)
    }, [fieldValue])

    useEffect(() => {
        if (field.value)
            setFieldValue(field.value)
    }, [field.value])

    useEffect(() => {
        console.log(formStatus?.values);
    }, [formStatus?.values])

    return (<LocalizationProvider dateAdapter={AdapterDayjs} localeText={currentLocale == 'es' ? esES.components.MuiLocalizationProvider.defaultProps.localeText : enUS.components.MuiLocalizationProvider.defaultProps.localeText}><Box display={'flex'} justifyItems={'center'} alignItems={'center'} >
        <Box alignItems="flex-start" gap={2} justifyContent={'space-evenly'} display={'flex'} flexDirection={'column'} width={'100%'}>
            {DAYS.map((day) => (
                <Box key={day.key} sx={{ mb: 3 }} width={'100%'}>
                    <Grid spacing={2} alignItems="center" gap={2} justifyContent={'space-between'} display={'flex'} flexDirection={'row'} width={'100%'}>
                        <Grid display={'flex'} width={'20%'} alignItems="flex-start" justifyContent={'flex-start'} flexDirection={{
                            xs: 'column',
                            sm: 'column',
                            md: 'column',
                            lg: 'row',
                            xl: 'row',
                        }} >
                            <Field name={`${day.key}.enabled`}>
                                {({ field }: FieldProps) => (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled={!formStatus?.values?.workScheduleEnable}
                                                checked={fieldValue[day.key]?.enabled}
                                                onChange={(e) => {
                                                    setFieldValue({
                                                        ...fieldValue,
                                                        [day.key]: {
                                                            ...fieldValue[day.key],
                                                            enabled: e.target.checked
                                                        }
                                                    });
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
                                )}
                            </Field>
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
                                    value={createDayjsTime(fieldValue[day.key]?.start?.hour as number, fieldValue[day.key]?.start?.minute as number)}
                                    defaultValue={createDayjsTime(fieldValue[day.key]?.start?.hour as number, fieldValue[day.key]?.start?.minute as number)}
                                    onChange={(e) => {
                                        setFieldValue({
                                            ...fieldValue,
                                            [day.key]: {
                                                ...fieldValue[day.key],
                                                start: {
                                                    ...fieldValue[day.key]?.start,
                                                    minute: e?.toDate().getMinutes(),
                                                    hour: e?.toDate().getHours()
                                                }
                                            }
                                        });
                                    }}
                                    disabled={!formStatus?.values?.workScheduleEnable || props.disabled || ((props.name === 'endTime' || props.name === 'startTime') && !formStatus?.values?.enableDayTimeRange)}
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
                                    value={createDayjsTime(fieldValue[day.key]?.end?.hour as number, fieldValue[day.key]?.end?.minute as number)}
                                    defaultValue={createDayjsTime(fieldValue[day.key]?.end?.hour as number, fieldValue[day.key]?.end?.minute as number)}
                                    onChange={(e) => {
                                        setFieldValue({
                                            ...fieldValue,
                                            [day.key]: {
                                                ...fieldValue[day.key],
                                                end: {
                                                    ...fieldValue[day.key]?.end,
                                                    minute: e?.toDate().getMinutes(),
                                                    hour: e?.toDate().getHours()
                                                }
                                            }
                                        });
                                    }}
                                    disabled={!formStatus?.values?.workScheduleEnable || props.disabled || ((props.name === 'endTime' || props.name === 'startTime') && !formStatus?.values?.enableDayTimeRange)}
                                    sx={{ width: '100%' }}
                                />
                            </Grid>
                        </Grid>


                    </Grid>
                    <Divider sx={{ mt: 2 }} />
                </Box>
            ))}

            {/* Notificación previa */}
            <Box  >


                <Grid container alignItems="flex-start" width={'100%'}>
                    <Grid container alignItems="center" justifyContent={'center'} gap={2}>
                        <Typography variant="body1" color="text.secondary">
                            {t('core.label.workScheduleNotify')}
                        </Typography>
                        <Field name="notifyBeforeMinutes">
                            {({ field, meta }: FieldProps) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    sx={{ width: 240 }}
                                    type="number"
                                     size="small"
                                    error={meta.touched && !!meta.error}
                                    helperText={meta.touched && meta.error}
                                    slotProps={{
                                        htmlInput: {
                                            min: 5,
                                            max: 60,
                                            step: 5,
                                        },
                                        input: touched && error ? {
                                            endAdornment: <Typography variant="caption" color="text.secondary">
                                                min
                                            </Typography>,
                                        } : {},
                                    }}
                                    value={fieldValue.notifyBeforeMinutes}
                                    onChange={(e) => {
                                        setFieldValue({
                                            ...fieldValue,
                                            notifyBeforeMinutes: parseInt(e.target.value ?? '0')
                                        });
                                    }}

                                />
                            )}
                        </Field>
                    </Grid>

                </Grid>
            </Box>
        </Box>

    </Box >
    </LocalizationProvider>
    );
};

export default WorkScheduleField;