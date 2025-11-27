import React, { } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { colorBarDataset } from '@/domain/features/checkinbiz/IStats';
import { useTranslations } from 'next-intl';

const ChartLine = ({ data, sub }: {sub:string, data: Array<Record<string, number>>, xAxisWeek?: boolean, YAxisText?: string }) => {
    const t = useTranslations();
    const theme = useTheme()
    const chartData = [
        { day: t('core.days.sunday') },
        { day: t('core.days.monday') },
        { day: t('core.days.tuesday') },
        { day: t('core.days.wednesday') },
        { day: t('core.days.thursday') },
        { day: t('core.days.friday') },
        { day: t('core.days.saturday') },
    ]


     const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Box
                     sx={{
                        p: 2,
                        backgroundColor: theme.palette.primary.main,
                        color:'#FFF',
                        textAlign:'left'
                    }}
                >
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {label}
                    </Typography>
                    {payload.map((entry: { color: string, name: string, value: any }, index: number) => (
                        <Typography
                            key={index}
                            variant="body2"
                            sx={{
                                color: "#FFF",
                                display: 'flex',
                                alignItems: 'flex-start'
                            }}
                        >
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: entry.color,
                                    mr: 1,
                                    borderRadius: 1
                                }}
                            />
                            {entry.name}: {entry.value}{sub}
                        </Typography>
                    ))}
                </Box>
            );
        }
        return null;
    };

    return (
        <Box style={{ width: '100%', height: 400 }} display={'flex'} flexDirection={'column'} gap={2}>

            {data.map(e => ({ day: chartData[data.indexOf(e)].day, ...e })).length > 0 && <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data.map(e => ({ day: chartData[data.indexOf(e)].day, ...e }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis label={{ value: t('core.days.time'), angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {Object.keys(data.map(e => ({ day: chartData[data.indexOf(e)].day, ...e }))[0]).filter(e => e !== 'day').map((e, i) => <Line strokeWidth={3} key={i} type="monotone" dataKey={e} stroke={colorBarDataset[i]} name={e} />)}
                </LineChart>
            </ResponsiveContainer>}


        </Box>
    );
};

export default ChartLine;
