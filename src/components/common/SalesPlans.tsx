import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Box,
    List,
    ListItem,
    ListItemIcon,

} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircleOutline } from '@mui/icons-material';

const PlanCard = styled(Card)(({ theme, featured }: any) => ({
    maxWidth: 345,
    margin: theme.spacing(2),
    border: featured ? `2px solid ${theme.palette.primary.main}` : 'none',
    transform: featured ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.3s ease',
})) as any;

const FeaturedBadge = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: theme.spacing(0.5, 2),
    borderRadius: theme.shape.borderRadius,
    position: 'absolute',
    top: -10,
    right: 20,
    fontSize: '0.75rem',
    fontWeight: 'bold',
}));

const salesPlans = [
    {
        name: '🟢 Plan Freemium',
        price: '$19',
        period: '/month',
        features: [
            'Up to 10 products',
            'Basic analytics',
            'Email support',
            '24/7 customer care'
        ],
        featured: false
    },
    {
        name: 'Standard',
        price: '$49',
        period: '/month',
        features: [
            'Up to 50 products',
            'Advanced analytics',
            'Priority email support',
            '24/7 customer care',
            'API access'
        ],
        featured: false
    },
    {
        name: 'Premium',
        price: '$99',
        period: '/month',
        features: [
            'Unlimited products',
            'Advanced analytics',
            'Phone & email support',
            '24/7 customer care',
            'API access',
            'Custom reports'
        ],
        featured: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        features: [
            'Unlimited products',
            'Dedicated account manager',
            'Custom integrations',
            '24/7 premium support',
            'White-label solutions',
            'On-site training'
        ],
        featured: false
    }
];

export default function SalesPlans() {
    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Choose Your Sales Plan
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                Select the plan that fits your business needs
            </Typography>

            <Grid container justifyContent="center">
                {salesPlans.map((plan, index) => (
                    <Grid key={index} size={{
                        xs: 12, md: 6, sm: 6
                    }}>
                        <Box position="relative">
                            {plan.featured && <FeaturedBadge>Most Popular</FeaturedBadge>}
                            <PlanCard featured={plan.featured}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {plan.name}
                                    </Typography>
                                    <Typography variant="h4" color="primary">
                                        {plan.price}
                                        <Typography variant="body2" component="span" color="text.secondary">
                                            {plan.period}
                                        </Typography>
                                    </Typography>

                                    <List>
                                        {plan.features.map((feature, i) => (
                                            <ListItem key={i} disableGutters>
                                                <ListItemIcon sx={{ minWidth: 30 }}>
                                                    <CheckCircleOutline color="primary" fontSize="small" />
                                                </ListItemIcon>
                                                <Typography variant="body2">{feature}</Typography>
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Button
                                        fullWidth
                                        variant={plan.featured ? 'contained' : 'outlined'}
                                        sx={{ mt: 2 }}
                                    >
                                        Select Plan
                                    </Button>
                                </CardContent>
                            </PlanCard>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}