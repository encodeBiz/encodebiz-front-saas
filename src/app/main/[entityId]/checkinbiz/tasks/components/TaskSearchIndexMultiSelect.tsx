"use client";

import { ISearchIndex } from "@/domain/core/SearchIndex";
import { normalizarString } from "@/lib/common/String";
import { fetchIndex } from "@/services/core/helper.service";
import { SearchOutlined } from "@mui/icons-material";
import { Autocomplete, Chip, CircularProgress, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useEntity } from "@/hooks/useEntity";
import { useDebouncedCallback } from "@/components/common/forms/customHooks/useDebounce";

type SearchIndexType = "employee" | "branch";
export type TaskSearchOption = { id: string; label: string; data?: ISearchIndex };

const getIndexId = (value: ISearchIndex) => value?.index?.split("/").pop() ?? value?.id ?? "";
const getIndexLabel = (value: ISearchIndex, type: SearchIndexType) => {
  const labelField = type === "branch" ? "name" : "fullName";
  return String(value.fields?.[labelField] ?? value.fields?.fullName ?? value.fields?.name ?? getIndexId(value));
};
const dedupeOptions = (items: TaskSearchOption[]) => Array.from(new Map(items.map((item) => [item.id, item])).values());

export default function TaskSearchIndexMultiSelect({
  type,
  label,
  value,
  onChange,
}: {
  type: SearchIndexType;
  label: string;
  value: TaskSearchOption[];
  onChange: (value: TaskSearchOption[]) => void;
}) {
  const t = useTranslations();
  const { currentEntity } = useEntity();
  const [pending, setPending] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<TaskSearchOption[]>([]);

  const debouncedSearch = useDebouncedCallback(
    async (q: string) => {
      const query = (q ?? "").trim();
      if (!query) {
        setOptions([]);
        setPending(false);
        return;
      }
      try {
        setPending(true);
        const data = await fetchIndex({
          keyword: normalizarString(query),
          type,
          entityId: currentEntity?.entity?.id as string,
        });
        setOptions(
          dedupeOptions(
            data.map((item: ISearchIndex) => ({
              id: getIndexId(item),
              label: getIndexLabel(item, type),
              data: item,
            }))
          )
        );
      } finally {
        setPending(false);
      }
    },
    600,
    []
  );

  useEffect(() => {
    return () => debouncedSearch?.cancel?.();
  }, [debouncedSearch]);

  return (
    <Autocomplete<TaskSearchOption, true, false, false>
      multiple
      fullWidth
      options={options}
      value={value}
      inputValue={inputValue}
      onInputChange={(_, nextInput) => {
        setInputValue(nextInput ?? "");
        debouncedSearch(nextInput);
      }}
      onChange={(_, nextValue) => {
        onChange(nextValue);
        setOptions([]);
        setInputValue("");
        debouncedSearch?.cancel?.();
      }}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      filterOptions={(x) => x}
      loading={pending}
      open={options.length > 0}
      noOptionsText={t("core.label.noOptionsText")}
      renderTags={(selected, getTagProps) =>
        selected.map((option, index) => {
          const tagProps = { ...getTagProps({ index }) } as Record<string, any>;
          delete tagProps.key;
          return <Chip key={option.id} label={option.label} {...tagProps} />;
        })
      }
      renderOption={(props, option) => {
        const optionProps = { ...props } as Record<string, any>;
        delete optionProps.key;
        return (
          <li {...optionProps} key={option.id}>
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={value.length === 0 ? label : ""}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <>
                  <SearchOutlined sx={{ mr: 1 }} />
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {pending ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
