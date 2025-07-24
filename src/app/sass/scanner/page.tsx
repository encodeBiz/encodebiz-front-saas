
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
    Google as GoogleIcon
} from '@mui/icons-material';
import { LoginFormValues, useRegisterController } from './page.controller';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { useTranslations } from 'next-intl';
import { useStyles } from './page.styles';
import { BaseButton } from '@/components/common/buttons/BaseButton';
import LocaleSwitcher from '@/components/common/LocaleSwitcher';
import QRScanner from '@/components/common/QRScanner/QRScanner';


const QRScannerPage = () => {
    const { signInWithGoogle, initialValues, signInWithFacebook, validationSchema, fields, signInWithEmail } = useRegisterController()
    const t = useTranslations()
    const classes = useStyles();

    return (
        <Container maxWidth="sm">
            <Box sx={classes.locale}>
                <LocaleSwitcher />
            </Box>
            <Paper elevation={3} sx={classes.root}>               
                <QRScanner />
            </Paper>
        </Container>
    );
};

export default QRScannerPage;
