'use client';
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  height?: string | number; // Optional height for the card content
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, height = 300 }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" component="h2" >
          {title}
        </Typography>
        <Box sx={{ height: height, width: '100%' }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;