'use client';
import { useTranslations } from 'next-intl';
import { Typography, Box } from '@mui/material';
import SalesPlans from "@/components/common/SalesPlans";
import { BizType } from '@/domain/core/IService';
import { IPlan } from '@/domain/core/IPlan';
 

export default function SalesPlan({fromService,salesPlans,ref}:{ref?: any,fromService:BizType,salesPlans:Array<IPlan>}) {
    const t = useTranslations()
    
 
    return (
        <Box maxWidth="xl" sx={{mt:10}} flexDirection={'column'} display={'flex'} justifyContent={'center'} alignItems={'center'} ref={ref}>
            
            <Typography variant="h4" align="center" >
                {t("salesPlan.title")}
            </Typography>
            <Typography sx={{width:'60%'}} variant="subtitle1" align="center" color="text.secondary" >
                {t("salesPlan.subTitle")}
            </Typography>            
            <br />
            <SalesPlans pricingPlans={salesPlans}   fromService={fromService} />
        </Box>
    );
}
