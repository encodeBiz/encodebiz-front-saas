/* eslint-disable react-hooks/exhaustive-deps */
import { Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { IReport } from "@/domain/features/checkinbiz/IReport";
import { search } from "@/services/checkinbiz/report.service";
import { search as searchBranch } from "@/services/checkinbiz/sucursal.service";
import { useLayout } from "@/hooks/useLayout";
import { useParams, useSearchParams } from "next/navigation";
import { Edit, ListAltOutlined } from "@mui/icons-material";
import { decodeFromBase64, encodeToBase64 } from "@/lib/common/base64";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import { Box } from "@mui/material";
import { SelectFilter } from "@/components/common/table/filters/SelectFilter";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";


interface IFilterParams {
  filter: { status: string, branchId: string }

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

export default function useReportListController() {
  const t = useTranslations();
  const { id } = useParams<{ id: string }>()
  const { changeLoaderState } = useLayout()
  const searchParams = useSearchParams()
  const { token, user } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IReport[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IReport[]>([]);
  const [filterParams, setFilterParams] = useState<IFilterParams>({
    filter: { status: 'active', branchId: 'none' },
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

  const [branchList, setBranchList] = useState<Array<ISucursal>>([])

  const rowAction: Array<IRowAction> = id ? [] : [
   

    


    {
      actionBtn: true,
      color: 'primary',
      icon: <ListAltOutlined color="primary" />,
      label: t('report.detail'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: IReport) => onDetail(item)
    },
  ]



  const onDetail = async (item: any) => {
    navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/report/${item.id}/detail`)
  }


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

  const options = [
    { label: t('core.label.active'), value: 'active' },
    { label: t('core.label.inactive'), value: 'inactive' },
    { label: t('core.label.vacation'), value: 'vacation' },
    { label: t('core.label.sick_leave'), value: 'sick_leave' },
    { label: t('core.label.leave_of_absence'), value: 'leave_of_absence' },
    { label: t('core.label.paternity_leave'), value: 'paternity_leave' },
    { label: t('core.label.maternity_leave'), value: 'maternity_leave' },
  ]


  const columns: Column<IReport>[] = [
    {
      id: 'id',
      label: t("core.label.name"),
      minWidth: 170,
     
    },

   


  ];

  const fetchingData = (filterParams: IFilterParams) => {
    const filters = []
    if (id) {
      filters.push({
        field: 'branchId',
        operator: 'array-contains',
        value: id
      })
    }
    setLoading(true)

    
     if (filterParams.params.filters.find((e: any) => e.field === 'branchId' && e.value === 'none'))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "branchId")


 
    search(currentEntity?.entity.id as string, { ...(filterParams.params as any), filters: [...filterParams.params.filters, ...filters] }).then(async res => {
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

  const fetchSucursal = async () => {
    setBranchList(await searchBranch(currentEntity?.entity.id as string, { ...{} as any, limit: 100 }))
  }


  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('checkinbiz')
    }
  }, [currentEntity?.entity?.id, watchServiceAccess])

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      fetchSucursal()
      if (searchParams.get('params') && localStorage.getItem('reportIndex'))
        inicializeFilter(searchParams.get('params') as string)
      else
        fetchingData(filterParams)
    }
  }, [currentEntity?.entity?.id, searchParams.get('params')])






 
  

 
  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>

    
  </Box>

  const buildState = () => {
    const dataStatus = {
      items,
      itemsHistory,
    }
    localStorage.setItem('reportIndex', JSON.stringify(dataStatus))
    return encodeToBase64({ ...filterParams })
  }

 

  return {
    items, onSort, onRowsPerPageChange,
 
    onNext, onBack, buildState,
    columns, rowAction, topFilter,
    loading,   filterParams,

  }


}