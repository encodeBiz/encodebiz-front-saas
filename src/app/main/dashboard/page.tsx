'use client';
import DoughnutChart from "@/components/common/charts/DoughnutChart";
import LineChart from "@/components/common/charts/LineChart";
import DashboardCard from "@/components/common/DashboardCard";
import HelpTabs from "@/components/features/dashboard/HelpTabs/HelpTabs";
import PresentationCard from "@/components/features/dashboard/PresentationCard/PresentationCard";
import image from '../../../../public/assets/images/encodebiz-sass.png'
import { Container, Grid, Typography } from '@mui/material';
import { useTranslations } from "next-intl";

export default function Dashboard() {
  const t = useTranslations()
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Overview
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

      <HelpTabs />


      <Typography variant="h4" component="h2" align="left" gutterBottom>
        Estadísticas
      </Typography>


      <Grid container spacing={3}>
        {/* Sales Trend Chart */}
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 6
        }}> {/* Takes full width on small, 8/12 on medium+ */}
          <DashboardCard title="PassinBiz Product Stats">
            <LineChart />
          </DashboardCard>
        </Grid>

        <Grid size={{
          xs: 12,
          sm: 6,
          md: 6
        }}> {/* Takes full width on small, 8/12 on medium+ */}
          <DashboardCard title="CkeckinBiz Product Stats">
            <LineChart />
          </DashboardCard>
        </Grid>

        {/* Departmental Budget Chart */}
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 6
        }}> {/* Takes full width on small, 4/12 on medium+ */}
          <DashboardCard title="Budget Allocation">
            <DoughnutChart />
          </DashboardCard>
        </Grid>

          {/* Departmental Budget Chart */}
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 6
        }}> {/* Takes full width on small, 4/12 on medium+ */}
          <DashboardCard title="Budget Allocation">
            <DoughnutChart />
          </DashboardCard>
        </Grid>
      </Grid>



    </Container>
  );
}
