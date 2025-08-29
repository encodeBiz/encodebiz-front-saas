import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useRouter } from 'nextjs-toploader/app';
import { MAIN_ROUTE } from '@/config/routes';
import { useEntity } from '@/hooks/useEntity';
import { useStyles } from './ServiceList.styles';
import { useAppLocale } from '@/hooks/useAppLocale';
import passnbiz from '../../../../../public/assets/images/icono passbiz.svg'
import checkbiz from '../../../../../public/assets/images/checkbiz.svg'
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useTheme } from '@mui/material';

const icons = {
    'checkinbiz': checkbiz,
    'passinbiz': passnbiz,
}
const ServiceList = () => {
    const theme = useTheme()
    const { push } = useRouter()
    const { entityServiceList } = useEntity()
    const styles = useStyles()
    const t = useTranslations()
    const { currentLocale } = useAppLocale()
    const handleActionClick = (id: any) => {
        push(`/${MAIN_ROUTE}/${id}/onboarding`)
    };
    if (entityServiceList.length > 0)
        return (
            <Grid container spacing={4} display={'flex'} flexDirection={{
                sx: 'column',
                sm: 'column',
                md: 'column',
                lg: 'row',
                xl: 'row',
            }} justifyContent="space-between" marginTop={10}>
                {entityServiceList.map((card, i) => (
                    <Card key={card.id} sx={styles.card} style={{cursor: card.id != 'checkinbiz' ? 'pointer' : 'default'}} onClick={() => card.id != 'checkinbiz' ? handleActionClick(card.id) : null} elevation={0} >
                        <CardContent sx={styles.card}>
                            <Box sx={styles.iconContainer} >
                                <Image src={icons[card.id]} width={76} height={76} alt='' />
                            </Box>
                            <Box sx={styles.textContainer} >
                                <Typography textTransform={'uppercase'} gutterBottom variant="h5" component="div">
                                    {card.name} {card.id==='checkinbiz' && <span style={{color:theme.palette.primary.main}}>{t('core.label.comminsoom')}</span>}
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

