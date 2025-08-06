// TextInput.tsx
import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { VisibilityOff, Visibility } from '@mui/icons-material';

const PasswordInput: React.FC<FieldProps & TextFieldProps> = ({
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const { touched, error } = meta
  const helperText = touched && error;

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <TextField
      {...field}
      {...props}
      error={!!error}
      helperText={helperText as string}
      type={showPassword ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      }}
    />
  );
};

export default PasswordInput;