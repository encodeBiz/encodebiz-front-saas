
'use client'
import React from 'react';
import {
    Container,
    Box,
    Typography,
    Divider,
    Paper,
    Link
} from '@mui/material';
import { RecoveryFormValues, useRegisterController } from './page.controller';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { useTranslations } from 'next-intl';
import { useStyles } from './page.styles';
import LocaleSwitcher from '@/components/common/LocaleSwitcher';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useRouter } from 'nextjs-toploader/app';


const RecoveryPage = () => {
    const { initialValues, validationSchema, fields, handleRecoveryPassword } = useRegisterController()
    const t = useTranslations()
    const classes = useStyles();
    const { open, closeModal } = useCommonModal();
    const { push } = useRouter();

    return (
        <Container maxWidth="sm">
            <Box sx={classes.locale}>
                <LocaleSwitcher />
            </Box>
            <Paper elevation={3} sx={classes.root}>
                <Box sx={classes.containerTop}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {t('core.recovery.title')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {t('core.recovery.subtitle')}
                    </Typography>
                </Box>



                <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        {t('core.recovery.or')}
                    </Typography>
                </Divider>


                <GenericForm<RecoveryFormValues>
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleRecoveryPassword}
                    fields={fields as FormField[]}
                    btnFullWidth
                    submitButtonText={t('core.recovery.recovery')}
                />

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2">
                        {t('core.recovery.noAccount')} <Link href="/auth/register">{t('core.recovery.signup')}</Link>
                    </Typography>
                    <Typography variant="body2">
                        {t('core.recovery.existAccount')} <Link href="/auth/login">{t('core.recovery.signin')}</Link>
                    </Typography>
                </Box>
            </Paper>

            {open.open && <ConfirmModal
                title={t('core.recovery.modalTitle')}
                description={t('core.recovery.modalTitle2')}
                textBtn={t('core.recovery.ok')}
                cancelBtn={false}
                onOKAction={() => {
                    closeModal()
                    push('/auth/login')
                }}
            />}

        </Container>
    );
};

export default RecoveryPage;
