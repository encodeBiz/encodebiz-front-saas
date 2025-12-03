import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Image from 'next/image';

interface EmptyListProps {
    /** URL o ruta de la imagen a mostrar */
    imageUrl?: string;
    /** URL o componente SVG como elemento React */
    imageComponent?: React.ReactNode;
    /** Título principal */
    title: string;
    /** Descripción o subtítulo */
    description: string;
    /** Altura máxima de la imagen */
    imageHeight?: number | string;
    /** Ancho máximo de la imagen */
    imageWidth?: number | string;
    /** Si se debe aplicar un estilo de elevación (card) */
    elevated?: boolean;
    /** Altura mínima del contenedor */
    minHeight?: number | string;
    /** Acciones adicionales (botones, enlaces, etc.) */
    actions?: React.ReactNode;
}

const EmptyList: React.FC<EmptyListProps> = ({
    imageUrl,
    imageComponent,
    title,
    description,
    imageHeight = 150,
    imageWidth = 'auto',
    elevated = false,
    minHeight = 400,
    actions,
}) => {
    const Content = () => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4,
                minHeight: minHeight,
                width: '100%',
            }}
        >
            {/* Imagen */}
            {(imageUrl || imageComponent) && (
                <Box
                    sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: imageHeight,
                        width: imageWidth,
                        '& img': {
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain',
                        },
                    }}
                >
                    {imageComponent ? (
                        imageComponent
                    ) : (
                        <Image
                            height={imageHeight as number}
                            width={imageWidth as number}
                            src={imageUrl as string}
                            alt={title}
                            style={{ height: '100%', width: '100%' }}
                        />
                    )}
                </Box>
            )}

            {/* Título */}
            <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 1,
                }}
            >
                {title}
            </Typography>

            {/* Descripción */}
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                    maxWidth: 500,
                    mb: actions ? 3 : 0,
                }}
            >
                {description}
            </Typography>

            {/* Acciones adicionales */}
            {actions && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {actions}
                </Box>
            )}
        </Box>
    );

    if (elevated) {
        return (
            <Paper
                elevation={1}
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    width: '100%',
                }}
            >
                <Content />
            </Paper>
        );
    }

    return <Content />;
};

export default EmptyList;