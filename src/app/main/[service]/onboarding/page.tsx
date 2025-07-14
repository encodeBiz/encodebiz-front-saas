'use client';
import HelpTabs from "@/components/features/dashboard/HelpTabs/HelpTabs";
import PresentationCard from "@/components/features/dashboard/PresentationCard/PresentationCard";
import image from '@/../public/assets/images/encodebiz-sass.png'
import { Container, Typography } from '@mui/material';
import { useTranslations } from "next-intl";
import { Cloud } from "@mui/icons-material";
import useDashboardController from "./page.controller";
import { useRef } from "react";
import SalesPlan from "@/components/features/profile/SalesPlan/SalesPlan";
import { IPlan } from "@/domain/core/IPlan";

export default function Dashboard() {
  const t = useTranslations()
  const { serviceData, pending, planList, notGetPlan } = useDashboardController()
  const sectionMoreInfofRef = useRef(null); // Create a ref for the section
  const sectionServicesRef = useRef(null); // Create a ref for the section

  const scrollToMore = () => {
    if (sectionMoreInfofRef.current) {
      (sectionMoreInfofRef.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  const scrollToPlan = () => {
    if (sectionMoreInfofRef.current) {
      (sectionMoreInfofRef.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {t('features.dashboard.overview')}
      </Typography>

      <PresentationCard
        title={serviceData?.name as string}
        description={serviceData?.description}
        image={serviceData?.image ? serviceData?.image : image}
        action1={scrollToMore}
        action1Text={t('features.dashboard.card.btn1')}
        action2={scrollToPlan}
        action2Text={t('features.dashboard.card.btn3')}
      />




      {!pending && Array.isArray(planList) && <SalesPlan ref={sectionServicesRef} salesPlans={planList as Array<IPlan>} notGetPlan={notGetPlan} fromService="checkinbiz" />}



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




    </Container>
  );
}
