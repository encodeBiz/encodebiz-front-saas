// components/PageLoader.tsx
'use client'
import React from 'react';
import { 
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  useTheme
} from '@mui/material';

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
  type = 'circular',
  size = 40,
  thickness = 3.6,
  message,
  fullScreen = true,
  backdrop = false,
  progress
}) => {
  const theme = useTheme();

  const loaderStyle = {
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

  const progressComponent = type === 'circular' ? (
    <CircularProgress
      size={size}
      thickness={thickness}
      variant={progress !== undefined ? 'determinate' : 'indeterminate'}
      value={progress}
    />
  ) : (
    <Box sx={{ width: '100%', maxWidth: 400, px: 2 }}>
      <LinearProgress
        variant={progress !== undefined ? 'determinate' : 'indeterminate'}
        value={progress}
      />
    </Box>
  );

  return (
    <Box sx={loaderStyle}>
      {progressComponent}
      {message && (
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default PageLoader;