"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { Chip, Stack, Typography } from "@mui/material";
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

// =======================
// Tipos y normalización
// =======================
type TrendItem = { total: number; event?: string; type?: string };
type TrendBucket = TrendItem[] | { passes?: number; credentials?: number; events?: number };
interface TrendResponse {
  month?: Record<string, TrendBucket>;
  dateRange?: { start: string; end: string };
  meta?: any;
}

function normalizeTrendResponse(json: any): TrendResponse {
  const root = json?.result ?? json?.output ?? json?.data ?? json ?? {};
  return {
    month: root.month ?? root.months ?? root.monthly ?? root.trend,
    dateRange: root.dateRange ?? root.meta?.dateRangeApplied ?? undefined,
    meta: root.meta,
  } as TrendResponse;
}

// Sinónimos flexibles
const PASS_TOKENS = ["pass","passes","pase","pases","event","events","evento","eventos","issued"];
const CRED_TOKENS = ["cred","credential","credentials","credencial","credenciales"];
const isPass = (s: string) => PASS_TOKENS.some(t => s.includes(t));
const isCred = (s: string) => CRED_TOKENS.some(t => s.includes(t));

function formatMonthLabel(key: string) {
  // key: "YYYY-MM"
  const d = new Date(`${key}-01T00:00:00Z`);
  return d.toLocaleDateString("es-ES", { month: "short", year: "2-digit" });
}

function buildMonthlyRows(month?: Record<string, TrendBucket>) {
  const m = month ?? {};
  const keys = Object.keys(m).sort((a,b)=>a.localeCompare(b));
  const rows = keys.map(k => {
    const b = m[k];
    let passes = 0, credentials = 0;

    if (Array.isArray(b)) {
      for (const it of b) {
        const label = String(it.type ?? it.event ?? "").toLowerCase();
        if (isPass(label)) passes += it.total || 0;
        if (isCred(label)) credentials += it.total || 0;
      }
    } else if (b && typeof b === "object") {
      const o = b as any;
      passes = Number(o.passes ?? o.events ?? 0);
      credentials = Number(o.credentials ?? 0);
    }

    return { key: k, label: formatMonthLabel(k), passes, credentials };
  });

  const totalPasses = rows.reduce((s,r)=>s+r.passes,0);
  const totalCredentials = rows.reduce((s,r)=>s+r.credentials,0);
  const passPerCredential = totalCredentials > 0 ? +((totalPasses/totalCredentials).toFixed(2)) : null;

  return { rows, kpis: { totalPasses, totalCredentials, passPerCredential } };
}

// =======================
// Página: Tendencia CRED vs PASS
// =======================
const DEFAULT_ENDPOINT =
  "https://us-central1-encodebiz-services.cloudfunctions.net/apiV100-firebaseEntryHttp-passinbiz-statsGetdata";

const DEFAULT_TREND_PAYLOAD = {
  "entityId": "k24rpxzY7aUTAmSXjNyT",
  "stats": "PASSES_ISSUED_GENERAL",
  "groupBy": "month",
  "type": "entity",
  "dateRange": {
    "start": "2025-01-01T00:00:00.000Z",
    "end": "2025-12-31T23:59:59.000Z"
  }
};

export default function Page() {
  const [endpoint, setEndpoint] = React.useState(DEFAULT_ENDPOINT);
  const [trendPayload, setTrendPayload] = React.useState(
    JSON.stringify(DEFAULT_TREND_PAYLOAD, null, 2)
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [raw, setRaw] = React.useState<any>(null);
  const [data, setData] = React.useState<TrendResponse | null>(null);

  const parsedTrend = React.useMemo(() => {
    try { return JSON.parse(trendPayload); } catch { return null; }
  }, [trendPayload]);

  async function fetchTrends() {
    setLoading(true); setError(null); setRaw(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedTrend ?? DEFAULT_TREND_PAYLOAD),
      });
      console.log(res);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setRaw(json);
      setData(normalizeTrendResponse(json));
    } catch (e:any) {
      setError(e?.message || "Request failed");
      setData(null);
    } finally { setLoading(false); }
  }

  const trend = React.useMemo(() => buildMonthlyRows(data?.month), [data?.month]);
  const dr = data?.dateRange;
  const empty = (trend.rows?.length ?? 0) === 0 || trend.rows.every(r => (r.passes||0)+(r.credentials||0)===0);

  return (
    <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "flex-end" }} justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>Tendencia mensual · Credenciales vs Pases</Typography>
            <Typography variant="body2" color="text.secondary">
              Dos líneas para proyectar inversión (credenciales) frente a emisión/uso (pases).
            </Typography>
          </Box>
        </Stack>

        {/* KPIs */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
          <Chip size="small" label={`Pases (Σ): ${new Intl.NumberFormat("en-US", { notation: "compact" }).format(trend.kpis.totalPasses || 0)}`} />
          <Chip size="small" label={`Credenciales (Σ): ${new Intl.NumberFormat("en-US", { notation: "compact" }).format(trend.kpis.totalCredentials || 0)}`} />
          {trend.kpis.passPerCredential != null && (
            <Chip size="small" label={`Pases/Cred: ${trend.kpis.passPerCredential}x`} />
          )}
          {dr?.start && <Chip size="small" label={`UTC: ${dr.start} → ${dr.end}`} />}
        </Stack>

        {/* Gráfica */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ height: 420 }}>
              {empty ? (
                <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                  <Typography color="text.secondary" variant="body2">Sin datos aún. Lanza el fetch de abajo.</Typography>
                </Stack>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trend.rows} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="credentials" name="Credenciales" dot={false} stroke="#1f77b4" strokeWidth={2} />
                    <Line type="monotone" dataKey="passes" name="Pases" dot={false} stroke="#16a34a" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Endpoint & payload */}
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <TextField label="Endpoint" value={endpoint} onChange={(e)=>setEndpoint(e.target.value)} size="small" fullWidth />
              <TextField label="Payload (JSON) – Tendencia" value={trendPayload} onChange={(e)=>setTrendPayload(e.target.value)} multiline minRows={6} maxRows={14} fullWidth />
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" onClick={fetchTrends} disabled={loading}>
                  {loading ? "Cargando…" : "Fetch tendencia"}
                </Button>
              </Stack>
              {error && <Alert severity="error">{error}</Alert>}
              {raw && (
                <Box component="pre" sx={{ p: 2, bgcolor: "#f1f5f9", borderRadius: 2, fontSize: 12, overflow: "auto", maxHeight: 260 }}>
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
