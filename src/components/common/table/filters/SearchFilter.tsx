
"use client";
import React, { useState } from "react";
import {
  FormControl,
  Autocomplete,
  ListItem,
  ListItemIcon,
  TextField,
  ListItemText,
} from "@mui/material";
import { CheckCircleOutline, SearchOutlined } from "@mui/icons-material";
 
type Option = { label: string, value: string }

interface SearchIndexInputProps {
  label?: any,
  width?: string,
  value: any
  onChange: (value: any) => void,
  options: Array<{ label: string, value: string }>
}


const SearchFilter: React.FC<SearchIndexInputProps> = ({ onChange, options, value, label, width= "200px" }) => {
 
  const [inputValue, setInputValue] = useState<string>("");
  const [open, setOpen] = useState(false)





  const handleChange = (_: any, newOption: Option | null) => {
    if (typeof onChange === "function") {
      if (newOption?.value)
        onChange(newOption.value);
      else onChange(null);
    }

    setOpen(false)
  };

  const handleInputChange = (_: any, newInput: string) => {
    setInputValue(newInput ?? "");
  };
  return (
    <FormControl sx={{ width, textAlign: "left" }}>

      <Autocomplete
        options={options}
        value={options.find(e => e.value === value) ?? null}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt?.label ?? "")}
        //isOptionEqualToValue={(opt, val) => opt.value === val.value}
        autoHighlight
        onClose={() => setOpen(false)}
        open={open}
        renderInput={(params) => (
          <TextField
            {...params}
            onClick={() => setOpen(true)}
            placeholder={label}
            sx={{

              height: 46,
              '& .MuiOutlinedInput-root': {
                transition: 'width 0.3s ease',
                width: width,
                height: 46,
                
              },

            }}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: <SearchOutlined sx={{ mr: 1 }} />,
              },
            }}

          />
        )}

        renderOption={(liProps, option, { selected }) => (
          <ListItem {...liProps} key={option.value}>
            {selected && (
              <ListItemIcon>
                <CheckCircleOutline />
              </ListItemIcon>
            )}
            <ListItemText key={option.value} primary={option.label} />
          </ListItem>
        )}
        sx={{
          "& .MuiAutocomplete-inputRoot": { padding: "8px" },
        }}
      />
    </FormControl>
  );
};

export default SearchFilter;
