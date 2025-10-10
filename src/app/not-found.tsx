'use client';

import { SassButton } from '@/components/common/buttons/GenericButton';
import { Box, Container, Typography, Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations()
  return (
    <Container component="main" maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Box
        sx={{
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h1" component="h1" color="primary" sx={{ fontWeight: 700 }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          {t('404.text1')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('404.text3')}
        </Typography>
        <SassButton
          component={Link}
          href="/"
          variant="contained"
          sx={{ mt: 3 }}
        >
          {t('404.text3')}
        </SassButton>
      </Box>
    </Container>
  );
}
