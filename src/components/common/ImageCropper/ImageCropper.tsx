import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Slider,
    Tooltip
} from '@mui/material';
import { Close, Crop, CloudUpload, ZoomIn, ZoomOut } from '@mui/icons-material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from 'next/image';
import { useImageCropper } from './ImageCropper.controller';
import { useTranslations } from 'next-intl';
import { NumberInput } from '../forms/fields/NumberField';

export const ImageCropper = ({ onComplete }: { onComplete: (file: File) => void }) => {
    const { zoom, handleZoomIn, file, handleZoomOut, handleZoomChange, image, crop, setCrop, open, handleClose, setCompletedCrop, handleCrop, completedCrop, isLoading, imgRef, handleFileChange } = useImageCropper(onComplete)
    const fileInputRef: any = useRef(null);
    const t = useTranslations()

    return (
        <Box>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />

            <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current.click()}
                style={{ width: 180, height: 55 }}
            >
                {t('core.label.uploadResourse')}
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Crop sx={{ mr: 1 }} />
                        <Typography variant="h6">Crop Image {crop && <>({Math.floor(crop?.width)}x{Math.floor(crop?.height)})</>}</Typography>
                        <Box flexGrow={1} />
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    {image && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <ReactCrop
                                crop={crop}
                                onChange={setCrop}
                                onComplete={setCompletedCrop}
                                style={{
                                    maxHeight: 'calc(90vh - 200px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    transform: `scale(${zoom})`,
                                    transformOrigin: 'center center'
                                }}
                            >
                                <img ref={imgRef} alt='' src={image} />
                            </ReactCrop>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Box display="flex" alignItems="center" sx={{ mr: 2 }}>

                        <NumberInput
                            min={0}
                            max={1000}
                            step={1}
                            value={crop.width ?? 0}
                            onChange={(value: number) => {
                                setCrop({ ...crop, width: Math.floor(value) });
                            }}
                        />

                        <NumberInput
                            min={0}
                            max={1000}
                            step={1}
                            value={crop.height ?? 0}
                            onChange={(value: number) => {
                                setCrop({ ...crop, height: Math.floor(value) });
                            }}
                        />

                        
                        <Tooltip title="Zoom Out">
                            <IconButton onClick={handleZoomOut} disabled={zoom <= 1}>
                                <ZoomOut />
                            </IconButton>
                        </Tooltip>

                        <Slider
                            value={zoom}
                            onChange={handleZoomChange}
                            min={1}
                            max={3}
                            step={0.1}
                            sx={{ width: 100, mx: 1 }}
                            aria-label="Zoom"
                        />

                        <Tooltip title="Zoom In">
                            <IconButton onClick={handleZoomIn} disabled={zoom >= 3}>
                                <ZoomIn />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Button onClick={handleClose} color="secondary">
                        {t('core.button.cancel')}
                    </Button>

                    

                    <Button
                        onClick={handleCrop}
                        color="primary"
                        variant="contained"
                        disabled={!completedCrop || isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                    >
                        {t('core.button.crop')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};



