'use client';
import HelpTabs from "@/components/features/dashboard/HelpTabs/HelpTabs";
import passinbiz from '@/../public/assets/images/passinbiz.svg'
import checkbiz from '@/../public/assets/images/checkbiz-onbooarding.svg'
import { Container } from '@mui/material';
import useDashboardController from "./page.controller";
import { useRef } from "react";
import SalesPlan from "@/components/features/profile/SalesPlan/SalesPlan";
import { IPlan } from "@/domain/core/IPlan";
import { useParams } from "next/navigation";
import OnboardingCard from "@/components/features/dashboard/OnboardingCard/OnboardingCard";
import TabContent from "./passBiz/tabContent";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useTranslations } from "next-intl";
import { StepIcon } from "@/components/common/icons/StepIcon";
import { TargetIcon } from "@/components/common/icons/TargetIcon";
const imageModule: any = {
  passinbiz:passinbiz,
  checkinbiz:checkbiz
}
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
        image={imageModule[service]}
        onPress={scrollToPlan}
        right={5}
        top={-10}
        width={350}
        height={390}
        heightCard={376}
      />

 
      <HelpTabs ref={sectionMoreInfofRef} tabs={[
        {
          id: '1',
          title: t(`onboarding.${service}.tab1Title`),
          icon: (props: any)=> <StepIcon {...props} fontSize="small" />,
          tabContent: <TabContent title={dataTab1.title} subtitle={dataTab1.subtitle} data={dataTab1.data} />
        },
        {
          id: '2',
          title: t(`onboarding.${service}.tab2Title`),
          icon:(props: any)=> <TargetIcon {...props} fontSize="small" />,
          tabContent: <TabContent title={dataTab2.title} data={dataTab2.data} />
        },

      ]} />

      {!pending && Array.isArray(planList) && <SalesPlan ref={sectionServicesRef} salesPlans={planList as Array<IPlan>} fromService={service} />}



    </Container>
  );
}
