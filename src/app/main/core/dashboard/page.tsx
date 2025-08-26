'use client';
import image from '@/../public/assets/images/dashboard.svg'
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useDashboardController from "./page.controller";
import ServiceList from "@/components/features/dashboard/ServiceList/ServiceList";
import OnboardingCard from "@/components/features/dashboard/OnboardingCard/OnboardingCard";
import DescriptionCard from '@/components/features/dashboard/DescriptionCard/DescriptionCard';

export default function Dashboard() {
  const t = useTranslations()
  const { } = useDashboardController()



  return (
    <Container maxWidth="xl">
      <OnboardingCard
        title={t('features.dashboard.card.title')}
        description={t('features.dashboard.card.subtitle')}
        image={image}
      />
      <ServiceList />

      <DescriptionCard
        title={t('features.dashboard.cardDesc.title')}
        description1={t('features.dashboard.cardDesc.subtitle1')}
        description2={t('features.dashboard.cardDesc.subtitle2')}
      />


    </Container>
  );
}
