import React from 'react';
import Grid from '@mui/material/Grid';
import { PricingCard } from './PricingCard/PricingCard';
import { IPlan } from '@/domain/core/IPlan';
import { BizType } from '@/domain/core/IService';
interface SalesPlansProps {
    pricingPlans: IPlan[];
    fromService: BizType;
  
}
export default function SalesPlans({ pricingPlans, fromService }: SalesPlansProps) {
    
    return (
        <Grid container spacing={1} justifyContent="center">
            {pricingPlans.map((plan, index) => (
                <PricingCard  key={index} {...plan}   fromService={fromService} />
            ))}
        </Grid>
    );
};
