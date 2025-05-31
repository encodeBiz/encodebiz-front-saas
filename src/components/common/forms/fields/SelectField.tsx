// SelectInput.tsx
import React from 'react';
import { TextField, TextFieldProps, MenuItem } from '@mui/material';
import { FieldProps } from 'formik';

type SelectInputProps = FieldProps & TextFieldProps & {
  options: Array<{ value: any; label: string }>;
};

const SelectInput: React.FC<SelectInputProps> = ({
  field,
  form: { touched, errors },
  options,
  ...props
}) => {
  const error = touched[field.name] && Boolean(errors[field.name]);
  const helperText = touched[field.name] && errors[field.name];

  return (
    <TextField
      {...field}
      {...props}
      select
      error={error}
      helperText={helperText as string}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectInput;