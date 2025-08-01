'use client';
import DoughnutChart from "@/components/common/charts/DoughnutChart";
import LineChart from "@/components/common/charts/LineChart";
import DashboardCard from "@/components/common/DashboardCard";
import HelpTabs from "@/components/features/dashboard/HelpTabs/HelpTabs";
import PresentationCard from "@/components/features/dashboard/PresentationCard/PresentationCard";
import image from '@/../public/assets/images/encodebiz-sass.png'
import { Container, Grid, Typography } from '@mui/material';
import { useTranslations } from "next-intl";
import { Cloud } from "@mui/icons-material";
import useDashboardController from "./page.controller";
import { useRef } from "react";
import ServiceList from "@/components/features/dashboard/ServiceList/ServiceList";

export default function Dashboard() {
  const t = useTranslations()
  const _ = useDashboardController()
  const sectionMoreInfofRef = useRef(null); // Create a ref for the section
  const sectionServicesRef = useRef(null); // Create a ref for the section

  const scrollToMore = () => {
    if (sectionMoreInfofRef.current) {
      (sectionMoreInfofRef.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  const scrollToServices = () => {
    if (sectionServicesRef.current) {
      (sectionServicesRef.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {t('features.dashboard.overview')}
      </Typography>

      <PresentationCard
        title={t('features.dashboard.card.title')}
        description={t('features.dashboard.card.subtitle')}
        image={image}
        action1={scrollToMore}
        action1Text={t('features.dashboard.card.btn1')}
        action2={scrollToServices}
        action2Text={t('features.dashboard.card.btn2')}
      />


      <HelpTabs ref={sectionMoreInfofRef} tabs={[
        {
          id: '1',
          title: "¿Como empiezo?",
          description: "Leer la documentación",
          icon: <Cloud fontSize="small" />,
          tabContent: <>1</>
        },
        {
          id: '2',
          title: "¿Cuanto me costará EncodeBiz SaaS?",
          description: "Consultar los planes de cada producto",
          icon: <Cloud fontSize="small" />,
          tabContent: <>2</>
        },
        {
          id: '3',
          title: "¿Como me puede ayudar EncodeBiz SaaS?",
          description: "Ver el video",
          icon: <Cloud fontSize="small" />,
          tabContent: <>3</>
        }
      ]} />


      <ServiceList ref={sectionServicesRef}  />

 
    </Container>
  );
}
