/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
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
import { useTranslations } from "next-intl";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { useEntity } from "@/hooks/useEntity";
import usePassesIssuedController from "./passesIssued.controller";
import { usePassinBizStats } from "../../../context/passBizStatsContext";
export const PassesIssuedRankingChart = () => {
    const t = useTranslations()
    const { currentEntity } = useEntity()
    const { payloadPassIssued } = usePassinBizStats()
    const { handleFetchStats, graphData } = usePassesIssuedController()
    useEffect(() => {
        if (currentEntity?.entity.id)
            handleFetchStats({ ...payloadPassIssued, stats: 'PASSES_ISSUED' })
    }, [currentEntity?.entity.id])

    return (<>

        <Box sx={{ height: 420 }}>

            <Box display={'flex'} flexDirection={'column'} >
                <Typography variant="body1">{t('stats.passesIssuedRank')}</Typography>
            </Box>
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
                        <Bar maxBarSize={25} dataKey="total" name={t('stats.totalByEvent')} radius={[6, 6, 0, 0]} />
                    </ComposedChart>)}
            </ResponsiveContainer>
        </Box>
    </>
    );

}