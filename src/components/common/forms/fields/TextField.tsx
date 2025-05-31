// TextInput.tsx
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { FieldProps } from 'formik';

const TextInput: React.FC<FieldProps & TextFieldProps> = ({
  field,
  form: { touched, errors },
  ...props
}) => {
  const error = touched[field.name] && Boolean(errors[field.name]);
  const helperText = touched[field.name] && errors[field.name];

  return (
    <TextField
      {...field}
      {...props}
      error={error}
      helperText={helperText as string}
    />
  );
};

export default TextInput;