import React, { useState } from 'react';
import { Box, InputAdornment, ListSubheader, MenuItem, Select, TextField, TextFieldProps, Typography } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { countriesCode } from '@/config/constants';
import { Error, SearchOutlined } from '@mui/icons-material';
import { extractCountryCode } from '@/lib/common/String';
import { useTranslations } from 'next-intl';

const PhoneNumberInput: React.FC<FieldProps & TextFieldProps> = ({
    ...props
}) => {
    const [field, meta, helper] = useField(props.name);
    const { touched, error } = meta
    const helperText = touched && error;
    const t = useTranslations()

    const [countryCode, setCountryCode] = useState(field.value ? extractCountryCode(field.value)?.code as string : '34');
    const [phoneNumber, setPhoneNumber] = useState(field.value ? extractCountryCode(field.value)?.phone?.replace(/^\+\d+\s?/, '') : '');

    const [codeFiltered, setCodeFiltered] = useState(countriesCode)
    const [searchText, setSearchText] = useState('')



    const handlePhoneChange = (event: any) => {
        const number = event.target.value?.replace(/\D/g, ''); // Remove non-digits
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
                    endAdornment: helperText && <InputAdornment position="end"><Error color='error' /></InputAdornment>,
                    startAdornment: <InputAdornment position="start">

                        <Select
                            value={countryCode}
                          
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
                                    right: -2
                                }
                            }}
                            MenuProps={{
                                autoFocus: false,

                                PaperProps: {
                                    sx: {
                                        height: 300
                                    }
                                }
                            }}
                            renderValue={(selected) => '+' + selected}

                        >
                            
                            <ListSubheader sx={{ pb: 2 ,pt:2}}>
                                <TextField autoFocus
                                    placeholder={t("core.label.search")}
                                    value={searchText}
                                    onChange={(event) => {
                                        setSearchText(event.target.value)
                                        setCodeFiltered(countriesCode.filter(e => e.name?.toLowerCase().includes(event.target.value?.toLowerCase())))
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key !== 'Escape') {
                                            e.stopPropagation();
                                        }
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: <SearchOutlined sx={{ mr: 1 }} />,
                                        },
                                    }}
                                    sx={{ height: 40 }}
                                />
                            </ListSubheader>
                        
                                {codeFiltered.sort((a, b) => a.name.localeCompare(b.name)).map((country, i) => (
                                    <MenuItem key={i} value={country.dialCode} sx={{ height: 40 }} onClick={() => {
                                        setCountryCode(country.dialCode);
                                        triggerOnChange(country.dialCode, phoneNumber);
                                        setSearchText('')
                                        setCodeFiltered(countriesCode)

                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {/** <Image
                                                src={`https://flagpedia.net/data/flags/icon/72x54/${country.flag.toLowerCase()}.png`}
                                                width={40}
                                                height={40 * 0.75}
                                                alt={countryCode}
                                                style={{
                                                    borderRadius: '2px'
                                                }}
                                            />*/}
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