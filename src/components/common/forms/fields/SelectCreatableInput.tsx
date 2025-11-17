/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { TextFieldProps, FormHelperText, FormControl, Autocomplete, TextField, Box, IconButton } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { useTranslations } from 'next-intl';
import { CancelOutlined } from '@mui/icons-material';

type SelectCreatableInputProps = FieldProps & TextFieldProps & {
  options: Array<string>;
  onHandleChange: (value: any) => void
  onDeleteItem: (value: any) => void

};

const SelectCreatableInput: React.FC<SelectCreatableInputProps> = ({
  options,
  onHandleChange,
  onDeleteItem,
  ...props
}) => {
  const [field, meta, helper] = useField(props.name);
  const { touched, error } = meta
  const helperText = touched && error;
  const t = useTranslations()
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([...options])

  useEffect(() => {
    setItems([...options])
  }, [options.length])



  return (<FormControl required={props.required} sx={{ width: '100%', textAlign: 'left' }} >

    <Autocomplete
      value={items.find(e => e?.toLowerCase() === field.value?.toLowerCase()) ?? ''}
      clearIcon={false}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const newValue = inputValue.trim();
          helper.setValue(newValue)
          if (typeof onHandleChange == 'function') onHandleChange(newValue)
          setInputValue('');
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      onChange={(event, newValue) => {
        const valueToSet = (typeof newValue === 'string' && newValue.trim().startsWith(t('core.button.add'))) ? newValue.replace(t('core.button.add'), '').trim() : newValue
        helper.setValue(valueToSet)
        if (typeof onHandleChange == 'function') onHandleChange(valueToSet)

        if (valueToSet)
          setItems([...new Set([...items, valueToSet as string])])
      }}
      filterOptions={(options, params) => {
        const filtered = options.filter(e => e?.toLowerCase().startsWith(params.inputValue?.toLowerCase()))

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue?.toLowerCase() === option?.toLowerCase());
        if (inputValue !== '' && !isExisting) {
          filtered.push(`${inputValue}`);
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={items as Array<string>}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option) {
          return option;
        }
        // Regular option
        return option;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
              {option}

              {typeof onDeleteItem === 'function' && <IconButton onClick={(event) => {
                event.stopPropagation();
                onDeleteItem(option)
              }}><CancelOutlined /></IconButton>}
            </Box>
          </li>
        );
      }}

      freeSolo
      renderInput={(params) => (
        <TextField {...params} sx={{
          width: '100%'
        }} label={props.label} />
      )}
    />
    <FormHelperText>{helperText as string}</FormHelperText>
  </FormControl>
  );
};

export default SelectCreatableInput;