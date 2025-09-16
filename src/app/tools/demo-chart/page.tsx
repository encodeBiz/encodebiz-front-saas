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
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";
import { Chip, Stack, Tab, Tabs, Typography } from "@mui/material";

// ==========================================================
// DATA CONTRACT – Pre-evento (createdAt → startAt)
// ==========================================================
// Medimos "emisiones" acumuladas por mes entre la creación del evento y su inicio.
export interface EventPreWindow {
  eventId: string;
  eventName: string;
  createdAt: string; // ISO date (YYYY-MM-DD)
  startAt: string;   // ISO date (YYYY-MM-DD)
  months: Array<{ year: number; month: number; emissions: number }>; // 1..12
}

// ==========================================================
// DEMO DATA – coherente con lo que podemos medir hoy
// ==========================================================
const DEMO_PREWINDOW: EventPreWindow[] = [
  {
    eventId: "ev-001",
    eventName: "Concierto Primavera",
    createdAt: "2025-02-01",
    startAt: "2025-03-20",
    months: [
      { year: 2025, month: 2, emissions: 900 },
      { year: 2025, month: 3, emissions: 2300 },
    ],
  },
  {
    eventId: "ev-003",
    eventName: "Summit TechBiz",
    createdAt: "2025-06-15",
    startAt: "2025-08-20",
    months: [
      { year: 2025, month: 6, emissions: 400 },
      { year: 2025, month: 7, emissions: 1500 },
      { year: 2025, month: 8, emissions: 750 },
    ],
  },
  {
    eventId: "ev-002",
    eventName: "Expo Arte Contemporáneo",
    createdAt: "2025-04-01",
    startAt: "2025-06-10",
    months: [
      { year: 2025, month: 4, emissions: 600 },
      { year: 2025, month: 5, emissions: 900 },
      { year: 2025, month: 6, emissions: 350 },
    ],
  },
  {
    eventId: "ev-004",
    eventName: "Concierto Primavera 2",
    createdAt: "2025-03-25",
    startAt: "2025-04-20",
    months: [
      { year: 2025, month: 3, emissions: 50 },
      { year: 2025, month: 4, emissions: 100 },
    ],
  },
  {
    eventId: "ev-005",
    eventName: "DEMO 1",
    createdAt: "2025-08-20",
    startAt: "2025-10-15",
    months: [
      { year: 2025, month: 8, emissions: 200 },
      { year: 2025, month: 9, emissions: 1500 },
      { year: 2025, month: 10, emissions: 950 },
    ],
  },
  {
    eventId: "ev-006",
    eventName: "DEMO 2",
    createdAt: "2025-08-25",
    startAt: "2025-11-05",
    months: [
      { year: 2025, month: 8, emissions: 150 },
      { year: 2025, month: 9, emissions: 1200 },
      { year: 2025, month: 10, emissions: 400 },
      { year: 2025, month: 11, emissions: 100 },
    ],
  },
  {
    eventId: "ev-007",
    eventName: "DEMO 3",
    createdAt: "2025-07-20",
    startAt: "2025-08-10",
    months: [
      { year: 2025, month: 7, emissions: 500 },
      { year: 2025, month: 8, emissions: 150 },
    ],
  },
  {
    eventId: "ev-008",
    eventName: "DEMO 4",
    createdAt: "2025-09-01",
    startAt: "2025-12-01",
    months: [
      { year: 2025, month: 9, emissions: 400 },
      { year: 2025, month: 10, emissions: 350 },
      { year: 2025, month: 11, emissions: 300 },
    ],
  },
];

// ==========================================================
// HELPERS – ranking total y evolución mensual multi-evento
// ==========================================================
function monthKey(y: number, m: number) { return `${y}-${String(m).padStart(2, "0")}`; }
function sortMonthKeyAsc(a: string, b: string) { return a.localeCompare(b); }
function labelFromKey(key: string) {
  const d = new Date(`${key}-01T00:00:00Z`);
  return d.toLocaleDateString("es-ES", { month: "short", year: "2-digit" });
}

// Ranking total por evento en su ventana pre-evento
interface DPRanking { evento: string; emisiones: number; }
function mapRankingPreWindow(rows: EventPreWindow[]): DPRanking[] {
  return [...rows]
    .map(r => ({ evento: r.eventName, emisiones: r.months.reduce((s,x)=>s+x.emissions, 0) }))
    .sort((a,b)=> b.emisiones - a.emisiones);
}

// Eje global de meses (unión de todas las ventanas)
function buildGlobalAxis(rows: EventPreWindow[]): string[] {
  const set = new Set<string>();
  for (const r of rows) for (const m of r.months) set.add(monthKey(m.year, m.month));
  return Array.from(set).sort(sortMonthKeyAsc);
}

// Evolución mensual multi-evento (formato ancho)
export type DPMultiLinea = { periodo: string; key: string; [serie: string]: number|string };
function mapEvolutionMulti(rows: EventPreWindow[]): { data: DPMultiLinea[]; series: string[] } {
  const axis = buildGlobalAxis(rows);
  const data: DPMultiLinea[] = axis.map(k => ({ periodo: labelFromKey(k), key: k }));
  const series: string[] = [];
  for (const r of rows) {
    const serieName = r.eventName; series.push(serieName);
    const map = new Map(r.months.map(m => [monthKey(m.year, m.month), m.emissions] as const));
    for (const row of data) { (row as any)[serieName] = map.get(row.key) ?? 0; }
  }
  return { data, series };
}

// Simple TabPanel para MUI
interface TabPanelProps { children?: React.ReactNode; index: number; value: number; }
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// ==========================================================
// PAGE (Next.js App Router) – CC/CV listo
// ==========================================================
export default function Page() {
  const [tab, setTab] = React.useState(0);

    // opciones de eventos y selección múltiple
  const EVENT_OPTIONS = React.useMemo(() => DEMO_PREWINDOW.map(e => ({ id: e.eventId, name: e.eventName })), []);
  const [selectedIds, setSelectedIds] = React.useState<string[]>(EVENT_OPTIONS.map(o => o.id));

  const filteredRows = React.useMemo(() => DEMO_PREWINDOW.filter(r => selectedIds.includes(r.eventId)), [selectedIds]);

  const ranking = React.useMemo(() => mapRankingPreWindow(filteredRows), [filteredRows]);
    const { data: evolucion, series } = React.useMemo(() => mapEvolutionMulti(filteredRows), [filteredRows]);

  return (
    <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "flex-end" }} justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>Emisiones pre‑evento</Typography>
            <Typography variant="body2" color="text.secondary">Ranking total y evolución mensual entre <strong>createdAt</strong> y <strong>startAt</strong>.</Typography>
          </Box>
        </Stack>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 320 }}>
            <InputLabel id="events-label">Comparar eventos</InputLabel>
            <Select
              labelId="events-label"
              label="Comparar eventos"
              multiple
              value={selectedIds}
              onChange={(e) => setSelectedIds(typeof e.target.value === 'string' ? (e.target.value as string).split(',') : (e.target.value as string[]))}
              renderValue={(selected) => (selected as string[]).map(id => EVENT_OPTIONS.find(o=>o.id===id)?.name ?? id).join(', ')}
            >
              {EVENT_OPTIONS.map(o => (
                <MenuItem key={o.id} value={o.id}>
                  <Checkbox checked={selectedIds.indexOf(o.id) > -1} />
                  <ListItemText primary={o.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <Tabs value={tab} onChange={(_,v)=>setTab(v)} aria-label="tabs-demo">
            <Tab label="Ranking total por evento" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Evolución mensual (multi‑evento)" id="tab-1" aria-controls="tabpanel-1" />
          </Tabs>

          <CardContent>
            {/* Ranking total (emisiones acumuladas en la ventana pre‑evento) */}
            <TabPanel value={tab} index={0}>
              <Box sx={{ height: 380 }}>
                <ResponsiveContainer width="100%" height="100%"> 
                  <BarChart data={ranking} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="evento" tick={{ fontSize: 12 }} angle={-10} height={60} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="emisiones" name="Emisiones (total pre‑evento)" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip size="small" label="Ventana de cálculo: createdAt → startAt" />
              </Stack>
            </TabPanel>

            {/* Evolución mensual multi‑evento (pre‑evento) */}
            <TabPanel value={tab} index={1}>
              <Box sx={{ height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolucion} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {series.map((name) => (
                      <Line key={name} type="monotone" dataKey={name} dot={false} strokeWidth={2} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip size="small" label="Cada serie solo tiene valores en su propio createdAt → startAt; el resto se rellena a 0" />
              </Stack>
            </TabPanel>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
