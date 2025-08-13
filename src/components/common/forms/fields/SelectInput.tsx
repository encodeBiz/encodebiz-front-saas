// SelectInput.tsx
import React from 'react';
import { TextFieldProps, MenuItem, Select, FormHelperText, FormControl, InputLabel } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { createSlug } from '@/lib/common/String';

type SelectInputProps = FieldProps & TextFieldProps & {
  options: Array<{ value: any; label: string }>;
};

const SelectInput: React.FC<SelectInputProps> = ({
  options,
  onChange,
  ...props
}) => {
  const [field, meta, helper] = useField(props.name);
  const { touched, error } = meta
  const helperText = touched && error;



  return (<FormControl required sx={{ width: '100%' }}>

    <InputLabel id="demo-simple-select-required-label">{props.label}</InputLabel>
    <Select
      disabled={props.disabled}
      label={props.label}
      error={!!error}
      value={field.value}
      key={createSlug(field?.value ?? '')}
      onChange={(e: any) => {

        if (typeof onChange === 'function') onChange(e.target.value)
        helper.setValue(e.target.value)
      }}
    >
      {options.map((option, index) => (
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