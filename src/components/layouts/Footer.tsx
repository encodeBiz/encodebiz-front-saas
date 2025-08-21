// src/components/Footer.tsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useTranslations } from 'next-intl';

const Footer: React.FC = () => {
  const t = useTranslations()
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: (theme) => theme.palette.background.paper,
        position:'absolute',
        zIndex:(theme)=>theme.zIndex.drawer + 1,
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="inherit" align="center">
          {'© '}
          {new Date().getFullYear()}{' '}
          {t('layout.footer.copyright')}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;