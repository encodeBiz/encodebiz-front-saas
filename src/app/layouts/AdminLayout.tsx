'use client'
import PageLoader from '@/components/common/PageLoader';
import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header/Header';
import Onboarding from '@/components/layouts/Onboarding/Onboarding';
import SideMenu from '@/components/layouts/SideMenu';
import { useAuth } from '@/hooks/useAuth';
import { useLayout } from '@/hooks/useLayout';
import { Box, CssBaseline, Grid } from '@mui/material';
import { useTranslations } from 'next-intl';

const drawerWidth = 265;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { layoutState } = useLayout()
  const { pendAuth } = useAuth()
  const t = useTranslations()

  return (
    <Box>
      <CssBaseline />
      <SideMenu />
      <Box
        component="main"
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        sx={{
          ml: { sm: `${layoutState.openDraw ? drawerWidth : 0}px` }, // For persistent drawer
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Header drawerWidth={drawerWidth} />
        <div style={{maxWidth: 1175, width: '100%'}}>
          <Grid container sx={{
            display: 'flex',
            minHeight: 'calc(100vh - 100px)',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingTop: "100px",
            paddingBottom: "24px", px: 4
          }}>
            {pendAuth && <PageLoader backdrop message={t('core.title.loader')} type={'circular'} fullScreen />}
            {children}
            <Onboarding />
          </Grid>
        </div>

        {/** <CustomFooter /> */}
      </Box>
      <Footer />
    </Box>


  );
}