import React from 'react';
import Grid from '@mui/material/Grid';
import { PricingCard } from './PricingCard/PricingCard';
import { IPlan } from '@/domain/core/IPlan';
interface SalesPlansProps {
    pricingPlans: IPlan[];
    fromService: "passinbiz" | "checkinbiz";
    getPlanAllow: boolean;
}
export default function SalesPlans({ pricingPlans, fromService, getPlanAllow }: SalesPlansProps) {

    return (
        <Grid container spacing={1} justifyContent="center">
            {pricingPlans.map((plan, index) => (
                <PricingCard key={index} {...plan} getPlanAllow={getPlanAllow} fromService={fromService} />
            ))}
        </Grid>
    );
};
