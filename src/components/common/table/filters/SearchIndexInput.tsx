
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
} from "@mui/material";
import { CheckCircleOutline, SearchOutlined } from "@mui/icons-material";
import { fetchIndex } from "@/services/core/helper.service";
import { useTranslations } from "next-intl";
import { useEntity } from "@/hooks/useEntity";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { useDebouncedCallback } from "../../forms/customHooks/useDebounce";

type Option = { id: string; label: string; data: ISearchIndex };

interface SearchIndexInputProps {
  type: "entities" | "users" | "events" | "staff" | "holder",
  label?: any,
  onChange: (value: any) => void,
}

const getDataLabel = (data: ISearchIndex, type: "entities" | "users" | "events" | "staff" | "holder") => {
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

    default:
      return data.id
      break;
  }
}


const SearchIndexFilter: React.FC<SearchIndexInputProps> = ({ onChange, label, type }) => {
  const t = useTranslations();
  const { currentEntity } = useEntity()

  const [pending, setPending] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option | null>(null);

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
          keyword: query, type, entityId: currentEntity?.entity?.id as string
        });
         
        setOptions(
          data.map((e: any) => ({
            id: `${e.id}`,
            label: getDataLabel(e, type) ?? '',
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



  const handleChange = (_: any, newOption: Option | null) => {
    setSelected(newOption);
    setOptions([])
    debouncedSearch?.cancel?.();

    if (typeof onChange === "function") {
      if (newOption?.data)
        onChange(newOption?.data);
      else onChange(null);
    }
  };

  const handleInputChange = (_: any, newInput: string) => {
    setInputValue(newInput ?? "");

    debouncedSearch(newInput);
  };
  return (
    <FormControl sx={{ width: "100%", textAlign: "left" }}>

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
            label={label}
            placeholder={t("core.label.search")}
            sx={{

              height: 46,
              '& .MuiOutlinedInput-root': {
                transition: 'width 0.3s ease',
                width: '200px',
                height: 46,
                '&.Mui-focused': {
                  width: '300px',
                },
              },

            }}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: <SearchOutlined sx={{ mr: 1 }} />,
                endAdornment: <React.Fragment>
                  {pending ? <CircularProgress color="inherit" size={20} /> : null}
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
            {type === 'events' && <ListItemText key={option?.id} primary={option?.data?.fields['name']} />}
            {type !== 'events' && <ListItemText key={option.id} primary={option.label} />}
          </ListItem>
        )}
        sx={{
          "& .MuiAutocomplete-inputRoot": { padding: "8px" },
        }}
      />
    </FormControl>
  );
};

export default SearchIndexFilter;
