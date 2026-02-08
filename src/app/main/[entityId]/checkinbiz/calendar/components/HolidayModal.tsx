'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SassButton } from "@/components/common/buttons/GenericButton";
import { Holiday } from "@/domain/features/checkinbiz/ICalendar";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";
import { useAppLocale } from "@/hooks/useAppLocale";
import { esES } from '@mui/x-date-pickers/locales';
import { enUS } from '@mui/x-date-pickers/locales';
import { Dayjs } from "dayjs";

type HolidayModalProps = {
    open: boolean;
    scope: "entity" | "branch" | "employee";
    initialValue?: Holiday;
    existingDates?: string[];
    onClose: () => void;
    onSubmit: (holiday: Holiday) => Promise<void> | void;
};

const HolidayModal = ({ open, scope, initialValue, onClose, onSubmit, existingDates = [] }: HolidayModalProps) => {
    const t = useTranslations('calendar');
    const { currentLocale } = useAppLocale();
    const isEmployee = scope === "employee";
    const isBranch = scope === "branch";
    const isEntity = scope === "entity";

    const nameLabel = isEmployee ? "Nombre de la ausencia" : isBranch ? "Nombre del día libre" : t('holidays.fields.name');
    const descLabel = isEmployee ? "Detalle de la ausencia" : isBranch ? "Detalle del día libre" : t('holidays.fields.description');
    const dateLabel = isEmployee ? "" : isBranch ? "Fecha del día libre" : t('holidays.fields.date');
    const saveLabel = isEmployee ? "Aceptar" : isBranch ? "Guardar día libre" : t('holidays.save');
    const dialogTitle = isEmployee
        ? initialValue ? "Editar ausencia" : "Agregar ausencia"
        : isBranch
            ? initialValue ? "Editar día libre" : "Agregar día libre"
            : initialValue ? t('holidays.editTitle') : t('holidays.addTitle');

    const formik = useFormik({
        initialValues: {
            id: initialValue?.id ?? '',
            name: initialValue?.name ?? '',
            date: initialValue?.date ?? '',
            startDate: initialValue?.date ?? '',
            endDate: initialValue?.date ?? '',
            description: initialValue?.description ?? ''
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required(t('errors.holidayName')),
            date: isEmployee ? Yup.string().optional() : Yup.string().required(t('errors.holidayDate')),
            startDate: isEmployee
                ? Yup.string().required(t('errors.holidayDate'))
                : Yup.string().optional(),
            endDate: isEmployee
                ? Yup.string()
                    .required(t('errors.holidayDate'))
                    .test('range', 'La fecha fin debe ser posterior al inicio', function (value) {
                        const { startDate } = this.parent as { startDate?: string };
                        if (!startDate || !value) return true;
                        return !dayjs(value).isBefore(dayjs(startDate), 'day');
                    })
                : Yup.string().optional(),
            description: Yup.string().optional()
        }),
        onSubmit: async (values, helpers) => {
            if (isEmployee) {
                const start = dayjs(values.startDate).startOf("day");
                const end = dayjs(values.endDate).startOf("day");
                const days = Math.max(0, end.diff(start, "day"));
                for (let i = 0; i <= days; i++) {
                    const date = start.add(i, "day").format("YYYY-MM-DD");
                    await onSubmit({
                        id: values.id ? `${values.id}-${i}` : `${values.name}-${date}`,
                        name: values.name.trim(),
                        date,
                        description: values.description?.trim() || undefined
                    });
                }
            } else {
                await onSubmit({
                    id: values.id,
                    name: values.name.trim(),
                    date: values.date,
                    description: values.description?.trim() || undefined
                });
            }
            helpers.setSubmitting(false);
        }
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth={isEmployee ? "xs" : "sm"} fullWidth>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label={nameLabel}
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        fullWidth
                        autoFocus
                    />
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        localeText={currentLocale == 'es' ? esES.components.MuiLocalizationProvider.defaultProps.localeText : enUS.components.MuiLocalizationProvider.defaultProps.localeText}
                    >
                        {isEmployee ? (
                            <Stack spacing={1.5} alignItems="center">
                                <Typography variant="subtitle2" alignSelf="flex-start">Rango de fechas</Typography>
                                <DateCalendar
                                    value={(formik.values.endDate || formik.values.startDate) ? dayjs(formik.values.endDate || formik.values.startDate) : null}
                                    onChange={(date) => {
                                        if (!date) return;
                                        const start = formik.values.startDate ? dayjs(formik.values.startDate) : null;
                                        const end = formik.values.endDate ? dayjs(formik.values.endDate) : null;

                                        // Selección de rango en dos clics:
                                        if (!start) {
                                            formik.setFieldValue("startDate", date.format("YYYY-MM-DD"));
                                            formik.setFieldValue("endDate", "");
                                        } else if (!end) {
                                            if (date.isBefore(start, "day")) {
                                                formik.setFieldValue("startDate", date.format("YYYY-MM-DD"));
                                                formik.setFieldValue("endDate", start.format("YYYY-MM-DD"));
                                            } else {
                                                formik.setFieldValue("endDate", date.format("YYYY-MM-DD"));
                                            }
                                        } else {
                                            // Tercer clic: reinicia rango
                                            formik.setFieldValue("startDate", date.format("YYYY-MM-DD"));
                                            formik.setFieldValue("endDate", "");
                                        }

                                        formik.setFieldTouched("startDate", true, false);
                                        formik.setFieldTouched("endDate", true, false);
                                    }}
                                    sx={{ maxWidth: 360, width: "100%", alignSelf: "center" }}
                                    slots={{
                                        day: (dayProps: PickersDayProps) => {
                                            const start = formik.values.startDate ? dayjs(formik.values.startDate) : null;
                                            const end = formik.values.endDate ? dayjs(formik.values.endDate) : null;
                                            const isStart = start?.isSame(dayProps.day, "day");
                                            const isEnd = end?.isSame(dayProps.day, "day");
                                            const dayStr = dayProps.day.format("YYYY-MM-DD");
                                            const belongsToCurrent = isStart || isEnd;
                                            const isTaken = existingDates.includes(dayStr) && !belongsToCurrent;
                                            const isBetween =
                                                start &&
                                                end &&
                                                dayProps.day.isAfter(start, "day") &&
                                                dayProps.day.isBefore(end, "day");
                                            return (
                                                <PickersDay
                                                    {...dayProps}
                                                    disabled={dayProps.disabled || isTaken}
                                                    selected={Boolean(isStart || isEnd)}
                                                    sx={{
                                                        ...(isTaken && {
                                                            bgcolor: (theme) => theme.palette.action.disabledBackground,
                                                            color: (theme) => theme.palette.text.disabled,
                                                            pointerEvents: "none",
                                                        }),
                                                        ...(isStart || isEnd
                                                            ? {
                                                                bgcolor: (theme) => theme.palette.primary.main,
                                                                color: (theme) => theme.palette.common.white,
                                                                "&:hover, &:focus": {
                                                                    bgcolor: (theme) => theme.palette.primary.dark,
                                                                },
                                                            }
                                                            : {}),
                                                        ...(isBetween && {
                                                            bgcolor: (theme) => theme.palette.primary.light,
                                                            color: (theme) => theme.palette.primary.contrastText,
                                                        }),
                                                    }}
                                                />
                                            );
                                        },
                                    }}
                                />
                                <Stack spacing={0.5} width="100%">
                                    <Typography variant="caption">
                                        {formik.values.startDate && formik.values.endDate
                                            ? `Del ${dayjs(formik.values.startDate).format("DD/MM/YYYY")} al ${dayjs(formik.values.endDate).format("DD/MM/YYYY")}`
                                            : "Selecciona inicio y fin en el calendario"}
                                    </Typography>
                                    {(formik.touched.startDate && formik.errors.startDate) || (formik.touched.endDate && formik.errors.endDate) ? (
                                        <Typography variant="caption" color="error">
                                            {formik.errors.startDate || formik.errors.endDate}
                                        </Typography>
                                    ) : null}
                                </Stack>
                            </Stack>
                        ) : (
                            <DatePicker
                                label={dateLabel || t('holidays.fields.date')}
                                value={formik.values.date ? dayjs(formik.values.date) : null}
                                onChange={(newValue) => {
                                    formik.setFieldValue('date', newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
                                }}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 2,
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: (theme) => theme.palette.primary.main,
                                    },
                                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderWidth: 1,
                                    },
                                }}
                                slotProps={{
                                    textField: {
                                        onBlur: formik.handleBlur,
                                        name: 'date',
                                        error: formik.touched.date && Boolean(formik.errors.date),
                                        helperText: formik.touched.date && formik.errors.date,
                                        fullWidth: true,
                                    }
                                }}
                            />
                        )}
                    </LocalizationProvider>
                    <TextField
                        label={descLabel}
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        multiline
                        minRows={2}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <SassButton variant="text" onClick={onClose}>
                    {t('actions.cancel')}
                </SassButton>
                <SassButton variant="contained" onClick={() => formik.submitForm()} disabled={formik.isSubmitting}>
                    {saveLabel}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default HolidayModal;
