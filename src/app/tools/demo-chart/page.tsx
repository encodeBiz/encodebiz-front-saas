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
import { Chip, Stack, Tab, Tabs, Typography } from "@mui/material";
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
// Esperamos una respuesta con una de estas claves: hour | day | month
// Cada clave es un objeto { bucketKey: Array<{ total: number; event: string; eventId?: string }> }
// Ej.:
// {
//   total: 1000,
//   hour: { "9": [{ total: 500, event: "Presentación de PassBiz" }, ...], ... },
//   dateRange: { start: ISO, end: ISO }
// }

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
// SAMPLE (fallback) – igual al ejemplo que compartiste
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
// HELPERS – normalización, construcción de series y ranking
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
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9_]/g, "_");
}

function buildChartData(buckets: Record<string, BucketItem[]>, gb: GroupBy) {
  const keys = sortKeys(gb, Object.keys(buckets));
  const eventNames = uniq(keys.flatMap((k) => (buckets[k] || []).map((i) => i.event)));
  const series = eventNames.map((name) => ({ name, field: safeKey(name) }));

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
      const key = item.event; // o item.eventId ?? item.event
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
// PAGE – Adaptada a tu estilo MUI, con fetch configurable
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
  const [tab, setTab] = React.useState(0);
  const [endpoint, setEndpoint] = React.useState(DEFAULT_ENDPOINT);
  const [payload, setPayload] = React.useState(JSON.stringify(DEFAULT_PAYLOAD, null, 2));
  const [groupBy, setGroupBy] = React.useState<GroupBy>("hour");
  const [useFallback, setUseFallback] = React.useState(true);
  const [showCumulative, setShowCumulative] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [raw, setRaw] = React.useState<any>(null);

  const [data, setData] = React.useState<StatsResponse | null>(SAMPLE_RESPONSE);

  const parsedPayload = React.useMemo(() => {
    try { return JSON.parse(payload); } catch { return null; }
  }, [payload]);

  async function fetchStats() {
    setLoading(true); setError(null); setRaw(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedPayload ?? DEFAULT_PAYLOAD),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setRaw(json);
      const normalized = normalizeApiResponse(json);
      // Detecta automáticamente el groupBy que viene del server
      const gb: GroupBy | null = normalized.hour ? "hour" : normalized.day ? "day" : normalized.month ? "month" : null;
      if (gb) setGroupBy(gb);
      setData(normalized);
    } catch (e: any) {
      setError(e?.message || "Request failed");
      if (useFallback) setData(SAMPLE_RESPONSE);
    } finally {
      setLoading(false);
    }
  }

  const buckets = React.useMemo(() => getBuckets(data ?? SAMPLE_RESPONSE, groupBy), [data, groupBy]);
  const { rows, series } = React.useMemo(() => buildChartData(buckets, groupBy), [buckets, groupBy]);
  const ranking = React.useMemo(() => computeTotalsByEvent(buckets), [buckets]);

  const dr = data?.dateRange ?? SAMPLE_RESPONSE.dateRange;
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
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <Tabs value={tab} onChange={(_,v)=>setTab(v)} aria-label="tabs-demo">
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
                <Chip size="small" label={showCumulative ? "Cumulative: ON" : "Cumulative: OFF"} onClick={()=>setShowCumulative(v=>!v)} />
              </Stack>
            </div>

            {/* TAB 1 – Ranking */}
            <div role="tabpanel" hidden={tab !== 1}>
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
            </div>

            {/* TAB 2 – Endpoint & payload */}
            <div role="tabpanel" hidden={tab !== 2}>
              <Stack spacing={2}>
                <TextField label="Endpoint" value={endpoint} onChange={(e)=>setEndpoint(e.target.value)} size="small" fullWidth />
                <TextField label="Payload (JSON)" value={payload} onChange={(e)=>setPayload(e.target.value)} multiline minRows={10} maxRows={18} fullWidth />
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button variant="contained" onClick={fetchStats} disabled={loading}>{loading ? "Cargando…" : "Fetch"}</Button>
                  <FormControl size="small" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox checked={useFallback} onChange={(e)=>setUseFallback(e.target.checked)} />
                    <ListItemText primary="Usar fallback si falla" />
                  </FormControl>
                </Stack>
                {error && <Alert severity="error">{error}</Alert>}
                {raw && (
                  <Box component="pre" sx={{ p: 2, bgcolor: "#f1f5f9", borderRadius: 2, fontSize: 12, overflow: "auto", maxHeight: 300 }}>
                    {JSON.stringify(raw, null, 2)}
                  </Box>
                )}
              </Stack>
            </div>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
