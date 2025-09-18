/* eslint-disable react-hooks/exhaustive-deps */
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
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
import { IStatsRequest } from "@/domain/features/passinbiz/IStats";
import { useEntity } from "@/hooks/useEntity";
import usePassesIssuedRankingController from "./passesIssuedRanking.controller";
export const PassesIssuedRankingChart = ({ payload, }: { payload: IStatsRequest}) => {
    const t = useTranslations()
    const { currentEntity } = useEntity()
    const { handleFetchStats, loading, graphData } = usePassesIssuedRankingController()
    useEffect(() => {
        if (currentEntity?.entity.id)
            handleFetchStats({ ...payload, entityId: currentEntity?.entity.id })
    }, [currentEntity?.entity.id])

    return (<>
        <Box>
            <Typography variant="h5" fontWeight={600}>{t('stats.passesIssuedRank')} {loading && <CircularProgress    />}</Typography>
           
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