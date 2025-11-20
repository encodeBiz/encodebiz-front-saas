import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {
    Paper,
    Typography,
    Box,
    useTheme
} from '@mui/material';



export const CustomizableGroupedBarChart = ({
    data = [],
    title = 'Customizable Grouped Bar Chart',
    height = 400,
    entities = []
}: any) => {
    const theme = useTheme();

    const getColor = (colorName: any) => {
        const colorMap: any = {
            primary: theme.palette.primary.main,
            secondary: theme.palette.secondary.main,
            success: theme.palette.success.main,
            error: theme.palette.error.main,
            warning: theme.palette.warning.main,
            info: theme.palette.info.main,
        };
        return colorMap[colorName] || theme.palette.primary.main;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        backgroundColor: 'background.paper',
                        border: `1px solid ${theme.palette.divider}`
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
                                color: entry.color,
                                display: 'flex',
                                alignItems: 'center'
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
                            {entry.name}: {entry.value}
                        </Typography>
                    ))}
                </Paper>
            );
        }
        return null;
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                backgroundColor: 'background.paper'
            }}
        >
         

            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.palette.divider}
                    />
                    <XAxis
                        dataKey="category"
                        tick={{ fill: theme.palette.text.primary }}
                        axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis
                        tick={{ fill: theme.palette.text.primary }}
                        axisLine={{ stroke: theme.palette.divider }}
                    />
                    {<Tooltip content={<CustomTooltip />} />}
                    <Legend
                        wrapperStyle={{
                            paddingTop: 20,
                        }}
                    />
                    {entities.map((entity: { key: string, name: string, color: string }, index: number) => (
                        <Bar
                            maxBarSize={25}
                            key={entity.key + '-' + index}
                            dataKey={entity.key}
                            name={entity.name}
                            fill={getColor(entity.color)}
                            radius={[2, 2, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
};