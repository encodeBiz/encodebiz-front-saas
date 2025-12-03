
'use client'
import React from 'react';
import {
    Container,
    Box,
    Typography,
    Link,
    useTheme
} from '@mui/material';
import { RecoveryFormValues, useRegisterController } from './page.controller';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { useTranslations } from 'next-intl';
import { useStyles } from './page.styles';
import LocaleSwitcher from '@/components/common/LocaleSwitcher';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useRouter } from 'nextjs-toploader/app';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import logo from '../../../../public/assets/images/logo.svg'
import Image from 'next/image';
import InfoModal from '@/components/common/modals/InfoModal';


const RecoveryPage = () => {
    const { initialValues, validationSchema, fields, handleRecoveryPassword } = useRegisterController()
    const t = useTranslations()
    const classes = useStyles();
    const { open, closeModal } = useCommonModal();
    const { push } = useRouter();
    const theme = useTheme()

    return (
        <Container maxWidth="sm">

            <BorderBox sx={classes.root}>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Image
                        width={150}
                        height={44}
                        src={logo}
                        alt="Company Logo"
                        style={{ position: 'relative', left: -15 }}
                    />
                    <LocaleSwitcher />
                </Box>
                <Box sx={{
                    ...classes.containerTop, px: {
                        xs: 0,
                        sm: 0,
                        md: 6,
                        xl: 6,
                        lg: 6,
                    }
                }}>
                    <Box sx={classes.containerTop}>
                        <Typography variant="h4" component="h1" >
                            {t('core.recovery.title')}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {t('core.recovery.subtitle')}
                        </Typography>
                    </Box>

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
                            {t('core.recovery.existAccount')} <Link style={{ color: theme.palette.primary.main, textDecoration: 'none' }} href="/auth/login">{t('core.recovery.signin')}</Link>
                        </Typography>
                    </Box>
                </Box>
            </BorderBox>

            {open.open && <InfoModal
                title={t('core.recovery.modalTitle')}
                description={t('core.recovery.modalTitle2')}
                closeIcon={false}
                cancelBtn={false}
                centerBtn
                onClose={() => {
                    closeModal()
                    push('/auth/login')
                }}
            />}

        </Container>
    );
};

export default RecoveryPage;
