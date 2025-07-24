import React, { useState, useRef, useCallback } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Slider,
    TextField,
    Grid,
    useTheme
} from '@mui/material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useStyles } from './ImageCropper.style';
import { CloudUpload, Crop, Save } from '@mui/icons-material';
import Image from 'next/image';


const ImageCropper = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [image, setImage] = useState<string>();
    const [crop, setCrop] = useState<any>({ aspect: 1 / 1 });
    const [completedCrop, setCompletedCrop] = useState<string>();
    const [croppedImage, setCroppedImage] = useState<string>();
    const [zoom, setZoom] = useState(1);
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(300);
    const [loading, setLoading] = useState(false);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);

    const onSelectFile = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop({ aspect: 1 / 1 }); // Reset crop when new image is selected
            const reader: FileReader = new FileReader();
            reader.addEventListener('load', () => setImage(reader.result as string));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onLoad = useCallback((img: any) => {
        imgRef.current = img;
    }, []);

    const handleCropComplete = (crop: any) => {
        setCompletedCrop(crop);
    };

    const generateCroppedImage = () => {
        if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
            return;
        }
        setLoading(true);
        const image: any = imgRef.current;
        const canvas: any = previewCanvasRef.current;
        const crop: any = completedCrop;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            width,
            height
        );

        // Convert canvas to blob and then to URL
        canvas.toBlob(
            (blob: Blob) => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }
                const croppedImageUrl: string = URL.createObjectURL(blob);
                setCroppedImage(croppedImageUrl);
                setLoading(false);
            },
            'image/jpeg',
            0.9
        );
    };

    const handleDownload = () => {
        if (!croppedImage) return;
        const link = document.createElement('a');
        link.download = 'cropped-image.jpg';
        link.href = croppedImage;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resetCropper = () => {
        setImage('');
        setCroppedImage('');
        setCrop({ aspect: 1 / 1 });
        setCompletedCrop('');
        setZoom(1);
    };

    return (
        <Box sx={classes.root}>
            <Typography variant="h4" gutterBottom>
                Image Cropper
            </Typography>

            {!image ? (
                <>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-image"
                        type="file"
                        onChange={onSelectFile}
                    />
                    <label htmlFor="upload-image">
                        <Paper sx={classes.uploadContainer}>
                            <CloudUpload fontSize="large" />
                            <Typography variant="h6">Upload Image</Typography>
                            <Typography variant="body2">
                                Click to select an image file from your device
                            </Typography>
                        </Paper>
                    </label>
                </>
            ) : (
                <>
                    {!croppedImage ? (
                        <>
                            <Box sx={classes.cropContainer}>
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={handleCropComplete}
                                    
                                    style={{ maxHeight: '100%' }}

                                >
                                    <img src={image} />
                                </ReactCrop>
                            </Box>

                            <Box sx={classes.controls}>
                                <Typography gutterBottom>Zoom</Typography>
                                <Slider
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e, newValue) => setZoom(newValue)}
                                    sx={classes.slider}
                                />

                                <Grid container spacing={2} sx={classes.dimensionInputs}>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField
                                            label="Width (px)"
                                            type="number"
                                            value={width}
                                            onChange={(e) => setWidth(Number(e.target.value))}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField
                                            label="Height (px)"
                                            type="number"
                                            value={height}
                                            onChange={(e) => setHeight(Number(e.target.value))}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>

                                <Box mt={2} display="flex" justifyContent="space-between">
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={resetCropper}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Crop />}
                                        onClick={generateCroppedImage}
                                        disabled={!completedCrop || loading}
                                    >
                                        {loading ? 'Processing...' : 'Crop Image'}
                                    </Button>
                                </Box>
                            </Box>

                            <canvas
                                ref={previewCanvasRef}
                                style={{
                                    display: 'none',
                                    width: width,
                                    height: height,
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Cropped Image Preview
                            </Typography>
                            <Image width={200} height={200}
                                src={croppedImage}
                                alt="Cropped preview"
                                className={classes.previewImage as any}
                            />
                            <Box mt={2} display="flex" justifyContent="space-between" width="100%">
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={resetCropper}
                                >
                                    Start Over
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Save />}
                                    onClick={handleDownload}
                                >
                                    Download Image
                                </Button>
                            </Box>
                        </>
                    )}
                </>
            )}
        </Box>
    );
};

export default ImageCropper;