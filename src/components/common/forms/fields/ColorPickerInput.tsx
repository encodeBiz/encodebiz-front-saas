import React, { ChangeEvent, useState } from 'react';
import { ColorChangeHandler, ColorResult, SketchPicker, TwitterPicker } from 'react-color';
import { Box, Button, FormControl, FormHelperText, InputAdornment, InputLabel, Popover, TextField, TextFieldProps } from '@mui/material';
import { FieldProps, useField, useFormikContext } from 'formik';
import { AccountCircle, PaletteRounded } from '@mui/icons-material';



const ColorPickerInput: React.FC<FieldProps & TextFieldProps> = ({
    onChange,
    ...props
}) => {
    const [field, meta, helper] = useField(props.name);
    const { touched, error } = meta
    const helperText = touched && error;
    const [anchorEl, setAnchorEl] = React.useState<HTMLInputElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };





    const open = Boolean(anchorEl);

    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <TextField
                {...field}
                {...props}
                onClick={handleClick}
                value={field.value ?? ``}
                error={!!error}
                multiline={props.type === 'textarea'}
                rows={2}
                disabled={props.disabled}
                helperText={helperText as string}
                aria-readonly

                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <PaletteRounded sx={{
                                    color: field && field.value ? field.value : '#ffffff'
                                }} />
                            </InputAdornment>
                        ),
                    },
                }}

            />
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <SketchPicker color={field && field.value ? field.value : '#ffffff'} onChange={(color: ColorResult, event: ChangeEvent<HTMLInputElement>) => {
                    helper.setValue(color.hex)
                }} />

            </Popover>

        </>

    );
};

export default ColorPickerInput;