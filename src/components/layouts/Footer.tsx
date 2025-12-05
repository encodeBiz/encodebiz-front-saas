// src/components/Footer.tsx
import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Footer: React.FC = () => {
  const t = useTranslations()
  const theme = useTheme()
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: (theme) => theme.palette.background.paper,
        position: 'relative',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        py: 3,
        mt: 6,
        height: 110,
        bottom: 0,
        pt: 6,
        borderTop: 2, borderColor: 'secondary.dark',
      }}
    >
      <Container maxWidth="lg" >
        <Box display={'flex'} flexDirection={'row'} gap={10} justifyContent={'center'}>
          <Typography variant="body2" color="inherit" align="center">
            {'© '}
            {new Date().getFullYear()}{' '}
            {t('layout.footer.copyright')}
          </Typography>
 

          <Link style={{ color: theme.palette.primary.main, textDecoration: 'none' }} href="/legal/terms-and-conditions" > {t('core.label.accepTerm2')} </Link>
          <Link style={{ color: theme.palette.primary.main, textDecoration: 'none' }} href="/legal/privacy-policy">{t('core.label.accepTerm4')} </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;