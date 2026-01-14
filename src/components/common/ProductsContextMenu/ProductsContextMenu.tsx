'use client';
import React from 'react';
import {
    Menu,
    Box,
    Typography,
    Grid,
    Divider
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { SassButton } from '../buttons/GenericButton';
import passinbiz from '@/../public/assets/images/service-logo/passbiz.png'
import checkbiz from '@/../public/assets/images/service-logo/checkbiz.png'
import { useLayout } from '@/hooks/useLayout';
import { BorderBox } from '../tabs/BorderBox';
interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    accessRoute: string;
}

interface ProductsContextMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    products?: Product[];
}

const DEFAULT_PRODUCTS: Product[] = [
    {
        id: 'passinbiz',
        name: 'PassBiz',
        description: 'productsMenu.passinbiz.description',
        image: passinbiz.src,
        accessRoute: '/passinbiz/onboarding'
    },
    {
        id: 'checkinbiz',
        name: 'CheckBiz',
        description: 'productsMenu.checkinbiz.description',
        image:  checkbiz.src,
        accessRoute: '/checkinbiz/onboarding'
    }
];

export const ProductsContextMenu: React.FC<ProductsContextMenuProps> = ({
    anchorEl,
    open,
    onClose,
    products = DEFAULT_PRODUCTS
}) => {
    const { navivateTo } = useLayout();
    const t = useTranslations();

    const handleProductAccess = (route: string) => {
        navivateTo(route);
        onClose();
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            PaperProps={{
                sx: {
                    maxWidth: 450,
                    width: '100%',
                    mt: 2,
                    boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                            ? '0 8px 32px rgba(0, 0, 0, 0.5)'
                            : '0 8px 32px rgba(0, 0, 0, 0.1)',
                },
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {t('productsMenu.title')}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    {products.map((product) => (
                        <Grid key={product.id}>
                            <BorderBox
                                sx={{
                                    width:"100%",
                                    display: 'flex',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: (theme) =>
                                            theme.palette.mode === 'dark'
                                                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                                                : '0 4px 20px rgba(0, 0, 0, 0.15)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                {/* Imagen del producto */}
                                <Box
                                    sx={{
                                        width: 100,
                                       
                                        flexShrink: 0,
                                        backgroundImage: `url(${product.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {!product.image && (
                                        <Typography variant="caption" sx={{ p: 1, textAlign: 'center' }}>
                                            {t('productsMenu.noImage')}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Contenido del producto */}
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 1.5 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                        {product.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'text.secondary',
                                            mb: 1,
                                            display: '-webkit-box',
                                            overflow: 'hidden',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 2,
                                        }}
                                    >
                                        {t(product.description)}
                                    </Typography>

                                    <SassButton
                                        size="small"
                                        variant="contained"
                                        sx={{ mt: 'auto', alignSelf: 'flex-start' }}
                                        onClick={() => handleProductAccess(product.accessRoute)}
                                    >
                                        {t('productsMenu.access')}
                                    </SassButton>
                                </Box>
                            </BorderBox>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Menu>
    );
};

export default ProductsContextMenu;
