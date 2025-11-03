'use client';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useTranslations } from "next-intl";

import { useCheckBizStats } from '../context/checkBizStatsContext';



export const SelectorChart = () => {
    const t = useTranslations();
    const { type, setType } = useCheckBizStats()


    return (
        <Box>
            <Typography color='textSecondary' variant='body1'>{t('statsCheckbiz.chartType')}</Typography >


            <FormControl sx={{ m: 1, width: 340 }}>
                <InputLabel id="demo-simple-select-label">{t('core.label.select')}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    label="Age"
                    onChange={e => setType(e.target.value)}
                >
                    <MenuItem value={'weeklyStartAvg'}>{t('statsCheckbiz.weeklyStartAvg')}</MenuItem>
                    <MenuItem value={'weeklyEndAvg'}>{t('statsCheckbiz.weeklyEndAvg')}</MenuItem>
                    <MenuItem value={'weeklyWorkAvg'}>{t('statsCheckbiz.weeklyWorkAvg')}</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}


