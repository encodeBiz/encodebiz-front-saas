/* eslint-disable react-hooks/exhaustive-deps */
// AddressInput.tsx
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
import { CheckCircleOutline } from "@mui/icons-material";
import { fetchIndex } from "@/services/common/helper.service";
import { useTranslations } from "next-intl";
import { useEntity } from "@/hooks/useEntity";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { useDebouncedCallback } from "../../forms/customHooks/useDebounce";

type Option = { id: string; label: string; data: ISearchIndex };

interface SearchIndexInputProps {
  value: any,
  type: "entities" | "users" | "events" | "staff" | "holder",
  label?: any,
  onChange: (value: any) => void,
}

const  SearchIndexFilter: React.FC<SearchIndexInputProps> = ({ onChange, value, label, type }) => {
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
            label: e.id,
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

    if (typeof onChange === "function" && newOption?.data) {
      onChange(newOption?.data);
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

            slotProps={{
              input: {
                ...params.InputProps,
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
            <ListItemText key={option.id} primary={option.label} />
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
