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
// DATA CONTRACT – Validation (hour/day/month buckets)
// ==========================================================
// Esperamos una respuesta con claves: hour | day | month
// Cada clave: { bucketKey: Array<{ total: {valid,failed,revoked} | number, event: string }> }
// - Si total es number, se interpreta como "valid" (retrocompatibilidad).
// - KPIs: Validation% (valid/attempts), RetryFactor (attempts/valid), Peak attempts por bucket.

type GroupBy = "hour" | "day" | "month";

type ValidationTotals = { failed: number; valid: number; revoked: number };
type BucketTotals = number | ValidationTotals;
type BucketItem = { total: BucketTotals; event: string; eventId?: string };

interface StatsResponse {
  total?: number | ValidationTotals; // no se usa; recalculamos
  hour?: Record<string, BucketItem[]>;
  day?: Record<string, BucketItem[]>;
  month?: Record<string, BucketItem[]>;
  dateRange?: { start: string; end: string };
  meta?: any;
}

// ==========================================================
// HELPERS – normalización, claves, colores, KPIs
// ==========================================================

function normalizeApiResponse(json: any): StatsResponse {
  const root = json?.result ?? json?.output ?? json?.data ?? json ?? {};
  const hour = root.hour ?? root.hours ?? root.hourly;
  const day = root.day ?? root.days ?? root.daily;
  const month = root.month ?? root.months ?? root.monthly;
  const dateRange = root.dateRange ?? root.meta?.dateRangeApplied ?? undefined;
  return { hour, day, month, dateRange, meta: root.meta } as StatsResponse;
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
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_]/g, "_");
}
function initialsFromName(name: string) {
  const clean = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9 ]/g, " ").trim();
  const stop = new Set(["de","del","la","las","el","los","y","en","para","por","con","a","al","the","of","and"]);
  const words = clean.split(/\s+/).filter(w => !stop.has(w.toLowerCase()));
  if (!words.length) return "NA";
  if (words.length === 1) return words[0].slice(0,2).toUpperCase();
  return words.map(w => w[0].toUpperCase()).join("").slice(0,6);
}

// Colores fijos por MÉTRICA (consistentes entre eventos)
const METRIC_COLORS: Record<keyof ValidationTotals, string> = {
  valid:   "#16a34a", // verde
  failed:  "#dc2626", // rojo
  revoked: "#f59e0b", // ámbar
};
const METRIC_ABBR: Record<keyof ValidationTotals, string> = { valid: "V", failed: "F", revoked: "R" };

function formatCompact(n: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
function labelFromKey(gb: GroupBy, key: string) {
  return gb === "hour" ? `${String(key).padStart(2, "0")}:00` : key;
}

// Mapea buckets -> filas + series (evento x métrica) apiladas por evento
function buildChartData(buckets: Record<string, BucketItem[]>, gb: GroupBy) {
  const keys = sortKeys(gb, Object.keys(buckets));
  const events = uniq(keys.flatMap(k => (buckets[k] || []).map(i => i.event)));

  const series = events.flatMap((ev) => {
    const evField = safeKey(ev);
    const short = initialsFromName(ev);
    return (["valid","failed","revoked"] as (keyof ValidationTotals)[]).map((m) => ({
      name: `${short}-${METRIC_ABBR[m]}`,
      fullName: `${ev} (${m})`,
      field: `${evField}__${m}`,
      metric: m,
      stackId: evField,              // apila V/F/R por evento
      color: METRIC_COLORS[m],
    }));
  });

  let cumulative = 0;
  const rows = keys.map((k) => {
    const row: any = { key: k };
    let totalAll = 0;
    let validSum = 0, attemptsSum = 0;

    for (const ev of events) {
      const item = (buckets[k] || []).find(i => i.event === ev);
      const totals = (item?.total ?? 0) as BucketTotals;

      const vt: ValidationTotals = typeof totals === "number"
        ? { valid: totals, failed: 0, revoked: 0 }
        : { valid: totals.valid || 0, failed: totals.failed || 0, revoked: totals.revoked || 0 };

      const evField = safeKey(ev);
      row[`${evField}__valid`]   = vt.valid;
      row[`${evField}__failed`]  = vt.failed;
      row[`${evField}__revoked`] = vt.revoked;

      validSum    += vt.valid;
      attemptsSum += vt.valid + vt.failed + vt.revoked;
      totalAll    += vt.valid + vt.failed + vt.revoked;
    }

    cumulative += totalAll;
    row.total = totalAll;
    row.cumulative = cumulative;
    row.validationRate = attemptsSum > 0 ? +(validSum / attemptsSum * 100).toFixed(2) : 0;
    row.label = labelFromKey(gb, k);

    return row;
  });

  return { rows, series };
}

// Ranking por evento (ordena por "valid") + agregados
function computeTotalsByEvent(buckets: Record<string, BucketItem[]>) {
  const map = new Map<string, { event: string; valid: number; failed: number; revoked: number; attempts: number }>();
  Object.keys(buckets).forEach((k) => {
    (buckets[k] || []).forEach((item) => {
      const key = item.event;
      const totals = (item?.total ?? 0) as BucketTotals;
      const vt: ValidationTotals = typeof totals === "number"
        ? { valid: totals, failed: 0, revoked: 0 }
        : { valid: totals.valid || 0, failed: totals.failed || 0, revoked: totals.revoked || 0 };
      const prev = map.get(key) ?? { event: key, valid: 0, failed: 0, revoked: 0, attempts: 0 };
      prev.valid += vt.valid; prev.failed += vt.failed; prev.revoked += vt.revoked; prev.attempts += vt.valid + vt.failed + vt.revoked;
      map.set(key, prev);
    });
  });
  return Array.from(map.values()).sort((a, b) => b.valid - a.valid);
}

function computeKPIs(buckets: Record<string, BucketItem[]>, gb: GroupBy) {
  let valid = 0, failed = 0, revoked = 0;
  let peakAttempts = 0; let peakKey: string | null = null;
  const keys = sortKeys(gb, Object.keys(buckets));
  for (const k of keys) {
    let bucketAttempts = 0;
    for (const item of (buckets[k] || [])) {
      const totals = (item?.total ?? 0) as BucketTotals;
      const vt: ValidationTotals = typeof totals === "number"
        ? { valid: totals, failed: 0, revoked: 0 }
        : { valid: totals.valid || 0, failed: totals.failed || 0, revoked: totals.revoked || 0 };
      valid += vt.valid; failed += vt.failed; revoked += vt.revoked;
      bucketAttempts += vt.valid + vt.failed + vt.revoked;
    }
    if (bucketAttempts > peakAttempts) { peakAttempts = bucketAttempts; peakKey = k; }
  }
  const attempts = valid + failed + revoked;
  const validationRate = attempts > 0 ? +(valid / attempts * 100).toFixed(2) : 0;
  const retryFactor = valid > 0 ? +((attempts / valid)).toFixed(2) : 0;
  return { attempts, valid, failed, revoked, validationRate, retryFactor, peak: { key: peakKey, attempts: peakAttempts } };
}

// ==========================================================
// PAGE – con fetch configurable y KPIs
// ==========================================================

const DEFAULT_ENDPOINT =
  "https://us-central1-encodebiz-services.cloudfunctions.net/apiV100-firebaseEntryHttp-passinbiz-statsGetdata";

const DEFAULT_PAYLOAD = {
  entityId: "z1YRV6s6ueqnJpIvInFL",
  stats: "PASSES_VALIDATION", // <-- importante
  dateRange: {
    start: "2025-09-16T09:00:00.000Z",
    end: "2025-09-16T22:00:00.000Z",
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
  const [showCumulative, setShowCumulative] = React.useState(false); // acumulado no es tan útil aquí
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [raw, setRaw] = React.useState<any>(null);

  const [data, setData] = React.useState<StatsResponse | null>(null);

  const parsedPayload = React.useMemo(() => {
    try { return JSON.parse(payload); } catch { return null; }
  }, [payload]);

  async function fetchStats() {
    setLoading(true); setError(null); setRaw(null);
    try {
      const body = { ...parsedPayload }; // fuerza groupBy actual
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setRaw(json);
      setData(normalizeApiResponse(json));
    } catch (e: any) {
      setError(e?.message || "Request failed");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const buckets = React.useMemo(() => getBuckets(data || ({} as StatsResponse), groupBy), [data, groupBy]);
  const { rows, series } = React.useMemo(() => buildChartData(buckets, groupBy), [buckets, groupBy]);
  const ranking = React.useMemo(() => computeTotalsByEvent(buckets), [buckets]);
  const kpis = React.useMemo(() => computeKPIs(buckets, groupBy), [buckets, groupBy]);

  const dr = data?.dateRange; const empty = rows.length === 0 || series.length === 0;

  const SERIES_OPTIONS = series.map((s) => ({ id: s.field, name: s.name }));
  const [visibleSeries, setVisibleSeries] = React.useState<string[]>(SERIES_OPTIONS.map(s => s.id));
  React.useEffect(() => { setVisibleSeries(SERIES_OPTIONS.map(s => s.id)); }, [series.length]);

  console.log(SERIES_OPTIONS);
  
  return (
    <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "flex-end" }} justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>Validación: Intentos vs Éxitos vs Revocados</Typography>
            <Typography variant="body2" color="text.secondary">Apilado por evento (V/F/R) + línea de % validación global por bucket.</Typography>
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

        {/* KPIs */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
          <Chip size="small" label={`Attempts: ${formatCompact(kpis.attempts || 0)}`} />
          <Chip size="small" label={`Valid: ${formatCompact(kpis.valid || 0)}`} />
          <Chip size="small" label={`Failed: ${formatCompact(kpis.failed || 0)}`} />
          <Chip size="small" label={`Revoked: ${formatCompact(kpis.revoked || 0)}`} />
          <Chip size="small" label={`Validation: ${(kpis.validationRate || 0).toFixed(2)}%`} />
          <Chip size="small" label={`Retry: ${(kpis.retryFactor || 0).toFixed(2)}x`} />
          {kpis.peak?.key && <Chip size="small" label={`Peak: ${formatCompact(kpis.peak.attempts)} @ ${labelFromKey(groupBy, kpis.peak.key)}`} />}
          {dr?.start && <Chip size="small" label={`UTC: ${dr.start} → ${dr.end}`} />}
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
              <Box sx={{ height: 440 }}>
                {empty ? (
                  <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                    <Typography color="text.secondary" variant="body2">No hay datos para mostrar. Ajusta el rango o revisa el error del fetch.</Typography>
                  </Stack>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={rows} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <YAxis yAxisId="right" orientation="right" domain={[0,100]} tickFormatter={(v)=>`${v}%`} />
                      <Tooltip />
                      <Legend />
                      {series.filter(s => visibleSeries.includes(s.field)).map((s) => (
                        <Bar key={s.field} dataKey={s.field} name={s.name} stackId={s.stackId} fill={s.color} />
                      ))}
                      <Line yAxisId="right" type="monotone" dataKey="validationRate" name="Validation %" dot={false} strokeWidth={2} />
                      {showCumulative && <Line type="monotone" dataKey="cumulative" name="Cumulative" dot={false} />}
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </div>

            {/* TAB 1 – Ranking */}
            <div role="tabpanel" hidden={tab !== 1}>
              <Box sx={{ height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={ranking.map(r=>({ evento: r.event, Valid: r.valid, Failed: r.failed, Revoked: r.revoked }))} margin={{ top: 8, right: 16, left: 8, bottom: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="evento" angle={-10} height={60} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Valid" name="Valid" fill={METRIC_COLORS.valid} radius={[6,6,0,0]} />
                    <Bar dataKey="Failed" name="Failed" fill={METRIC_COLORS.failed} radius={[6,6,0,0]} />
                    <Bar dataKey="Revoked" name="Revoked" fill={METRIC_COLORS.revoked} radius={[6,6,0,0]} />
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
