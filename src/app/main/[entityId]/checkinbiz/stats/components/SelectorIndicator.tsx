'use client';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useTranslations } from "next-intl";

import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import {   useCheckBizStats } from '../context/checkBizStatsContext';
import { IHeuristicInfo } from '@/domain/features/checkinbiz/IStats';

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
    const { heuristicData, setHeuristicData } = useCheckBizStats()

    const getNameById = (id: Array<string>) => {
        const names: Array<string> = []
        id.forEach(element => {
            const branch = heuristicData.find(e => e.id === element)
            if (branch) {
                names.push(branch.id)
            }
        });
        return names.join(', ')
    }
    return (
        <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">{t('statsCheckbiz.selected')}</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={heuristicData.filter(e=>e.active).map(e => e.id)}
                onChange={(event: any) => {
                    const data: Array<IHeuristicInfo> = []
                    if (Array.isArray(event?.target.value)) {
                        heuristicData.forEach(element => {
                            if(event?.target.value?.includes(element.id))
                                data.push({...element, active: true})
                            else
                                data.push({...element, active: false})
                        });                      
                        setHeuristicData(data)
                    }
                }}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => getNameById(selected as Array<string>)}
                MenuProps={MenuProps}
            >
                {heuristicData.map((branch: IHeuristicInfo) => (
                    <MenuItem  key={branch.id} value={branch.id}>
                        <Checkbox checked={branch.active} />
                        <ListItemText primary={branch.label} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}


 