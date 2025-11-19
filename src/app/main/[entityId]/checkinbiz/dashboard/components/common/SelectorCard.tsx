'use client';
import { Box, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import { useTranslations } from "next-intl";
import { useDashboard } from '../../context/dashboardContext';

 
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export const SelectorCard = () => {
    const t = useTranslations();
    const { cardIndicatorSelected, setCardIndicatorSelected } = useDashboard()

    const option = [ 
        'avgStartEnd',
        'avgCycleCost',
        'avgCostHour',
        'avgWeekWork',
        'reliability',
        'avgEffectiveCost',
        'dataPoints',
        'avgCostEfficiency'
    ].map(e => ({ value: e, label: t(`statsCheckbiz.${e}`) }))

    const getNameById = (id: Array<string>) => {
        const names: Array<string> = []
        id.forEach(element => {
            const branch = option.find(e => e.value === element)
            if (branch) {
                names.push(branch.label)
            }
        });
        return names.join(', ')
    }
    return (<Box>
        <Typography color='textSecondary' variant='body1'>{t('statsCheckbiz.selectedCards')}</Typography>
        <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">{t('core.label.select')}</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={cardIndicatorSelected}
                onChange={(event: any) => {
                    localStorage.setItem('cardIndicatorSelected', JSON.stringify(event?.target.value))
                    setCardIndicatorSelected(event?.target.value)

                }}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => getNameById(selected as Array<string>)}
                MenuProps={MenuProps}
            >
                {option.map((branch: { value: string, label: string }) => (
                    <MenuItem key={branch.value} value={branch.value}>
                        <Checkbox checked={cardIndicatorSelected.includes(branch.value)} />
                        <ListItemText primary={branch.label} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    </Box>
    );
}


