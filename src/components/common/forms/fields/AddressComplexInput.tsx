/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// AddressInput.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  TextFieldProps,
  FormHelperText,
  FormControl,
  InputAdornment,
  Box,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Autocomplete,
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Typography,
} from "@mui/material";
import { FieldProps, useField } from "formik";
import { CheckCircleOutline, Error } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { useFormStatus } from "@/hooks/useFormStatus";
import { country } from "@/config/country";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "../customHooks/useDebounce";
import { fetchLocation, IGeoAutoCompleteOutput, IGeoDetailOutput, IGeoInputAutoComplete, IGeoInputAutoDetail } from "@/services/core/helper.service";
import { useAppLocale } from "@/hooks/useAppLocale";
import { uuidv4 } from "@/lib/common/String";

type Option = { id: string; label: string; data: any, autocompleteData: IGeoAutoCompleteOutput };

type AutoCompletedInputProps = FieldProps &
  TextFieldProps & {
    onHandleChange: (value: any) => void;
  };


const AddressComplexInput: React.FC<AutoCompletedInputProps> = ({ ...props }) => {
  const t = useTranslations();
  const [field, meta, helper] = useField(props.name);

  const { formStatus } = useFormStatus();
  const [cityList, setCityList] = useState<Array<{ label: string, value: string }>>(country.find((e: any) => e.name === field.value?.country)?.states?.map(e => ({ label: e.name, value: e.name })) ?? [])
  const { currentLocale } = useAppLocale();

  const countryField = useField(`${props.name}.country`);
  const cityField = useField(`${props.name}.city`);
  const postalCodeField = useField(`${props.name}.postalCode`);
  const streetField = useField(`${props.name}.street`);
  const [sessionToken, setSessionToken] = useState(uuidv4())

  const { token } = useAuth();

  const [pending, setPending] = useState(false);
  const [inputValue, setInputValue] = useState<string>(field.value ?? "");
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option | null>(null);
  const [countryCode, setCountryCode] = useState("ES");

  useEffect(() => {
    setCityList(country.find((e: any) => e.name === formStatus?.values?.address?.country)?.states?.map(e => ({ label: e.name, value: e.name })) ?? [])
  }, [formStatus?.values?.address?.country])



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
        const data: Array<IGeoAutoCompleteOutput> = (await fetchLocation({ address: query.toLowerCase(), country: code, sessionToken, action: 'autocomplete' } as IGeoInputAutoComplete, token, currentLocale)) as Array<IGeoAutoCompleteOutput>;
        setOptions(
          data.map((e: any) => ({
            id: `${e.lng}${e.lat}`,
            label: e.resolvedText,
            autocompleteData: e,
            data: e
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
      setInputValue(field.value?.street ?? "");
  }, [field.value]);

  useEffect(() => {
    const code2 =
      country.find((e) => e.name === formStatus?.values?.address?.country)?.code2 ?? "ES";
    setCountryCode(code2);

    const base = (field.value?.street ?? "").trim();
    if (base) {
      setPending(true);
      debouncedSearch(base, code2);
    } else {
      setOptions([]);
    }
  }, [formStatus?.values?.address?.country]);

  const handleChange = async (_: any, newOption: Option | null) => {
    setSelected(newOption);
    setOptions([])
    debouncedSearch?.cancel?.();

    if (newOption?.autocompleteData) {
      const data: IGeoDetailOutput = (await fetchLocation({ placeId: newOption?.autocompleteData?.placeId, provider: newOption?.autocompleteData?.provider, sessionToken: newOption?.autocompleteData?.sessionToken, action: 'placedetails' } as IGeoInputAutoDetail, token, currentLocale)) as IGeoDetailOutput

      helper.setValue({
        ...(field.value ?? {}),
        street: newOption?.label,
        geo: { lat: data?.lat as number, lng: data?.lng as number },
        timeZone: data?.timeZone as string
      })

    }




  };

  const handleInputChange = (_: any, newInput: string) => {
    setInputValue(newInput ?? "");

    debouncedSearch(newInput, countryCode);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
     
      <Grid size={{
        xs: 12,
        sm: 12
      }} sx={{ width: '100%', position: 'relative', top: 10, mt: 2, mb: 1, textAlign: 'left' }}>
        <Typography variant='subtitle1' textTransform={'uppercase'}>{props.label}</Typography>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row' }}>
        <FormControl required={props.required} sx={{ width: '100%', textAlign: 'left' }} >
          <InputLabel id="demo-simple-select-required-label">{t('core.label.country')}</InputLabel>
          <Select
            name="country"
            disabled={props.disabled}
            label={t('core.label.country')}
            error={!!(countryField[1].touched && countryField[1].error)}
            value={field.value?.country || ''}
            defaultValue={field.value?.country || ''}

            onChange={(event: any) => {

              helper.setValue({
                ...(field.value ?? {}),
                country: event.target.value
              })
              setCityList(country.find((e: any) => e.name === event.target.value)?.states?.map(e => ({ label: e.name, value: e.name })) ?? [])

            }}

            input={
              <OutlinedInput label={props.label}
                endAdornment={(countryField[1].touched && countryField[1].error) ?
                  <InputAdornment sx={{ mr: 2 }} position="end"><Error color='error' /></InputAdornment>
                  : undefined}
              />
            }

          >
            {country.map(e => ({ label: e.name, value: e.name })).map((option, index) => (
              <MenuItem key={option.value + '-' + index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {countryField[1].touched && countryField[1].error && <FormHelperText>{countryField[1].error as string}</FormHelperText>}
        </FormControl>



        <FormControl required={props.required} sx={{ width: '100%', textAlign: 'left' }} >
          <InputLabel id="demo-simple-select-required-label">{t('core.label.city')}</InputLabel>
          <Select
            name="city"
            disabled={props.disabled || (!formStatus?.values?.address?.country)}
            label={t('core.label.city')}
            error={!!(cityField[1].touched && cityField[1].error)}
            value={field.value?.city || ''}
            defaultValue={field.value?.city || ''}
            onChange={(e: any) => {
              helper.setValue({
                ...(field.value ?? {}),
                city: e.target.value
              })
            }}

            input={
              <OutlinedInput label={props.label}
                endAdornment={(cityField[1].touched && cityField[1].error) ?
                  <InputAdornment sx={{ mr: 2 }} position="end"><Error color='error' /></InputAdornment>
                  : undefined}
              />
            }

          >
            {cityList.map(e => ({ label: e.label, value: e.value })).map((option, index) => (
              <MenuItem key={option.value + '-' + index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {(cityField[1].touched && cityField[1].error) && <FormHelperText>{cityField[1].error as string}</FormHelperText>}
        </FormControl>
      </Box>


      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row' }}>
        <TextField
          label={t('core.label.postalCode')}
          fullWidth
          name="postalCode"
          value={formStatus?.values?.address?.postalCode ?? ``}
          onChange={(e: any) => {
            helper.setValue({
              ...(field.value ?? {}),
              postalCode: e.target.value
            })
          }}
          onFocus={() => postalCodeField[2].setTouched(true)}
          disabled={props.disabled || (!formStatus?.values?.address?.country || !formStatus?.values?.address?.city)}
          helperText={postalCodeField[1].touched && postalCodeField[1].error}
          error={!!(postalCodeField[1].touched && postalCodeField[1].error)}
          slotProps={{
            input: postalCodeField[1].touched && postalCodeField[1].error ? {
              endAdornment: <InputAdornment position="end"><Error color='error' /></InputAdornment>,
            } : {},
          }}

        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row' }}>

        <FormControl required={props.required} sx={{ width: "100%", textAlign: "left" }}>

          <Autocomplete<Option, false, false, false>
            options={options}
            disabled={props.disabled || !formStatus?.values?.address?.country || !formStatus?.values?.address?.city}
            value={selected}
            inputValue={inputValue !== '' ? inputValue : field.value?.street ?? ""}
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
                label={t("core.label.address")}
                placeholder={t("core.label.typingAddress")}
                error={!!(streetField[1].touched && streetField[1].error)}
                helperText={streetField[1].touched && streetField[1].error}
                onFocus={() => setSessionToken(uuidv4())}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: <React.Fragment>
                      {pending ? <CircularProgress color="inherit" size={20} /> : null}
                      {(streetField[1].touched && streetField[1].error) ? <InputAdornment position="end"><Error color='error' /></InputAdornment> : null}
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

          {streetField[1].touched && streetField[1].error && <FormHelperText sx={{
            ml: 2,
            color: streetField[1].error ? 'error.main' : 'text.secondary'
          }}>
            {streetField[1].error}
          </FormHelperText>}    </FormControl>

      </Box>
    </Box>

  );
};

export default AddressComplexInput;
