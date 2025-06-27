'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderController from './page.controller';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericTabs from '@/components/common/tabs/GenericTabs';

export default function HolderList() {
  const { tabsRender } = useHolderController();
  const t = useTranslations()
  return (
    <Container maxWidth="lg">
      <PresentationCard
        title={t('holders.title')}
      >
        <GenericTabs
          tabs={tabsRender}
        />
      </PresentationCard>
    </Container>
  );
}
