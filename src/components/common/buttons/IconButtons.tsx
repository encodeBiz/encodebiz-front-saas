// components/buttons/IconButtons.tsx
import { IconButton, IconButtonProps, styled } from '@mui/material';

export const CircleIconButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
    borderRadius: '50%',
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    '&:hover': {
        backgroundColor: theme.palette.grey[100],
    },
}));

export const FloatingActionButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));