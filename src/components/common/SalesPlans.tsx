import React from 'react';
import Grid from '@mui/material/Grid';
import { PricingCard } from './PricingCard';
interface Plan {
    name: string;
    price: string;
    period: string;
    features: string[];
    featured?: boolean;
}
interface SalesPlansProps {
    pricingPlans: Plan[];
}
export default function SalesPlans({ pricingPlans }: SalesPlansProps) {

    return (
        <Grid container spacing={1} justifyContent="center">
            {pricingPlans.map((plan, index) => (
                <PricingCard key={index} {...plan} />
            ))}
        </Grid>
    );
};
