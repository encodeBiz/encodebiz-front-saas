'use client';
import { Box, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import { useTranslations } from "next-intl";

import { useCheckBizStats } from '../../context/dashboardContext';
import { IHeuristicInfo } from '@/domain/features/checkinbiz/IStats';
import { useAppLocale } from '@/hooks/useAppLocale';

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

export const SelectorIndicator = () => {
    const t = useTranslations();
    const { heuristicDataOne, heuristicDataTwo, setHeuristicDataOne, setHeuristicDataTwo, branchTwo } = useCheckBizStats()
    const { currentLocale } = useAppLocale()
    const getNameById = (id: Array<string>) => {
        const names: Array<string> = []
        id.forEach(element => {
            const branch = heuristicDataOne.find(e => e.id === element)
            if (branch) {
                names.push(branch.id)
            }
        });
        return names.join(', ')
    }
    return (<Box>
        <Typography color='textSecondary' variant='body1'>{t('statsCheckbiz.selectedIndicator')}</Typography>
        <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">{t('core.label.select')}</InputLabel>

            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={heuristicDataOne.filter(e => e.active).map(e => e.id)}
                onChange={(event: any) => {
                    const data1: Array<IHeuristicInfo> = []
                    const data2: Array<IHeuristicInfo> = []
                    if (Array.isArray(event?.target.value)) {
                        heuristicDataOne.forEach(element => {
                            if (event?.target.value?.includes(element.id))
                                data1.push({ ...element, active: true })
                            else
                                data1.push({ ...element, active: false })
                        });
                        setHeuristicDataOne(data1)

                        if (!!branchTwo) {
                            heuristicDataTwo.forEach(element => {
                                if (event?.target.value?.includes(element.id))
                                    data2.push({ ...element, active: true })
                                else
                                    data2.push({ ...element, active: false })
                            });
                            setHeuristicDataTwo(data2)
                        }
                    }
                }}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => getNameById(selected as Array<string>)}
                MenuProps={MenuProps}
            >
                {heuristicDataOne.map((branch: IHeuristicInfo) => (
                    <MenuItem key={branch.id} value={branch.id}>
                        <Checkbox checked={branch.active} />
                        <ListItemText primary={branch.name[currentLocale as 'es' | 'en']} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    </Box>
    );
}


