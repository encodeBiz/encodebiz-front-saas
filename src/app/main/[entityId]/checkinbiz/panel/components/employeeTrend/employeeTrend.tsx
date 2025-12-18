import { Box, Stack, Typography } from "@mui/material";
import React from "react";
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
import { CustomChip } from "@/components/common/table/CustomChip";
import BoxLoader from "@/components/common/BoxLoader";
import useEmployeeTrendChart from "./employeeTrend.controller";


export const EmployeeTrendChart = () => {
    const t = useTranslations()
    const { graphData, loading } = useEmployeeTrendChart()

   

    return (<>
        <Box sx={{ height: 360 }}>
            <Box display={'flex'} flexDirection={'row'} gap={2} mb={2}>
                <Box display={'flex'} flexDirection={'column'} >
                    <Typography variant="body1">{t('employeeDashboard.employeeTrend')}</Typography>
                    <Typography variant="caption">{t('employeeDashboard.employeeTrendText')}</Typography>
                </Box>
                 
            </Box>
            {loading  && <BoxLoader message={t('core.title.loaderAction') } />}
            {!loading  && <Box display={'flex'} flexDirection={'row'} gap={2}>
                <Box width={'80%'} sx={{ height: 300 }}>
                    {graphData?.monthlyBreakdown.length===0 ? (
                        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                            <EmptyState />
                        </Stack>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={graphData?.monthlyBreakdown} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="monthName" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                          
                                <Line type="monotone" dataKey="count" name={t('employeeDashboard.total')} dot={false} stroke="#1f77b4" strokeWidth={2} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </Box>

                <Box >
                    <Stack direction="column" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                        <CustomChip size="small" label={`${t('employeeDashboard.averagePerMonth')}: ${new Intl.NumberFormat("en-US", { notation: "compact" }).format(graphData?.averagePerMonth|| 0)}`} />
                        <CustomChip size="small" label={`${t('employeeDashboard.totalEmployees')} (Σ): ${new Intl.NumberFormat("en-US", { notation: "compact" }).format(graphData?.totalEmployees || 0)}`} />
                        <CustomChip size="small" label={`${t('employeeDashboard.peakMonth')}: ${new Intl.NumberFormat("en-US", { notation: "compact" }).format(graphData?.peakMonth?.count || 0)}  (${graphData?.peakMonth?.monthName})`} />
                        <CustomChip size="small" label={`${t('employeeDashboard.lowestMonth')}: ${new Intl.NumberFormat("en-US", { notation: "compact" }).format(graphData?.lowestMonth?.count || 0)} (${graphData?.lowestMonth?.monthName})`} />
                       
                    </Stack>
                </Box>
            </Box>}
        </Box>

    </>
    );

}
