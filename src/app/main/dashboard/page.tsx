'use client';
import DoughnutChart from "@/components/common/charts/DoughnutChart";
import LineChart from "@/components/common/charts/LineChart";
import DashboardCard from "@/components/common/DashboardCard";
import HelpTabs from "@/components/features/dashboard/HelpTabs/HelpTabs";
import PresentationCard from "@/components/features/dashboard/PresentationCard/PresentationCard";
import image from '../../../../public/assets/images/encodebiz-sass.png'
import { Container, Divider, Grid, Typography } from '@mui/material';
import { useTranslations } from "next-intl";
import { Cloud } from "@mui/icons-material";

export default function Dashboard() {
  const t = useTranslations()
  return (
    <Container maxWidth="xl">
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
        action2Text={t('features.dashboard.card.btn2')}
      />


      <HelpTabs tabs={[
        {
          id: '1',
          title: "¿Como empiezo?",
          description: "Leer la documentación",
          icon: <Cloud fontSize="small" />,
          tabContent: <>1</>
        },
         {
          id: '2',
          title: "¿Cuanto me costará Encodebiz Sass?",
          description: "Consultar los planes de cada producto",
          icon: <Cloud fontSize="small" />,
          tabContent: <>2</>
        },
         {
          id: '3',
          title: "¿Como me puede ayudar Encodebiz Sass?",
          description: "Ver el video",
          icon: <Cloud fontSize="small" />,
          tabContent: <>3</>
        }
      ]} />




      <Typography variant="h4" component="h2" align="left" gutterBottom>
        {t('features.dashboard.stats')}
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
