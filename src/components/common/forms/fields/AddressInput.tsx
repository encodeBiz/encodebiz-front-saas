/* eslint-disable react-hooks/exhaustive-deps */
// AddressInput.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  TextFieldProps,
  FormHelperText,
  FormControl,
  Autocomplete,
  ListItem,
  ListItemIcon,
  TextField,
  ListItemText,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { FieldProps, useField } from "formik";
import { CheckCircleOutline, Error } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { fetchLocation } from "@/services/common/helper.service";
import { useFormStatus } from "@/hooks/useFormStatus";
import { country } from "@/config/country";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "../customHooks/useDebounce"; // debe exponer .cancel()

type Option = { id: string; label: string; data: any };

type AutoCompletedInputProps = FieldProps &
  TextFieldProps & {
    onHandleChange: (value: any) => void;
  };

const AddressInput: React.FC<AutoCompletedInputProps> = ({ onHandleChange, ...props }) => {
  const { token } = useAuth();
  const t = useTranslations();
  const [field, meta, helper] = useField(props.name);
  const { touched, error } = meta;
  const helperText = touched && error;
  const { formStatus } = useFormStatus();

  const [pending, setPending] = useState(false);
  const [inputValue, setInputValue] = useState<string>(field.value ?? "");
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option | null>(null);
  const [countryCode, setCountryCode] = useState("ES");

  // Debounced remote search
  const debouncedSearch = useDebouncedCallback(
    async (q: string, code: string) => {
      const query = (q ?? "").trim();


      if (!query || query == inputValue) {
        setOptions([]);
        setPending(false);
        return;
      }
      try {
        setPending(true);
        const data = await fetchLocation({ address: query.toLowerCase(), country: code }, token);
        setOptions(
          data.map((e: any) => ({
            id: `${e.lng}${e.lat}`,
            label: e.resolvedText,
            data: e,
          }))
        );
      } finally {
        setPending(false);
      }
    },
    600
    , [token]
  );

  useEffect(() => {
    return () => {
      debouncedSearch?.cancel?.();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    if (field.value != '')
      setInputValue(field.value ?? "");
  }, [field.value]);

  useEffect(() => {
    const code2 =
      country.find((e) => e.name === formStatus?.values?.country)?.code2 ?? "ES";
    setCountryCode(code2);

    const base = (field.value ?? "").trim();
    if (base) {
      setPending(true);
      debouncedSearch(base, code2);
    } else {
      setOptions([]);
    }
  }, [formStatus?.values?.country]);

  const handleChange = (_: any, newOption: Option | null) => {
    setSelected(newOption);
    setOptions([])
    debouncedSearch?.cancel?.();
    helper.setValue(newOption?.label ?? "");
    if (typeof onHandleChange === "function" && newOption?.data) {
      onHandleChange({ lat: newOption.data.lat, lng: newOption.data.lng });
    }
  };

  const handleInputChange = (_: any, newInput: string) => {
    setInputValue(newInput ?? "");

    debouncedSearch(newInput, countryCode);
  };
  return (
    <FormControl required={props.required} sx={{ width: "100%", textAlign: "left" }}>

      <Autocomplete<Option, false, false, false>
        options={options}
        disabled={props.disabled || !formStatus?.values?.country || !formStatus?.values?.city}
        value={selected}
        inputValue={inputValue !== '' ? inputValue : field.value}
        onInputChange={handleInputChange}
        onChange={handleChange}
        getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt?.label ?? "")}
        isOptionEqualToValue={(opt, val) => opt.id === val.id}
        filterOptions={(x) => x} // no filtres en cliente si ya filtras en servidor
        loading={pending}
        open={options.length > 0}

        renderInput={(params) => (
          <TextField required={props.required}
            {...params}
            label={props.label}
            placeholder={t("core.label.typingAddress")}
            error={!!error}
            helperText={helperText as string}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: <React.Fragment>
                  {pending ? <CircularProgress color="inherit" size={20} /> : null}
                  {error ? <InputAdornment position="end"><Error color='error' /></InputAdornment> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>


              },
            }}

          />
        )}

        renderOption={(liProps, option, { selected }) => (
          <ListItem {...liProps} key={option.id}>
            {selected && (
              <ListItemIcon>
                <CheckCircleOutline />
              </ListItemIcon>
            )}
            <ListItemText key={option.id} primary={option.label} />
          </ListItem>
        )}
        sx={{
          "& .MuiAutocomplete-inputRoot": { padding: "8px" },
        }}
      />

      {!!error && <FormHelperText sx={{
        ml: 2,
        color: error ? 'error.main' : 'text.secondary'
      }}>
        {error}
      </FormHelperText>}    </FormControl>
  );
};

export default AddressInput;
