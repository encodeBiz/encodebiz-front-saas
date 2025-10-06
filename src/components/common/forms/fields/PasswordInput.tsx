// TextInput.tsx
import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { VisibilityOff, Visibility, Error } from '@mui/icons-material';

const PasswordInput: React.FC<FieldProps & TextFieldProps> = ({
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const { touched, error } = meta
 
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <TextField
      {...field}
      {...props}
        error={!!(touched && error)}
      helperText={touched && error as string}
      type={showPassword ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment:  <InputAdornment position="end">
            {(touched && error) && <Error color='error' />}
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