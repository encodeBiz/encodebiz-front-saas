'use client';

import { useState, useMemo } from "react";
import {
  Box,
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
import { SassButton } from "@/components/common/buttons/GenericButton";
import { CalendarMonth } from "@mui/icons-material";

const MAX_DAYS = 365;

type PresetKey = "last7" | "last30" | "last90" | "last365" | "thisMonth" | "thisWeek" | "custom";

const presets: { key: PresetKey; label: string; from: Dayjs; to: Dayjs }[] = [
  { key: "last7", label: "Últimos 7 días", from: dayjs().subtract(7, "day"), to: dayjs().endOf("day") },
  { key: "last30", label: "Últimos 30 días", from: dayjs().subtract(30, "day"), to: dayjs().endOf("day") },
  { key: "last90", label: "Últimos 90 días", from: dayjs().subtract(90, "day"), to: dayjs().endOf("day") },
  { key: "last365", label: "Últimos 12 meses", from: dayjs().subtract(365, "day"), to: dayjs().endOf("day") },
  { key: "thisWeek", label: "Esta semana", from: dayjs().startOf("week"), to: dayjs().endOf("week") },
  { key: "thisMonth", label: "Este mes", from: dayjs().startOf("month"), to: dayjs().endOf("day") },
];

export interface DateRange {
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
  const [selection, setSelection] = useState<PresetKey | null>("thisWeek");
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
  
  // Crear copias de las fechas para no modificar las originales
  const fromDate = new Date(tempFrom.toDate());
  const toDate = new Date(tempTo.toDate());
  
  // Establecer from a las 00:00:00
  fromDate.setHours(0, 0, 0, 0);
  
  // Establecer to a las 23:59:59
  toDate.setHours(23, 59, 59, 999);
  
  onChange({ 
    from: fromDate.toISOString(), 
    to: toDate.toISOString() 
  });
  setAnchorEl(null);
};

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        spacing={1}
        display="flex"
        alignItems="flex-end"
        sx={{
          minWidth: { xs: "100%", sm: "auto" },
        }}
      >
        <SassButton
          sx={{
            fontWeight: 600,
            /*textTransform: 'none',*/
            padding: theme => theme.spacing(1.5, 3),
            borderRadius: 1,
            gap: 2,
            boxShadow: 'none',
            borderColor: theme => theme.palette.grey[400],
            borderStyle: 'solid',
            borderWidth: 1,
            color: theme => theme.palette.grey[800],
            '&:hover': {
              boxShadow: 'none',
              backgroundColor: '#FFF',
              borderColor: theme => theme.palette.grey[800],
            },


          }}
          variant="outlined" onClick={(e) => setAnchorEl(e.currentTarget)} endIcon={<CalendarMonth />}>
          {displayLabel}
        </SassButton>
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
                              : preset.key === "thisWeek"
                                ? t("presets.thisWeek")
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
            <SassButton size="small" onClick={() => setAnchorEl(null)}>
              {t("dateCancel")}
            </SassButton>
            <SassButton size="small" variant="contained" onClick={handleApply}>
              {t("dateApply")}
            </SassButton>
          </Stack>
        </Box>
      </Popover>
    </LocalizationProvider>
  );
};
