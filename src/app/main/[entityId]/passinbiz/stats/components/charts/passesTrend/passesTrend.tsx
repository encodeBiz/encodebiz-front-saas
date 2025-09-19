/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import {
    ResponsiveContainer,
    ComposedChart,

    Line,
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
import { CustomChip } from "@/components/common/table/CustomChip";
import usePassesTrendController from "./passesTrend.controller";


export const PassesTrendChart = () => {
    const t = useTranslations()
    const { currentEntity } = useEntity()
    const { payloadPassTrend } = usePassinBizStats()

    const { handleFetchStats, loading, graphData } = usePassesTrendController()
    useEffect(() => {
        if (currentEntity?.entity.id)
            handleFetchStats({ ...payloadPassTrend })
    }, [currentEntity?.entity.id, payloadPassTrend])

    return (<>
        <Box sx={{ height: 460 }}>
            <Box display={'flex'} flexDirection={'row'} gap={2} mb={2}>
                <Box display={'flex'} flexDirection={'column'} >
                    <Typography variant="body1">{t('stats.passesTrend')}</Typography>
                    <Typography variant="caption">{t('stats.passesTrendText')}</Typography>
                </Box>
                {loading && <CircularProgress size={24} />}
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
                <Box width={'80%'} sx={{ height: 400 }}>
                    {graphData?.empty ? (
                        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                            <EmptyState />
                        </Stack>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={graphData?.trend.rows} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="credentials" name="Credenciales" dot={false} stroke="#1f77b4" strokeWidth={2} />
                                <Line type="monotone" dataKey="passes" name="Pases" dot={false} stroke="#16a34a" strokeWidth={2} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </Box>

                <Box >
                    <Stack direction="column" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                        <CustomChip size="small" label={`Pases (Σ): ${new Intl.NumberFormat("en-US", { notation: "compact" }).format(graphData?.trend.kpis.totalPasses || 0)}`} />
                        <CustomChip size="small" label={`Credenciales (Σ): ${new Intl.NumberFormat("en-US", { notation: "compact" }).format(graphData?.trend.kpis.totalCredentials || 0)}`} />
                        {graphData?.trend.kpis.passPerCredential != null && (
                            <CustomChip size="small" label={`Pases/Cred: ${graphData?.trend.kpis.passPerCredential}x`} />
                        )}
                    </Stack>
                </Box>
            </Box>



        </Box>

    </>
    );

}