/* eslint-disable react-hooks/exhaustive-deps */
import { formatCompact } from "@/lib/common/stats";
import { Box, Stack, Typography, Chip } from "@mui/material";
import React from "react";
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
import { ChartData } from "../../page.controller";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/common/EmptyState/EmptyState";


export const PassesIssuedChart = ({ graphData, evenDataList, pending }: { graphData: ChartData | undefined, evenDataList: Array<{ id: string, name: string }>, pending: boolean }) => {
    const [showCumulative, setShowCumulative] = React.useState(true);
    const t = useTranslations()

    return (<>
        <Box>
            <Typography variant="h5" fontWeight={600}>{t('stats.passesIssued')}</Typography>
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
                        {evenDataList.map((s) => (
                            <Bar key={s.id} dataKey={s.id} name={s.name} stackId="events" />
                        ))}
                        {showCumulative && <Line type="monotone" dataKey="cumulative" dot={false} />}
                    </ComposedChart>
                </ResponsiveContainer>
            )}
        </Box>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip size="small" label={`Date Range (UTC): ${graphData?.dr?.start ?? '-'} → ${graphData?.dr?.end ?? '-'}`} />
            <Chip size="small" label={`Total: ${formatCompact(graphData?.data?.total ?? 0)}`} />
            <Chip size="small" label={showCumulative ? "Cumulative: ON" : "Cumulative: OFF"} onClick={() => setShowCumulative(v => !v)} />
        </Stack>
    </>
    );

}