'use client';
import DoughnutChart from "@/components/common/charts/DoughnutChart";
import LineChart from "@/components/common/charts/LineChart";
import DashboardCard from "@/components/common/DashboardCard";
import HelpTabs from "@/components/features/dashboard/HelpTabs/HelpTabs";
import PresentationCard from "@/components/features/dashboard/PresentationCard/PresentationCard";
import image from '../../../../public/assets/images/encodebiz-sass.png'
import { Container, Grid, Paper, Typography } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Overview
      </Typography>

      <PresentationCard
        title="Bienvenido a Encodebiz Sass"
        description="En esta plataforma podras hacer varias cosas interesantes"
        image={image}
      />

      <HelpTabs />


      <Typography variant="h4" component="h2" align="left" gutterBottom>
        Estadísticas
      </Typography>
      <Grid container spacing={3}>
        {/* Sales Trend Chart */}
        <Grid item xs={12} md={8}> {/* Takes full width on small, 8/12 on medium+ */}
          <DashboardCard title="PassinBiz Product Stats">
            <LineChart />
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={8}> {/* Takes full width on small, 8/12 on medium+ */}
          <DashboardCard title="CkeckinBiz Product Stats">
            <LineChart />
          </DashboardCard>
        </Grid>

        {/* Departmental Budget Chart */}
        <Grid item xs={12} md={4}> {/* Takes full width on small, 4/12 on medium+ */}
          <DashboardCard title="Budget Allocation">
            <DoughnutChart />
          </DashboardCard>
        </Grid>


        {/* Another Example Card (can be anything, e.g., a list or text) */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Recent Activities">
            <Typography variant="body1" sx={{ mb: 1 }}>
              - New user registered (John Doe)
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              - Report generated for Q1 sales
            </Typography>
            <Typography variant="body1">
              - System update deployed
            </Typography>
          </DashboardCard>
        </Grid>

        {/* You can add more Grid items and DashboardCards here */}
      </Grid>
    </Container>
  );
}
