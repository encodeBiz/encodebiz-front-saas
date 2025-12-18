'use client';

import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

const MAX_DAYS = 365;

type PresetKey = "last7" | "last30" | "last90" | "last365" | "thisMonth" | "custom";

const presets: { key: PresetKey; label: string; from: Dayjs; to: Dayjs }[] = [
  { key: "last7", label: "Últimos 7 días", from: dayjs().subtract(7, "day"), to: dayjs().endOf("day") },
  { key: "last30", label: "Últimos 30 días", from: dayjs().subtract(30, "day"), to: dayjs().endOf("day") },
  { key: "last90", label: "Últimos 90 días", from: dayjs().subtract(90, "day"), to: dayjs().endOf("day") },
  { key: "last365", label: "Últimos 12 meses", from: dayjs().subtract(365, "day"), to: dayjs().endOf("day") },
  { key: "thisMonth", label: "Este mes", from: dayjs().startOf("month"), to: dayjs().endOf("day") },
];

interface DateRange {
  from: string;
  to: string;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  const t = useTranslations("statsDashboard");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tempFrom, setTempFrom] = useState<Dayjs | null>(dayjs(value.from));
  const [tempTo, setTempTo] = useState<Dayjs | null>(dayjs(value.to));
  const [selection, setSelection] = useState<PresetKey | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "daterange-popover" : undefined;

  const displayLabel = useMemo(() => {
    const fromLabel = dayjs(value.from).format("DD MMM YYYY");
    const toLabel = dayjs(value.to).format("DD MMM YYYY");
    return `${fromLabel} · ${toLabel}`;
  }, [value.from, value.to]);

  const applyRange = (from: Dayjs, to: Dayjs) => {
    let start = from;
    let end = to;
    if (end.isBefore(start)) {
      [start, end] = [end, start];
    }
    if (end.diff(start, "day") > MAX_DAYS) {
      end = start.add(MAX_DAYS, "day");
      setHint("Máximo 12 meses de rango. Ajustado automáticamente.");
    } else {
      setHint(null);
    }
    setTempFrom(start);
    setTempTo(end);
  };

  const handlePreset = (key: PresetKey) => {
    if (key === "custom") {
      setSelection("custom");
      return;
    }
    const preset = presets.find((p) => p.key === key);
    if (!preset) return;
    setSelection(key);
    applyRange(preset.from, preset.to);
  };

  const handleApply = () => {
    if (!tempFrom || !tempTo) return;
    onChange({ from: tempFrom.toISOString(), to: tempTo.toISOString() });
    setAnchorEl(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="flex-start">
        <Button variant="outlined" onClick={(e) => setAnchorEl(e.currentTarget)}>
          {displayLabel}
        </Button>
      </Stack>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 360 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {t("dateRange")} (max. 12m)
          </Typography>
          <Stack direction="row" spacing={2}>
            <List dense sx={{ minWidth: 180 }}>
              {presets.map((preset) => (
                <ListItemButton
                  key={preset.key}
                  selected={selection === preset.key}
                  onClick={() => handlePreset(preset.key)}
                >
                  <ListItemText
                    primary={
                      preset.key === "last7"
                        ? t("presets.last7")
                        : preset.key === "last30"
                        ? t("presets.last30")
                        : preset.key === "last90"
                        ? t("presets.last90")
                        : preset.key === "last365"
                        ? t("presets.last365")
                        : t("presets.thisMonth")
                    }
                  />
                </ListItemButton>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItemButton selected={selection === "custom"} onClick={() => setSelection("custom")}>
                <ListItemText primary={t("presets.custom")} />
              </ListItemButton>
            </List>
            <Stack spacing={1.5}>
              <DatePicker
                label={t("dateRangeFrom", { default: "Desde" })}
                value={tempFrom}
                onChange={(newValue) => {
                  if (newValue) applyRange(newValue, tempTo ?? newValue);
                }}
                slotProps={{ textField: { size: "small" } }}
              />
              <DatePicker
                label={t("dateRangeTo", { default: "Hasta" })}
                value={tempTo}
                onChange={(newValue) => {
                  if (newValue) applyRange(tempFrom ?? newValue, newValue);
                }}
                slotProps={{ textField: { size: "small" } }}
              />
            </Stack>
          </Stack>
          {hint && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              {t("dateMaxHint")}
            </Typography>
          )}
          <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
            <Button size="small" onClick={() => setAnchorEl(null)}>
              {t("dateCancel")}
            </Button>
            <Button size="small" variant="contained" onClick={handleApply}>
              {t("dateApply")}
            </Button>
          </Stack>
        </Box>
      </Popover>
    </LocalizationProvider>
  );
};
