'use client';
import { useTranslations } from 'next-intl';
import { Typography, Box } from '@mui/material';
import SalesPlans from "@/components/common/SalesPlans";
import { BizType } from '@/domain/core/IService';
import { IPlan } from '@/domain/core/IPlan';
import { karla } from '@/config/fonts/google_fonts';


export default function SalesPlan({ fromService, salesPlans, ref , cancelAt}: { ref?: any, fromService: BizType, salesPlans: Array<IPlan> , cancelAt?: Date}) {
    const t = useTranslations()
    return (
        <Box maxWidth="xl" sx={{ mt: 10 }} flexDirection={'column'} display={'flex'} justifyContent={'center'} alignItems={'center'} ref={ref}>

            <Typography variant="h4" align="center" >
                {t("salesPlan.title")}
            </Typography>
            <Typography sx={{ width: '80%' }} variant="subtitle1" align="center" color="text.secondary" fontFamily={karla.style.fontFamily}>
                {t("salesPlan.subTitle") +(fromService=='checkinbiz'?'CheckBiz':'PassBiz') +'.'}
            </Typography>
            <br />
            <SalesPlans pricingPlans={salesPlans} fromService={fromService} cancelAt={cancelAt}/>
        </Box>
    );
}
