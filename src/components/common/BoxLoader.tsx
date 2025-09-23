// components/PageLoader.tsx
'use client'
import React from 'react';
import {
  Box,
  Typography,
  useTheme
} from '@mui/material';
import AnimatedLogo from '../layouts/LogoLoader/LogoLoader';
import { useTranslations } from 'next-intl';

type PageLoaderProps = {
  type?: 'circular' | 'linear';
  backdrop?: boolean
  size?: number | string;
  thickness?: number;
  message?: string;
  textColor?: string;

  progress?: number; // For determinate mode
  width?: number;
};

const BoxLoader: React.FC<PageLoaderProps> = ({
  message,
  backdrop = false,
  width = 0,
  textColor = '#FFF'

}) => {
  const theme = useTheme();
  const t = useTranslations()

  const loaderStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),

    top: 0,
    left: 0,
    width: '100%',
    height: '80%',
    backgroundColor: 'rgba(0,0,0,0.3)' ,
    zIndex: theme.zIndex.modal + 1,
    color: theme.palette.text.secondary

  };



  return (
    <Box sx={loaderStyle}>
      <AnimatedLogo />
      <Typography style={{ color: textColor }} variant="body1"  >
        {message ? message : t('core.title.loader')}
      </Typography>

    </Box>
  );
};

export default BoxLoader;