import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    CardContent,
    Typography,
    IconButton,
    LinearProgress,
    Alert,
    Tooltip
} from '@mui/material';
import { Scanner } from '@yudiel/react-qr-scanner';

import {
    CheckCircle,
    Error,
    Download,
    Share,
    CopyAll
} from '@mui/icons-material';
import { PreviewContainer, ScannerContainer, StyledCard } from './QRScanner.style';
//import { useGeolocation } from '@/hooks/useGeolocation';
import { useTranslations } from 'next-intl';
import { useQRScanner } from './QRScanner.controller';

const QRScanner = () => {
    const { handleScan, handleError, resetScanner, scanRessult, staffValidating, staffValid, error } = useQRScanner()
    const t = useTranslations()

    /* const { position, isLoading } = useGeolocation({
        enableHighAccuracy: true,
        timeout: 10000
    }); */



    const copyToClipboard = () => {
        navigator.clipboard.writeText(scanRessult?.fullName as string);
    };

    const shareResult = async () => {
        try {
            await navigator.share({
                title: 'QR Code Result',
                text: scanRessult?.fullName as string
            });
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };




    return (
        <Box sx={{ p: 1, maxWidth: 600, margin: '0 auto' }}>

            {staffValidating && (
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        {t('scan.validatingStaff')}
                    </Typography>
                    <LinearProgress />
                </Box>
            )}
            {!scanRessult && !staffValidating && staffValid && !error && <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('scan.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t('scan.subtitle')}
                </Typography>
            </Box>}

            {!scanRessult && !staffValidating && staffValid && !error && (
                <StyledCard>
                    <ScannerContainer elevation={1}>
                        <PreviewContainer>
                            <Scanner
                                scanDelay={1500}
                                sound
                                onScan={handleScan}
                                onError={handleError}
                                styles={{
                                    video: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }
                                }}
                            />
                        </PreviewContainer>

                    </ScannerContainer>
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <LinearProgress />
                        <Typography variant="body2" color="text.secondary">
                            {t('scan.camaraFocus')}
                        </Typography>
                    </Box>
                </StyledCard>
            )}

            {scanRessult && !staffValidating && staffValid && !error && (
                <StyledCard>
                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <CheckCircle color="success" sx={{ fontSize: 100 }} />
                            <Typography variant="h5" gutterBottom>
                                {t('scan.resultTitle')}
                            </Typography>
                            <Typography variant="body1">{scanRessult?.fullName}</Typography>
                            <Typography variant="body1">{scanRessult?.companyName}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Tooltip title="Copy to clipboard">
                                    <IconButton onClick={copyToClipboard}>
                                        <CopyAll />
                                    </IconButton>
                                </Tooltip>
                                {!!navigator.share && (
                                    <Tooltip title="Share result">
                                        <IconButton onClick={shareResult}>
                                            <Share />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>


                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={resetScanner}
                                sx={{ mt: 2 }}
                            >
                                {t('scan.scanOther')}
                            </Button>
                        </Box>
                    </CardContent>
                </StyledCard>
            )}

            {!!error && (
                <StyledCard>
                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Error color="error" sx={{ fontSize: 100 }} />
                            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                                {t('scan.failed')}
                            </Typography>
                            <Alert severity="error" sx={{ width: '100%', textAlign: 'center' }}>
                                {'Pase no encontrado'}
                            </Alert>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={resetScanner}
                                sx={{ mt: 2 }}
                            >
                                {t('scan.tryagain')}
                            </Button>
                        </Box>
                    </CardContent>
                </StyledCard>
            )}


            {!staffValid && !staffValidating && (
                <StyledCard>
                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Error color="error" sx={{ fontSize: 100 }} />
                            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                                {t('scan.failedStaff')}
                            </Typography>
                            
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={resetScanner}
                                sx={{ mt: 2 }}
                            >
                                {t('scan.tryagain')}
                            </Button>
                        </Box>
                    </CardContent>
                </StyledCard>
            )}


        </Box>
    );
};

export default QRScanner;