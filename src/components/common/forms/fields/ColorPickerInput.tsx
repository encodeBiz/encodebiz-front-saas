import React, { useState } from 'react';
import { TwitterPicker } from 'react-color';
import { Box } from '@mui/material';
import { FieldProps, useField, useFormikContext } from 'formik';

type ColorPickerInputProps = {
    label?: string;
};

const ColorPickerInput: React.FC<FieldProps & ColorPickerInputProps> = ({
    label,
    ...props
}) => {
    const [field, meta] = useField(props);
    const { setFieldValue } = useFormikContext();

    const [color, setColor] = useState<string>(
        field && field.value ? field.value : '#ffffff'
    );
    const defaultColorPalette = [
        '#000000', '#FFFFFF', '#808080', '#C0C0C0',
        '#FF0000', '#FF6666', '#CC0000', '#FFA500',
        '#FFFF00', '#FFD700', '#FFBF00', '#DAA520',
        '#008000', '#00FF00', '#32CD32', '#2E8B57',
        '#0000FF', '#00BFFF', '#4682B4', '#1E90FF',
        '#800080', '#BA55D3', '#9370DB', '#8A2BE2',
        '#FF69B4', '#FFB6C1', '#FFA07A', '#FAEBD7',
        '#A0522D', '#8B4513', '#DEB887', '#D2B48C',
    ];

    const handleChange = (newColor: any) => {
        const hex = newColor.hex;
        setColor(hex);
        setFieldValue(field.name, hex);
    };

    return (
        <Box sx={{ mb: 2 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        border: "solid 1px",
                        borderColor: "lightgrey",
                        borderBottom: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "35px",
                        width: "100%",
                        borderTopLeftRadius: "6px",
                        borderTopRightRadius: "6px",
                        backgroundColor: `${color}`
                    }}>{color}</div>
                <TwitterPicker
                    color={color}
                    onChangeComplete={handleChange}
                    width="100%"
                    triangle="hide"
                    colors={defaultColorPalette}
                />
            </div>
            <label
                style={{ marginLeft: "30px", fontSize: "0.75rem", color: "rgba(0, 0, 0, 0.6)" }}
            >{label}</label>
        </Box>
    );
};

export default ColorPickerInput;