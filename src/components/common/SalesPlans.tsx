import React from 'react';
import Grid from '@mui/material/Grid';
import { PricingCard } from './PricingCard/PricingCard';
import { IPlan } from '@/domain/core/IPlan';
import { BizType } from '@/domain/core/IService';
import { useEntity } from '@/hooks/useEntity';
interface SalesPlansProps {
    pricingPlans: IPlan[];
    fromService: BizType;
  
}
export default function SalesPlans({ pricingPlans, fromService }: SalesPlansProps) {
    const { entitySuscription } = useEntity()
    return (
        <Grid container spacing={1} justifyContent="center">
            {pricingPlans.map((plan, index) => (
                <PricingCard isContract={entitySuscription.filter(e=>e.plan===plan.id && e.serviceId===fromService).length>0} key={index} {...plan}   fromService={fromService} />
            ))}
        </Grid>
    );
};
