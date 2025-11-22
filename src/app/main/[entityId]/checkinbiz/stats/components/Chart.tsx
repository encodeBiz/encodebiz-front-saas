/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCheckBizStats } from '../context/checkBizStatsContext';
import {  Box, Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';

const Chart = () => {
    const t = useTranslations()
    const theme = useTheme()
    const { branchOne, branchTwo , type} = useCheckBizStats()

    const [chartData, setChartData] = useState([
        { day: 'Lunes' },
        { day: 'Martes' },
        { day: 'Miércoles' },
        { day: 'Jueves' },
        { day: 'Viernes' },
        { day: 'Sábado' },
        { day: 'Domingo' }
    ])
    const updateChartData = async () => {
        const newDataArray: Array<any> = []

        if (!!branchOne && !!branchTwo) {

            chartData.forEach((element, index) => {
                newDataArray.push({
                    day: element.day,
                    [branchOne.branch?.name as string]: (branchOne as any)[type][index] ?? 0,
                    [branchTwo.branch?.name as string]: (branchTwo as any)[type][index] ?? 0
                })
            });
        } else {
            if (!!branchOne) {

                chartData.forEach((element, index) => {
                    newDataArray.push({
                        day: element.day,
                        [branchOne.branch?.name as string]: (branchOne as any)[type][index] ?? 0
                    })
                });
            }
        }



 

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
                    {Object.keys(chartData[0]).filter(e => e !== 'day').map((e, i) => <Line  strokeWidth={3}  key={i} type="monotone" dataKey={e} stroke={i == 0 ? theme.palette.primary.main : theme.palette.error.main} name={e} />)}

                </LineChart>
            </ResponsiveContainer>

           
        </Box>
    );
};

export default Chart;
