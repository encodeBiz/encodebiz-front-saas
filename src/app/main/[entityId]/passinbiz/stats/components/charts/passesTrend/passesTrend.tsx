/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Stack, Typography } from "@mui/material";
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
import BoxLoader from "@/components/common/BoxLoader";


export const PassesTrendChart = () => {
    const t = useTranslations()
    const { currentEntity } = useEntity()
    const { payloadPassTrend } = usePassinBizStats()

    const { handleFetchStats, loading, graphData } = usePassesTrendController()
    useEffect(() => {
        if (currentEntity?.entity.id)
            handleFetchStats({
                entityId: currentEntity?.entity.id,
                groupBy: 'month',
                stats: 'PASSES_ISSUED_GENERAL',
                type: 'entity',
                dateRange: {
                    start: new Date(new Date().getFullYear(), 0, 1),
                    end: new Date()
                }
            })
    }, [currentEntity?.entity.id, payloadPassTrend])

    return (<>
        <Box sx={{ height: 360 }}>
            <Box display={'flex'} flexDirection={'row'} gap={2} mb={2}>
                <Box display={'flex'} flexDirection={'column'} >
                    <Typography variant="body1">{t('stats.passesTrend')}</Typography>
                    <Typography variant="caption">{t('stats.passesTrendText')}</Typography>
                </Box>
                 
            </Box>
            {loading  && <BoxLoader message={t('core.title.loaderAction') } />}
            {!loading  && <Box display={'flex'} flexDirection={'row'} gap={2}>
                <Box width={'80%'} sx={{ height: 300 }}>
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
                          
                                <Line type="monotone" dataKey="credentials" name={t('core.label.credencial')} dot={false} stroke="#1f77b4" strokeWidth={2} />
                                <Line type="monotone" dataKey="passes" name={t('core.label.pass')}  dot={false} stroke="#16a34a" strokeWidth={2} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </Box>

                <Box >
                    <Stack direction="column" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                        <CustomChip size="small" label={`${t('core.label.pass')} (Σ): ${new Intl.NumberFormat("en-US", { notation: "compact" }).format(graphData?.trend.kpis.totalPasses || 0)}`} />
                        <CustomChip size="small" label={`${t('core.label.credencial')} (Σ): ${new Intl.NumberFormat("en-US", { notation: "compact" }).format(graphData?.trend.kpis.totalCredentials || 0)}`} />
                        {graphData?.trend.kpis.passPerCredential != null && (
                            <CustomChip size="small" label={`${t('core.label.credpass')}: ${graphData?.trend.kpis.passPerCredential}x`} />
                        )}
                    </Stack>
                </Box>
            </Box>}
        </Box>

    </>
    );

}