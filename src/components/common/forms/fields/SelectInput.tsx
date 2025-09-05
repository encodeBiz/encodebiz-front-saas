// SelectInput.tsx
import React from 'react';
import { TextFieldProps, MenuItem, Select, FormHelperText, FormControl, InputLabel, OutlinedInput,  InputAdornment } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { createSlug } from '@/lib/common/String';
import { Error } from '@mui/icons-material';
import { useFormStatus } from '@/hooks/useFormStatus';

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



  return (<FormControl required sx={{ width: '100%', textAlign: 'left' }} >

    <InputLabel id="demo-simple-select-required-label">{props.label}</InputLabel>
    <Select
      disabled={props.disabled || (props.name ==='city' && formStatus?.values?.country)}
      label={props.label}
      error={!!error}
      value={field.value}
      key={createSlug(field?.value ?? '')}
      onChange={(e: any) => {
        if (typeof onHandleChange === 'function') onHandleChange(e.target.value)
        helper.setValue(e.target.value)
      }}

      input={
        <OutlinedInput   label={props.label}       
          endAdornment={helperText ?
            <InputAdornment sx={{ mr: 2 }} position="end"><Error color='error' /></InputAdornment>
            : undefined}
        />
      }

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