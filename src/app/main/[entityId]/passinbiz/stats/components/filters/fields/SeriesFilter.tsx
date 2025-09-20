import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { useTranslations } from "next-intl";

export const SeriesFilter = ({ value, onChange, seriesChart2 }: { seriesChart2: Array<{ id: string, name: string }>, value: Array<string>, onChange: (value: Array<string>) => void }) => {
    const t = useTranslations()

    return <FormControl size="small" sx={{ minWidth: 140,maxWidth:160, mb: 1, }}>
        <InputLabel id="gb-label">{t('stats.statusPass')}</InputLabel>
        <Select
            multiple
            labelId="series-label"
            label="Series visibles"
            value={value} onChange={(e) => onChange(e.target.value as Array<string>)}
            renderValue={(selected: any) => (selected as string[]).map(id => seriesChart2.find((o: any) => o.id === id)?.name ?? id).join(', ')}
        >
            {seriesChart2.map((o: any) => (
                <MenuItem key={o.id} value={o.id}>
                    <Checkbox checked={value?.indexOf(o.id) > -1} />
                    <ListItemText primary={o.name} />
                </MenuItem>
            ))}
        </Select>
    </FormControl>
}