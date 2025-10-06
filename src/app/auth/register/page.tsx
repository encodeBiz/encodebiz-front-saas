
'use client'
import React from 'react';
import {
    Container,
    Box,
    Typography,
    Link,
    useTheme
} from '@mui/material';
import { RegisterFormValues, useRegisterController } from './page.controller';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { useTranslations } from 'next-intl';
import { useStyles } from './page.styles';
import LocaleSwitcher from '@/components/common/LocaleSwitcher';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import logo from '../../../../public/assets/images/logo.svg'
import Image from 'next/image';


const SignUpPage = () => {
    const { initialValues, validationSchema, fields, signInWithEmail } = useRegisterController()
    const t = useTranslations()
    const classes = useStyles();
    const theme = useTheme()

    return (
        <Container style={{ minWidth: 600, maxWidth: 700, width: '100%' }}>

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
                <Box sx={{ ...classes.containerTop, px: {
                        xs: 0,
                        sm: 0,
                        md: 6,
                        xl: 6,
                        lg: 6,
                    } }}>
                    <Box sx={classes.containerTop}>
                        <Typography variant="h4" component="h1" >
                            {t('core.signup.title')}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {t('core.signup.subtitle')}
                        </Typography>
                    </Box>
                    <GenericForm<RegisterFormValues>
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={signInWithEmail}
                        fields={fields as FormField[]}
                        btnFullWidth
                        column={2}
                        submitButtonText={t('core.signup.signup')}
                    />

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2">
                            {t('core.signup.existAccount')} <Link style={{ color: theme.palette.primary.main, textDecoration: 'none' }} href="/auth/login">{t('core.signup.signIn')}</Link>
                        </Typography>
                    </Box>
                </Box>
            </BorderBox>

        </Container>
    );
};

export default SignUpPage;
