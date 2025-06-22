'use client';
import { useTranslations } from 'next-intl';
import { Container, Typography } from '@mui/material';
import SalesPlans from "@/components/common/SalesPlans";
import usePassInBizController from './page.controller';

export default function PassInBiz() {
  const t = useTranslations()
  const { salesPlans } = usePassInBizController();
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {t('features.dashboard.overview')}
      </Typography>
      <SalesPlans pricingPlans={salesPlans} />
    </Container>
  );
}
