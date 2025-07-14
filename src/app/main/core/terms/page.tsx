'use client';
import { useTranslations } from 'next-intl';
import { Container, Typography } from '@mui/material';


export default function TemsPage() {
  const t = useTranslations()

  return (
    <Container maxWidth="xl">
      <Typography variant="body2" color="inherit" align="center">
        {t('terms.title')}
      </Typography>
    </Container>
  );
}
