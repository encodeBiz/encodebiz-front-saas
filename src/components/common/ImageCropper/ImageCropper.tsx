/* eslint-disable @next/next/no-img-element */
import React, { useRef } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    CircularProgress
} from '@mui/material';
import { Close, Crop, CloudUpload } from '@mui/icons-material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useImageCropper } from './ImageCropper.controller';
import { useTranslations } from 'next-intl';
import { NumberInput } from '../forms/fields/NumberField';
import { SassButton } from '../buttons/GenericButton';

export const ImageCropper = ({ onComplete, disabled = false, isUploading, size = { w: 80, h: 80, locked: true } }: { disabled?: boolean, onComplete: (file: File) => void, isUploading: boolean, size?: { locked: boolean, w: number, h: number } }) => {
    const { scale, setScale, onImageLoad, aspect, image, crop, setCrop, open, handleClose, setCompletedCrop, handleCrop, completedCrop, isLoading, imgRef, handleFileChange } = useImageCropper(onComplete, size)
    const fileInputRef: any = useRef(null);
    const t = useTranslations()

    return (
        <Box>
            <input disabled={disabled}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />

            <SassButton disabled={disabled}
                variant="contained"
                startIcon={!isUploading ? <CloudUpload /> : <CircularProgress color='inherit' size={24} />}
                onClick={() => fileInputRef.current.click()}
                style={{ width: 180, height: 55 }}
            >
                {t('core.label.uploadResourse')}
            </SassButton>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Crop sx={{ mr: 1 }} />
                        <Typography variant="body2">{t('core.label.cropImage')} {crop && <>({Math.floor(crop?.width)}x{Math.floor(crop?.height)}){crop?.unit}</>}</Typography>
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
                                onChange={(cropPixel) => setCrop(cropPixel)}
                                onComplete={(cropPixel) => setCompletedCrop(cropPixel)}
                                aspect={aspect}
                                locked={size.locked}
                                minHeight={100}

                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={image}
                                    style={{ transform: `scale(${scale})` }}
                                    onLoad={onImageLoad}
                                />

                            </ReactCrop>
                        </Box>

                    )}
                </DialogContent>

                <DialogActions>
                    <Box display="flex" alignItems="center" sx={{ mr: 2 }} gap={2}>



                        <NumberInput
                            label={'Escala'}
                            min={0}
                            max={1000}
                            step={0.1}
                            value={scale}
                            onChange={(value: number) => {
                                setScale(value);
                            }}
                        />
                        {!size.locked && <NumberInput
                            label={'Ancho'}
                            disabled={size.locked}
                            min={0}
                            max={1000}
                            step={1}
                            value={crop?.width ? Math.floor(crop?.width) : 0}
                            onChange={(value: number) => {
                                setCrop({ ...(crop as any), width: Math.floor(value) });
                            }}
                        />}

                        {!size.locked && <NumberInput
                            label={'Largo'}
                            disabled={size.locked}
                            min={0}
                            max={1000}
                            step={1}
                            value={crop?.height ? Math.floor(crop?.height) : 0}
                            onChange={(value: number) => {
                                setCrop({ ...(crop as any), height: Math.floor(value) });
                            }}
                        />}
                    </Box>



                    <SassButton
                        onClick={handleCrop}
                        color="primary"
                        variant="contained"
                        disabled={!completedCrop || isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                    >
                        {t('core.button.crop')}
                    </SassButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};



