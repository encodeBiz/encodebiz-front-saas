/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import WelcomeInviteModal from '@/components/common/modals/WelcomeInvite';
import PageLoader from '@/components/common/PageLoader';
import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header/Header';
import Onboarding from '@/components/layouts/Onboarding/Onboarding';
import SideMenu from '@/components/layouts/SideMenu';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useAuth } from '@/hooks/useAuth';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useEntity } from '@/hooks/useEntity';
import { useLayout } from '@/hooks/useLayout';
import { Box, CssBaseline, Grid } from '@mui/material';
import { useEffect } from 'react';

const drawerWidth = 265;


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { layoutState } = useLayout()
  const { pendAuth, user } = useAuth()
  const { open, openModal } = useCommonModal()
  const { currentEntity } = useEntity()

  useEffect(() => {
     
    if (currentEntity?.id && user?.id && currentEntity.status === 'invited' && !pendAuth) {
      openModal(CommonModalType.WELCOMEGUEST)
    }
  }, [currentEntity?.id, user?.id, pendAuth])

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
        <div style={{ maxWidth: 1275, width: '100%' }}>
          <Grid container sx={{
            display: 'flex',
            minHeight: 'calc(100vh - 100px)',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingTop: "100px",
            paddingBottom: "24px", px: 4
          }}>
            {pendAuth && <PageLoader backdrop type={'circular'} fullScreen />}
            {children}
            {open.type === CommonModalType.ONBOARDING && <Onboarding />}
            {open.type === CommonModalType.WELCOMEGUEST && <WelcomeInviteModal />}
          </Grid>
        </div>

        {/** <CustomFooter /> */}
      </Box>
      <Footer />
    </Box>


  );
}