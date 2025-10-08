//SelectMultipleInput.tsx
import React from 'react';
import { TextFieldProps, MenuItem, Select, FormHelperText, FormControl, InputLabel, Box } from '@mui/material';
import { FieldProps, useField } from 'formik';

type SelectMultipleInputProps = FieldProps & TextFieldProps & {
  options: Array<{ value: any; label: string }>;
  onHandleChange: (value: any) => void
};

const SelectMultipleInput: React.FC<SelectMultipleInputProps> = ({
  options,
  onHandleChange,
  ...props
}) => {
  const [field, meta, helper] = useField(props.name);
  const { touched, error } = meta
  const helperText = touched && error;




  return (<FormControl required sx={{ width: '100%' }}>

    <InputLabel id="demo-simple-select-required-label">{props.label}</InputLabel>
    <Select
      disabled={props.disabled}
      multiple
      label={props.label}
      error={!!helperText}
      value={[...(field.value ?? [])]}
      onChange={(e: any) => {
        const value = e.target.value
        helper.setValue([...value])
        if (typeof onHandleChange === 'function') onHandleChange(value)

      }}
      renderValue={(selected) => <Box sx={{textAlign:'start'}}>{(selected as string[]).map(id => options.find((o: any) => o.value === id)?.label ?? id).join(', ')}</Box>}

    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
    <FormHelperText>{helperText as string}</FormHelperText>
  </FormControl>
  );
};

export default SelectMultipleInput;