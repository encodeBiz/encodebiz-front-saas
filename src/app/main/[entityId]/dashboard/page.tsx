'use client';
import image from '@/../public/assets/images/dashboard.svg'
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useDashboardController from "./page.controller";
import ServiceList from "@/components/features/dashboard/ServiceList/ServiceList";
import OnboardingCard from "@/components/features/dashboard/OnboardingCard/OnboardingCard";
import DescriptionCard from '@/components/features/dashboard/DescriptionCard/DescriptionCard';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { PassesTrendChart } from '../passinbiz/stats/components/charts/passesTrend/passesTrend';
import { PassinBizStatsProvider } from '../passinbiz/stats/context/passBizStatsContext';
import { useEntity } from '@/hooks/useEntity';
import { EmployeeTrendChart } from '../checkinbiz/panel/components/employeeTrend/employeeTrend';
 
export default function Dashboard() {
  const t = useTranslations()
  useDashboardController()
  const { entitySuscription } = useEntity()


  return (
    <PassinBizStatsProvider>
      <Container maxWidth="xl">
        <OnboardingCard
          title={t('features.dashboard.card2.title')}
          description={t('features.dashboard.card2.subtitle')}
          description2={t('features.dashboard.card2.subtitle2')}
          image={image}
          
        />

        {entitySuscription.filter((e) => e.serviceId === "passinbiz").length > 0 && <BorderBox sx={{ width: "100%", p: 2, mt: 10, background: 'white'}}>
          <PassesTrendChart />
        </BorderBox>}

         {entitySuscription.filter((e) => e.serviceId === "checkinbiz").length > 0 && <BorderBox sx={{ width: "100%", p: 2, mt: 10, background: 'white'}}>
          <EmployeeTrendChart />
        </BorderBox>}

        <ServiceList />

        <DescriptionCard
          title1={t('features.dashboard.cardDesc.title1')}
          title2={t('features.dashboard.cardDesc.title2')}
          description1={t('features.dashboard.cardDesc.subtitle1')}
          description2={t('features.dashboard.cardDesc.subtitle2')}
        />


      </Container >
    </PassinBizStatsProvider>
  );
}
