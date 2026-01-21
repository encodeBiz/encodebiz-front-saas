'use client';

import { Container } from "@mui/material";
import HeaderPage from "@/components/features/dashboard/HeaderPage/HeaderPage";
import GenericTabs from "@/components/common/tabs/GenericTabs";
import { TabItem } from "@/components/common/tabs/BaseTabs";
import { useTranslations } from "next-intl";
import EntityCalendarTab from "./components/EntityCalendarTab";
import BranchCalendarTab from "./components/BranchCalendarTab";

const CalendarPage = () => {
    const t = useTranslations('calendar');

    const tabs: TabItem[] = [
        {
            id: 'entity',
            label: t('tabs.entity'),
            content: <EntityCalendarTab />
        },
        {
            id: 'branch',
            label: t('tabs.branch'),
            content: <BranchCalendarTab />
        },
    ];

    return (
        <Container maxWidth="xl">
            <HeaderPage
                title={t('title')}
                description={t('subtitle')}
            >
                <GenericTabs
                    tabs={tabs}
                    fullWidth
                    scrollable
                    syncUrl
                />
            </HeaderPage>
        </Container>
    );
};

export default CalendarPage;
