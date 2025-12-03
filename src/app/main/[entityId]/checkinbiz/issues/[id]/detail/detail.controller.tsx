/* eslint-disable react-hooks/exhaustive-deps */
import { Column, IRowAction } from "@/components/common/table/GenericTable";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getIssuesResponsesLists } from "@/services/checkinbiz/employee.service";
import { fetchEmployee as fetchEmployeeData } from "@/services/checkinbiz/employee.service";

import { useParams, useSearchParams } from "next/navigation";
import { decodeFromBase64 } from "@/lib/common/base64";
import { Avatar, Box } from "@mui/material";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { IIssueResponse } from "@/domain/features/checkinbiz/IIssue";
import { format_date } from "@/lib/common/Date";


interface IFilterParams {

  params: {
    orderBy: string,
    orderDirection: 'desc' | 'asc',
    startAfter: any,
    limit: number,
    filters: Array<{
      field: string;
      operator: | '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in'
      value: any;
    }>
  }
  total: number
  currentPage: number
  startAfter: string | null,
}

export default function useResponseIssueController() {
  const t = useTranslations();
  const { id } = useParams<{ id: string }>()
 
  const searchParams = useSearchParams()
   const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
   const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IIssueResponse[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IIssueResponse[]>([]);

  const [filterParams, setFilterParams] = useState<IFilterParams>({

    startAfter: null,
    currentPage: 0,
    total: 0,
    params: {
      filters: [],
      startAfter: null,
      limit: 5,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    }
  })
  const { openModal } = useCommonModal()
  const rowAction: Array<IRowAction> = id ? [] : []


  /** Paginated Changed */
  const onBack = (): void => {
    const backSize = items.length
    itemsHistory.splice(-backSize)
    setItemsHistory([...itemsHistory])
    setItems([...itemsHistory.slice(-filterParams.params.limit)])
    setFilterParams({ ...filterParams, currentPage: filterParams.currentPage - 1, params: { ...filterParams.params, startAfter: (itemsHistory[itemsHistory.length - 1] as any).last } })

  }

  /** Paginated Changed */
  const onNext = async (): Promise<void> => {
    setLoading(true)
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: filterParams.currentPage + 1 }
    fetchingData(filterParamsUpdated)
  }



  /** Sort Change */
  const onSort = (sort: { orderBy: string, orderDirection: 'desc' | 'asc' }) => {
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, ...sort, startAfter: null, } }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }


  /** Limit Change */
  const onRowsPerPageChange = (limit: number) => {
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, limit } }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }



  const columns: Column<IIssueResponse>[] = [
    {
      id: 'employee',
      label: t("core.label.employee"),
      minWidth: 170,
      format: (value, row) => <Box>
        <div style={{ display: "flex", alignItems: 'center', cursor: 'help', gap: 4 }}>
          <Avatar sx={{ bgcolor: (theme) => theme.palette.primary.dark, width: 45, height: 45 }}>{row.employee?.fullName?.charAt(0)}</Avatar>
          {row.employee?.fullName}
        </div>
      </Box>

    },


    {
      id: 'message',
      label: t("core.label.message"),
      minWidth: 170,
      format: (value, row: IIssueResponse) => <>{row.message}</>

    },

    {
      id: 'message',
      label: t("core.label.message"),
      minWidth: 170,
      format: (value, row: IIssueResponse) => <>{format_date(row.createdAt)}</>

    },

    {
      id: 'newState',
      label: t("core.label.state"),
      minWidth: 170,
      format: (value, row) => <>{t("core.label." + row.newState)} {' -> '} {t("core.label." + row.oldState)}</>
    },




  ];

  const fetchingData = (filterParams: IFilterParams) => {

    setLoading(true)





    getIssuesResponsesLists(id as string, { ...(filterParams.params as any), filters: [...filterParams.params.filters] }).then(async data => {
      const res: Array<any> = await Promise.all(
        data.map(async (item) => {
          const employee = (await fetchEmployeeData(currentEntity?.entity.id as string, item.employeeId as string))
          return { ...item, employee };
        })
      );

      if (res.length !== 0) {
        setFilterParams({ ...filterParams, params: { ...filterParams.params, startAfter: res.length > 0 ? (res[res.length - 1] as any).last : null } })
        setItems(res)
        if (!filterParams.params.startAfter) {
          setItemsHistory([...res])
        } else {
          setItemsHistory(prev => [...prev, ...res])
        }
      }

      if (!filterParams.params.startAfter && res.length === 0) {
        setItems([])
        setItemsHistory([])
      }

    }).catch(e => {
      showToast(e?.message, 'error')
    }).finally(() => {
      setLoading(false)
    })
  }

  


  const inicializeFilter = (params: string) => {
    try {
      const filters: IFilterParams = params !== 'null' ? filterParams : decodeFromBase64(params as string)
      filters.params.startAfter = null
      setFilterParams(filters)
      setLoading(false)
      fetchingData(filters)
    } catch (error) {
      showToast(String(error as any), 'error')
    }
  }





  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('checkinbiz')
    }
  }, [currentEntity?.entity?.id])

  useEffect(() => {
    if (currentEntity?.entity?.id) {

      if (searchParams.get('params') && localStorage.getItem('employeeIndex'))
        inicializeFilter(searchParams.get('params') as string)
      else
        fetchingData(filterParams)
    }
  }, [currentEntity?.entity?.id, searchParams.get('params')])


  const onEdit = async (item: any) => {
    openModal(CommonModalType.FORM, { ...item })
  }
  


  return {
    items, onSort, onRowsPerPageChange,
    onEdit,
    onNext, onBack,
    columns, rowAction,
    loading, filterParams,

  }


}

