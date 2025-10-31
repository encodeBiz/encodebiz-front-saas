/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCheckBizStats } from '../context/checkBizStatsContext';
import { fetchSucursal } from '@/services/checkinbiz/sucursal.service';
import { useEntity } from '@/hooks/useEntity';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

const Chart = () => {
    const t = useTranslations()
    const { branchOne, branchTwo } = useCheckBizStats()
    const [type, setType] = useState('weeklyWorkAvg')
    const [chartData, setChartData] = useState([
        { day: 'Lunes' },
        { day: 'Martes' },
        { day: 'Miércoles' },
        { day: 'Jueves' },
        { day: 'Viernes' },
        { day: 'Sábado' },
        { day: 'Domingo' }
    ])
    const { currentEntity } = useEntity()
    const updateChartData = async () => {
        const newDataArray: Array<any> = []
        if (!!branchOne) {

            chartData.forEach((element, index) => {
                newDataArray.push({
                    day: element.day,
                    [branchOne.branch?.name as string]: (branchOne as any)[type][index] ?? 0
                })
            });
        }

        if (!!branchOne && !!branchTwo) {

            chartData.forEach((element, index) => {
                newDataArray.push({
                    day: element.day,
                    [branchOne.branch?.name as string]: (branchOne as any)[type][index] ?? 0,
                    [branchTwo.branch?.name as string]: (branchTwo as any)[type][index] ?? 0
                })
            });
        }

        console.log(newDataArray);


        setChartData(newDataArray)
    }

    useEffect(() => {
        updateChartData()
    }, [branchOne, branchTwo, type])



    return (
        <Box style={{ width: '100%', height: 400 }} display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} flexDirection={'column'}>
                <Typography>{t('statsCheckbiz.chartTitle')}</Typography>
            </Box>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {Object.keys(chartData[0]).filter(e => e !== 'day').map((e, i) => <Line key={i} type="monotone" dataKey={e} stroke="#8884d8" name={e} />)}

                </LineChart>
            </ResponsiveContainer>

            <Box display={'flex'} flexDirection={'column'}>
                <FormControl >
                    <InputLabel id="demo-simple-select-label">{t('statsCheckbiz.chartType')}</InputLabel>
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
        </Box>
    );
};

export default Chart;