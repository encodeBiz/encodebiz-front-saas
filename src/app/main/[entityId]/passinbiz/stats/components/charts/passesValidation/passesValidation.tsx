/* eslint-disable react-hooks/exhaustive-deps */
import { formatCompact } from "@/lib/common/stats";
import { Box, Stack, Typography, Chip, CircularProgress } from "@mui/material";
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
import { GroupBy, IStatsRequest } from "@/domain/features/passinbiz/IStats";
import { useEntity } from "@/hooks/useEntity";
import usePassesValidationController from "./passesValidation.controller";

function labelFromKey(gb: GroupBy, key: string) {
    return gb === "hour" ? `${String(key).padStart(2, "0")}:00` : key;
}

export const PassesValidationChart = ({ payload, type = "PASSES_ISSUED" }: { payload: IStatsRequest, type?: "PASSES_ISSUED" | "PASSES_VALIDATION" }) => {
    const [showCumulative, setShowCumulative] = React.useState(true);
    const t = useTranslations()
    const { currentEntity } = useEntity()
    const { handleFetchStats, loading, graphData } = usePassesValidationController()
    useEffect(() => {
        if (currentEntity?.entity.id)
            handleFetchStats({ ...payload, stats: type, entityId: currentEntity?.entity.id })
    }, [currentEntity?.entity.id, payload])

    return (<>

        <Typography>Validación: Intentos vs Éxitos vs Revocados</Typography>
        <Box  >
            {loading && <CircularProgress />}
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
                        {graphData?.series?.map((s: any) => (
                            <Bar key={s.id} dataKey={s.stackId} name={s.name} stackId={s.stackId} fill={s.color} />
                        ))}
                        <Line yAxisId="right" type="monotone" dataKey="validationRate" name="Validation %" dot={false} strokeWidth={2} />
                        {showCumulative && <Line type="monotone" dataKey="cumulative" name="Cumulative" dot={false} />}
                    </ComposedChart>
                </ResponsiveContainer>
            )}

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {/** <Chip size="small" label={`${t('stats.dateRange')} (UTC): ${graphData?.dr?.start ?? '-'} → ${graphData?.dr?.end ?? '-'}`} />*/}
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                    <Chip size="small" label={`Total: ${formatCompact(graphData?.data?.total as number ?? 0)}`} />
                    <Chip size="small" label={showCumulative ? t('stats.cumulativo') + ": ON" : t('stats.cumulativo') + ": OFF"} onClick={() => setShowCumulative(v => !v)} />
                    <Chip size="small" label={`Attempts: ${formatCompact(graphData?.kpis.attempts || 0)}`} />
                    <Chip size="small" label={`Valid: ${formatCompact(graphData?.kpis.valid || 0)}`} />
                    <Chip size="small" label={`Failed: ${formatCompact(graphData?.kpis.failed || 0)}`} />
                    <Chip size="small" label={`Revoked: ${formatCompact(graphData?.kpis.revoked || 0)}`} />
                    <Chip size="small" label={`Validation: ${(graphData?.kpis.validationRate || 0).toFixed(2)}%`} />
                    <Chip size="small" label={`Retry: ${(graphData?.kpis.retryFactor || 0).toFixed(2)}x`} />
                    {graphData?.kpis.peak?.key && <Chip size="small" label={`Peak: ${formatCompact(graphData?.kpis.peak.attempts)} @ ${labelFromKey(payload?.groupBy, graphData?.kpis.peak.key)}`} />}
                    {/*payload?.dateRange?.start && <Chip size="small" label={`UTC: ${payload?.dateRange.start} → ${payload?.dateRange.end}`} />*/}
                </Stack>

            </Stack>
        </Box>

    </>
    );

}