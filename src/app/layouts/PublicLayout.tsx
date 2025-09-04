'use client'
import { Box, CssBaseline } from '@mui/material';
import bg from '../../../public/assets/images/bg.jpg'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <Box sx={{ 
      backgroundImage:`url(${bg.src})`,
      display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: (theme) => theme.palette.background.paper }}>
      <CssBaseline />
      {children}
    </Box>


  );
}