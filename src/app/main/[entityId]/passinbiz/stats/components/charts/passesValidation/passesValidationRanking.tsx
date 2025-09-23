import { Box, Stack, Typography } from "@mui/material";
import React from "react";
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
import { usePassinBizStats } from "../../../context/passBizStatsContext";
import usePassesValidationController, { METRIC_COLORS } from "./passesValidation.controller";
import { CustomChip } from "@/components/common/table/CustomChip";
export const PassesValidationRankingChart = () => {
    const t = useTranslations()
    const { graphData } = usePassinBizStats()
    const {loading} = usePassesValidationController()
    return (<>

        {!loading && <Box sx={{ height: 350 }}>
            <Box display={'flex'} flexDirection={'column'} >
                <Typography variant="body1">{t('stats.passesValidationRank')}</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
                <Box sx={{ height: 350, width: '80%' }} >
                    <ResponsiveContainer width="100%" height="100%">
                        {graphData['validator']?.ranking?.length === 0 ? (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                                <EmptyState showIcon={false}
                                    title={t('stats.empthy')}
                                    description={t('stats.empthytext')}
                                />
                            </Stack>
                        ) : (
                            <ComposedChart data={graphData['validator']?.ranking?.map((r: any) => ({ evento: r.event, Valid: r.valid, Failed: r.failed, Revoked: r.revoked }))} margin={{ top: 8, right: 16, left: 8, bottom: 24 }}>
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
                        {graphData['validator']?.ranking?.map((r: any) => ({ evento: r.event, Valid: r.valid, Failed: r.failed, Revoked: r.revoked })).map((e: any, i: any) =>
                            <Box key={i} flexDirection="column" display={'flex'} sx={{ mb: 1 }} gap={1}>
                                <Typography variant="body2">{e.evento}</Typography>
                                <CustomChip key={i} size="small" label={`${t('stats.valid')}:${e.Valid}`} />
                                <CustomChip key={i} size="small" label={`${t('stats.failed')}:${e.Failed}`} />
                                <CustomChip key={i} size="small" label={`${t('stats.revoked')}:${e.Revoked}`} />
                            </Box>
                        )}
                    </Stack>
                </Box>
            </Box>
        </Box>}
    </>
    );



}