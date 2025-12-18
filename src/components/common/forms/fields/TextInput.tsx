// TextInput.tsx
import React from 'react';
import { Box, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { Error } from '@mui/icons-material';
import { useFormStatus } from '@/hooks/useFormStatus';

const TextInput: React.FC<FieldProps & TextFieldProps & { afterTextField?: React.ReactNode }> = ({
  afterTextField,
  ...props
}) => {
  const [field, meta] = useField(props.name as string);
  const { touched, error } = meta;
  const { formStatus } = useFormStatus();
  return (
    <Box display={'flex'} justifyItems={'center'} alignItems={'center'}>
      <TextField
        {...field}
        {...props}
        value={field.value ?? ``}
        multiline={props.type === 'textarea'}
        rows={2}
        disabled={
          props.disabled ||
          (props.name === 'ratioChecklog' && formStatus?.values?.disableRatioChecklog) ||
          (props.name === 'postalCode' && (!formStatus?.values?.country || !formStatus?.values?.city))
        }
        helperText={touched && (error as string)}
        error={!!(touched && error)}
        slotProps={{
          input:
            touched && error
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Error color="error" />
                    </InputAdornment>
                  ),
                }
              : {},
        }}
      />
      {afterTextField && <Box sx={{ ml: 2, minWidth: '150px' }}>{afterTextField}</Box>}
    </Box>
  );
};

export default TextInput;
