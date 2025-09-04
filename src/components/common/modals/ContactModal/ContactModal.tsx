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
import { SassButton } from '../../buttons/GenericButton';
import { CancelOutlined, SendOutlined } from '@mui/icons-material';
import { CustomTypography } from '../../Text/CustomTypography';
import { ContactFromModel, IContact } from '@/domain/core/IContact';
import useFormContactController from './ContactModal.controller';
import GenericForm, { FormField } from '../../forms/GenericForm';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useFormStatus } from '@/hooks/useFormStatus';
import { BorderBox } from '../../tabs/BorderBox';

const ContactModalModal = (): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const { fields, validationSchema, setDinamicDataAction } = useFormContactController();
    const t = useTranslations();
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    // Handler for closing the dialog
    const handleClose = (event: any, reason: 'backdropClick' | 'escapeKeyDown' | 'manual') => {
        if (reason !== 'backdropClick')
            closeModal(CommonModalType.CONTACT);
    };

    const handleContactModal = (values: Partial<IContact>) => {
        setIsLoading(true)
        setTimeout(() => {
            setDinamicDataAction(values)
            closeModal(CommonModalType.CONTACT);
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
                    <CustomTypography >{t('contact.title')}</CustomTypography>
                </Box>

                <CustomIconBtn
                    onClick={() => handleClose(null, 'manual')}
                    color={theme.palette.primary.main}
                />
            </DialogTitle>
            <DialogContent>
                <BorderBox sx={{ p: 2 }}>
                    <GenericForm<Partial<ContactFromModel>>
                        column={2}
                        initialValues={{
                            "subject": t('contact.test2'),
                            "message": '',
                            "email": user?.email as string,
                            "phone": user?.phoneNumber as string,
                            "name": currentEntity?.entity.name as string,
                        }}
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
                    startIcon={<CancelOutlined />}

                >
                    {t('core.button.cancel')}
                </SassButton>
                <SassButton
                    onClick={handleExternalSubmit}
                    disabled={!formStatus?.isValid || formStatus?.isSubmitting}
                    color="primary"
                    size='small'
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SendOutlined />}
                >
                    {t('core.button.submit')}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default ContactModalModal