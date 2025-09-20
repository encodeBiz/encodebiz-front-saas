/* eslint-disable react-hooks/exhaustive-deps */
import { formatCompact } from "@/lib/common/stats";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import usePassesValidationController, { METRIC_COLORS } from "./passesValidation.controller";
import { GroupBy, IPassValidatorStatsRequest } from "../../../model/PassValidator";
import { usePassinBizStats } from "../../../context/passBizStatsContext";
import { CustomChip } from "@/components/common/table/CustomChip";
import { SeriesFilter } from "../../filters/fields/SeriesFilter";

function labelFromKey(gb: GroupBy, key: string) {
    return gb === "hour" ? `${String(key).padStart(2, "0")}:00` : key;
}

export const PassesValidationChart = () => {
    const [showCumulative, setShowCumulative] = React.useState(true);
    const t = useTranslations()
    const { currentEntity } = useEntity()
    const { payloadPassValidatorFilter, seriesChart2 } = usePassinBizStats()
    const { handleFetchStats, loading, graphData } = usePassesValidationController()
    const [seriesStateVisibles, setSeriesStateVisibles] = useState<Array<string>>([...seriesChart2.map(e => e.id)])
    const [seriesEventVisibles, setEventStateVisibles] = useState<Array<string>>([...seriesChart2.map(e => e.id)])


    useEffect(() => {

        if (currentEntity?.entity.id && payloadPassValidatorFilter) {
            handleFetchStats({
                ...payloadPassValidatorFilter,
                // stats: 'PASSES_VALIDATION',
                // entityId: currentEntity?.entity.id

            })
            if (Array.isArray(payloadPassValidatorFilter?.events) && payloadPassValidatorFilter?.events?.length > 0)
                setEventStateVisibles([...payloadPassValidatorFilter?.events?.map(e => e.id)])
        }
    }, [currentEntity?.entity.id, payloadPassValidatorFilter])

    console.log(seriesChart2);

    return (<>
        <Box display={'flex'} flexDirection={'row'} gap={2} mb={2}>
            <Box display={'flex'} flexDirection={'column'} >
                <Typography variant="body1">{t('stats.passesValidation')}</Typography>
                <Typography variant="caption">{t('stats.passesValidationText')}</Typography>
            </Box>
            {loading && <CircularProgress size={24} />}
        </Box>
        <Box display={'flex'} flexDirection={'row'} gap={2}>
            <Box sx={{ height: 400, width: '80%' }}>

                {graphData?.empty ? (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                        <EmptyState showIcon={false}
                            title={t('stats.empthy')}
                            description={t('stats.empthytext')}
                        />
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
                            {seriesChart2?.filter((s: any) => seriesStateVisibles?.includes(s.id)).map((s: any) => (
                                <Bar key={s.id} dataKey={s.id} name={s.name} stackId={s.id}
                                    fill={(s.id.includes('valid') ? METRIC_COLORS.valid : s.id.includes('revoked') ? METRIC_COLORS.revoked : METRIC_COLORS.failed)} />
                            ))}
                            <Line yAxisId="right" type="monotone" dataKey="validationRate" name={t('stats.validation%')} dot={false} strokeWidth={2} />
                            {showCumulative && <Line type="monotone" dataKey="cumulative" name={t('stats.cumulativo')} dot={false} />}
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </Box>
            <Box   >
                <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
                    {/** <CustomChip size="small" label={`${t('stats.dateRange')} (UTC): ${graphData?.dr?.start ?? '-'} → ${graphData?.dr?.end ?? '-'}`} />*/}
                    <Typography variant="body2">{t('stats.series')}</Typography>
                    {seriesChart2.length > 0 && <SeriesFilter seriesChart2={seriesChart2} value={seriesStateVisibles ?? []} onChange={(series: any) => setSeriesStateVisibles(series)} />}

                    <Typography variant="body2">{t('stats.summary')}</Typography>
                    <Stack direction="column" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                        <CustomChip size="small" label={`Total: ${formatCompact(graphData?.data?.total as number ?? 0)}`} />
                        <CustomChip size="small" label={showCumulative ? t('stats.cumulativo') + ": ON" : t('stats.cumulativo') + ": OFF"} onClick={() => setShowCumulative(v => !v)} />
                        <CustomChip size="small" label={`${t('stats.attempts')}: ${formatCompact(graphData?.kpis.attempts || 0)}`} />
                        <CustomChip size="small" label={`${t('stats.valid')}: ${formatCompact(graphData?.kpis.valid || 0)}`} />
                        <CustomChip size="small" label={`${t('stats.failed')}: ${formatCompact(graphData?.kpis.failed || 0)}`} />
                        <CustomChip size="small" label={`${t('stats.revoked')}: ${formatCompact(graphData?.kpis.revoked || 0)}`} />
                        <CustomChip size="small" label={`${t('stats.validation')}: ${(graphData?.kpis.validationRate || 0).toFixed(2)}%`} />
                        <CustomChip size="small" label={`${t('stats.retry')}: ${(graphData?.kpis.retryFactor || 0).toFixed(2)}x`} />
                        {graphData?.kpis.peak?.key && <CustomChip size="small" label={`${t('stats.peak')}: ${formatCompact(graphData?.kpis.peak.attempts)} @ ${labelFromKey(payloadPassValidatorFilter?.groupBy as GroupBy, graphData?.kpis.peak.key)}`} />}
                        {/*payload?.dateRange?.start && <CustomChip size="small" label={`UTC: ${payload?.dateRange.start} → ${payload?.dateRange.end}`} />*/}
                    </Stack>

                </Stack>
            </Box>
        </Box>

    </>
    );

}