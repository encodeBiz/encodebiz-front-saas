import { Select, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";
export interface SelectFilterProps {
    value: any,
    first?: boolean
    defaultValue?: any,
    onChange: (value: any) => void,
    items: Array<{ label: string, value: any }>
}
export const SelectFilter = ({ defaultValue, value, onChange, items, first = true }: SelectFilterProps) => {
    const t = useTranslations()
    return <Select


        sx={{
            height: 46,
            paddingRight:2,
            "& .MuiSelect-icon": {
               
            },
        }}
        value={value ?? 'none'}
        defaultValue={defaultValue ?? 'none'}
        onChange={(e: any) => onChange(e.target.value)}  >
        {first && <MenuItem key={'none'} value={'none'}>
            {t('core.label.select')}
        </MenuItem>}
        {items.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
        ))}
    </Select>
}