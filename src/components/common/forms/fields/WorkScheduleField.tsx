import { Box, FormControlLabel, Grid, Switch, TextFieldProps, Typography, Divider } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Field, FieldProps, useField } from "formik";
import { useEffect, useState } from "react";
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
    afterTextField: string,
    onHandleChange?: (value: any) => void,
    enableDayTimeRange: boolean
    workScheduleEnable: boolean

}> = ({
    ...props
}) => {

        const { workScheduleEnable, enableDayTimeRange, onHandleChange } = props
        const [field, , helper] = useField(props.name as string);
        const [fieldValue, setFieldValue] = useState<WorkSchedule>(field.value ?? initialValues)
        const { currentLocale } = useAppLocale()
        const t = useTranslations()
        useEffect(() => {
            helper.setValue(fieldValue)
            if (typeof onHandleChange === 'function') onHandleChange(fieldValue)
        }, [fieldValue, helper, onHandleChange])

        useEffect(() => {
            if (field.value)
                setFieldValue(field.value)
        }, [field.value])



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
                                    {() => (
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    disabled={!workScheduleEnable}
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
                                        disabled={!workScheduleEnable || enableDayTimeRange || props.disabled || ((props.name === 'endTime' || props.name === 'startTime') && !enableDayTimeRange)}
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
                                        disabled={!workScheduleEnable || enableDayTimeRange || props.disabled || ((props.name === 'endTime' || props.name === 'startTime') && !enableDayTimeRange)}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </Grid>


                        </Grid>
                        <Divider sx={{ mt: 2 }} />
                    </Box>
                ))}


            </Box>

        </Box >
        </LocalizationProvider>
        );
    };

export default WorkScheduleField;
