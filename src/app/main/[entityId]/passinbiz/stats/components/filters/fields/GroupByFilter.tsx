 import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
 import { useTranslations } from "next-intl";

export const GroupByFilter = ({ value, onChange }: { value: "hour" | "day" | "month", onChange: (value: "hour" | "day" | "month") => void }) => {
    const t = useTranslations()
    return <FormControl size="small" sx={{ width: 100,mb:1 }}>
        <InputLabel id="gb-label">{t('stats.groupBy')}</InputLabel>
        <Select labelId="gb-label" label="groupBy" value={value} onChange={(e) => onChange(e.target.value as any)}>
            <MenuItem value="hour">{t('stats.hour')}</MenuItem>
            <MenuItem value="day">{t('stats.day')}</MenuItem>
            <MenuItem value="month">{t('stats.month')}</MenuItem>
        </Select>
    </FormControl>
}