import React, { useRef, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    CircularProgress,
    useTheme
} from '@mui/material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useTranslations } from 'next-intl';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { useFormStatus } from '@/hooks/useFormStatus';
import { CustomTypography } from '@/components/common/Text/CustomTypography';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { SassButton } from '@/components/common/buttons/GenericButton';
import useFormModalController from './FormModal.controller';
import * as Yup from 'yup';
import { IEmployee } from '@/domain/features/checkinbiz/IEmployee';

const FormModal = ({onSuccess }: { employeeId?: string, branchId?: string, onSuccess: () => void }): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const { fields, validationSchema, handleSubmit, initialValues } = useFormModalController(onSuccess);
    const t = useTranslations();
    const formRef = useRef(null)
    const handleClose = (event: any, reason: 'backdropClick' | 'escapeKeyDown' | 'manual') => {
        if (reason !== 'backdropClick')
            closeModal(CommonModalType.CHECKLOGFORM);
    };

    const handleModal = (values: Partial<IEmployee>) => {
        setIsLoading(true)
        setTimeout(() => {
            handleSubmit(values, () => { (formRef.current as any).resetForm() })
            setIsLoading(true)
        }, 2000);
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
            maxWidth="md"
            slotProps={{ paper: { sx: { p: 2, borderRadius: 2 } } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                    <CustomTypography >{t('sucursal.edit')}</CustomTypography>
                    <CustomTypography  sx={{fontSize:20}} >{t('sucursal.formDesc')}</CustomTypography>
                </Box>
                <CustomIconBtn
                    onClick={() => handleClose(null, 'manual')}
                    color={theme.palette.primary.main}
                />
            </DialogTitle>
            <DialogContent>
                <BorderBox sx={{ p: 2 }} key={open.open + ''}>
                    <GenericForm<Partial<IEmployee>>
                        column={2}
                        initialValues={initialValues}
                        validationSchema={Yup.object().shape(validationSchema)}
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
                    disabled={isLoading}
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
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {t('core.button.submit')}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default FormModal