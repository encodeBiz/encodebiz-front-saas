'use client';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useTranslations } from "next-intl";
export const SelectorChart = ({ type, setType }: {
    type: string
    setType: (type: string) => void
}) => {
    const t = useTranslations();
    return (
        <Box>
            <Typography textTransform={'uppercase'} color='textSecondary' variant='body1'>{t('statsCheckbiz.tempActiviy')}</Typography >
            <FormControl sx={{ m: 1, width: 340 }}>
                <InputLabel id="demo-simple-select-label">{t('statsCheckbiz.tempActiviyLabel')}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    label={t('statsCheckbiz.tempActiviyLabel')}
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


