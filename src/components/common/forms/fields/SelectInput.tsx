/* eslint-disable react-hooks/exhaustive-deps */
// SelectInput.tsx
import React, { useEffect, useState } from 'react';
import { TextFieldProps, MenuItem, Select, FormHelperText, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { createSlug } from '@/lib/common/String';
import { Error } from '@mui/icons-material';
import { useFormStatus } from '@/hooks/useFormStatus';
import { country } from '@/config/country';

type SelectInputProps = FieldProps & TextFieldProps & {
  options: Array<{ value: any; label: string }>;
  onHandleChange: (value: any) => void

};

const SelectInput: React.FC<SelectInputProps> = ({
  options,
  onHandleChange,
  ...props
}) => {
  const [field, meta, helper] = useField(props.name);
  const { touched, error } = meta
  const helperText = touched && error;
  const { formStatus } = useFormStatus();
  const [items, setItems] = useState<Array<{ value: any; label: string }>>([])


  useEffect(() => {
    if (props.name === 'city') {
      const countrySelected = formStatus?.values?.country
      if (countrySelected)
        setItems(country.find((e: any) => e.name === countrySelected)?.states?.map((e: any) => ({ label: e.name, value: e.name })) ?? [])
    }
  }, [formStatus?.values?.country])



  return (<FormControl required={props.required} sx={{ width: '100%', textAlign: 'left' }} >

    <InputLabel id="demo-simple-select-required-label">{props.label}</InputLabel>
    <Select
      disabled={props.disabled || (props.name === 'city' && !formStatus?.values?.country)}
      label={props.label}
      error={!!helperText}
      value={field.value ?? ''}
      defaultValue={field.value ?? ''}
      key={createSlug(field?.value ?? '')}
      onChange={(e: any) => {
        if (typeof onHandleChange === 'function') onHandleChange(e.target.value)
        helper.setValue(e.target.value)
      }}

      input={
        <OutlinedInput label={props.label}
          endAdornment={helperText ?
            <InputAdornment sx={{ mr: 2 }} position="end"><Error color='error' /></InputAdornment>
            : undefined}
        />
      }

    >
      {((props.name === 'city' ? items : options) as Array<{ value: any; label: string }>).map((option, index) => (
        <MenuItem key={option.value + '-' + index} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
    <FormHelperText>{helperText as string}</FormHelperText>
  </FormControl>
  );
};

export default SelectInput;