/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';
import { colorBarDataset } from '@/domain/features/checkinbiz/IStats';

const ChartLine = ({ data, xAxisWeek = true, YAxisText = 'Horas' }: { data: Array<Record<string, number>>, xAxisWeek?: boolean, YAxisText?: string }) => {
    const [chartData, setChartData] = useState([
        { day: 'Domingo' },
        { day: 'Lunes' },
        { day: 'Martes' },
        { day: 'Miércoles' },
        { day: 'Jueves' },
        { day: 'Viernes' },
        { day: 'Sábado' },

    ])
    const updateChartData = async () => {
        const newDataArray: Array<any> = []
        if (data.length > 0) {
            chartData.forEach((element) => {
                const item = {}

                if (xAxisWeek) Object.assign(item, {
                    day: element.day
                })
                data.forEach((item: any) => {
                    Object.assign(item, {
                        [item]: parseFloat(`${data[item] ?? 0}`).toFixed(2)
                    })
                });
                newDataArray.push(item)
            });
        }

        setChartData(newDataArray)
    }

    useEffect(() => {
        updateChartData()
    }, [data.length])
    return (
        <Box style={{ width: '100%', height: 400 }} display={'flex'} flexDirection={'column'} gap={2}>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis label={{ value: { YAxisText }, angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {Object.keys(chartData[0]).filter(e => e !== 'day').map((e, i) => <Line strokeWidth={3} key={i} type="monotone" dataKey={e} stroke={colorBarDataset[i]} name={e} />)}
                </LineChart>
            </ResponsiveContainer>


        </Box>
    );
};

export default ChartLine;
