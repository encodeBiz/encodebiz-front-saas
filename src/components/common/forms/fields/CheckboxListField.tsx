// CheckboxListField.tsx
import React from 'react';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Radio,
} from '@mui/material';
import { useField } from 'formik';

interface CheckboxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface CheckboxListFieldProps {
  name: string;
  label: string;
  options: CheckboxOption[];
  row?: boolean;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
}

export const CheckboxListField: React.FC<CheckboxListFieldProps> = ({
  name,
  label,
  options,
  row = false,
  disabled = false,
  required = false,
  helperText,
}) => {
  const [field, meta, helpers] = useField<string | boolean | number>(name);

  const handleChange = (optionValue: string | number) => {

    helpers.setValue(optionValue);
    helpers.setTouched(true);
  };


 


  return (
    <FormControl
      component="fieldset"
      error={meta.touched && !!meta.error}
      disabled={disabled}
      required={required}
      fullWidth
    >
      {label && <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </FormLabel>}



      <FormGroup row={row}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Radio
                checked={field.value === option.value}
                onChange={() => handleChange(option.value)}
                value={option.value}
                disabled={option.disabled || disabled}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>

      {(meta.touched && meta.error) && (
        <FormHelperText error>{meta.error}</FormHelperText>
      )}

      {helperText && !meta.error && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
