import { useAuth } from "@/hooks/useAuth";

import { useToast } from "@/hooks/useToast";

import { fetchStats } from "@/services/passinbiz/holder.service";
import { useState } from "react";
import { IPassValidatorStatsRequest, IPassValidatorStatsResponse } from "../../../model/PassValidator";
import { usePassinBizStats } from "../../../context/passBizStatsContext";




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
  const stop = new Set(["de", "del", "la", "las", "el", "los", "y", "en", "para", "por", "con", "a", "al", "the", "of", "and"]);
  const words = clean.split(/\s+/).filter(w => !stop.has(w.toLowerCase()));
  if (!words.length) return "NA";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.map(w => w[0].toUpperCase()).join("").slice(0, 6);
}

// Colores fijos por MÉTRICA (consistentes entre eventos)
export const METRIC_COLORS: Record<keyof ValidationTotals, string> = {
  valid: "#16a34a", // verde
  failed: "#dc2626", // rojo
  revoked: "#f59e0b", // ámbar
};
const METRIC_ABBR: Record<keyof ValidationTotals, string> = { valid: "V", failed: "F", revoked: "R" };


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
    return (["valid", "failed", "revoked"] as (keyof ValidationTotals)[]).map((m) => ({
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
      row[`${evField}__valid`] = vt.valid;
      row[`${evField}__failed`] = vt.failed;
      row[`${evField}__revoked`] = vt.revoked;

      validSum += vt.valid;
      attemptsSum += vt.valid + vt.failed + vt.revoked;
      totalAll += vt.valid + vt.failed + vt.revoked;
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


export interface ChartData {
  buckets: Record<string, BucketItem[]>,
  rows: any,
  series: any,
  ranking: any,
  dr: { start: string, end: string } | undefined,
  empty: boolean
  data: StatsResponse
  kpis: any
}


export default function usePassesValidationController() {

  const { setSeriesChart2 } = usePassinBizStats()
  const [loading, setLoading] = useState(false);




  //Graph Data
  const { setGraphData, graphData } = usePassinBizStats()

  const { token } = useAuth()
  const { showToast } = useToast()
  async function handleFetchStats(payload: IPassValidatorStatsRequest) {
    setLoading(true);

    fetchStats({ ...payload } as IPassValidatorStatsRequest, token).then(res => {
      const normalized = normalizeApiResponse(res);

      const buckets = getBuckets(normalized as IPassValidatorStatsResponse, payload.groupBy)
      const { rows, series } = buildChartData(buckets, payload.groupBy)
      const ranking = computeTotalsByEvent(buckets)
      const dr = normalized?.dateRange ?? (normalized as IPassValidatorStatsResponse)?.dateRange;
      const empty = rows.length === 0 || series.length === 0;
      const kpis = computeKPIs(buckets, payload.groupBy)


      setSeriesChart2(series.map((s) => ({ id: s.field, name: s.name })))

      setGraphData({
        ...graphData,
        ['validator']: {
          buckets, rows, series, ranking, dr, empty, kpis, data: normalized
        }
      })

    }).catch(e => {
      showToast(e?.message, 'error')
    }).finally(() => {
      setLoading(false)
    })
  }





  return {
    handleFetchStats, loading, graphData
  }

}