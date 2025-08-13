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
 
const drawerWidth = 240; // Define the width of your drawer

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { layoutState } = useLayout()
  const { pendAuth } = useAuth()
  const t = useTranslations()

  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />

      <Header />
      {/* Main content area, including drawer and content grid */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <SideMenu />
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1, // Allows main content to take up available space
          //p: 3, // Padding around the main content           
          // Margin top to clear the fixed AppBar
          //mt: (theme) => `${theme.mixins.toolbar.minHeight}px`,
          // Adjust padding for drawer if it were permanent/persistent
          ml: { sm: `${layoutState.openDraw ? drawerWidth : 0}px` }, // For persistent drawer
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          })
        }}
      >
        <Grid container sx={{ display: 'flex', minHeight: 'calc(100vh - 200px)', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: pendAuth ? 0 : "24px", paddingBottom: "24px" }}>
          {pendAuth && <PageLoader width={drawerWidth} backdrop message={t('core.title.loader')} type={'circular'} fullScreen={false} />}
          {children}
          <Onboarding />
        </Grid>
        {/** <CustomFooter /> */}
      </Box>
      <Footer />
    </Box>


  );
}