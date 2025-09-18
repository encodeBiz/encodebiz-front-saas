/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

import { ChartData } from "../../page.controller";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/common/EmptyState/EmptyState";
export const PassesIssuedRankingChart = ({ graphData, pending }: { graphData: ChartData | undefined, pending: boolean }) => {
    const t = useTranslations()

    return (<>
        <Box>
            <Typography variant="h5" fontWeight={600}>{t('stats.passesIssuedRank')}</Typography>
           
        </Box>
        <Box sx={{ height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
                {graphData?.ranking?.length === 0 ? (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                        <EmptyState />
                    </Stack>
                ) : (
                    <ComposedChart data={graphData?.ranking.map((r: any) => ({ evento: r.event, total: r.total }))} margin={{ top: 8, right: 16, left: 8, bottom: 24 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="evento" angle={-10} height={60} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" name="Total por evento" radius={[6, 6, 0, 0]} />
                    </ComposedChart>)}
            </ResponsiveContainer>
        </Box>
    </>
    );

}