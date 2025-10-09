'use client'
import { Box, CssBaseline } from '@mui/material';
import { usePathname } from 'next/navigation';
  
export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathName = usePathname()
   return (

    <Box sx={{
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex', flexDirection: 'column', 
      justifyItems: 'center', 
      justifyContent: pathName.includes('tools/scanner')?'flex-start':'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      bgcolor: (theme) => theme.palette.background.paper
    }}>
      <CssBaseline />

      {children}
    </Box>


  );
}