/* eslint-disable react-hooks/exhaustive-deps */

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
import usePassesIssuedController, { formatCompact } from "./passesIssued.controller";
import { useEntity } from "@/hooks/useEntity";
import { usePassinBizStats } from "../../../context/passBizStatsContext";
import { CustomChip } from "@/components/common/table/CustomChip";


export const PassesIssuedChart = () => {
    const t = useTranslations()
    const { currentEntity } = useEntity()
    const { payloadPassIssuedFilter } = usePassinBizStats()
    const [showCumulative, setShowCumulative] = React.useState(true);

    const { handleFetchStats, loading, graphData } = usePassesIssuedController()
    useEffect(() => {
        if (currentEntity?.entity.id && payloadPassIssuedFilter)
            handleFetchStats({
                ...payloadPassIssuedFilter,
                stats: 'PASSES_ISSUED',
                entityId: currentEntity?.entity.id
            })
    }, [currentEntity?.entity.id, payloadPassIssuedFilter])

    return (<>
        <Box sx={{ height: 460 }}>
            <Box display={'flex'} flexDirection={'row'} gap={2} mb={2}>
                <Box display={'flex'} flexDirection={'column'} >
                    <Typography variant="body1">{t('stats.passesIssued')}</Typography>
                    <Typography variant="caption">{t('stats.passesIssuedText')}</Typography>
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
                                <Tooltip />
                                <Legend />
                                {graphData?.series.map((s: any) => (
                                    <Bar maxBarSize={25} key={s.field} dataKey={s.field} name={s.name} stackId="events" fill={s.color} />
                                ))}
                                {showCumulative && <Line type="monotone" dataKey="cumulative" name={t('stats.cumulativo')} dot={false} />}
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </Box>

                <Box >
                    <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
                        <CustomChip size="small" label={`Total: ${formatCompact(graphData?.data?.total ?? 0)}`} />
                        <CustomChip size="small" label={`Series: ${graphData?.series.length}`} />
                        <CustomChip size="small" label={`Buckets: ${graphData?.rows.length}`} />
                        <CustomChip size="small" label={showCumulative ? t('stats.cumulativo') + ": ON" : t('stats.cumulativo') + ": OFF"} onClick={() => setShowCumulative(v => !v)} />

                    </Stack>
                </Box>
            </Box>



        </Box>

    </>
    );

}