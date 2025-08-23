import React from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import { InputAdornment, Popover, TextField, TextFieldProps } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { PaletteRounded } from '@mui/icons-material';



const ColorPickerInput: React.FC<FieldProps & TextFieldProps> = ({
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
                            <InputAdornment position="start" sx={{ textAlign:'center',height: 40, width: 40, background: field && field.value ? field.value : '#ffffff' }}>
                                <PaletteRounded sx={{
                                    color: '#ffffff',
                                    m:'auto'
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
                <SketchPicker color={field && field.value ? field.value : '#ffffff'} onChange={(color: ColorResult) => {
                    helper.setValue(color.hex)
                }} />

            </Popover>

        </>

    );
};

export default ColorPickerInput;