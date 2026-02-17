import React from 'react';
import Grid from '@mui/material/Grid';
import { PricingCard } from './PricingCard/PricingCard';
import { IPlan } from '@/domain/core/IPlan';
import { BizType } from '@/domain/core/IService';
interface SalesPlansProps {
    pricingPlans: IPlan[];
    fromService: BizType;
    cancelAt?:Date
}
export default function SalesPlans({ pricingPlans, fromService, cancelAt }: SalesPlansProps) {
   
    return (
        <Grid container  direction={'column'}>
            {pricingPlans.slice(1).map((plan, index) => (
                <PricingCard  key={index} {...plan}   fromService={fromService} cancelAt={cancelAt}/>
            ))}
        </Grid>
    );
};
