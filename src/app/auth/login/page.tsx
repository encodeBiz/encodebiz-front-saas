
'use client'
import React from 'react';
import {
    Container,
    Box,
    Typography,
    Divider,
    Paper,
    Grid,
    Link
} from '@mui/material';
import {
    Google as GoogleIcon} from '@mui/icons-material';
import { LoginFormValues, useRegisterController } from './page.controller';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { useTranslations } from 'next-intl';
import { useStyles } from './page.styles';
import { BaseButton } from '@/components/common/buttons/BaseButton';
import LocaleSwitcher from '@/components/common/LocaleSwitcher';


const SignInPage = () => {
    const { signInWithGoogle, initialValues, signInWithFacebook, validationSchema, fields, signInWithEmail } = useRegisterController()
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
                        {t('core.signin.title')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {t('core.signin.subtitle')}
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={classes.fullWidth}>
                    <Grid size={{ xs: 12, sm: 12 }} sx={classes.fullWidth}>
                        <BaseButton fullWidth variant="outlined" startIcon={<GoogleIcon color="primary" />} onClick={()=>signInWithGoogle()}>
                            {t('core.signin.google')}
                        </BaseButton>
                    </Grid>
                    {/*<Grid size={{ xs: 12, sm: 12 }} sx={classes.fullWidth}>
                        <BaseButton fullWidth variant="outlined" startIcon={<FacebookIcon color="primary" />} onClick={signInWithFacebook}>
                            {t('core.signin.facebook')}
                        </BaseButton>
                    </Grid>*/}
                </Grid>

                <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        {t('core.signin.or')}
                    </Typography>
                </Divider>


                <GenericForm<LoginFormValues>
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={signInWithEmail}
                    fields={fields as FormField[]}
                    btnFullWidth
                    submitButtonText={t('core.signin.signup')}
                />

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2">
                        {t('core.signin.noAccount')} <Link href="/auth/register">{t('core.signup.signup')}</Link>
                    </Typography>
                </Box>
            </Paper>

        </Container>
    );
};

export default SignInPage;
