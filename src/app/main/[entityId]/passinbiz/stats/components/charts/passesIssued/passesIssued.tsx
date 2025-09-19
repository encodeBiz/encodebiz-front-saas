/* eslint-disable react-hooks/exhaustive-deps */

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
import usePassesIssuedController, { formatCompact } from "./passesIssued.controller";
import { IStatsRequest } from "@/domain/features/passinbiz/IStats";
import { useEntity } from "@/hooks/useEntity";


export const PassesIssuedChart = ({ payload, type = "PASSES_ISSUED" }: { payload: IStatsRequest, type?: "PASSES_ISSUED" | "PASSES_VALIDATION" }) => {
    const [showCumulative, setShowCumulative] = React.useState(true);
    const t = useTranslations()
    const { currentEntity } = useEntity()
    const { handleFetchStats, loading, graphData } = usePassesIssuedController()
    useEffect(() => {
        if (currentEntity?.entity.id)
            handleFetchStats({ ...payload, stats: type, })
    }, [currentEntity?.entity.id, payload])

    return (<>
        <Box sx={{ height: 400  }}>
            <Typography variant="body1">{t('stats.passesIssued')}</Typography>
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
                        <Tooltip />
                        <Legend />
                        {graphData?.series.map((s: any) => (
                            <Bar  key={s.field} dataKey={s.field} name={s.name} stackId="events" fill={s.color} />
                        ))}
                        {showCumulative && <Line type="monotone" dataKey="cumulative" dot={false} />}
                    </ComposedChart>
                </ResponsiveContainer>
            )}

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {/**<Chip size="small" label={`${t('stats.dateRange')} (UTC): ${graphData?.dr?.start ?? '-'} → ${graphData?.dr?.end ?? '-'}`} /> */}
                <Chip size="small" label={`Total: ${formatCompact(graphData?.data?.total ?? 0)}`} />
                <Chip size="small" label={showCumulative ? t('stats.cumulativo') + ": ON" : t('stats.cumulativo') + ": OFF"} onClick={() => setShowCumulative(v => !v)} />
            </Stack>
        </Box>

    </>
    );

}