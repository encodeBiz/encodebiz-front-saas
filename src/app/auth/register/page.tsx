
'use client'
import React from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Link
} from '@mui/material';
import { RegisterFormValues, useRegisterController } from './page.controller';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { useTranslations } from 'next-intl';
import { useStyles } from './page.styles';
import LocaleSwitcher from '@/components/common/LocaleSwitcher';


const SignUpPage = () => {
    const { initialValues, validationSchema, fields, signInWithEmail } = useRegisterController()
    const t = useTranslations()
    const classes = useStyles();

    return (
        <Container maxWidth="sm">
            <Box sx={classes.locale}>
                <LocaleSwitcher />
            </Box>
            <Paper elevation={3} sx={classes.root}>
                <Box sx={classes.containerTop}>
                    <Typography variant="h4" component="h1" gutterBottom>
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
                    submitButtonText={t('core.signup.signup')}
                />

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2">
                        {t('core.signup.existAccount')} <Link href="/auth/login">{t('core.signup.signIn')}</Link>
                    </Typography>
                </Box>
            </Paper>

        </Container>
    );
};

export default SignUpPage;
