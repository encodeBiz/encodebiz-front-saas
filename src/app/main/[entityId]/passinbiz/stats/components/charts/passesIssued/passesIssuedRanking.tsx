/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Stack, Typography, useTheme } from "@mui/material";
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
import { CustomChip } from "@/components/common/table/CustomChip";
export const PassesIssuedRankingChart = () => {
    const t = useTranslations()
    const theme = useTheme()
    const { currentEntity } = useEntity()
    const { payloadPassIssuedFilter } = usePassinBizStats()
    const { handleFetchStats, graphData } = usePassesIssuedController()
    useEffect(() => {
        if (currentEntity?.entity.id && payloadPassIssuedFilter)
            handleFetchStats({
                ...payloadPassIssuedFilter,
                stats: 'PASSES_ISSUED',
                entityId: currentEntity?.entity.id
            })
    }, [currentEntity?.entity.id, payloadPassIssuedFilter])

    return (<>
        <Box>
            <Box display={'flex'} flexDirection={'column'} >
                <Typography variant="body1">{t('stats.passesIssuedRank')}</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
                <Box sx={{ height: 350, width: '80%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {graphData?.ranking?.length === 0 ? (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                                <EmptyState showIcon={false}
                                    title={t('stats.empthy')}
                                    description={t('stats.empthytext')}
                                />
                            </Stack>
                        ) : (
                            <ComposedChart data={graphData?.ranking.map((r: any) => ({ evento: r.event, total: r.total }))} margin={{ top: 8, right: 16, left: 8, bottom: 24 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="evento" angle={-10} height={60} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar fill={theme.palette.primary.main} maxBarSize={25} dataKey="total" name={t('stats.totalByEvent')} radius={[6, 6, 0, 0]} />
                            </ComposedChart>)}
                    </ResponsiveContainer>
                </Box>
                <Box >
                    <Stack direction="column" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                        {graphData?.ranking.map((r: any) => ({ evento: r.event, total: r.total })).map((e: any, i: any) =>
                            <CustomChip key={i} size="small" label={`${e.evento}: ${e.total}`} />
                        )}
                    </Stack>
                </Box>
            </Box>
        </Box >
    </>
    );

}