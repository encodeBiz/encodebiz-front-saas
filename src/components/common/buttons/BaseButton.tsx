
import { Button, ButtonProps, Palette, styled } from '@mui/material';
import { ReactNode } from 'react';

export type BaseButtonProps = ButtonProps & {
    children: ReactNode;
    loading?: boolean;
};

export const BaseButton = styled(Button)<ButtonProps>(({ theme, variant, color = 'primary' }) => ({

    fontWeight: 600,
    /*textTransform: 'none',*/
    padding: theme.spacing(1.5, 3),
     
    gap: 2,
    boxShadow: 'none',
    '&:hover': {
        boxShadow: 'none',
        ...(variant === 'contained' && {
            backgroundColor: color != 'primary' ? (theme.palette as Palette | any)[color].dark : theme.palette.primary.main,
        }),
    },
    '&.Mui-disabled': {
        ...(variant === 'contained' && {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.action.disabled,
        }),
    },

}));

export const GenericButton = ({
    children,
    loading = false,
    disabled = false,
    ...props
}: BaseButtonProps) => {
    return (
        <BaseButton
            disabled={disabled || loading}
            disableElevation
            {...props}
        >
            {children}
        </BaseButton>
    );
};