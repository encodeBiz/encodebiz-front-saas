import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useTranslations } from 'next-intl';
import image from '@/../public/assets/images/encodebiz-sass.png'
import { useRouter } from 'nextjs-toploader/app';
import { MAIN_ROUTE } from '@/config/routes';
import { useEntity } from '@/hooks/useEntity';
 

const ServiceList = ({ ref }: { ref: any }) => {
   
    const t = useTranslations()
    const { push } = useRouter()
    const { entityServiceList } = useEntity()

    const handleActionClick = (id: any) => {
        push(`/${MAIN_ROUTE}/${id}/onboarding`)
    };
    if (entityServiceList.length > 0)
        return (
            <Box ref={ref} sx={{ flexGrow: 1, padding: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom align="left">
                    {t('features.dashboard.card.btn2')}
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {entityServiceList.map((card) => (
                        <Grid size={{
                            xs: 12, sm: 6, md: 4, lg: 3
                        }} key={card.id}>
                            <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={card?.image ? card?.image : image.src}
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