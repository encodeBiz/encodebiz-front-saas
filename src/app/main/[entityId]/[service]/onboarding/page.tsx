'use client';
import HelpTabs from "@/components/features/dashboard/HelpTabs/HelpTabs";
import image from '@/../public/assets/images/qr_code.svg'
import { Container } from '@mui/material';
import { SettingsOutlined } from "@mui/icons-material";
import useDashboardController from "./page.controller";
import { useRef } from "react";
import SalesPlan from "@/components/features/profile/SalesPlan/SalesPlan";
import { IPlan } from "@/domain/core/IPlan";
import { useParams } from "next/navigation";
import OnboardingCard from "@/components/features/dashboard/OnboardingCard/OnboardingCard";
import TabContent from "./passBiz/tabContent";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useTranslations } from "next-intl";

export default function Dashboard() {
  const { serviceData, pending, planList, dataTab1, dataTab2 } = useDashboardController()
  const sectionMoreInfofRef = useRef(null); // Create a ref for the section
  const sectionServicesRef = useRef(null); // Create a ref for the section
  const { service } = useParams<any>()
  const { currentLocale } = useAppLocale()
  const t = useTranslations()


  const scrollToPlan = () => {
    if (sectionServicesRef.current) {
      (sectionServicesRef.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Container maxWidth="xl">

      <OnboardingCard
        title={serviceData?.name}
        description={serviceData?.about ? (serviceData?.about as any)[currentLocale] : ''}
        image={image}
        onPress={scrollToPlan}
        right={-5}
        top={0}
        width={350}
        height={390}
        heightCard={376}
      />



      <HelpTabs ref={sectionMoreInfofRef} tabs={[
        {
          id: '1',
          title: t(`onboarding.${service}.tab1Title`),
          icon: <SettingsOutlined fontSize="small" />,
          tabContent: <TabContent title={dataTab1.title} subtitle={dataTab1.subtitle} data={dataTab1.data} />
        },
        {
          id: '2',
          title: t(`onboarding.${service}.tab2Title`),
          icon: <SettingsOutlined fontSize="small" />,
          tabContent: <TabContent title={dataTab2.title} data={dataTab2.data} />
        },

      ]} />

      {!pending && Array.isArray(planList) && <SalesPlan ref={sectionServicesRef} salesPlans={planList as Array<IPlan>} fromService={service} />}



    </Container>
  );
}
