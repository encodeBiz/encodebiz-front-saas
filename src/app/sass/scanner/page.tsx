
'use client'
import React from 'react';
import {
    Container,
    Box,
    Paper} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useStyles } from './page.styles';
import LocaleSwitcher from '@/components/common/LocaleSwitcher';
import QRScanner from '@/components/common/QRScanner/QRScanner';


const QRScannerPage = () => {
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
