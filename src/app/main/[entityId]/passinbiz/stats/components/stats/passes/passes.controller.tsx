import { IStatsRequest, IStatsResponse, GroupBy, BucketItem } from "@/domain/features/passinbiz/IStats";
import { useState } from "react";



export interface ChartData {
  buckets: Record<string, BucketItem[]>,
  rows: any,
  series: any,
  ranking: any,
  dr: { start: string, end: string } | undefined,
  empty: boolean
  data: IStatsResponse
}
function rmDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export default function PassesStatsController() {


  const [payload, setPayload] = useState<IStatsRequest>({
    stats: "PASSES_ISSUED",
    type: 'credential',
    dateRange: {
      start: rmDays(new Date(), 5),
      end: new Date()
    },
    groupBy: 'day',
    events:[]
  });

  const [filter, setFilter] = useState<IStatsRequest>({
    stats: "PASSES_ISSUED",
    type: 'credential',
    dateRange: {
       start: rmDays(new Date(), 5),
      end: new Date()
    },
    groupBy: 'day',
    events:[]
  });

  //Filter

  



  return {
    setPayload, payload,filter, setFilter
 

  }

}