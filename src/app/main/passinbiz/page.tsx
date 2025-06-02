'use client';
import DoughnutChart from "@/components/common/charts/DoughnutChart";
import LineChart from "@/components/common/charts/LineChart";
import DashboardCard from "@/components/common/DashboardCard";
import HelpTabs from "@/components/features/dashboard/HelpTabs/HelpTabs";
import PresentationCard from "@/components/features/dashboard/PresentationCard/PresentationCard";
import image from '../../../../public/assets/images/encodebiz-sass.png'
import { Container, Divider, Grid, Typography } from '@mui/material';
import { useTranslations } from "next-intl";
import SalesPlans from "@/components/common/SalesPlans";

export default function Dashboard() {
  const t = useTranslations()
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {t('features.dashboard.overview')}
      </Typography>

      <PresentationCard
        title={t('features.dashboard.card.title')}
        description={t('features.dashboard.card.subtitle')}
        image={image}
        action1={() => { }}
        action1Text={t('features.dashboard.card.btn1')}
        action2={() => { }}
        action2Text={t('features.dashboard.card.btn1')}
      />


      <SalesPlans />

      <HelpTabs />






    </Container>
  );
}
