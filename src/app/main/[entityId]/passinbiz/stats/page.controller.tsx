import { IStatsRequest, IStatsResponse, GroupBy, BucketItem } from "@/domain/features/passinbiz/IStats";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { normalizeApiResponse, getBuckets, buildChartData, computeTotalsByEvent } from "@/lib/common/stats";
import { fetchStats } from "@/services/passinbiz/holder.service";
import React, { useState, useEffect } from "react";



export interface ChartData {
  buckets: Record<string, BucketItem[]>,
  rows: any,
  series: any,
  ranking: any,
  dr: { start: string, end: string } | undefined,
  empty: boolean
  data: IStatsResponse
}
function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default function useStaffListController() {


  const [tab, setTab] = React.useState(0);
  const { currentEntity } = useEntity()
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<IStatsRequest>({
    stats: "PASSES_ISSUED",
    type: 'credential',
    dateRange: {
      start: new Date(),
      end: addDays(new Date(), 5)
    },
    groupBy: 'day'
  });

  const [data, setData] = useState<IStatsResponse>();

  //Filter
  const [groupBy, setGroupBy] = useState<GroupBy>("day");
  const [type, setType] = useState<"event" | "credential">("credential");
  const [eventList, setEventList] = useState<Array<string>>([]);
  const [evenDataList, setEventDataList] = useState<Array<{ id: string, name: string }>>([]);

  const [dateRange, setDateRange] = useState<{ start: any, end: any }>({ start: new Date(), end: addDays(new Date(), 5) })


  //Graph Data
  const [graphData, setGraphData] = useState<ChartData>()

  const { token } = useAuth()
  const { showToast } = useToast()
  async function handleFetchStats(payload: IStatsRequest) {
    setLoading(true);
    fetchStats({ ...payload, entityId: currentEntity?.entity.id } as IStatsRequest, token).then(res => {
      const normalized = normalizeApiResponse(res);
      setData(normalized);
      const buckets = getBuckets(normalized as IStatsResponse, groupBy)
      const { rows, series } = buildChartData(buckets, groupBy)
      const ranking = computeTotalsByEvent(buckets)
      const dr = normalized?.dateRange ?? (normalized as IStatsResponse)?.dateRange;
      const empty = rows.length === 0 || series.length === 0;

      setGraphData({
        buckets, rows, series, ranking, dr, empty, data: normalized
      })

    }).catch(e => {
      showToast(e?.message, 'error')
    }).finally(() => {
      setLoading(false)
    })
  }


  useEffect(() => {
    if (currentEntity?.entity.id)
      handleFetchStats(payload)
  }, [currentEntity?.entity.id])


  return {
    setPayload, payload,
    type, setType,
    groupBy, setGroupBy,
    eventList, evenDataList, setEventDataList, setEventList,
    handleFetchStats, loading, graphData,
    tab, setTab,
  }

}