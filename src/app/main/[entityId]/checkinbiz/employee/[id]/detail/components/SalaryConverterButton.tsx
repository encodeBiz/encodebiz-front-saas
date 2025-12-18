'use client';

import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useFormikContext } from "formik";

type Period = "month" | "week";

interface SalaryConverterButtonProps {
  fieldName?: string;
  size?: "small" | "medium";
}

export const SalaryConverterButton = ({ fieldName = "price", size = "small" }: SalaryConverterButtonProps) => {
  const t = useTranslations("core.label");
  const tButton = useTranslations("core.button");
  const { setFieldValue } = useFormikContext<any>();
  const [open, setOpen] = useState(false);
  const [salaryInput, setSalaryInput] = useState<string>("");
  const [hoursInput, setHoursInput] = useState<string>("173.33");
  const [period, setPeriod] = useState<Period>("month");

  const hourly = useMemo(() => {
    const salary = Number(salaryInput);
    const hours = Number(hoursInput);
    if (Number.isNaN(salary) || Number.isNaN(hours) || hours <= 0) return 0;
    const baseHours = period === "month" ? hours : hours * 4.33;
    return salary / baseHours;
  }, [salaryInput, hoursInput, period]);

  return (
    <>
      <Button
        size={size}
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ whiteSpace: "nowrap" }}
      >
        {t("convertToHourly")}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t("convertToHourly")}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t("salaryHelper")}
          </DialogContentText>
          <Stack spacing={2}>
            <TextField
              label={t("monthlySalary")}
              type="number"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
              size="small"
            />
            <TextField
              label={
                period === "month"
                  ? t("monthlyHours")
                  : t("weeklyHours")
              }
              type="number"
              value={hoursInput}
              onChange={(e) => setHoursInput(e.target.value)}
              InputProps={{ inputProps: { min: 1 } }}
              helperText={t("defaultHoursHint")}
              size="small"
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2">{t("period")}</Typography>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={period}
                onChange={(_, val: Period | null) => {
                  if (!val) return;
                  setPeriod(val);
                  setHoursInput(val === "month" ? "173.33" : "40");
                }}
              >
                <ToggleButton value="month">{t("monthly")}</ToggleButton>
                <ToggleButton value="week">{t("weekly")}</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <Box>
              <Typography variant="overline" color="text.secondary">
                {t("salaryPerHour")}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {hourly > 0 ? hourly.toFixed(2) : "-"}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="outlined" onClick={() => setOpen(false)}>
            {tButton("cancel")}
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              if (hourly > 0) {
                setFieldValue(fieldName, Number(hourly.toFixed(2)));
              }
              setOpen(false);
            }}
          >
            {tButton("save")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
