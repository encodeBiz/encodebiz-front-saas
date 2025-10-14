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
import { ContactFromModel, IContact } from '@/domain/core/IContact';
import useFormContactController from './ReportFormModal.controller';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useFormStatus } from '@/hooks/useFormStatus';
import { CustomTypography } from '@/components/common/Text/CustomTypography';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { SassButton } from '@/components/common/buttons/GenericButton';
import useReportFormModalController from './ReportFormModal.controller';
import { IChecklog } from '@/domain/features/checkinbiz/IChecklog';

const ReportFormModal = ({ employeeId, branchId , onSuccess}: { employeeId?: string, branchId?: string, onSuccess:()=>void }): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const { fields, validationSchema, setDinamicDataAction, initialValues } = useReportFormModalController(onSuccess,employeeId, branchId);
    const t = useTranslations();

    const handleClose = (event: any, reason: 'backdropClick' | 'escapeKeyDown' | 'manual') => {
        if (reason !== 'backdropClick')
            closeModal(CommonModalType.CHECKLOGFORM);
    };

    const handleContactModal = (values: Partial<IChecklog>) => {
        setIsLoading(true)
        setTimeout(() => {
            setDinamicDataAction(values)
            closeModal(CommonModalType.CHECKLOGFORM);
            setIsLoading(true)
        }, 2000);
    }


    const formRef = useRef(null)
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
                    <CustomTypography >{t('report.report')}</CustomTypography>
                </Box>
                <CustomIconBtn
                    onClick={() => handleClose(null, 'manual')}
                    color={theme.palette.primary.main}
                />
            </DialogTitle>
            <DialogContent>
                <BorderBox sx={{ p: 2 }}>
                    <GenericForm<Partial<IChecklog>>
                        column={2}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleContactModal}
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
                    {t('core.button.create-download')}
                </SassButton>

                <SassButton
                    onClick={handleExternalSubmit}
                    disabled={!formStatus?.isValid || formStatus?.isSubmitting}
                    color="primary"
                    size='small'
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {t('core.button.create')}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default ReportFormModal