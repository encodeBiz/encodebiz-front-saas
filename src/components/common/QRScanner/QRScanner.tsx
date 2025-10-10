/* eslint-disable @typescript-eslint/no-unused-vars */
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
    CreditCardOff,
    Error,
    Warning
} from '@mui/icons-material';
import { PreviewContainer, ScannerContainer } from './QRScanner.style';
import { useTranslations } from 'next-intl';
import { useQRScanner } from './QRScanner.controller';
import EventSelectorModal from '../modals/EventSelector';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import Image from 'next/image';
import { SassButton } from '../buttons/GenericButton';
import { updateDoc } from 'firebase/firestore';
import { getDocRefByPath } from '@/lib/firebase/firestore/readDocument';
import ConfirmModal from '../modals/ConfirmModal';
import { DetailText } from '../table/DetailText';
import { BorderBox } from '../tabs/BorderBox';
 
const QRScanner = () => {
    const { eventSelected, handleScan, handleError, resetScanner, scanRessult, staffValidating, staffValid, error, eventList, setEventSelected } = useQRScanner()
    const t = useTranslations()
    const { open, openModal, closeModal } = useCommonModal()

    const disabledPass = async (docRef: string) => {

        try {
            await updateDoc(await getDocRefByPath(docRef), {
                result: 'failed'
            });
            closeModal(CommonModalType.DELETE)
            resetScanner()
        } catch (_: any) { }
    }
    return (<>
 


        <BorderBox sx={{ mt: 10,pt: 4, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', background: () => "#FFFBFF" }}>
            <Box sx={{ p: 0, maxWidth: 600, margin: '0 auto' }}>

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

                {!scanRessult && !staffValidating && staffValid && !error && (eventList.length > 0 && !!eventSelected || eventList.length == 0) && (
                    <CardContent >
                        <ScannerContainer elevation={0} >
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
                                        },
                                        container: {
                                            borderColor: 'blue'
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
                    </CardContent>
                )}

                {scanRessult && !staffValidating && staffValid && !error && (

                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                <CheckCircle  sx={{ fontSize: 35, color:"#4AB84F" }} />
                                <Typography fontSize={24} fontWeight={400} variant="h5" >
                                    {t('scan.resultTitle')}
                                </Typography>
                            </Box>
 
 

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, width: '100%' }}>
                                    <Image style={{ borderRadius: 4, background: '#AEADAD' }} src={scanRessult?.holder?.parent?.logo} width={80} height={80} alt='' />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                                        <Typography fontSize={16} color='#1C1B1D' fontWeight={500} variant="body1">{scanRessult?.holder?.fullName}</Typography>
                                    </Box>
                                </Box>
                            </Box>
 


                            {/*scanRessult?.lastValidatedAt && <Typography variant="body1">
                            {t('scan.lastValidatedAt')}:
                            {format_date(new Date(scanRessult?.lastValidatedAt as string), 'DD/MM/YY hh:mm')}</Typography>
                        */}

                            {scanRessult?.holder?.type !== 'credential' && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Alert icon={<Warning color='warning'/>} severity='warning' style={{ fontSize: 14, paddingTop: 8, paddingBottom: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    action={
                                        <SassButton variant='contained' style={{ fontSize: 10 }} onClick={() => openModal(CommonModalType.DELETE)} color="warning" size="small">
                                            {t('core.button.disabled')}
                                        </SassButton>
                                    }
                                    variant='outlined'>{t('scan.' + scanRessult.suggestedDirection)}</Alert>
                            </Box>}

                            {Array.isArray(scanRessult?.holder?.metadata?.auxiliaryFields) && scanRessult?.holder?.metadata?.auxiliaryFields?.length > 0 && <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%', px:2  }}>
                                <Typography fontSize={16}  variant="body1" fontWeight={500} textTransform={'capitalize'}>{t('core.label.aditionalData2')}: </Typography>
                                {scanRessult?.holder?.metadata?.auxiliaryFields?.map((e: any, i: number) => <DetailText key={i}
                                    label={e.label}
                                    value={e.value}
                                    valueFontSize={16}
                                />)}
                            </Box>}

 


                             

                        </Box>
                    </CardContent>


                )}

                {!!error && (
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
                )}


                {!staffValid && !staffValidating && (
                  
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Error color="error" sx={{ fontSize: 100 }} />
                                <Typography variant="h5" sx={{ textAlign: 'center' }}>
                                    {t('scan.failedStaff')}
                                </Typography>

                                <SassButton
                                    variant="contained"
                                    color="primary"
                                    onClick={resetScanner}
                                    sx={{ mt: 2, textTransform: 'inherit' }}
                                >
                                    {t('scan.tryagain')}
                                </SassButton>
                            </Box>
                        </CardContent>
                 
                )}


                {open.type === CommonModalType.EVENT_SELECTED && <EventSelectorModal
                    eventList={eventList}
                    onOKAction={(event) => setEventSelected(event)}
                />}

                {open.type === CommonModalType.DELETE && <ConfirmModal
                    icon={<CreditCardOff />}
                    title={t('scan.deleteConfirmModalTitle')}
                    textBtn={t('core.button.deny')}
                    description={t('scan.deleteConfirmModalTitle2')}
                    onOKAction={() => disabledPass(scanRessult?.ref as string)}
                />}




            </Box>
        </BorderBox>

        {scanRessult && !staffValidating && staffValid && !error && (<Box sx={{maxWidth:600,  width: '90%', position: 'fixed', bottom: 50, display:'flex', justifyContent:'center' }}><SassButton
            variant="contained"
            color="primary"
            onClick={resetScanner}
            sx={{
                textTransform: 'inherit', width: '268px', mx: 'auto'
            }}
        >
            {t('scan.scanOther')}
        </SassButton></Box>)}
    </>
    );
};

export default QRScanner;