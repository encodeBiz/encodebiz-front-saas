'use client';
import { useTranslations } from 'next-intl';
import { Container, Typography, Alert, Link, Box } from '@mui/material';
import SalesPlan from '@/components/features/profile/SalesPlan/SalesPlan';

export default function PassInBiz() {
  const t = useTranslations()
  return (
    <Container maxWidth="xl">
      <SalesPlan fromService="checkinbiz" />

    </Container>
  );
}
