import React, { useState } from 'react';
import { Box, InputAdornment, MenuItem, Select, TextField, TextFieldProps, Typography } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { countries } from '@/config/constants';

const PhoneNumberInput: React.FC<FieldProps & TextFieldProps> = ({
    ...props
}) => {
    const [field, meta, helper] = useField(props.name);
    const { touched, error } = meta
    const helperText = touched && error;

    const [countryCode, setCountryCode] = useState('+34');
    const [phoneNumber, setPhoneNumber] = useState(field.value.replace(/^\+\d+\s?/, ''));

    const handleCountryChange = (event: any) => {
        setCountryCode(event.target.value);
        triggerOnChange(event.target.value, phoneNumber);
    };

    const handlePhoneChange = (event: any) => {
        const number = event.target.value.replace(/\D/g, ''); // Remove non-digits
        setPhoneNumber(number);
        triggerOnChange(countryCode, number);
    };

    const triggerOnChange = (code: string, number: number) => {
        helper.setValue(`${code}${number}`)
    };

    const formatPhoneNumber = (number: any) => {
        if (!number) return '';
        // Format as (XXX) XXX-XXXX for US numbers
        if (countryCode === '+1' && number.length <= 10) {
            const areaCode = number.slice(0, 3);
            const middle = number.slice(3, 6);
            const last = number.slice(6, 10);
            return `(${areaCode}) ${middle}${last ? '-' + last : ''}`;
        }
        return number;
    };


    return (
        <TextField
            {...field}
            {...props}
            error={!!error}
            helperText={helperText as string}

            value={formatPhoneNumber(phoneNumber)}
            onChange={handlePhoneChange}
            slotProps={{
                input: {
                    startAdornment: <InputAdornment position="start">
                        <Select
                            value={countryCode}
                            onChange={handleCountryChange}
                            variant="standard"
                            sx={{
                                '& .MuiSelect-select': {
                                    paddingRight: '24px !important',
                                    paddingLeft: '8px'
                                },
                                '&:before, &:after': {
                                    borderBottom: 'none !important'
                                },
                                '& .MuiSelect-icon': {
                                    right: 0
                                }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        maxHeight: 300
                                    }
                                }
                            }}
                        >
                            {countries.map((country) => (
                                <MenuItem key={country.code} value={country.dial_code}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                            alt={country.name}
                                            style={{ marginRight: 8, width: 20 }}
                                        />
                                        <Typography variant="body2">{country.dial_code}</Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </InputAdornment>
                }
            }}
            inputProps={{
                inputMode: 'tel',
                maxLength: countryCode === '+1' ? 14 : 20 // Adjust for formatting
            }}
        />
    );
};

export default PhoneNumberInput;