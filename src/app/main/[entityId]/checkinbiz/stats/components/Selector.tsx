'use client';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useTranslations } from "next-intl";

import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { CheckBizStatsProvider, useCheckBizStats } from '../context/checkBizStatsContext';

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

export const SelectorBranch = () => {
    const t = useTranslations();
    const { branchList, branchSelected, setBranchSelected } = useCheckBizStats()

    const getNameById = (id: Array<string>) => {
        const names: Array<string> = []
        id.forEach(element => {
            const branch = branchList.find(e => e.id === element)
            if (branch) {
                names.push(branch.name)
            }
        });
        return names.join(', ')
    }
    return (
        <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">Selecione una sucursal</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={branchSelected.map(e => e.id)}
                onChange={(event: any) => {
                    const data: Array<ISucursal> = []
                    if (Array.isArray(event?.target.value)) {
                        event?.target.value?.forEach((element: string) => {
                            data.push(branchList.find(e => e.id === element) as ISucursal)
                        });
                        setBranchSelected(data)
                    }
                }}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => getNameById(selected as Array<string>)}
                MenuProps={MenuProps}
            >
                {branchList.map((branch: ISucursal) => (
                    <MenuItem disabled={branchSelected.length >= 2 && !branchSelected.map(e => e.id).includes(branch.id)} key={branch.id} value={branch.id}>
                        <Checkbox checked={branchSelected.map(e => e.id).includes(branch.id)} />
                        <ListItemText primary={branch.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}


 