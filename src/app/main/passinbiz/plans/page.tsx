'use client';
import { useTranslations } from 'next-intl';
import { Container, Typography, Alert, Link, Box } from '@mui/material';
import SalesPlan from '@/components/features/profile/SalesPlan/SalesPlan';
import useSalesPlanController from '@/components/features/profile/SalesPlan/SalesPlan.controller';
import usePassInBizController from './page.controller';
import { IPlan } from '@/domain/core/IPlan';

export default function PassInBiz() {
  const t = useTranslations()
  const {notGetPlan } = useSalesPlanController();
  const {planList,pending,service} = usePassInBizController()

  return (
    <Container maxWidth="xl">
     
      {!pending &&  Array.isArray(planList) && <SalesPlan salesPlans={planList as Array<IPlan>} notGetPlan={notGetPlan} fromService="checkinbiz" />}

    </Container>
  );
}
