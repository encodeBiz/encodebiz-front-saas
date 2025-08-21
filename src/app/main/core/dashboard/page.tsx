'use client';
import HelpTabs from "@/components/features/dashboard/HelpTabs/HelpTabs";
import image from '@/../public/assets/images/dashboard.svg'
import { Container, Typography } from '@mui/material';
import { useTranslations } from "next-intl";
import { Cloud } from "@mui/icons-material";
import useDashboardController from "./page.controller";
import { useRef } from "react";
import ServiceList from "@/components/features/dashboard/ServiceList/ServiceList";
import OnboardingCard from "@/components/features/dashboard/OnboardingCard/OnboardingCard";

export default function Dashboard() {
  const t = useTranslations()
  const { } = useDashboardController()
  const sectionMoreInfofRef = useRef(null); // Create a ref for the section
  const sectionServicesRef = useRef(null); // Create a ref for the section



  return (
    <Container maxWidth="xl">    
      <OnboardingCard
        title={t('features.dashboard.card.title')}
        description={t('features.dashboard.card.subtitle')}
        image={image}
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


      <ServiceList ref={sectionServicesRef} />


    </Container>
  );
}
