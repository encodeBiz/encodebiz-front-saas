'use client'
import { Box, CssBaseline } from '@mui/material';
import bg from '../../../public/assets/images/bg.jpg'
import { AuthProvider } from '@/contexts/authContext';
import { CommonModalProvider } from '@/contexts/commonModalContext';
import { EntityProvider } from '@/contexts/entityContext';
import { FormStatusProvider } from '@/contexts/formStatusContext';
import { LayoutProvider } from '@/contexts/layoutContext';
import { MediaProvider } from '@/contexts/mediaContext';

export default function PublicLayout({
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
                <Box sx={{
                  backgroundImage: `url(${bg.src})`,
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: (theme) => theme.palette.background.paper
                }}>
                  <CssBaseline />
                  {children}
                </Box>
              </FormStatusProvider>
            </MediaProvider>
          </CommonModalProvider>
        </LayoutProvider>
      </EntityProvider>
  

  );
}