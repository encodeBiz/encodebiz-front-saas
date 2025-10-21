import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useEntity } from '@/hooks/useEntity';
import { useStyles } from './ServiceList.styles';
import { useAppLocale } from '@/hooks/useAppLocale';
import passnbiz from '../../../../../public/assets/images/service-logo/icono-passbiz.png'
import checkbiz from '../../../../../public/assets/images/service-logo/icono-checkbiz.png'
import Image from 'next/image';
 
import { useLayout } from '@/hooks/useLayout';

const icons = {
    'checkinbiz': checkbiz,
    'passinbiz': passnbiz,
}
const ServiceList = () => {
     const { navivateTo } = useLayout()
    const { entityServiceList, entitySuscription } = useEntity()
    const styles = useStyles()
     const { currentLocale } = useAppLocale()
    const handleActionClick = (id: any) => {
        navivateTo(`/${id}/onboarding`)
    };


    if (entityServiceList.filter(e => e.active && entitySuscription.filter((es) => es.serviceId === e.id).length === 0).length> 0)
        return (
            <Grid container spacing={4} display={'flex'} flexDirection={{
                xs: 'column',
                sm: 'column',
                md: 'column',
                lg: 'row',
                xl: 'row',
            }} justifyContent="space-between" marginTop={10}>
                {entityServiceList.filter(e => e.active && entitySuscription.filter((es) => es.serviceId === e.id).length === 0).map((card) => (
                    <Card key={card.id} sx={styles.card} style={{ cursor: card.id != 'checkinbiz' ? 'pointer' : 'default' }} onClick={() => card.id != 'checkinbiz' ? handleActionClick(card.id) : null} elevation={0} >
                        <CardContent sx={styles.card}>
                            <Box sx={styles.iconContainer} >
                                <Image src={icons[card.id]} width={card.id == 'checkinbiz'?70:70} height={card.id == 'checkinbiz'?76:70} alt='' />
                            </Box>
                            <Box sx={styles.textContainer} >
                                <Typography textTransform={'uppercase'} variant="h5" component="div">
                                    {card.name}
                                </Typography>
                                <Typography variant="body2" color="text.primary" fontSize={16}>
                                    {card?.description ? (card?.description as any)[currentLocale] : ''}
                                </Typography>
                            </Box>

                        </CardContent>
                    </Card>

                ))}
            </Grid>
        );
    else return null
};

export default ServiceList;



/* Emisión y validación de pases digitales, compatibles con Apple Wallet y Google Wallet. */

