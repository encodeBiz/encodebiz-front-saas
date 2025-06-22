'use client';
import { Container } from '@mui/material';
import SalesPlans from "@/components/common/SalesPlans";
import useDashboardController from './page.controller';

export default function Dashboard() {
  const {salesPlans} = useDashboardController();
  return (
    <Container maxWidth="lg">
      <SalesPlans pricingPlans={salesPlans} />
    </Container>
  );
}
