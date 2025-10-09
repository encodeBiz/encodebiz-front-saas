'use client'
import { Box, CssBaseline } from '@mui/material';
import bg from '../../../public/assets/images/bg.jpg'
import { usePathname } from 'next/navigation';

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname()
  return (

    <Box sx={{
      backgroundImage: pathName.includes('/tools/scanner') ? 'none' : `url(${bg.src})`,
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