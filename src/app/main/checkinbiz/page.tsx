'use client';
import { useTranslations } from 'next-intl';
import { Container, Typography } from '@mui/material';
import SalesPlans, { Plan } from "@/components/common/SalesPlans";
import useCheckInBizController from './page.controller';

export default function CheckInBiz() {
  const t = useTranslations()
  const { salesPlans } = useCheckInBizController();
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" gutterBottom>
        {t("salesPlan.title")}
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
        {t("salesPlan.subTitle")}
      </Typography>
      <br />
      <SalesPlans pricingPlans={salesPlans} fromService="checkinbiz" />
    </Container>
  );
}
