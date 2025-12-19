/* eslint-disable react-hooks/exhaustive-deps */
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useEffect, useState } from "react";
import { getIssuesResponsesLists } from "@/services/checkinbiz/employee.service";
import { fetchEmployee as fetchEmployeeData } from "@/services/checkinbiz/employee.service";

import { useParams } from "next/navigation";
import { IIssueResponse } from "@/domain/features/checkinbiz/IIssue";



export default function useResponseIssueController() {
  const { id } = useParams<{ id: string }>()

  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IIssueResponse[]>([]);
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const fetchingData = (limit: number) => {

    setLoading(true)
    getIssuesResponsesLists(id as string, { limit } as any).then(async data => {
      const res: Array<IIssueResponse> = await Promise.all(
        data.map(async (item) => {
          const employee = (await fetchEmployeeData(currentEntity?.entity.id as string, item.employeeId as string))
          return { ...item, employee };
        })
      );

      setItems(res)
      if (res.length > 0) setTotal(res[0].totalItems ?? 0)

    }).catch(e => {
      showToast(e?.message, 'error')
    }).finally(() => {
      setLoading(false)
    })
  }







  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('checkinbiz')
    }
  }, [currentEntity?.entity?.id])

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      fetchingData(limit)
    }
  }, [currentEntity?.entity?.id])



  const loadMore = (restart: boolean = false) => {
    setLimit(restart ? 10 : limit + 10)
    fetchingData(restart ? 10 : limit + 10)
  }

  return {
    items, limit, total, loadMore, loading

  }


}

