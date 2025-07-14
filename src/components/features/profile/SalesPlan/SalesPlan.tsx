'use client';
import { useTranslations } from 'next-intl';
import { Container, Typography, Alert, Link, Box } from '@mui/material';
import SalesPlans from "@/components/common/SalesPlans";
import useSalesPlanController from './SalesPlan.controller';
import { BizType } from '@/domain/core/IService';
import { IPlan } from '@/domain/core/IPlan';
import { MAIN_ROUTE, GENERAL_ROUTE } from '@/config/routes';
 

export default function SalesPlan({fromService,salesPlans, notGetPlan,ref}:{ref?: any,fromService:BizType,salesPlans:Array<IPlan>, notGetPlan:boolean}) {
    const t = useTranslations()
 
    return (
        <Box maxWidth="xl" sx={{mt:4}} ref={ref}>
            
            <Typography variant="h4" align="left" gutterBottom>
                {t("salesPlan.title")}
            </Typography>
            <Typography variant="subtitle1" align="left" color="text.secondary" gutterBottom>
                {t("salesPlan.subTitle")}
            </Typography>

            {notGetPlan &&
                <Box display="flex" justifyContent="center" paddingBottom="20px">
                    <Alert
                        sx={{ alignItems: "center" }}
                        severity="warning"
                        variant='filled'
                        action={
                            <Link
                                paddingLeft="20px"
                                color='#FFFFFF'
                                href={`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity`}
                                 
                            >{`${t('core.button.update')} ${t('entity.title')}`}</Link>
                        }
                    >{t("salesPlan.notAllowedPlan")}</Alert>
                </Box>
            }
            <br />
            <SalesPlans pricingPlans={salesPlans} getPlanAllow={notGetPlan} fromService={fromService} />
        </Box>
    );
}
