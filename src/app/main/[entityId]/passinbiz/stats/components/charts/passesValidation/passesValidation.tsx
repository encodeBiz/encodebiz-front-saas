/* eslint-disable react-hooks/exhaustive-deps */
import { formatCompact } from "@/lib/common/stats";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
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
import usePassesValidationController from "./passesValidation.controller";
import { GroupBy, IPassValidatorStatsRequest } from "../../../model/PassValidator";
import { usePassinBizStats } from "../../../context/passBizStatsContext";
import { CustomChip } from "@/components/common/table/CustomChip";

function labelFromKey(gb: GroupBy, key: string) {
    return gb === "hour" ? `${String(key).padStart(2, "0")}:00` : key;
}

export const PassesValidationChart = () => {
    const [showCumulative, setShowCumulative] = React.useState(true);
    const t = useTranslations()
    const { currentEntity } = useEntity()
    const { payloadPassValidator } = usePassinBizStats()
    const { handleFetchStats, loading, graphData } = usePassesValidationController()

    console.log(payloadPassValidator);


    useEffect(() => {
        if (currentEntity?.entity.id)
            handleFetchStats({ ...payloadPassValidator })
    }, [currentEntity?.entity.id, payloadPassValidator])

    return (<>
        <Box display={'flex'} flexDirection={'row'} gap={2} mb={2}>
            <Box display={'flex'} flexDirection={'column'} >
                <Typography variant="body1">{t('stats.passesValidation')}</Typography>
                <Typography variant="caption">{t('stats.passesValidationText')}</Typography>
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
                        <ComposedChart data={graphData?.rows} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                            <Tooltip />
                            <Legend />
                            {graphData?.series?.filter((s: any) => payloadPassValidator.series?.includes(s.field)).map((s: any) => (
                                <Bar key={s.field} dataKey={s.field} name={s.name} stackId={s.stackId} fill={s.color} />
                            ))}
                            <Line yAxisId="right" type="monotone" dataKey="validationRate" name={t('stats.validation%')}  dot={false} strokeWidth={2} />
                            {showCumulative && <Line type="monotone" dataKey="cumulative" name={t('stats.cumulativo')}  dot={false} />}
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </Box>
            <Box   >
                <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
                    {/** <CustomChip size="small" label={`${t('stats.dateRange')} (UTC): ${graphData?.dr?.start ?? '-'} → ${graphData?.dr?.end ?? '-'}`} />*/}
                    <Stack direction="column" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                        <CustomChip size="small" label={`Total: ${formatCompact(graphData?.data?.total as number ?? 0)}`} />
                        <CustomChip size="small" label={showCumulative ? t('stats.cumulativo') + ": ON" : t('stats.cumulativo') + ": OFF"} onClick={() => setShowCumulative(v => !v)} />
                        <CustomChip size="small" label={`${t('stats.attempts')}: ${formatCompact(graphData?.kpis.attempts || 0)}`} />
                        <CustomChip size="small" label={`${t('stats.valid')}: ${formatCompact(graphData?.kpis.valid || 0)}`} />
                        <CustomChip size="small" label={`${t('stats.failed')}: ${formatCompact(graphData?.kpis.failed || 0)}`} />
                        <CustomChip size="small" label={`${t('stats.revoked')}: ${formatCompact(graphData?.kpis.revoked || 0)}`} />
                        <CustomChip size="small" label={`${t('stats.validation')}: ${(graphData?.kpis.validationRate || 0).toFixed(2)}%`} />
                        <CustomChip size="small" label={`${t('stats.retry')}: ${(graphData?.kpis.retryFactor || 0).toFixed(2)}x`} />
                        {graphData?.kpis.peak?.key && <CustomChip size="small" label={`${t('stats.peak')}: ${formatCompact(graphData?.kpis.peak.attempts)} @ ${labelFromKey(payloadPassValidator?.groupBy, graphData?.kpis.peak.key)}`} />}
                        {/*payload?.dateRange?.start && <CustomChip size="small" label={`UTC: ${payload?.dateRange.start} → ${payload?.dateRange.end}`} />*/}
                    </Stack>

                </Stack>
            </Box>
        </Box>

    </>
    );

}