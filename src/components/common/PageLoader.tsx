// components/PageLoader.tsx
'use client'
import React from 'react';
import { 
  Box,
  Typography,
  useTheme
} from '@mui/material';
import AnimatedLogo from '../layouts/LogoLoader/LogoLoader';

type PageLoaderProps = {
  type?: 'circular' | 'linear';
  backdrop?:boolean
  size?: number | string;
  thickness?: number;
  message?: string;
  fullScreen?: boolean;
  progress?: number; // For determinate mode
};

const PageLoader: React.FC<PageLoaderProps> = ({  
  message,
  fullScreen = true,
  backdrop = false,
  
}) => {
  const theme = useTheme();

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
      backgroundColor: backdrop?'rgba(0,0,0,0.7)':theme.palette.background.default,
      zIndex: theme.zIndex.modal + 1,
      color: theme.palette.text.secondary
    }),
    ...(!fullScreen && {
     
      width: '100%',
      height: 'calc(50vh - 200px)',
      backgroundColor: theme.palette.background.default,
     // zIndex: theme.zIndex.modal + 1
    })
  };

   

  return (
    <Box sx={loaderStyle}>
      <AnimatedLogo/>
      {message && (
        <Typography style={{color:'#FFF'}} variant="body1" color="textSecondary">
          {message}...
        </Typography>
      )}
    </Box>
  );
};

export default PageLoader;