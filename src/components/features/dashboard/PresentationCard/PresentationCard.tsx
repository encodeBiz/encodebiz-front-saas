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
    <Container maxWidth="xl"  >
      <Paper elevation={3} sx={{
        p: 4, mt: 4, mb: 4, borderRadius: 2, display: 'flex', flexDirection: {

          xs: 'column',   
          sm: 'column',     
          md: 'column',     
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

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                color: 'white',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                }
              }}
            >
              Gradient Button
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
              Dashed Border
            </Button>
          </Stack>
        </Box>
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Image width={200} height={200} alt='EncodeBiz' src={image} />
        </Box>
      </Paper>
    </Container>
  );
}