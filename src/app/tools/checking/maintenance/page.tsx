'use client'

import { Box, Button, Container, Stack, Typography } from '@mui/material'

const androidUrl = 'https://firebasestorage.googleapis.com/v0/b/encodebiz-services.firebasestorage.app/o/assets%2Fandroid.png?alt=media&token=f6e2eee2-9ed7-41b5-baa3-1aea3dfaf45b'
const iosUrl = 'https://firebasestorage.googleapis.com/v0/b/encodebiz-services.firebasestorage.app/o/assets%2Fios.png?alt=media&token=1cde91f9-db99-4cf7-8371-ffd5339944c7'
const logoUrl = 'https://www.encodebiz.com/_next/static/media/encodebiz_logo.d398c273.png'

export default function MaintenancePage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Stack spacing={4} alignItems="center" textAlign="center">
        <Box component="img" src={logoUrl} alt="EncodeBiz Logo" sx={{ width: 180, height: 60, objectFit: 'contain' }} />
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700}>CheckBiz está en mantenimiento</Typography>
          <Typography variant="body1" color="text.secondary">
            Estamos mejorando la experiencia de fichaje. Mientras tanto, descarga la app CheckBiz360 para seguir registrando tu jornada.
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={700}>Descarga la app CheckBiz360</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="center">
            <Button component="a" href={androidUrl} variant="contained" color="primary" sx={{ px: 3 }}>
              Google Play
            </Button>
            <Button component="a" href={iosUrl} variant="contained" color="primary" sx={{ px: 3 }}>
              App Store
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ bgcolor: '#f0f4ff', borderLeft: '4px solid #0066ff', p: 3, borderRadius: 2, width: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>Acceso y seguridad</Typography>
          <Typography variant="body2" color="text.secondary">
            Es posible que se solicite geolocalización, dispositivo de confianza y autenticación temporal (Authenticator) para proteger tu cuenta.
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          ¿Necesitas ayuda? Escríbenos a soporte@encodebiz.com
        </Typography>
      </Stack>
    </Container>
  )
}
