// TextInput.tsx
import React from 'react';
import { Box, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { Error } from '@mui/icons-material';

const TextInput: React.FC<FieldProps & TextFieldProps & { afterTextField: string }> = ({
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const { touched, error } = meta
  const helperText = touched && error;

  return (<Box display={'flex'} justifyItems={'center'} alignItems={'center'} >
    <TextField
      {...field}
      {...props}
      value={field.value ?? ``}
      error={!!error}
      multiline={props.type === 'textarea'}
      rows={2}
      disabled={props.disabled}
      helperText={helperText as string}
      
      slotProps={{
        input: helperText ? {
          endAdornment: <InputAdornment position="end"><Error color='error' /></InputAdornment>,
        } : {},
      }}

    />
    {props?.afterTextField && <Box sx={{ ml: 2, minWidth: '150px' }}>{props?.afterTextField}</Box>}
  </Box>
  );
};

export default TextInput;