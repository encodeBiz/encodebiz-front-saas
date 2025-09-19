"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { Chip, Stack, Typography } from "@mui/material";
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

// ==========================================================
// DATA CONTRACT – Passes Issued (hour/day/month buckets)
// ==========================================================
type GroupBy = "hour" | "day" | "month";

type BucketItem = { total: number; event: string; eventId?: string };

interface StatsResponse {
  total: number;
  hour?: Record<string, BucketItem[]>;
  day?: Record<string, BucketItem[]>;
  month?: Record<string, BucketItem[]>;
  dateRange?: { start: string; end: string };
  meta?: any;
}

// ==========================================================
// SAMPLE (fallback) – mismo formato
// ==========================================================
const SAMPLE_RESPONSE: StatsResponse = {
  total: 1000,
  hour: {
    "9": [
      { total: 0, event: "Masterclass GROUND" },
      { total: 500, event: "Presentación de PassBiz" },
    ],
    "14": [
      { total: 0, event: "Masterclass GROUND" },
      { total: 500, event: "Presentación de PassBiz" },
    ],
  },
  dateRange: {
    start: "2025-09-12T09:00:00.000Z",
    end: "2025-09-12T22:00:00.000Z",
  },
};

// ==========================================================
// HELPERS – normalización, series, ranking
// ==========================================================
function normalizeApiResponse(json: any): StatsResponse {
  const root = json?.result ?? json?.output ?? json?.data ?? json ?? {};
  const hour = root.hour ?? root.hours ?? root.hourly;
  const day = root.day ?? root.days ?? root.daily;
  const month = root.month ?? root.months ?? root.monthly;
  const total = root.total ?? root.kpis?.total ?? root.kpis?.totalIssued ?? 0;
  const dateRange = root.dateRange ?? root.meta?.dateRangeApplied ?? undefined;
  return { total, hour, day, month, dateRange, meta: root.meta } as StatsResponse;
}
function getBuckets(resp: StatsResponse, gb: GroupBy) {
  return (resp?.[gb] ?? {}) as Record<string, BucketItem[]>;
}
function sortKeys(gb: GroupBy, keys: string[]) {
  if (gb === "hour") return keys.map(Number).sort((a, b) => a - b).map(String);
  return keys.sort((a, b) => a.localeCompare(b)); // YYYY-MM(-DD)
}
function uniq<T>(arr: T[]): T[] { return Array.from(new Set(arr)); }
function safeKey(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9_]/g, "_");
}
const PALETTE = [
  "#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd",
  "#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf",
  "#023047","#fb8500","#219ebc","#8ecae6","#ffb703",
  "#6a994e","#e76f51","#8338ec","#3a86ff","#ff006e"
];
function hashString(str: string) { let h = 2166136261>>>0; for (let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h,16777619);} return h>>>0; }
function colorFor(key: string) { return PALETTE[hashString(key) % PALETTE.length]; }

function buildChartData(buckets: Record<string, BucketItem[]>, gb: GroupBy) {
  const keys = sortKeys(gb, Object.keys(buckets));
  const eventNames = uniq(keys.flatMap((k) => (buckets[k] || []).map((i) => i.event)));
  const series = eventNames.map((name) => {
    const field = safeKey(name);
    return { name, field, color: colorFor(field) };
  });

  let cumulative = 0;
  const rows = keys.map((k) => {
    const row: any = { key: k };
    let total = 0;
    for (const s of series) {
      const found = (buckets[k] || []).find((i) => i.event === s.name);
      const v = found ? found.total : 0;
      row[s.field] = v;
      total += v;
    }
    cumulative += total;
    row.total = total;
    row.cumulative = cumulative;
    row.label = gb === "hour" ? `${String(k).padStart(2, "0")}:00` : k;
    return row;
  });

  return { rows, series };
}
function computeTotalsByEvent(buckets: Record<string, BucketItem[]>) {
  const map = new Map<string, { event: string; total: number }>();
  Object.keys(buckets).forEach((k) => {
    (buckets[k] || []).forEach((item) => {
      const key = item.event;
      const prev = map.get(key) ?? { event: item.event, total: 0 };
      prev.total += item.total || 0;
      map.set(key, prev);
    });
  });
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}
function formatCompact(n: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);
}

// ==========================================================
// PAGE – estilo Analytics (sin tabs). Filtros en su card.
// ==========================================================
const DEFAULT_ENDPOINT =
  "https://us-central1-encodebiz-services.cloudfunctions.net/apiV100-firebaseEntryHttp-passinbiz-statsGetdata";

const DEFAULT_PAYLOAD = {
  entityId: "z1YRV6s6ueqnJpIvInFL",
  stats: "PASSES_ISSUED",
  dateRange: {
    start: "2025-09-12T09:00:00.000Z",
    end: "2025-09-12T22:00:00.000Z",
  },
  groupBy: "hour",
  type: "event",
  passStatus: "active",
  events: [
    { id: "DAhykI0IAJAWA9Ip9TGW", name: "Masterclass GROUND" },
    { id: "ItjpMhJf4dJAkbZR5zkf", name: "Presentación de PassBiz" },
  ],
};

export default function Page() {
  // Header
  const [groupBy, setGroupBy] = React.useState<GroupBy>("hour");
  const [showCumulative, setShowCumulative] = React.useState(true);

  // Data
  const [endpoint, setEndpoint] = React.useState(DEFAULT_ENDPOINT);
  const [payload, setPayload] = React.useState(JSON.stringify(DEFAULT_PAYLOAD, null, 2));
  const [useFallback, setUseFallback] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [raw, setRaw] = React.useState<any>(null);
  const [data, setData] = React.useState<StatsResponse | null>(SAMPLE_RESPONSE);

  const parsedPayload = React.useMemo(() => { try { return JSON.parse(payload); } catch { return null; } }, [payload]);

  async function fetchStats() {
    setLoading(true); setError(null); setRaw(null);
    try {
      const body = { ...(parsedPayload ?? DEFAULT_PAYLOAD), groupBy };
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setRaw(json);
      const normalized = normalizeApiResponse(json);
      const gb: GroupBy | null = normalized.hour ? "hour" : normalized.day ? "day" : normalized.month ? "month" : null;
      if (gb) setGroupBy(gb);
      setData(normalized);
    } catch (e:any) {
      setError(e?.message || "Request failed");
      if (useFallback) setData(SAMPLE_RESPONSE);
    } finally { setLoading(false); }
  }

  // Derived
  const buckets = React.useMemo(() => getBuckets(data ?? SAMPLE_RESPONSE, groupBy), [data, groupBy]);
  const { rows, series } = React.useMemo(() => buildChartData(buckets, groupBy), [buckets, groupBy]);
  const ranking = React.useMemo(() => computeTotalsByEvent(buckets), [buckets]);
  const dr = data?.dateRange ?? SAMPLE_RESPONSE.dateRange;
  const empty = rows.length === 0 || series.length === 0;

  // Series visibles
  const SERIES_OPTIONS = series.map((s) => ({ id: s.field, name: s.name, color: s.color }));
  const [visibleSeries, setVisibleSeries] = React.useState<string[]>(SERIES_OPTIONS.map(s => s.id));
  React.useEffect(() => { setVisibleSeries(SERIES_OPTIONS.map(s => s.id)); }, [series.length]);

  return (
    <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        {/* Header */}
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>Passes Issued</Typography>
          <Typography variant="body2" color="text.secondary">
            Barras apiladas por evento y línea de acumulado. Rango UTC.
          </Typography>
        </Stack>

        {/* Filtros (card propia) */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} justifyContent="space-between">
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel id="gb-label">groupBy</InputLabel>
                  <Select labelId="gb-label" label="groupBy" value={groupBy} onChange={(e)=>setGroupBy(e.target.value as GroupBy)}>
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
                    renderValue={(selected) => (selected as string[]).map(id => SERIES_OPTIONS.find(o=>o.id===id)?.name ?? id).join(', ')}
                  >
                    {SERIES_OPTIONS.map(o => (
                      <MenuItem key={o.id} value={o.id}>
                        <Checkbox checked={visibleSeries.indexOf(o.id) > -1} />
                        <ListItemText primary={o.name} />
                        <Box sx={{ width: 12, height: 12, bgcolor: o.color, borderRadius: 0.5, ml: 1 }} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Chip
                  size="small"
                  label={showCumulative ? "Cumulative: ON" : "Cumulative: OFF"}
                  onClick={()=>setShowCumulative(v=>!v)}
                  variant={showCumulative ? "filled" : "outlined"}
                />
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={fetchStats} disabled={loading}>
                  {loading ? "Cargando…" : "Aplicar filtros"}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* KPIs arriba de la gráfica */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
          <Chip size="small" label={`Date Range (UTC): ${dr?.start ?? '-'} → ${dr?.end ?? '-'}`} />
          <Chip size="small" label={`Total: ${formatCompact(data?.total ?? 0)}`} />
          <Chip size="small" label={`Series: ${series.length}`} />
          <Chip size="small" label={`Buckets: ${rows.length}`} />
        </Stack>

        {/* Gráfica principal */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ height: 440 }}>
              {empty ? (
                <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                  <Typography color="text.secondary" variant="body2">No hay datos para mostrar. Ajusta filtros o usa fallback.</Typography>
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
                      <Bar key={s.field} dataKey={s.field} name={s.name} stackId="events" fill={s.color} />
                    ))}
                    {showCumulative && <Line type="monotone" dataKey="cumulative" name="Cumulative" dot={false} />}
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Ranking por evento */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Ranking por evento</Typography>
            <Box sx={{ height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={ranking.map(r=>({ evento: r.event, total: r.total }))} margin={{ top: 8, right: 16, left: 8, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="evento" angle={-10} height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total por evento" radius={[6,6,0,0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Origen de datos (endpoint/payload) */}
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Origen de datos</Typography>
            <Stack spacing={2}>
              <TextField label="Endpoint" value={endpoint} onChange={(e)=>setEndpoint(e.target.value)} size="small" fullWidth />
              <TextField label="Payload (JSON)" value={payload} onChange={(e)=>setPayload(e.target.value)} multiline minRows={8} maxRows={18} fullWidth />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Checkbox checked={useFallback} onChange={(e)=>setUseFallback(e.target.checked)} />
                  <ListItemText primary="Usar fallback si falla" />
                </Stack>
                <Button variant="contained" onClick={fetchStats} disabled={loading}>
                  {loading ? "Cargando…" : "Fetch"}
                </Button>
              </Stack>
              {error && <Alert severity="error">{error}</Alert>}
              {raw && (
                <Box component="pre" sx={{ p: 2, bgcolor: "#f1f5f9", borderRadius: 2, fontSize: 12, overflow: "auto", maxHeight: 300 }}>
                  {JSON.stringify(raw, null, 2)}
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
