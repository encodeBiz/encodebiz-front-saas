import React from 'react';
import Grid from '@mui/material/Grid';
import { PricingCard } from './PricingCard';
export interface Plan {
    name: string;
    price: string;
    period: string;
    features: string[];
    featured?: boolean;
    serviceId?: "passinbiz" | "checkinbiz"
    planId?: "freemium" | "bronze" | "enterprise";

}
interface SalesPlansProps {
    pricingPlans: Plan[];
    serviceId: "passinbiz" | "checkinbiz"
}
export default function SalesPlans({ pricingPlans, serviceId }: SalesPlansProps) {

    return (
        <Grid container spacing={1} justifyContent="center">
            {pricingPlans.map((plan, index) => (
                <PricingCard key={index} {...plan} serviceId={serviceId} />
            ))}
        </Grid>
    );
};
