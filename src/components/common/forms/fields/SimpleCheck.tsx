// TextInput.tsx
import React from 'react';
import { Checkbox, FormControlLabel, TextFieldProps, Typography } from '@mui/material';
import { FieldProps, useField } from 'formik';
import Link from 'next/link';

const SimpleCheck: React.FC<FieldProps & TextFieldProps> = ({
  ...props
}) => {
  const [field, meta, helper] = useField(props.name);
  const { touched, error } = meta
  const helperText = touched && error;


  return (
    <FormControlLabel
      control={
        <Checkbox
          name="acceptTerms"
          checked={field.checked}
          onChange={() => helper.setValue(!field.checked)}
          color="primary"
        />
      }
      label={
        <Typography variant="body2">
          I agree to the <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>
        </Typography>
      }
      sx={{ mt: 2 }}
    />
  );
};

export default SimpleCheck;