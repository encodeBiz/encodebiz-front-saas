import React from 'react';
import Grid from '@mui/material/Grid';
import { PricingCard } from './PricingCard/PricingCard';
import { IPlan } from '@/domain/core/IPlan';
import { BizType } from '@/domain/core/IService';
import { useEntity } from '@/hooks/useEntity';
interface SalesPlansProps {
    pricingPlans: IPlan[];
    fromService: BizType;
    getPlanAllow: boolean;
}
export default function SalesPlans({ pricingPlans, fromService, getPlanAllow }: SalesPlansProps) {
    const { entitySuscription } = useEntity()
    return (
        <Grid container spacing={1} justifyContent="center">
            {pricingPlans.map((plan, index) => (
                <PricingCard isContract={entitySuscription.filter(e=>e.plan===plan.id && e.serviceId===fromService).length>0} key={index} {...plan} getPlanAllow={getPlanAllow} fromService={fromService} />
            ))}
        </Grid>
    );
};
