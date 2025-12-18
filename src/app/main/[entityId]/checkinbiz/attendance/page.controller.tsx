/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/useToast";
import { useEntity } from "@/hooks/useEntity";
import { searchLogs, fetchEmployee as fetchEmployeeData } from "@/services/checkinbiz/employee.service";
import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";
import { Column } from "@/components/common/table/GenericTable";
import { format_date, getDateRange } from "@/lib/common/Date";
import { fetchSucursal as fetchSucursalData } from "@/services/checkinbiz/sucursal.service";

import { Box, IconButton } from "@mui/material";

import { DateRangePicker } from "@/app/main/[entityId]/passinbiz/stats/components/filters/fields/DateRangeFilter";
import SearchFilter from "@/components/common/table/filters/SearchFilter";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { CustomChip } from "@/components/common/table/CustomChip";
import { Edit, Map } from "@mui/icons-material";
import { onGoMap } from "@/lib/common/maps";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { emptyChecklog } from "@/services/checkinbiz/report.service";
import { HistoryIcon } from "@/components/common/icons/HistoryIcon";
import { fetchUserAccount } from "@/services/core/account.service";

interface IFilterParams {
  filter: { branchId: string, employeeId: string, status: string, range: { start: any, end: any } | null },
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
  const { openModal } = useCommonModal()
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IChecklog[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IChecklog[]>([]);
  const [empthy, setEmpthy] = useState(false)

  const [filterParams, setFilterParams] = useState<any>({
    filter: { branchId: 'none', employeeId: 'none', status: 'valid', range: { start: getDateRange('today').start, end: getDateRange('today').end } },
    startAfter: null,
    currentPage: 0,
    total: 0,
    params: {
      filters: [
        { field: 'status', operator: '==', value: 'valid' },
        { field: 'timestamp', operator: '>=', value: getDateRange('today').start },
        { field: 'timestamp', operator: '<=', value: getDateRange('today').end }
      ],
      startAfter: null,
      limit: 5,
      orderBy: 'timestamp',
      orderDirection: 'desc',
    }
  })

  /** Paginated Changed */
  const onBack = (): void => {
    const backSize = items.length
    itemsHistory.splice(-backSize)
    setItemsHistory([...itemsHistory])
    setItems([...itemsHistory.slice(-filterParams.params.limit)])
    setFilterParams({ ...filterParams, currentPage: filterParams.currentPage - 1, params: { ...filterParams.params, startAfter: (itemsHistory[itemsHistory.length - 1] as any).last } })

  }

  const onEdit = async (item: any) => {
    openModal(CommonModalType.CHECKLOGFORM, { data: item })
  }


  const rowAction: Array<any> = [{
    actionBtn: true,
    color: 'primary',
    icon: <Edit color="primary" />,
    label: t('core.button.edit'),
    bulk: false,
    allowItem: () => true,
    onPress: (item: IChecklog) => onEdit(item)
  }, {
    actionBtn: true,
    color: 'primary',
    icon: <Map color="primary" />,
    label: t('sucursal.map'),
    bulk: false,
    allowItem: () => true,
    onPress: (item: IChecklog) => onGoMap(item.geo.lat, item.geo.lng)
  }]

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



  const fetchingData = async (filterParams: IFilterParams) => {

    if (filterParams.params.filters.find((e: any) => e.field === 'branchId' && e.value === 'none'))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "branchId")

    if (filterParams.params.filters.find((e: any) => e.field === "employeeId" && e.value === 'none'))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "employeeId")

    if (filterParams.params.filters.find((e: any) => e.field === "employeeId" && !e.value))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "employeeId")
    const filters = [
      ...filterParams.params.filters,
    ]
    setLoading(true)

    setEmpthy(await emptyChecklog(currentEntity?.entity.id as string))

    searchLogs(currentEntity?.entity.id as string, { ...(filterParams.params as any), filters }).then(async res => {
      if (res.length !== 0) {
        setFilterParams({ ...filterParams, params: { ...filterParams.params, startAfter: res.length > 0 ? (res[res.length - 1] as any).last : null } })
       
        const data: Array<IChecklog> = await Promise.all(
          res.map(async (item) => {
            const branch = (await fetchSucursalData(currentEntity?.entity.id as string, item.branchId as string))
            const employee = (await fetchEmployeeData(currentEntity?.entity.id as string, item.employeeId as string))
            let requestUpdates: Array<any> = []
            if (Array.isArray(item.metadata?.requestUpdates) && item.metadata?.requestUpdates.length > 0) {
              requestUpdates = await Promise.all(
                item.metadata?.requestUpdates.map(async (e: any) => {
                  const employee1 = (await fetchEmployeeData(currentEntity?.entity.id as string, e.data?.employeeId as string))
                  const admin = (await fetchUserAccount( e.updateBy as string))
                   
                  return { ...e, employee: employee1, admin };
                })
              );
            }
            return { ...item, requestUpdates, branch, employee };
          })
        );

         console.log(data);
         

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


  const columns: Column<any>[] = [
    {
      id: 'branch',
      label: t("core.label.branch"),
      minWidth: 170,
      format: (value, row) => row.branch?.name
    },
    {
      id: 'employee',
      label: t("core.label.employee"),
      minWidth: 170,
      format: (value, row) => row.employee?.fullName ?? ' Supervisor '
    },
    {
      id: 'type',
      label: t("core.label.register"),
      minWidth: 170,
      format: (value, row) => t('core.label.' + row.type)
    },
    {
      id: 'status',
      label: t("core.label.status"),
      minWidth: 170,
      format: (value, row) => <CustomChip role={'text'} background={row.status} label={t('core.label.' + row.status)} />
    },
    {
      id: 'timestamp',
      label: t("core.label.date-hour"),
      minWidth: 200,
      format: (value, row) => <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
       
        {format_date(row.timestamp, 'DD/MM/YYYY')} {format_date(row.timestamp, 'hh:mm')}
         {Array.isArray(row.metadata?.requestUpdates) && row.metadata?.requestUpdates.length > 0 && <IconButton onClick={() => {
           
          openModal(CommonModalType.INFO, { item: row?.requestUpdates[0] })
        }}><HistoryIcon /></IconButton>}
      </Box>
    },



  ];





  useEffect(() => {
    if (currentEntity?.entity?.id) {
      fetchingData(filterParams)

    }
  }, [currentEntity?.entity?.id])






  const topFilter = <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap', width: '100%', justifyContent: 'flex-end' }}>


    <SearchFilter
      label={t('core.label.status')}
      value={filterParams.filter.status}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, status: value } })}
      options={[{ value: 'valid' as string, label: t('core.label.valid') }, { value: 'failed' as string, label: t('core.label.failed') }, { value: 'pending-employee-validation' as string, label: t('core.label.pending-employee-validation') }]}
    />



    <SearchIndexFilter width='auto'
      type="branch"
      label={t('core.label.subEntity')}
      onChange={async (value: ISearchIndex) => {
        if (value?.id) {
          const parts = value.index?.split('/')
          const branchId = parts[parts.length - 1]
          if (branchId)
            onFilter({ ...filterParams, filter: { ...filterParams.filter, branchId } })
          else
            onFilter({ ...filterParams, filter: { ...filterParams.filter, branchId: 'none' } })
        } else onFilter({ ...filterParams, filter: { ...filterParams.filter, branchId: 'none' } })

      }}
    />

    <SearchIndexFilter width='auto'
      type="employee"
      label={t('core.label.employee')}
      onChange={async (value: ISearchIndex) => {
        if (value?.index) {
          const parts = value.index?.split('/')
          const employeeId = parts[parts.length - 1]
          if (employeeId)
            onFilter({ ...filterParams, filter: { ...filterParams.filter, employeeId } })
          else
            onFilter({ ...filterParams, filter: { ...filterParams.filter, employeeId: 'none' } })
        } else {
          onFilter({ ...filterParams, filter: { ...filterParams.filter, employeeId: 'none' } })

        }
      }}
    />
    <DateRangePicker filter width='100%' value={filterParams.filter.range} onChange={(rg: { start: any, end: any }) => {
      onFilter({ ...filterParams, filter: { ...filterParams.filter, range: rg } })
    }} />

  </Box>


  const onFilter = (filterParamsData: any) => {

    const filterData: Array<{ field: string, operator: any, value: any }> = []
    const filter = filterParamsData.filter
    Object.keys(filter).forEach((key) => {
      if (key === 'range')
        filterData.push(
          { field: 'timestamp', operator: '>=', value: filter[key].start },
          { field: 'timestamp', operator: '<=', value: filter[key].end }
        )
      else
        filterData.push({ field: key, operator: '==', value: filter[key] })
    })
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, filters: filterData }, filter: filter }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }





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
    topFilter, empthy,
    onNext, onBack,
    columns, rowAction, onSuccessCreate,
    loading, filterParams
  }
}