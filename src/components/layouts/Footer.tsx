// src/components/Footer.tsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import CustomFooter from './CustomFooter/CustomFooter';

const Footer: React.FC = () => {
  const t = useTranslations()
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: (theme) => theme.palette.background.paper,

        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <CustomFooter />
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