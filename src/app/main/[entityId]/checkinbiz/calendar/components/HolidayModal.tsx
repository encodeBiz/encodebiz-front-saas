'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SassButton } from "@/components/common/buttons/GenericButton";
import { Holiday } from "@/domain/features/checkinbiz/ICalendar";

type HolidayModalProps = {
    open: boolean;
    initialValue?: Holiday;
    onClose: () => void;
    onSubmit: (holiday: Holiday) => Promise<void> | void;
};

const HolidayModal = ({ open, initialValue, onClose, onSubmit }: HolidayModalProps) => {
    const t = useTranslations('calendar');

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
                    <TextField
                        label={t('holidays.fields.date')}
                        name="date"
                        type="date"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.date && Boolean(formik.errors.date)}
                        helperText={formik.touched.date && formik.errors.date}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
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
