
'use client'
import React from 'react';
import {
    Container,
    Box,
    Paper
} from '@mui/material';
import { useStyles } from './page.styles';
import LocaleSwitcher from '@/components/common/LocaleSwitcher';
import QRScanner from '@/components/common/QRScanner/QRScanner';


const QRScannerPage = () => {
    const classes = useStyles();

    return (
        <Container maxWidth="sm">
            <Box sx={classes.locale} >
                <LocaleSwitcher rmText={true} />
            </Box>

            <QRScanner />

        </Container>
    );
};

export default QRScannerPage;
