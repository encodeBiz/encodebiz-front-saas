import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Stack
} from '@mui/material';
import Image from 'next/image';
export interface PresentationCardProps {
  title?: string
  description?: string
  image?: any
  action1?: () => void
  action2?: () => void
}

export default function PresentationCard({ title, description, image, action1, action2 }: PresentationCardProps) {

  return (
    <Box  >
      <Paper elevation={3} sx={{
        mt: 4, mb: 4, pb: 4, borderRadius: 2, display: 'flex', flexDirection: {
          xs: 'column-reverse',
          sm: 'column-reverse',
          md: 'column-reverse',
          lg: 'row',
          xl: 'row',

        }, alignItems: 'center', justifyContent: 'space-around'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            {title}
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            {description}
          </Typography>

          <Stack direction="row" spacing={2} sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: 2,
            flexDirection: {
              xs: 'column',
              sm: 'column',
              md: 'column',
              lg: 'row',
              xl: 'row',

            }
          }}>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #1976d2 90%)',
                color: 'white',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976d2 30%, #1976d2 90%)',
                }
              }}
            >
              Más información
            </Button>
            <Button
              variant="outlined"
              sx={{
                border: '2px dashed',
                '&:hover': {
                  border: '2px dashed',
                  backgroundColor: 'action.hover'
                }
              }}
            >
              Nuestros productos
            </Button>
          </Stack>
        </Box>
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Image width={200} height={200} alt='EncodeBiz' src={image} />
        </Box>
      </Paper>
    </Box>
  );
}