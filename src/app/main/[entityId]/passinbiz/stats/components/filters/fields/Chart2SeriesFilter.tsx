import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePassinBizStats } from "../../../context/passBizStatsContext";

export const Chart2SeriesFilter = ({ value, onChange }: { value: Array<{id:string,name:string}>, onChange: (value: Array<{id:string,name:string}>) => void }) => {
    const t = useTranslations()
    const { seriesChart2 } = usePassinBizStats()
    return <FormControl size="small" sx={{ minWidth: 140, mb: 1, }}>
        <InputLabel id="gb-label">{t('stats.statusPass')}</InputLabel>
        <Select
            multiple
            labelId="series-label"
            label="Series visibles"
            value={value} onChange={(e) => onChange(e.target.value as Array<{id:string,name:string}>)}
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