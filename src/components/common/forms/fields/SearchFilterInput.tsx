/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  Autocomplete,
  ListItem,
  ListItemIcon,
  TextField,
  ListItemText,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { CheckCircleOutline, Error, SearchOutlined } from "@mui/icons-material";
import { fetchIndex } from "@/services/core/helper.service";
import { useTranslations } from "next-intl";
import { useEntity } from "@/hooks/useEntity";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { useDebouncedCallback } from "../../forms/customHooks/useDebounce";
import { normalizarString } from "@/lib/common/String";
import { useField } from "formik";

type Option = { id: string; label: string; data: ISearchIndex };

interface SearchIndexFilterInputProps {
  typeIndex: "entities" | "users" | "events" | "staff" | "holder" | "employee" | "branch",
  label?: any,
  width?: any,
  name: string
  onChange: (value: any) => void,
}

const getDataLabel = (data: ISearchIndex, type: "entities" | "users" | "events" | "staff" | "holder" | "employee" | "branch") => {
  switch (type) {
    case "events":
      return data.fields['name']
      break;
    case "holder":
      return data.fields['fullName']
      break;
    case "staff":
      return data.fields['fullName']
      break;
    case "employee":
      return data.fields['fullName']
      break;
    case "branch":
      return data.fields['name']
      break;
    default:
      return data.id
      break;
  }
}


const SearchIndexFilterInput: React.FC<SearchIndexFilterInputProps> = ({ typeIndex = 'employee', name, label, width = '100%' }) => {
  const t = useTranslations();
  const { currentEntity } = useEntity()

  const [pending, setPending] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option | null>(null);
  const [field, meta, helpers] = useField(name);
  const [defaultValue, setDefaultValue] = useState<ISearchIndex | undefined>()
  const { touched, error } = meta
  // Debounced remote search
  const debouncedSearch = useDebouncedCallback(
    async (q: string) => {
      const query = (q ?? "").trim();


      if (!query || query == inputValue) {
        setOptions([]);
        setPending(false);
        return;
      }
      try {
        setPending(true);
        const data = await fetchIndex({
          keyword: normalizarString(query), type: typeIndex, entityId: currentEntity?.entity?.id as string
        });

        setOptions(
          data.map((e: any) => ({
            id: `${e.id}`,
            label: getDataLabel(e, typeIndex) ?? '',
            data: e,
          }))
        );
      } finally {
        setPending(false);
      }
    },
    600
    , []
  );

  useEffect(() => {
    return () => {
      debouncedSearch?.cancel?.();
    };
  }, [debouncedSearch]);

  const getModelId = (index: string) => {
    const parts = index?.split('/')
    return parts[parts.length - 1]
  }

  const handleChange = (_: any, newOption: Option | null) => {
    setSelected(newOption);
    setOptions([])
    debouncedSearch?.cancel?.();

    if (newOption?.data) {
      setDefaultValue(newOption?.data)
      helpers.setValue(getModelId(newOption?.data?.index))
    } else helpers.setValue(null)

  };

  const handleInputChange = (_: any, newInput: string) => {
    setInputValue(newInput ?? "");

    debouncedSearch(newInput);
  };
  return (
    <FormControl sx={{ width: width, textAlign: "left" }}>

      <Autocomplete<Option, false, false, false>
        options={options}
        value={selected}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt?.label ?? "")}
        isOptionEqualToValue={(opt, val) => opt.id === val.id}
        filterOptions={(x) => x} // no filtres en cliente si ya filtras en servidor
        loading={pending}
        open={options.length > 0}

        renderInput={(params) => (
          <TextField
            {...params}

            placeholder={label ? label : t("core.label.search")}
            sx={{
              width: '100%'


            }}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: <SearchOutlined sx={{ mr: 1 }} />,
                endAdornment: <React.Fragment>
                  {(touched && error) ? <InputAdornment position="end"><Error color='error' /></InputAdornment> : pending ? <CircularProgress color="inherit" size={20} /> : null}
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
            {typeIndex === 'events' && <ListItemText key={option?.id} primary={option?.data?.fields['name']} />}
            {typeIndex !== 'events' && <ListItemText key={option.id} primary={option.label} />}
          </ListItem>
        )}
        sx={{
          "& .MuiAutocomplete-inputRoot": { padding: "8px" },
        }}
      />
    </FormControl>
  );
};

export default SearchIndexFilterInput;
