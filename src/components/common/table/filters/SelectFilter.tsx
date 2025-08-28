import { Select, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";
export interface SelectFilterProps {
    value: any,
    defaultValue?: any,
    onChange: (value: any) => void,
    items: Array<{ label: string, value: any }>
}
export const SelectFilter = ({ defaultValue, value, onChange, items }: SelectFilterProps) => {
    const t = useTranslations()
    return <Select sx={{ minWidth: 187, height: 56 }}
        value={value ?? 'none'}
        defaultValue={defaultValue ?? 'none'}
        onChange={(e: any) => onChange(e.target.value)}  >
        <MenuItem key={'none'} value={'none'}>
            {t('core.label.select')}
        </MenuItem>
        {items.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
        ))}
    </Select>
}