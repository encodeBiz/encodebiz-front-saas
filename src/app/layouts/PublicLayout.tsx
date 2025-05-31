'use client'
import { useLayout } from '@/hooks/useLayout';
import { Box, CssBaseline, Grid } from '@mui/material';


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { layoutState } = useLayout()

  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
       
        <Grid container spacing={3}>
          {children}
        </Grid>
     
    </Box>


  );
}