import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon
} from '@mui/icons-material';
import Image from 'next/image';

const ImagePreview = ({
  src='',
  alt = 'Preview image',
  width = '100%',
  height = 'auto',
  style = {},
  previewStyle = {},
  showZoomIcon = true,
  zoomIconPosition = 'top-right',
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFullScreen(false);
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  const getZoomIconPosition = () => {
    const positions: any = {
      'top-right': { top: 8, right: 8 },
      'top-left': { top: 8, left: 8 },
      'bottom-right': { bottom: 8, right: 8 },
      'bottom-left': { bottom: 8, left: 8 },
      'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    };
    return positions[zoomIconPosition] || positions['top-right'];
  };

  return (
    <>
      {/* Thumbnail Image */}
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          cursor: 'pointer',
          width: width,
          height: height,
          ...style
        }}
        onClick={handleClickOpen}
      >
        <Image 
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: theme.shape.borderRadius,
            ...props.style
          }}
          {...props}
        />

        {showZoomIcon && (
          <Box
            sx={{
              position: 'absolute',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              padding: '4px',
              ...getZoomIconPosition()
            }}
          >
            <ZoomInIcon sx={{ color: 'white' }} />
          </Box>
        )}
      </Box>

      {/* Preview Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile || fullScreen}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden',
            margin: 0,
            width: '100%',
            height: '100%'
          }
        }}
      >
        <DialogContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            position: 'relative',
            ...previewStyle
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Fullscreen Toggle Button */}
          {!isMobile && (
            <Tooltip title={fullScreen ? 'Exit fullscreen' : 'Fullscreen'}>
              <IconButton
                onClick={toggleFullScreen}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 48,
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
          )}

          {/* Preview Image */}
          <Image
            src={src}
            alt={alt}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              cursor: 'zoom-out'
            }}
            onClick={handleClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImagePreview;