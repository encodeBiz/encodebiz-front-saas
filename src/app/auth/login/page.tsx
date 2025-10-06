
'use client'
import React from 'react';
import {
    Container,
    Box,
    Typography,

    Link,
    useTheme
} from '@mui/material';
import { LoginFormValues, useRegisterController } from './page.controller';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { useTranslations } from 'next-intl';
import { useStyles } from './page.styles';
import LocaleSwitcher from '@/components/common/LocaleSwitcher';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import logo from '../../../../public/assets/images/logo.svg'
import Image from 'next/image';
import InfoModal from '@/components/common/modals/InfoModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';


const SignInPage = () => {
    const { initialValues, validationSchema, fields, signInWithEmail } = useRegisterController()
    const t = useTranslations()
    const classes = useStyles();
    const { open } = useCommonModal()
    const theme = useTheme()
    return (
        <Container sx={{ display: 'flex', justifyItems: 'center', flexDirection: 'column', alignItems: 'center' }} maxWidth="sm">
            <Box sx={classes.locale}>
                <LocaleSwitcher />
            </Box>
            <BorderBox sx={classes.root}>
                <Image
                    width={150}
                    height={44}
                    src={logo}
                    alt="Company Logo"
                    style={{ position: 'relative', left: -15 }}
                />
                <Box sx={{ ...classes.containerTop, px: 6 }}>
                    <Box sx={classes.containerTop}>
                        <Typography variant="h4" component="h1" >
                            {t('core.signin.title')}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {t('core.signin.subtitle')}
                        </Typography>
                    </Box>
                    <GenericForm<LoginFormValues>
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={signInWithEmail}
                        fields={fields as FormField[]}
                        btnFullWidth
                        linkForm
                        submitButtonText={t('core.signin.signup')}
                    />

                    <Box sx={{ textAlign: 'center' }}>

                        <Typography variant="body2">
                            {t('core.signin.noAccount')} <Link style={{ color: theme.palette.primary.main, textDecoration:'none' }} href="/auth/register">{t('core.signup.signup')}</Link>
                        </Typography>
                    </Box>
                </Box>
            </BorderBox>

            {open.type === CommonModalType.INFO && <InfoModal
                title={t('core.feedback.tokenExireTitle')}
                description={t('core.feedback.tokenExireText')}
                cancelBtn
            />}

        </Container>
    );
};

export default SignInPage;
