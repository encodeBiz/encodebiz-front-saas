'use client';
import { useTranslations } from 'next-intl';
import { Typography, Box } from '@mui/material';
import SalesPlans from "@/components/common/SalesPlans";
import { BizType } from '@/domain/core/IService';
import { IPlan } from '@/domain/core/IPlan';
 

export default function SalesPlan({fromService,salesPlans,ref}:{ref?: any,fromService:BizType,salesPlans:Array<IPlan>, notGetPlan:boolean}) {
    const t = useTranslations()
    
 
    return (
        <Box maxWidth="xl" sx={{mt:4}} ref={ref}>
            
            <Typography variant="h4" align="left" gutterBottom>
                {t("salesPlan.title")}
            </Typography>
            <Typography variant="subtitle1" align="left" color="text.secondary" gutterBottom>
                {t("salesPlan.subTitle")}
            </Typography>            
            <br />
            <SalesPlans pricingPlans={salesPlans}   fromService={fromService} />
        </Box>
    );
}
