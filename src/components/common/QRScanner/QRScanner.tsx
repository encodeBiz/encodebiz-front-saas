import React, { } from 'react';
import {
    Box,
    Button,
    CardContent,
    Typography,
    LinearProgress,
    Alert,

} from '@mui/material';
import { Scanner } from '@yudiel/react-qr-scanner';

import {
    CheckCircle,
    Error
} from '@mui/icons-material';
import { PreviewContainer, ScannerContainer, StyledCard } from './QRScanner.style';
import { useTranslations } from 'next-intl';
import { useQRScanner } from './QRScanner.controller';
import { formatDateInSpanish } from '@/lib/common/Date';
import EventSelectorModal from '../modals/EventSelector';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';

const QRScanner = () => {
    const {eventSelected,  handleScan, handleError, resetScanner, scanRessult, staffValidating, staffValid, error, eventList, setEventSelected } = useQRScanner()
    const t = useTranslations()
    const { open } = useCommonModal()
    return (
        <Box sx={{ p: 1, maxWidth: 600, margin: '0 auto' }}>
            
            {staffValidating && (
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h6" component="h2" >
                        {t('scan.validatingStaff')}
                    </Typography>
                    <LinearProgress />
                </Box>
            )}
            {!scanRessult && !staffValidating && staffValid && !error && <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" >
                    {t('scan.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t('scan.subtitle')}
                </Typography>
            </Box>}

            {!scanRessult && !staffValidating && staffValid && !error && (eventList.length>0 && !!eventSelected || eventList.length==0 ) && (
                <StyledCard>
                    <ScannerContainer elevation={0}>
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
                            <Typography variant="h5" >
                                {t('scan.resultTitle')}
                            </Typography>
                            <Typography variant="body1">{scanRessult?.fullName}</Typography>
                            <Typography variant="body1">{scanRessult?.companyName}</Typography>
                            {scanRessult?.lastValidatedAt && <Typography variant="body1">
                                {t('scan.lastValidatedAt')}:
                                {formatDateInSpanish(new Date(scanRessult?.lastValidatedAt as string))}</Typography>
                            }



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
                            <Typography variant="h5" sx={{ textAlign: 'center' }}>
                                {t('scan.failed')}
                            </Typography>
                            <Alert severity="error" sx={{ width: '100%', textAlign: 'center' }}>
                                {error}
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
                            <Typography variant="h5" sx={{ textAlign: 'center' }}>
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


            {open.type === CommonModalType.EVENT_SELECTED && <EventSelectorModal
                eventList={eventList}
                onOKAction={(event) => setEventSelected(event)}
            />}

        </Box>
    );
};

export default QRScanner;