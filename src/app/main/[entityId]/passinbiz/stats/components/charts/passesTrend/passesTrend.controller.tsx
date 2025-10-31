import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

import { fetchStats } from "@/services/passinbiz/holder.service";
import { useState } from "react";
import { IPassTrendStatsRequest, IPassTrendStatsResponse } from "../../../model/PassTrend";
import { useAppLocale } from "@/hooks/useAppLocale";


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
const PASS_TOKENS = ["pass", "passes", "pase", "pases", "event", "events", "evento", "eventos", "issued"];
const CRED_TOKENS = ["cred", "credential", "credentials", "credencial", "credenciales"];
const isPass = (s: string) => PASS_TOKENS.some(t => s.includes(t));
const isCred = (s: string) => CRED_TOKENS.some(t => s.includes(t));

function formatMonthLabel(key: string) {
    // key: "YYYY-MM"
    const d = new Date(`${key}-01T00:00:00Z`);
    return d.toLocaleDateString("es-ES", { month: "short", year: "2-digit" });
}

function buildMonthlyRows(month?: Record<string, TrendBucket>) {
    const m = month ?? {};
    const keys = Object.keys(m).sort((a, b) => a.localeCompare(b));
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

    const totalPasses = rows.reduce((s, r) => s + r.passes, 0);
    const totalCredentials = rows.reduce((s, r) => s + r.credentials, 0);
    const passPerCredential = totalCredentials > 0 ? +((totalPasses / totalCredentials).toFixed(2)) : null;

    console.log(rows);
    
    return { rows, kpis: { totalPasses, totalCredentials, passPerCredential } };
}

export interface ChartData {
    trend: any,
    dr: { start: string, end: string } | undefined,
    empty: boolean
    data: IPassTrendStatsResponse
}

export default function usePassesTrendController() {
    const { currentLocale } = useAppLocale()

    const [loading, setLoading] = useState(false);
    //Graph Data
    const [graphData, setGraphData] = useState<ChartData>()
    const { token } = useAuth()
    const { showToast } = useToast()
    async function handleFetchStats(payload: IPassTrendStatsRequest) {
        setLoading(true);

        fetchStats({ ...payload } as IPassTrendStatsRequest, token, currentLocale).then(res => {
            const normalized: any = normalizeTrendResponse(res);
            const trend = buildMonthlyRows(normalized?.month);
            const dr = normalized?.dateRange;
            const empty = (trend.rows?.length ?? 0) === 0 || trend.rows.every(r => (r.passes || 0) + (r.credentials || 0) === 0);

            setGraphData({
                dr, empty, trend, data: normalized
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