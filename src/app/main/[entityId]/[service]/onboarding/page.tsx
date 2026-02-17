/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import HelpTabs from "@/components/features/dashboard/HelpTabs/HelpTabs";
import passinbiz from '@/../public/assets/images/service-logo/passbiz.png'
import checkbiz from '@/../public/assets/images/service-logo/checkbiz.png'
import { Box, Container } from '@mui/material';
import useDashboardController from "./page.controller";
import { useEffect, useRef } from "react";
import SalesPlan from "@/components/features/profile/SalesPlan/SalesPlan";
import { IPlan } from "@/domain/core/IPlan";
import { useParams, useSearchParams } from "next/navigation";
import OnboardingCard from "@/components/features/dashboard/OnboardingCard/OnboardingCard";
import TabContent from "./passBiz/tabContent";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useTranslations } from "next-intl";
import { StepIcon } from "@/components/common/icons/StepIcon";
import { TargetIcon } from "@/components/common/icons/TargetIcon";
import { useEntity } from "@/hooks/useEntity";
const imageModule: any = {
  passinbiz: passinbiz,
  checkinbiz: checkbiz
}
export default function Dashboard() {
  const { serviceData, pending, planList, dataTab1, dataTab2 } = useDashboardController()
  const sectionMoreInfofRef = useRef(null); // Create a ref for the section
  const sectionServicesRef = useRef(null); // Create a ref for the section


  const { service } = useParams<any>()
  const { currentLocale } = useAppLocale()
  const t = useTranslations()
  const { currentEntity, entitySuscription, entityServiceList } = useEntity()
  const searchParams = useSearchParams()
  const isCommingZoom = entityServiceList.find(e => e.id === service)?.status === 'cooming_soon'
  const sub = entitySuscription.find(e => e.serviceId === service && e.status === 'active')
  const activeService = sub || currentEntity?.role === 'owner'
  const scrollToPlan = () => {
    if (sectionServicesRef.current) {
      (sectionServicesRef.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });

    }
  };

  useEffect(() => {

    if (searchParams.get('to') === 'plans' && !pending && sectionServicesRef?.current && planList?.length)
      setTimeout(() => {
        scrollToPlan()
      }, 1000);
  }, [searchParams.get('to'), (sectionServicesRef?.current as any), pending, planList?.length])
  return (
    <Container maxWidth="xl">

      <OnboardingCard
        serviceData={serviceData}
        title={serviceData?.name}
        description={serviceData?.about ? (serviceData?.about as any)[currentLocale] : ''}
        image={imageModule[service]}
        onPress={scrollToPlan}
        right={5}
        top={-10}
        width={400}
        height={390}
        heightCard={376}
      />


      <HelpTabs ref={sectionMoreInfofRef} tabs={[
        {
          id: '1',
          title: t(`onboarding.${service}.tab1Title`),
          icon: (props: any) => <StepIcon {...props} fontSize="small" />,
          tabContent: <TabContent counter title={dataTab1.title} subtitle={dataTab1.subtitle} data={dataTab1.data} />
        },
        {
          id: '2',
          title: t(`onboarding.${service}.tab2Title`),
          icon: (props: any) => <TargetIcon {...props} fontSize="small" />,
          tabContent: <TabContent title={dataTab2.title} data={dataTab2.data} />
        },

      ]} />

      <Box id="plans" ref={sectionServicesRef} >{!pending && !isCommingZoom && activeService && Array.isArray(planList) && 
        <SalesPlan salesPlans={planList as Array<IPlan>} fromService={service} cancelAt={sub?.cancel_at?.toDate()}/>}
        </Box>
    </Container>
  );
}


//