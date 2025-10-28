// TextInput.tsx
import React from 'react';
import { Box, FormControlLabel, FormHelperText, Switch } from '@mui/material';
import { FieldProps, useField } from 'formik';


const ToggleInput: React.FC<FieldProps & { label: string, name: string, disabled: boolean, onHandleChange: (value: any) => void }> = ({
  ...props
}) => {
  const [field, meta, helpers] = useField(props.name);
  const { touched, error } = meta

  return (<Box display={'flex'} justifyItems={'center'} alignItems={'center'} >

    <FormControlLabel
      control={
        <Switch

          disabled={props.disabled}
          checked={field.value ?? false} onChange={(e) => {
            if (typeof props.onHandleChange === 'function') props.onHandleChange(e.target.checked)
            helpers.setValue(e.target.checked)
          }} name="gilad" />
      }

      label={props.label}
    />
    {touched && error && <FormHelperText sx={{
      ml: 2,
      color: error ? 'error.main' : 'text.secondary'
    }}>
      {error}
    </FormHelperText>}
  </Box>
  );
};

export default ToggleInput;