import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useTranslations } from "next-intl";
export interface SelectFilterProps {
    value: any,
    first?: boolean
    label?: string
    firstText?: string
    width?: number
    defaultValue?: any,
    onChange: (value: any) => void,
    items: Array<{ label: string, value: any }>
}
export const SelectFilter = ({ defaultValue, value, label, onChange, items, first = true, firstText, width=150 }: SelectFilterProps) => {
    const t = useTranslations()
    return <FormControl size="small" sx={{ width  }}>
        {label && <InputLabel id="gb-label">{label}</InputLabel>}
        <Select
            label={label}

            sx={{
                height: 46,
                paddingRight: 2,
                "& .MuiSelect-icon": {

                },
            }}
            value={value ?? 'none'}
            defaultValue={defaultValue ?? 'none'}
            onChange={(e: any) => onChange(e.target.value)}  >
            {first && <MenuItem key={'none'} value={'none'}>
                {firstText?firstText:t('core.label.select')}
            </MenuItem>}
            {items.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
}