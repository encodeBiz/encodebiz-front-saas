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
  iconColor?: 'blue' | 'white';
  fullScreen?: boolean;
  progress?: number; // For determinate mode
  width?: number;
};

const PageLoader: React.FC<PageLoaderProps> = ({
  message,
  fullScreen = true,
  backdrop = false,
  width = 0,
  textColor = '#FFF',
  iconColor = 'white'

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
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: backdrop ? 'rgba(0,0,0,0.7)' : theme.palette.background.default,
      zIndex: theme.zIndex.modal + 1,
      color: theme.palette.text.secondary
    }),
    ...(!fullScreen && {
      width: `calc(100vw - ${width ? width : 200}px)`,
      height: 'calc(100vh)',
      position: 'absolute',
      zIndex: theme.zIndex.modal - 1,

      backgroundColor: backdrop ? 'rgba(0,0,0,0.1)' : theme.palette.background.default,
      // zIndex: theme.zIndex.modal + 1
    })
  };



  return (
    <Box sx={loaderStyle}>
      <AnimatedLogo color={iconColor} />
      <Typography style={{ color: textColor }} variant="body1"  >
        {message ? message : t('core.title.loader')}
      </Typography>

    </Box>
  );
};

export default PageLoader;