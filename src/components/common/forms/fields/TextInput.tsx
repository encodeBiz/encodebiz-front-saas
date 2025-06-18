// TextInput.tsx
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { FieldProps, useField } from 'formik';

const TextInput: React.FC<FieldProps & TextFieldProps> = ({
  ...props
}) => {
  const [field, meta, helper] = useField(props.name);
  const { touched, error } = meta 
  const helperText = touched && error;

  return (
    <TextField
      {...field}
      {...props}
      value={field.value ?? ``}
      error={!!error}
      disabled={props.disabled}
      helperText={helperText as string}
       
    />
  );
};

export default TextInput;