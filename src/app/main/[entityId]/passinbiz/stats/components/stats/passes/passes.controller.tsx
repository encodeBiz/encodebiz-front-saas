import { IStatsRequest, BucketItem } from "@/domain/features/passinbiz/IStats";
import { useState } from "react";



export interface ChartData {
  buckets: Record<string, BucketItem[]>,
  rows: any,
  series: any,
  ranking: any,
  dr: { start: string, end: string } | undefined,
  empty: boolean
  data: any
}
function rmDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export default function PassesStatsController() {


  const [payload, setPayload] = useState<IStatsRequest>({
  "entityId": "z1YRV6s6ueqnJpIvInFL",
  "stats": "PASSES_VALIDATION",
  "dateRange": {
    "start": "2025-09-16T09:00:00.000Z",
    "end": "2025-09-16T22:00:00.000Z"
  },
  "groupBy": "hour",
  "type": "event",
  "passStatus": "active",
  "events": [
    {
      "id": "DAhykI0IAJAWA9Ip9TGW",
      "name": "Masterclass GROUND"
    },
    {
      "id": "ItjpMhJf4dJAkbZR5zkf",
      "name": "Presentación de PassBiz"
    }
  ]
});

  const [filter, setFilter] = useState<IStatsRequest>({
  "entityId": "z1YRV6s6ueqnJpIvInFL",
  "stats": "PASSES_VALIDATION",
  "dateRange": {
    "start": "2025-09-16T09:00:00.000Z",
    "end": "2025-09-16T22:00:00.000Z"
  },
  "groupBy": "hour",
  "type": "event",
  "passStatus": "active",
  "events": [
    {
      "id": "DAhykI0IAJAWA9Ip9TGW",
      "name": "Masterclass GROUND"
    },
    {
      "id": "ItjpMhJf4dJAkbZR5zkf",
      "name": "Presentación de PassBiz"
    }
  ]
});

  //Filter





  return {
    setPayload, payload, filter, setFilter


  }

}