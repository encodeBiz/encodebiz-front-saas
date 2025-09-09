/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { SassButton } from '@/components/common/buttons/GenericButton';
import WelcomeInviteModal from '@/components/common/modals/WelcomeInvite';
import PageLoader from '@/components/common/PageLoader';
import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header/Header';
import Onboarding from '@/components/layouts/Onboarding/Onboarding';
import SideMenu from '@/components/layouts/SideMenu';
import { CommonModalProvider, CommonModalType } from '@/contexts/commonModalContext';
import { EntityProvider } from '@/contexts/entityContext';
import { FormStatusProvider } from '@/contexts/formStatusContext';
import { LayoutProvider } from '@/contexts/layoutContext';
import { MediaProvider } from '@/contexts/mediaContext';
import { useAuth } from '@/hooks/useAuth';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useEntity } from '@/hooks/useEntity';
import { useLayout } from '@/hooks/useLayout';
import { Alert, Box, CssBaseline, Grid } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

const drawerWidth = 265;


function Admin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { layoutState, navivateTo } = useLayout()
  const { pendAuth, user } = useAuth()
  const { open, openModal } = useCommonModal()
  const { currentEntity, entitySuscription } = useEntity()
  const t = useTranslations()
  const enableAdvise = entitySuscription.filter(e => (e.plan === "bronze" || e.plan === "enterprise")).length > 0 && currentEntity?.entity.billingConfig?.payment_method?.length === 0

  useEffect(() => {
    if (currentEntity?.id && user?.id && currentEntity.status === 'invited' && !pendAuth && !localStorage.getItem(`ENTITY-${currentEntity?.id}-${user?.id}`)) {
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
            {enableAdvise && <Alert
              action={
                <SassButton onClick={() => navivateTo('/entity?tab=billing', true)} color="inherit" size="small">
                  {t('core.button.configure')}
                </SassButton>
              }
              sx={{ margin: 'auto', mb: 2 }} variant="filled" severity="error">{t('core.feedback.nocard')}</Alert>}
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


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
  
      <EntityProvider>
        <LayoutProvider>
            <CommonModalProvider>
              <MediaProvider>
                <FormStatusProvider>
                  <Admin>{children}</Admin>
                </FormStatusProvider>
              </MediaProvider>
            </CommonModalProvider>         
        </LayoutProvider>
      </EntityProvider>
   
  );
}