'use client';
import { Container, Typography } from '@mui/material';
import { useTranslations } from "next-intl";

export default function HolderList() {
  const t = useTranslations()
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {t('features.dashboard.overview')}
      </Typography>

      






    </Container>
  );
}
