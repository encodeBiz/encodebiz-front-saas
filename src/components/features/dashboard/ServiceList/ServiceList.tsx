import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useRouter } from 'nextjs-toploader/app';
import { MAIN_ROUTE } from '@/config/routes';
import { useEntity } from '@/hooks/useEntity';
import { AssignmentTurnedInOutlined } from '@mui/icons-material';
import { useStyles } from './ServiceList.styles';


const ServiceList = () => {

    const { push } = useRouter()
    const { entityServiceList } = useEntity()
    const styles = useStyles()

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
                {entityServiceList.map((card) => (
                    <Card key={card.id} sx={styles.card} onClick={() => handleActionClick(card.id)} elevation={0} >
                        <CardContent sx={styles.card}>
                            <Box sx={styles.iconContainer} >
                                <AssignmentTurnedInOutlined sx={styles.icon} />
                            </Box>
                            <Typography textTransform={'uppercase'} gutterBottom variant="h5" component="div">
                                {card.name}
                            </Typography>
                            <Typography variant="body2" color="text.primary" fontSize={16}>
                                {card.description}
                            </Typography>

                        </CardContent>
                    </Card>

                ))}
            </Grid>
        );
    else return null
};

export default ServiceList;



/* Emisión y validación de pases digitales, compatibles con Apple Wallet y Google Wallet. */

