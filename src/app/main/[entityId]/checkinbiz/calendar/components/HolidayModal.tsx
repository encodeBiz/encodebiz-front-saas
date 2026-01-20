'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SassButton } from "@/components/common/buttons/GenericButton";
import { Holiday } from "@/domain/features/checkinbiz/ICalendar";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import { useAppLocale } from "@/hooks/useAppLocale";
import { esES } from '@mui/x-date-pickers/locales';
import { enUS } from '@mui/x-date-pickers/locales';

type HolidayModalProps = {
    open: boolean;
    initialValue?: Holiday;
    onClose: () => void;
    onSubmit: (holiday: Holiday) => Promise<void> | void;
};

const HolidayModal = ({ open, initialValue, onClose, onSubmit }: HolidayModalProps) => {
    const t = useTranslations('calendar');
    const { currentLocale } = useAppLocale();

    const formik = useFormik({
        initialValues: {
            id: initialValue?.id ?? '',
            name: initialValue?.name ?? '',
            date: initialValue?.date ?? '',
            description: initialValue?.description ?? ''
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required(t('errors.holidayName')),
            date: Yup.string().required(t('errors.holidayDate')),
            description: Yup.string().optional()
        }),
        onSubmit: async (values, helpers) => {
            await onSubmit({
                id: values.id,
                name: values.name.trim(),
                date: values.date,
                description: values.description?.trim() || undefined
            });
            helpers.setSubmitting(false);
        }
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialValue ? t('holidays.editTitle') : t('holidays.addTitle')}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label={t('holidays.fields.name')}
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
                        <DatePicker
                            label={t('holidays.fields.date')}
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
                    </LocalizationProvider>
                    <TextField
                        label={t('holidays.fields.description')}
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
                    {t('holidays.save')}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default HolidayModal;
