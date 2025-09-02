// AutoCompletedInput.tsx
import React, { useState } from 'react';
import { TextFieldProps, FormHelperText, FormControl, Autocomplete, ListItem, ListItemIcon, TextField, ListItemText } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { CheckCircleOutline } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { fetchLocation } from '@/services/common/helper.service';
import { useFormStatus } from '@/hooks/useFormStatus';
import { country } from '@/config/country';
import { useTranslations } from 'next-intl';

type AutoCompletedInputProps = FieldProps & TextFieldProps & {
  //options: Array<{ value: any; label: string }>;
  onHandleChange: (value: any) => void

};
let resource
const AddressInput: React.FC<AutoCompletedInputProps> = ({

  onHandleChange,
  ...props
}) => {
  const { token } = useAuth()
  const t = useTranslations()

  const [field, meta, helper] = useField(props.name);
  const { touched, error } = meta
  const helperText = touched && error;
  const { formStatus } = useFormStatus()
  const [pending, setPending] = useState(false)
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<Array<{ id: string, label: string, data: any }>>([])

  const handleChange = (event: any, newValue: any) => {
    helper.setValue(newValue)
    onHandleChange(newValue)
  };

  const handleInputChange = (event: any, newInputValue: any) => {

    let countryCode = 'ES'
    if (formStatus?.values?.country)
      countryCode = country.find(e => e.name === formStatus?.values?.country)?.code2 ?? 'ES'


    setInputValue(newInputValue === 'undefined' ? '' : newInputValue);
    if (resource) clearTimeout(resource)
    setPending(true)
    setTimeout(() => {
      fetchLocation({ address: newInputValue.toLowerCase(), country: countryCode }, token).then(data => {
        setOptions(data.map(e => ({ id: `${e.lng}${e.lat}`, label: e.resolvedText, data: e })))
        setPending(false)
      })
    }, 2000);
  };







  return (<FormControl required sx={{ width: '100%', textAlign: 'left' }} >
   
    <Autocomplete
      id="tech-autocomplete"
      options={options}
      value={field.value}
      loading={pending}
      onChange={handleChange}
      inputValue={inputValue ?? ''}
      onInputChange={handleInputChange}
      disableCloseOnSelect
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option, { selected }) => (
        <ListItem {...props} key={option.id}>
          {selected && <ListItemIcon><CheckCircleOutline /></ListItemIcon>}
          <ListItemText
            primary={option.label}

          />
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          placeholder={t('core.label.typingAddress')}
        />
      )}

      sx={{
        '& .MuiAutocomplete-inputRoot': {
          padding: '8px',
        }
      }}
    />


    <FormHelperText>{helperText as string}</FormHelperText>
  </FormControl>
  );
};

export default AddressInput;