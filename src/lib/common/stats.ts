 
export function normalizeApiResponse(json: any): any {
  const root = json?.result ?? json?.output ?? json?.data ?? json ?? {};
  const hour = root.hour ?? root.hours ?? root.hourly;
  const day = root.day ?? root.days ?? root.daily;
  const month = root.month ?? root.months ?? root.monthly;
  const total = root.total ?? root.kpis?.total ?? root.kpis?.totalIssued ?? 0;
  const dateRange = root.dateRange ?? root.meta?.dateRangeApplied ?? undefined;
  return { total, hour, day, month, dateRange, meta: root.meta } as any;
}

export function getBuckets(resp: any, gb: any) {
  return (resp?.[gb] ?? {}) as Record<string, any[]>;
}

export function sortKeys(gb: any, keys: string[]) {
  if (gb === "hour") return keys.map(Number).sort((a, b) => a - b).map(String);
  return keys.sort((a, b) => a.localeCompare(b)); // YYYY-MM(-DD)
}

export function uniq<T>(arr: T[]): T[] { return Array.from(new Set(arr)); }

export function safeKey(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9_]/g, "_");
}

export function buildChartData(buckets: Record<string, any[]>, gb: any) {
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

export function computeTotalsByEvent(buckets: Record<string, any[]>) {
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

export function formatCompact(n: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);
}

