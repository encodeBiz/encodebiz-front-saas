'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";

import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import HelpTabs from '@/components/features/dashboard/HelpTabs/HelpTabs';
import PassesStats from './components/stats/passes/passes';

export default function HolderList() {
  const t = useTranslations();
 

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("layout.side.menu.Stats")}
      >
        <HelpTabs tabs={[
          {
            id: '1',
            title: t('stats.passes'),
            tabContent: <PassesStats />
          }]} />

      </HeaderPage>
    </Container>
  );
}
