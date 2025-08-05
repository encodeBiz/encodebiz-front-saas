'use client'
import { Box, CssBaseline, Grid } from '@mui/material';


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
       
        <Grid container spacing={3}>
          {children}
        </Grid>
     
    </Box>


  );
}