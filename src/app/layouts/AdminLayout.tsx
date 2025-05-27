import Header from '@/components/layouts/Header';
import Sidebar from '@/components/layouts/SideMenu';
import { LayoutProvider } from '@/contexts/layoutContext';
import { Box } from '@mui/material';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
          {children}
        </Box>
      </Box>
    </LayoutProvider>
  );
}