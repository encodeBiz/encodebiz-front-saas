"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { colorBarDataset } from '@/domain/features/checkinbiz/IStats';
import { useTranslations } from 'next-intl';

const ChartLine = ({ data, sub }: { sub?: string; data: Array<Record<string, number>>; xAxisWeek?: boolean; YAxisText?: string }) => {
    const t = useTranslations();
    const theme = useTheme();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [hasSize, setHasSize] = useState(false);

    const chartData = useMemo(
        () => [
            { day: t("core.days.sunday") },
            { day: t("core.days.monday") },
            { day: t("core.days.tuesday") },
            { day: t("core.days.wednesday") },
            { day: t("core.days.thursday") },
            { day: t("core.days.friday") },
            { day: t("core.days.saturday") },
        ],
        [t]
    );

    // Evita el warning de Recharts cuando el contenedor aún no tiene tamaño.
    useEffect(() => {
        if (!containerRef.current) return;
        if (typeof ResizeObserver === "undefined") {
            setHasSize(true);
            return;
        }
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setHasSize(width > 0 && height > 0);
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);


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
                            {entry.name}: {entry.value}{sub ? sub : ''}
                        </Typography>
                    ))}
                </Box>
            );
        }
        return null;
    };

    const formattedData = useMemo(
        () =>
            data.map((item, idx) => ({
                day: chartData[idx]?.day ?? `Day ${idx + 1}`,
                ...item,
            })),
        [chartData, data]
    );

    const seriesKeys = useMemo(
        () => Object.keys(formattedData[0] ?? {}).filter((key) => key !== 'day'),
        [formattedData]
    );

    const shouldRenderChart = hasSize && formattedData.length > 0 && seriesKeys.length > 0;

    return (
        <Box
            ref={containerRef}
            sx={{ width: '100%', minWidth: 0, height: 400, minHeight: 320 }}
            display={'flex'}
            flexDirection={'column'}
            gap={2}
        >
            {shouldRenderChart ? (
                <ResponsiveContainer width="100%" height="100%" debounce={150}>
                    <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis label={{ value: t('core.days.time'), angle: -90, position: 'insideLeft' }} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {seriesKeys.map((key, i) => (
                            <Line strokeWidth={3} key={key} type="monotone" dataKey={key} stroke={colorBarDataset[i % colorBarDataset.length]} name={key} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    {t('core.table.nodata')}
                </Typography>
            )}
        </Box>
    );
};

export default ChartLine;
