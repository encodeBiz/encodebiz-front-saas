/* eslint-disable react-hooks/exhaustive-deps */
import { SassButton } from "@/components/common/buttons/GenericButton";
import { GroupBy, IStatsRequest, IStatsResponse } from "@/domain/features/passinbiz/IStats";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { buildChartData, computeTotalsByEvent, formatCompact, getBuckets, normalizeApiResponse } from "@/lib/common/stats";
import { fetchStats } from "@/services/passinbiz/holder.service";
import { Box, Stack, Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Card, Tabs, Tab, CardContent, Chip, TextField, Button, Alert } from "@mui/material";
import React from "react";
import { useState } from "react";
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
export const PassesIssuedComponentChart = () => {
    const [tab, setTab] = React.useState(0);
    const [showCumulative, setShowCumulative] = React.useState(true);
    const [useFallback, setUseFallback] = React.useState(true);

    const [loading, setLoading] = useState(false);
    const [payload, setPayload] = useState<IStatsRequest>();
    const [data, setData] = useState<IStatsResponse>();
    const [groupBy, setGroupBy] = useState<GroupBy>("hour");
    const { token } = useAuth()
    const { showToast } = useToast()
    async function handleFetchStats() {
        setLoading(true);
        fetchStats(payload as IStatsRequest, token).then(res => {
            const normalized = normalizeApiResponse(res);
            // Detecta automáticamente el groupBy que viene del server
            const gb: GroupBy | null = normalized.hour ? "hour" : normalized.day ? "day" : normalized.month ? "month" : null;
            if (gb) setGroupBy(gb);
            setData(normalized);
        }).catch(e => {
            showToast(e?.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }

    const buckets = React.useMemo(() => getBuckets(data as IStatsResponse, groupBy), [data, groupBy]);
    const { rows, series } = React.useMemo(() => buildChartData(buckets, groupBy), [buckets, groupBy]);
    const ranking = React.useMemo(() => computeTotalsByEvent(buckets), [buckets]);

    const dr = data?.dateRange ?? (data as IStatsResponse).dateRange;
    const empty = rows.length === 0 || series.length === 0;

    // Para ocultar/mostrar series en la gráfica
    const SERIES_OPTIONS = series.map((s) => ({ id: s.field, name: s.name }));
    const [visibleSeries, setVisibleSeries] = React.useState<string[]>(SERIES_OPTIONS.map(s => s.id));
    React.useEffect(() => { setVisibleSeries(SERIES_OPTIONS.map(s => s.id)); }, [series.length]);

    return (
        <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
            <Box sx={{ maxWidth: 1200, mx: "auto" }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "flex-end" }} justifyContent="space-between" sx={{ mb: 2 }}>
                    <Box>
                        <Typography variant="h5" fontWeight={600}>Passes Issued</Typography>
                        <Typography variant="body2" color="text.secondary">Barras apiladas por evento + línea acumulada. Rango UTC.</Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel id="gb-label">groupBy</InputLabel>
                            <Select labelId="gb-label" label="groupBy" value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupBy)}>
                                <MenuItem value="hour">hour</MenuItem>
                                <MenuItem value="day">day</MenuItem>
                                <MenuItem value="month">month</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 320 }}>
                            <InputLabel id="series-label">Series visibles</InputLabel>
                            <Select
                                multiple
                                labelId="series-label"
                                label="Series visibles"
                                value={visibleSeries}
                                onChange={(e) => setVisibleSeries(typeof e.target.value === 'string' ? (e.target.value as string).split(',') : (e.target.value as string[]))}
                                renderValue={(selected) => (selected as string[]).map(id => SERIES_OPTIONS.find(o => o.id === id)?.name ?? id).join(', ')}
                            >
                                {SERIES_OPTIONS.map(o => (
                                    <MenuItem key={o.id} value={o.id}>
                                        <Checkbox checked={visibleSeries.indexOf(o.id) > -1} />
                                        <ListItemText primary={o.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>

                <Card variant="outlined" sx={{ mb: 2 }}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="tabs-demo">
                        <Tab label="Gráfica" id="tab-0" aria-controls="tabpanel-0" />
                        <Tab label="Ranking por evento" id="tab-1" aria-controls="tabpanel-1" />
                        <Tab label="Endpoint" id="tab-2" aria-controls="tabpanel-2" />
                    </Tabs>

                    <CardContent>
                        {/* TAB 0 – Chart */}
                        <div role="tabpanel" hidden={tab !== 0}>
                            <Box sx={{ height: 420 }}>
                                {empty ? (
                                    <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                                        <Typography color="text.secondary" variant="body2">No hay datos para mostrar. Ajusta el rango o usa el fallback.</Typography>
                                    </Stack>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={rows} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="label" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            {series.filter(s => visibleSeries.includes(s.field)).map((s) => (
                                                <Bar key={s.field} dataKey={s.field} name={s.name} stackId="events" />
                                            ))}
                                            {showCumulative && <Line type="monotone" dataKey="cumulative" dot={false} />}
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Chip size="small" label={`Date Range (UTC): ${dr?.start ?? '-'} → ${dr?.end ?? '-'}`} />
                                <Chip size="small" label={`Total: ${formatCompact(data?.total ?? 0)}`} />
                                <Chip size="small" label={showCumulative ? "Cumulative: ON" : "Cumulative: OFF"} onClick={() => setShowCumulative(v => !v)} />
                            </Stack>
                        </div>

                        {/* TAB 1 – Ranking */}
                        <div role="tabpanel" hidden={tab !== 1}>
                            <Box sx={{ height: 380 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={ranking.map(r => ({ evento: r.event, total: r.total }))} margin={{ top: 8, right: 16, left: 8, bottom: 24 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="evento" angle={-10} height={60} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="total" name="Total por evento" radius={[6, 6, 0, 0]} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </Box>
                        </div>

                        {/* TAB 2 – Endpoint & payload */}
                        <div role="tabpanel" hidden={tab !== 2}>
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <SassButton variant="contained" onClick={handleFetchStats} disabled={loading}>{loading ? "Cargando…" : "Fetch"}</SassButton>
                                    <FormControl size="small" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Checkbox checked={useFallback} onChange={(e) => setUseFallback(e.target.checked)} />
                                        <ListItemText primary="Usar fallback si falla" />
                                    </FormControl>
                                </Stack>
                          
                                 
                            </Stack>
                        </div>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );

}