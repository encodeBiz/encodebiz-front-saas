/* eslint-disable react-hooks/exhaustive-deps */
// SelectCreatableInput.tsx
import React, { useEffect } from 'react';
import { TextFieldProps, FormHelperText, FormControl, Autocomplete, createFilterOptions, TextField } from '@mui/material';
import { FieldProps, useField } from 'formik';


interface CreatableOptions {
  inputValue?: string;
  label: string;
  value?: number;
}


type SelectCreatableInputProps = FieldProps & TextFieldProps & {
  options: Array<{ value: any; label: string }>;
  onHandleChange: (value: any) => void

};
const filter = createFilterOptions<CreatableOptions>();

const SelectCreatableInput: React.FC<SelectCreatableInputProps> = ({
  options,
  onHandleChange,
  ...props
}) => {
  const [field, meta, helper] = useField(props.name);
  const { touched, error } = meta
  const helperText = touched && error;
  const [value, setValue] = React.useState<CreatableOptions | null>(field.value);


  useEffect(() => {
    if (value !== field.value) {
      helper.setValue(value)
      if (typeof onHandleChange == 'function') onHandleChange(value)
    } 
  }, [value])




  return (<FormControl required={props.required} sx={{ width: '100%', textAlign: 'left' }} >

    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            label: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            label: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.label);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            label: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={options as Array<CreatableOptions>}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.label;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.label}
          </li>
        );
      }}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label={props.label} />
      )}
    />
    <FormHelperText>{helperText as string}</FormHelperText>
  </FormControl>
  );
};

export default SelectCreatableInput;