import React, { useState } from 'react';
import { Box, InputAdornment, MenuItem, Select, TextField, TextFieldProps, Typography } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { countriesCode } from '@/config/constants';
import { Error } from '@mui/icons-material';

const PhoneNumberInput: React.FC<FieldProps & TextFieldProps> = ({
    ...props
}) => {
    const [field, meta, helper] = useField(props.name);
    const { touched, error } = meta
    const helperText = touched && error;

    const [countryCode, setCountryCode] = useState('34');
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
            error={!!helperText}
            helperText={helperText as string}

            value={formatPhoneNumber(phoneNumber)}
            onChange={handlePhoneChange}
            slotProps={{
                input: {
                    endAdornment: <InputAdornment position="end"><Error color='error' /></InputAdornment>,
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
                            renderValue={(selected) => selected}
                        >
                            {countriesCode.sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
                                <MenuItem key={country.isoCode} value={country.dialCode}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body2">{country.phoneCode} {country.name}</Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </InputAdornment>
                }
            }}
        />
    );
};

export default PhoneNumberInput;