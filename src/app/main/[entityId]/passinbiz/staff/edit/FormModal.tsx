import React, { useRef } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
} from '@mui/material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useTranslations } from 'next-intl';
import { useFormStatus } from '@/hooks/useFormStatus';
import { CustomTypography } from '@/components/common/Text/CustomTypography';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { IEvent } from '@/domain/features/passinbiz/IEvent';
import useFormController from '../form/form.controller';

const FormModal = ({ onSuccess }: { employeeId?: string, branchId?: string, onSuccess: () => void }): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const { fields, validationSchema, handleSubmit, initialValues } = useFormController(true, onSuccess);
    const t = useTranslations();
    const formRef = useRef(null)
    const handleClose = (event: any, reason: 'backdropClick' | 'escapeKeyDown' | 'manual') => {
        if (reason !== 'backdropClick')
            closeModal(CommonModalType.FORM);
    };

    const handleModal = (values: Partial<IEvent>) => {
        handleSubmit(values)
    }

    const { formStatus } = useFormStatus()

    const handleExternalSubmit = () => {
        if (formRef.current) {
            (formRef.current as any).submitForm()
        }
    }
    return (
        <Dialog
            open={open.open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="xl"
            slotProps={{ paper: { sx: { p: 2, borderRadius: 2 } } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                    <CustomTypography >{t('staff.edit')}</CustomTypography>
                    <CustomTypography sx={{ fontSize: 20 }} >{t('staff.formDesc')}</CustomTypography>
                </Box>

            </DialogTitle>
            <DialogContent>
                <BorderBox sx={{ p: 2 }} key={open.open + ''}>
                    <GenericForm<Partial<IEvent>>
                        column={2}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleModal}
                        fields={fields as FormField[]}
                        submitButtonText={t('core.button.save')}
                        enableReinitialize
                        hideBtn
                        activateWatchStatus
                        formRef={formRef}
                    />
                </BorderBox>
            </DialogContent>
            <DialogActions>
                <SassButton
                    color="primary"
                    variant="outlined"
                    onClick={(e) => handleClose(e, 'manual')}
                    disabled={formStatus?.isSubmitting}
                    size='small'


                >
                    {t('core.button.cancel')}
                </SassButton>
                <SassButton
                    onClick={handleExternalSubmit}
                    disabled={!formStatus?.isValid || formStatus?.isSubmitting}
                    color="primary"
                    size='small'
                    variant="contained"
                >
                    {t('core.button.save')}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default FormModal