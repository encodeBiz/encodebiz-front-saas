// TextInput.tsx
import React from 'react';
import { FormControlLabel, FormHelperText, TextFieldProps } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { TimePicker  } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useFormStatus } from '@/hooks/useFormStatus';
import { useAppLocale } from '@/hooks/useAppLocale';


import { esES } from '@mui/x-date-pickers/locales';
import { enUS } from '@mui/x-date-pickers/locales';


const TimeInput: React.FC<FieldProps & TextFieldProps> = ({
  ...props
}) => {
  const [field, meta, helper] = useField(props.name as any);
  const { touched, error } = meta
  const helperText = touched && error;
  const { formStatus } = useFormStatus()
      const {currentLocale} = useAppLocale()
  
    return (<LocalizationProvider dateAdapter={AdapterDayjs} localeText={currentLocale == 'es' ? esES.components.MuiLocalizationProvider.defaultProps.localeText : enUS.components.MuiLocalizationProvider.defaultProps.localeText}>
    <FormControlLabel
      control={
        <TimePicker label={props.label} localeText={currentLocale == 'es' ? esES.components.MuiLocalizationProvider.defaultProps.localeText : enUS.components.MuiLocalizationProvider.defaultProps.localeText}
          //minTime={dayjs(props.name === 'endTime' ? new Date(formStatus?.values?.startTime) ?? new Date() : new Date())}
          defaultValue={field.value?dayjs(field.value ?? new Date()):null}
          value={field.value?dayjs(field.value ?? new Date()):null}
          onChange={(e) => helper.setValue(e)}
          disabled={props.disabled || ((props.name === 'endTime' || props.name === 'startTime') && !formStatus?.values?.enableDayTimeRange)}
          sx={{ width: '100%' }}
        />
      }
      label={''}
      sx={{ ml: 0, width: '100%' }}
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

export default TimeInput;