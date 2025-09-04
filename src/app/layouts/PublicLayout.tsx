'use client'
import { Box, CssBaseline, Grid } from '@mui/material';


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (

    <Box sx={{ display: 'flex', flexDirection: 'column',justifyItems:'center',justifyContent:'center', alignItems:'center',   minHeight: '100vh',  bgcolor:(theme) => theme.palette.background.paper }}>
      <CssBaseline />
        
          {children}
       
     
    </Box>


  );
}