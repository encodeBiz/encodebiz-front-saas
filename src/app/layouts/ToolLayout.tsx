'use client'
import { Box, CssBaseline } from '@mui/material';
  
export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   return (

    <Box sx={{
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: (theme) => theme.palette.background.paper
    }}>
      <CssBaseline />

      {children}
    </Box>


  );
}