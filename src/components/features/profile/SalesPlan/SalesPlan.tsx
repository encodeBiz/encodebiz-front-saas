'use client';
import { useTranslations } from 'next-intl';
import { Container, Typography, Alert, Link, Box } from '@mui/material';
import SalesPlans from "@/components/common/SalesPlans";
import useSalesPlanController from './SalesPlan.controller';
import { BizType } from '@/domain/core/IService';
import { IPlan } from '@/domain/core/IPlan';
 

export default function SalesPlan({fromService,salesPlans, notGetPlan}:{fromService:BizType,salesPlans:Array<IPlan>, notGetPlan:boolean}) {
    const t = useTranslations()
 
    return (
        <Container maxWidth="xl">
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
                                href="/main/preferences/entity"
                            >{`${t('core.button.update')} ${t('entity.title')}`}</Link>
                        }
                    >{t("salesPlan.notAllowedPlan")}</Alert>
                </Box>
            }
            <Typography variant="h4" align="center" gutterBottom>
                {t("salesPlan.title")}
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                {t("salesPlan.subTitle")}
            </Typography>
            <br />
            <SalesPlans pricingPlans={salesPlans} getPlanAllow={notGetPlan} fromService={fromService} />
        </Container>
    );
}
