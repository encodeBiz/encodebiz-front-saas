 
import React from 'react';
import { TextFieldProps, FormHelperText, FormControl, Autocomplete, TextField } from '@mui/material';
import { FieldProps, useField } from 'formik';


 

type SelectCreatableInputProps = FieldProps & TextFieldProps & {
  options: Array<string>;
  onHandleChange: (value: any) => void

};
 
const SelectCreatableInput: React.FC<SelectCreatableInputProps> = ({
  options,
  onHandleChange,
  ...props
}) => {
  const [field, meta, helper] = useField(props.name);
  const { touched, error } = meta
  const helperText = touched && error;


  return (<FormControl required={props.required} sx={{ width: '100%', textAlign: 'left' }} >

    <Autocomplete
      value={options.find(e => e.toLowerCase() === field.value?.toLowerCase()) ?? ''}
      clearIcon={false}
      onChange={(event, newValue) => {

        helper.setValue(newValue)
        if (typeof onHandleChange == 'function') onHandleChange(newValue)
      }}
      filterOptions={(options, params) => {

        const filtered = options.filter(e => e?.toLowerCase().startsWith(params.inputValue?.toLowerCase()))

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue?.toLowerCase() === option?.toLowerCase());
        if (inputValue !== '' && !isExisting) {
          filtered.push(`Add "${inputValue}"`);
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={options as Array<string>}
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
            {option}
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