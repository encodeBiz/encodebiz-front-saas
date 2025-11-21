/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/useToast";
import { useEntity } from "@/hooks/useEntity";
import { IReport } from "@/domain/features/checkinbiz/IReport";
import { Column, IRowAction } from "@/components/common/table/GenericTable";
import { format_date, getDateRange } from "@/lib/common/Date";
import { fetchSucursal as fetchSucursalData } from "@/services/checkinbiz/sucursal.service";
import { search, updateReport } from "@/services/checkinbiz/report.service";
import { DownloadOutlined } from "@mui/icons-material";
import { SelectFilter } from "@/components/common/table/filters/SelectFilter";
import { useLayout } from "@/hooks/useLayout";
import SearchFilter from "@/components/common/table/filters/SearchFilter";
import { DateRangePicker } from "../../passinbiz/stats/components/filters/fields/DateRangeFilter";
import { Box } from "@mui/material";

interface IFilterParams {
  filter: { status: string, range: { start: any, end: any } | null },
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
export default function useAttendanceController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { changeLoaderState } = useLayout()
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IReport[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IReport[]>([]);
  const [filterParams, setFilterParams] = useState<any>({
    filter: { status: 'active', range: getDateRange('year') },
    startAfter: null,
    currentPage: 0,
    total: 0,
    params: {
      filters: [
        { field: 'status', operator: '==', value: 'active' },
        { field: 'start', operator: '>=', value: getDateRange('year').start },
        { field: 'start', operator: '<=', value: getDateRange('year').end }
      ],
      startAfter: null,
      limit: 5,
      orderBy: 'start',
      orderDirection: 'desc',
    }
  })

  const options = [
    { label: t('core.label.active'), value: 'active' },
    { label: t('core.label.archived'), value: 'archived' },
  ]


  /** Paginated Changed */
  const onBack = (): void => {
    const backSize = items.length
    itemsHistory.splice(-backSize)
    setItemsHistory([...itemsHistory])
    setItems([...itemsHistory.slice(-filterParams.params.limit)])
    setFilterParams({ ...filterParams, currentPage: filterParams.currentPage - 1, params: { ...filterParams.params, startAfter: (itemsHistory[itemsHistory.length - 1] as any).last } })

  }



  const onFilter = (filterParamsData: any) => {

    const filterData: Array<{ field: string, operator: any, value: any }> = []
    const filter = filterParamsData.filter
    Object.keys(filter).forEach((key) => {
      if (key === 'range')
        filterData.push(
          { field: 'start', operator: '>=', value: filter[key].start },
          { field: 'start', operator: '<=', value: filter[key].end }
        )
      else
        filterData.push({ field: key, operator: '==', value: filter[key] })
    })
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, filters: filterData }, filter: filter }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }


  const topFilter = <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap', width: '100%', justifyContent: 'flex-end' }}>


    <SearchFilter
      label={t('core.label.status')}
      value={filterParams.filter.status}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, status: value } })}
      options={[{ value: 'active' as string, label: t('core.label.active') }, { value: 'archived' as string, label: t('core.label.archived') }]}
    />


    <DateRangePicker filter width='100%' value={filterParams.filter.range} onChange={(rg: { start: any, end: any }) => {
      onFilter({ ...filterParams, filter: { ...filterParams.filter, range: rg } })
    }} />

  </Box>


  const rowAction: Array<IRowAction> = [
    {
      actionBtn: true,
      color: 'primary',
      icon: <DownloadOutlined color="primary" />,
      label: t('core.button.download'),
      allowItem: () => true,
      showBulk: false,
      onPress: (item: IReport) => window.open(item.ref?.url, '_blank'),
      bulk: false
    },

  ]
  /** Paginated Changed */
  const onNext = async (): Promise<void> => {
    setLoading(true)
    const filterParamsUpdated: any = { ...filterParams, currentPage: filterParams.currentPage + 1 }
    fetchingData(filterParamsUpdated)
  }



  /** Sort Change */
  const onSort = (sort: { orderBy: string, orderDirection: 'desc' | 'asc' }) => {
    const filterParamsUpdated: any = { ...filterParams, currentPage: 0, params: { ...filterParams.params, ...sort, startAfter: null, } }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }


  /** Limit Change */
  const onRowsPerPageChange = (limit: number) => {
    const filterParamsUpdated: any = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, limit } }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }



  const fetchingData = (filterParams: IFilterParams) => {


    const filters = [
      ...filterParams.params.filters,
    ]
    setLoading(true)

     
     
    search(currentEntity?.entity.id as string, { ...(filterParams.params as any), filters }).then(async res => {
 
      if (res.length !== 0) {
        setFilterParams({ ...filterParams, params: { ...filterParams.params, startAfter: res.length > 0 ? (res[res.length - 1] as any).last : null } })
        const data: Array<IReport> = await Promise.all(
          res.map(async (item) => {
            let branchId = null
            if (item.branchId)
              branchId = (await fetchSucursalData(currentEntity?.entity.id as string, item.branchId as string))?.name
            return { ...item, branchId };
          })
        );

        setItems(data)
        if (!filterParams.params.startAfter) {
          setItemsHistory([...data])
        } else {
          setItemsHistory(prev => [...prev, ...data])
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


  const columns: Column<IReport>[] = [

    {
      id: 'status',
      label: t("core.label.status"),
      minWidth: 170,
      format: (value, row) => <SelectFilter first={false}
        defaultValue={row.status}
        value={row.status}
        onChange={(value: any) => {
          row.status = value
          updateStatus(row)
        }}
        items={options}
      />
    },

    {
      id: 'start',
 
      label: t("core.label.start"),
      minWidth: 170,
      format: (value, row) => format_date(row.start, 'YYYY-MM-DD')
    },
    {
      id: 'end',
      label: t("core.label.end"),
      minWidth: 170,
      format: (value, row) => format_date(row.end, 'YYYY-MM-DD')
    },

     {
      id: 'createdAt',
      label: t("core.label.createdAt"),
      minWidth: 170,
      format: (value, row) => format_date(row.createdAt, 'YYYY-MM-DD')
    },
 

  ];



  const updateStatus = async (report: IReport) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: any = {
        "id": report.id,
        status: report.status,
        entityId: currentEntity?.entity.id
      }
      await updateReport(data)
      const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
      fetchingData(filterParamsUpdated)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };


  useEffect(() => {
    if (currentEntity?.entity?.id)
      fetchingData(filterParams)

  }, [currentEntity?.entity?.id])



  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('checkinbiz')
    }
  }, [currentEntity?.entity?.id])

  const onSuccessCreate = () => {
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }

  return {
    items, onSort, onRowsPerPageChange,

    onNext, onBack, onSuccessCreate,
    columns, rowAction, topFilter,
    loading, filterParams
  }
}