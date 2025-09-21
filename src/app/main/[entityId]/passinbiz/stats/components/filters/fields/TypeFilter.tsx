import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";

export const TypeFilter = ({ value, onChange }: { value: "event" | "credential", onChange: (value: "event" | "credential") => void }) => {
    const t = useTranslations()
    return <FormControl  size="small"  sx={{ minWidth: 140, mb:1, }}>
        <InputLabel id="gb-label">{t('stats.type')}</InputLabel>
        <Select labelId="gb-label" label="groupBy" value={value} onChange={(e) => onChange(e.target.value as "event" | "credential")}>
            
            <MenuItem value="event">{t('core.label.event')}</MenuItem>
            <MenuItem value="credential">{t('core.label.credential')}</MenuItem>
        </Select>
    </FormControl>
}