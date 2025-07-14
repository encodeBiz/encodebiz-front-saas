import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { IService } from '@/domain/core/IService';
import { useToast } from '@/hooks/useToast';
import { fetchServiceList } from '@/services/common/subscription.service';
import { useTranslations } from 'next-intl';
import image from '@/../public/assets/images/encodebiz-sass.png'
import { useRouter } from 'nextjs-toploader/app';
import { MAIN_ROUTE } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';

// Sample data for the cards
const cardData = [
    {
        id: 'passinBiz',
        name: 'Misty Mountains',
        description: 'Breathtaking views of the misty peaks, perfect for a peaceful getaway.',
        image: 'https://images.unsplash.com/photo-1542204620-e220267781b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTU5OTl8MHwxfHNlYXJjaHwxfHw0NTU5OTl8fGVufDB8fHx8MTcwNDc0OTAzMXwx&ixlib=rb-4.0.3&q=80&w=1080',
    },
    {
        id: 2,
        name: 'checkinBiz',
        description: 'Enjoy the calming sounds of waves and endless ocean horizons.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTU5OTl8MHwxfHNlYXJjaHwxfHw0NTU5OTl8fGVufDB8fHx8MTcwNDc0OTAyNnwx&ixlib=rb-4.0.3&q=80&w=1080',
    },

];

const ServiceList = ({ ref }: { ref: any }) => {
    const [serviceList, setServiceList] = useState<Array<IService>>([])
    const [pending, setPending] = useState(false)
    const { showToast } = useToast()
    const { user } = useAuth()    
    const t = useTranslations()
    const { push } = useRouter()

    const fetchService = async () => {
        try {
            setPending(true)
            setServiceList(await fetchServiceList())
            setPending(false)
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
            setPending(false)
        }
    }

    useEffect(() => { 
        if(user?.id)
        fetchService()
    }, [user?.id])


    const handleActionClick = (id: any) => {
            push(`/${MAIN_ROUTE}/${id}/onboarding`)
    };
    if (serviceList.length > 0)
        return (
            <Box ref={ref} sx={{ flexGrow: 1, padding: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom align="left">
                    {t('features.dashboard.card.btn2')}
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {serviceList.map((card) => (
                        <Grid size={{
                            xs: 12, sm: 6, md: 4, lg: 3
                        }} key={card.id}>
                            <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={card?.image?card?.image:image.src}
                                    alt={card.name}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {card.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => handleActionClick(card.id)}>
                                        Learn More
                                    </Button>
                                    {/* You can add more buttons here */}
                                    {/* <Button size="small">Share</Button> */}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    else return null
};

export default ServiceList;