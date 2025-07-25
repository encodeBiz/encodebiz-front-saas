import React, { useState } from 'react';
import {
    TextField,
    IconButton,
    Stack,
    styled
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        paddingLeft: 0,
        paddingRight: 0,
    },
    '& input': {
        textAlign: 'center',
        padding: theme.spacing(1.5),
        width: 60
    },
}));

export const NumberInput = ({

    min = 0,
    max = 100,
    step = 1,
    value = 0,
    onChange,
    ...props
}: any) => {

    const handleIncrement = () => {
        const newValue = Math.min(Number(value) + step, max);
        if (!props.disabled)
            onChange?.(newValue);
    };

    const handleDecrement = () => {
        const newValue = Math.max(Number(value) - step, min);
        if (!props.disabled)
            onChange?.(newValue);
    };

    const handleChange = (e: any) => {
        const inputValue = e.target.value;
        if (inputValue === '') {

            return;
        }
        const numValue = Number(inputValue);
        if (!isNaN(numValue)) {
            const clampedValue = Math.min(Math.max(numValue, min), max);
            if (!props.disabled)
                onChange?.(clampedValue);
        }
    };

    const handleBlur = () => {
        if (value === '') {
            const clampedValue = Math.min(Math.max(value, min), max);

            onChange?.(clampedValue);
        }
    };

    return (

        <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
                aria-label="Decrease"
                onClick={handleDecrement}
                disabled={value <= min}
                size="small"
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '4px 0 0 4px',
                }}
            >
                <RemoveIcon fontSize="small" />
            </IconButton>

            <StyledTextField
                variant="outlined"
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                inputProps={{
                    min,
                    max,
                    step,
                    style: {
                        MozAppearance: 'textfield',
                        WebkitAppearance: 'none',
                        margin: 0,
                    },
                }}
                sx={{
                    flex: 1,
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,

                    },
                }}
                {...props}
            />

            <IconButton
                aria-label="Increase"
                onClick={handleIncrement}
                disabled={value >= max}
                size="small"
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '0 4px 4px 0',
                }}
            >
                <AddIcon fontSize="small" />
            </IconButton>
        </Stack>

    );
};
