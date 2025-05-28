// src/components/Footer.tsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: (theme) => theme.palette.background.paper,
        
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="inherit" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' My Company. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;