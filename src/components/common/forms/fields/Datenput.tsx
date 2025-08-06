// TextInput.tsx
import React from 'react';
import { FormControlLabel, FormHelperText, TextFieldProps } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
const DateInput: React.FC<FieldProps & TextFieldProps> = ({
  ...props
}) => {
  const [field, meta, helper] = useField(props.name);
  const { touched, error } = meta
  const helperText = touched && error; 

  return (<LocalizationProvider dateAdapter={AdapterDayjs}>
    <FormControlLabel   
      control={
        <DateTimePicker  label={props.label}
  
          defaultValue={dayjs(field.value ?? new Date())}
          value={dayjs(field.value ?? new Date())}
          onChange={(e) => helper.setValue(e)}
          disabled={props.disabled}
          sx={{width:'100%'}}
        />
      }
      label={''}
      sx={{ ml:0, width:'100%' }}
    />

    {helperText && !!error && <FormHelperText sx={{
      ml: 2,
      color: error ? 'error.main' : 'text.secondary'
    }}>
      {error}
    </FormHelperText>}
  </LocalizationProvider>
  );
};

export default DateInput;