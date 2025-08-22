// components/buttons/index.ts
import { BaseButtonProps, GenericButton } from './BaseButton';
import { CircularProgress } from '@mui/material';


export const SassButton = (props: BaseButtonProps) => (
    <GenericButton
        {...props}
        sx={{
            borderRadius: 100,
            ...props.sx
        }}
    />
);

export const PrimaryButton = (props: BaseButtonProps) => (
    <GenericButton variant="contained" color="primary" {...props} />
);

export const SecondaryButton = (props: BaseButtonProps) => (
    <GenericButton variant="outlined" color="secondary" {...props} />
);

export const TextButton = (props: BaseButtonProps) => (
    <GenericButton variant="text" color="inherit" {...props} />
);

export const DangerButton = (props: BaseButtonProps) => (
    <GenericButton
        variant="contained"
        sx={{
            backgroundColor: 'error.main',
            '&:hover': { backgroundColor: 'error.dark' },
        }}
        {...props}
    />
);

export const LoadingButton = ({ loading, children, ...props }: BaseButtonProps) => (
    <GenericButton
        disabled={loading}
        endIcon={loading && <CircularProgress size={20} color="inherit" />}
        {...props}
    >
        {children}
    </GenericButton>
);