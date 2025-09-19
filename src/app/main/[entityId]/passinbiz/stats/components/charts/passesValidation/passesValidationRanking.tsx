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
import { usePassinBizStats } from "../../../context/passBizStatsContext";
import usePassesValidationController, { METRIC_COLORS } from "./passesValidation.controller";
import { CustomChip } from "@/components/common/table/CustomChip";
export const PassesValidationRankingChart = () => {
    const t = useTranslations()
    const { currentEntity } = useEntity()
    const { payloadPassValidator } = usePassinBizStats()
    const { handleFetchStats, graphData } = usePassesValidationController()
    useEffect(() => {
        if (currentEntity?.entity.id)
            handleFetchStats({ ...payloadPassValidator })
    }, [currentEntity?.entity.id])

    return (<>

        <Box sx={{ height: 250 }}>
            <Box display={'flex'} flexDirection={'column'} >
                <Typography variant="body1">{t('stats.passesValidationRank')}</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
                <Box width={'80%'} sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {graphData?.ranking?.length === 0 ? (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                                <EmptyState />
                            </Stack>
                        ) : (
                            <ComposedChart data={graphData?.ranking.map((r: any) => ({ evento: r.event, Valid: r.valid, Failed: r.failed, Revoked: r.revoked }))} margin={{ top: 8, right: 16, left: 8, bottom: 24 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="evento" angle={-10} height={60} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar maxBarSize={25} dataKey="Valid" name={t('stats.valid')} fill={METRIC_COLORS.valid} radius={[6, 6, 0, 0]} />
                                <Bar maxBarSize={25} dataKey="Failed" name={t('stats.failed')} fill={METRIC_COLORS.failed} radius={[6, 6, 0, 0]} />
                                <Bar maxBarSize={25} dataKey="Revoked" name={t('stats.revoked')} fill={METRIC_COLORS.revoked} radius={[6, 6, 0, 0]} />
                            </ComposedChart>)}
                    </ResponsiveContainer>

                </Box>
                <Box >
                    <Stack direction="column" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                        {graphData?.ranking.map((r: any) => ({ evento: r.event, Valid: r.valid, Failed: r.failed, Revoked: r.revoked })).map((e: any, i: any) =>
                            <CustomChip key={i} size="small" label={`${e.evento}: ${t('stats.valid')}:${e.Valid}, ${t('stats.failed')}:${e.Failed}, ${t('stats.revoked')}:${e.Revoked}`} />
                        )}
                    </Stack>
                </Box>
            </Box>
        </Box>
    </>
    );



}