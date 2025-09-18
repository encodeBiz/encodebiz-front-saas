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
import usePassesIssuedController from "./passesIssued.controller";
import { IStatsRequest } from "@/domain/features/passinbiz/IStats";
import { useEntity } from "@/hooks/useEntity";


export const PassesIssuedChart = ({ payload }: { payload: IStatsRequest }) => {
    const [showCumulative, setShowCumulative] = React.useState(true);
    const t = useTranslations()
    const { currentEntity } = useEntity()
    const { handleFetchStats, loading, graphData } = usePassesIssuedController()
    useEffect(() => {
        if (currentEntity?.entity.id)
            handleFetchStats({ ...payload, entityId: currentEntity?.entity.id })
    }, [currentEntity?.entity.id, payload])

    return (<>
 
        <Box>
            <Typography variant="h5" fontWeight={600}>{t('stats.passesIssued')} {loading && <CircularProgress />}</Typography>
            <Typography variant="body2" color="text.secondary">{t('stats.passesIssuedText')}</Typography>
        </Box>
        <Box sx={{ height: 420 }}>
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
                        <Tooltip />
                        <Legend />
                        {payload.events?.map((s) => (
                            <Bar key={s.id} dataKey={s.id} name={s.name} stackId="events" />
                        ))}
                        {showCumulative && <Line type="monotone" dataKey="cumulative" dot={false} />}
                    </ComposedChart>
                </ResponsiveContainer>
            )}
        </Box>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip size="small" label={`${t('stats.dateRange')} (UTC): ${graphData?.dr?.start ?? '-'} → ${graphData?.dr?.end ?? '-'}`} />
            <Chip size="small" label={`Total: ${formatCompact(graphData?.data?.total ?? 0)}`} />
            <Chip size="small" label={showCumulative ? t('stats.cumulativo') + ": ON" : t('stats.cumulativo') + ": OFF"} onClick={() => setShowCumulative(v => !v)} />
        </Stack>
    </>
    );

}