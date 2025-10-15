/* eslint-disable react-hooks/exhaustive-deps */
import { Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import { search, updateEmployee } from "@/services/checkinbiz/employee.service";
import { search as searchBranch } from "@/services/checkinbiz/sucursal.service";
import { useLayout } from "@/hooks/useLayout";
import { useParams, useSearchParams } from "next/navigation";
import { Edit, ListAltOutlined, SignalWifi4Bar, SignalWifi4BarLockOutlined } from "@mui/icons-material";
import { decodeFromBase64, encodeToBase64 } from "@/lib/common/base64";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import { Box, Tooltip } from "@mui/material";
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

export default function useEmployeeListController() {
  const t = useTranslations();
  const { id } = useParams<{ id: string }>()
  const { changeLoaderState } = useLayout()
  const searchParams = useSearchParams()
  const { token, user } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IEmployee[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IEmployee[]>([]);
  const [filterParams, setFilterParams] = useState<IFilterParams>({
    filter: { status: 'active', branchId: 'none' },
    startAfter: null,
    currentPage: 0,
    total: 0,
    params: {
      filters: [{ field: 'status', operator: '==', value: 'active' }],
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
      icon: <Edit color="primary" />,
      label: t('core.button.edit'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: IEmployee) => onEdit(item)
    },


    {
      actionBtn: true,
      color: 'primary',
      icon: <ListAltOutlined color="primary" />,
      label: t('employee.detail'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: IEmployee) => onDetail(item)
    },
  ]



  const onDetail = async (item: any) => {
    navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee/${item.id}/detail`)
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


  const columns: Column<IEmployee>[] = [
    {
      id: 'fullName',
      label: t("core.label.name"),
      minWidth: 170,
      format: (value, row) => <Box>
        <div style={{ display: "flex", alignItems: 'center' , cursor: 'help', gap:4}}>
          <Tooltip title={row.enableRemoteWork ? t('core.label.enableRemoteWorkEnable') : t('core.label.enableRemoteWorkDisabled')}>
            <span>{row.enableRemoteWork ? <SignalWifi4Bar color="primary" /> : <SignalWifi4BarLockOutlined color="secondary" />}</span>
          </Tooltip>
            {row.fullName}
          </div>
      </Box>

    },

    {
      id: 'email',
      label: t("core.label.email"),
      minWidth: 170,
    },

    {
      id: 'phone',
      label: t("core.label.phone"),
      minWidth: 170,
    },


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
  }, [currentEntity?.entity?.id])

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      fetchSucursal()
      if (searchParams.get('params') && localStorage.getItem('employeeIndex'))
        inicializeFilter(searchParams.get('params') as string)
      else
        fetchingData(filterParams)
    }
  }, [currentEntity?.entity?.id, searchParams.get('params')])


  const onEdit = async (item: any) => {
    navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee/${item.id}/edit`)
  }



  const updateStatus = async (employee: IEmployee) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: IEmployee = {
        ...employee,
        "uid": user?.id as string,
        "id": employee.id,
        entityId: currentEntity?.entity.id as string,
        status: employee.status
      }
      await updateEmployee(data, token)
      const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
      fetchingData(filterParamsUpdated)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      //navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee`)

    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };

  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>

    {branchList.length > 0 && <SelectFilter
      first
      label={t('core.label.subEntity')}
      defaultValue={'none'}
      value={filterParams.filter.branchId}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, branchId: value } })}
      items={branchList.map(e => ({ value: e.id, label: e.name }))}
    />}
    <SelectFilter first={false}
      defaultValue={'active'}
      value={filterParams.filter.status}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, status: value } })}

      items={options}
    />
    <SearchIndexFilter
      type="employee"
      label={t('core.label.search')}
      onChange={async (value: ISearchIndex) => {
        const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
        if (value?.id) {
          const item = await getRefByPathData(value.index)
          if (item)
            setItems([item])
          else
            fetchingData(filterParamsUpdated)
        }
        else {
          setItems([])
          fetchingData(filterParamsUpdated)
        }
      }}
    />
  </Box>

  const buildState = () => {
    const dataStatus = {
      items,
      itemsHistory,
    }
    localStorage.setItem('employeeIndex', JSON.stringify(dataStatus))
    return encodeToBase64({ ...filterParams })
  }


  const onFilter = (filterParamsData: any) => {

    const filterData: Array<{ field: string, operator: any, value: any }> = []
    const filter = filterParamsData.filter
    Object.keys(filter).forEach((key) => {
      if (key === 'branchId' && filter[key] !== 'none')
        filterData.push({
          field: 'branchId',
          operator: 'array-contains-any',
          value: [filter[key]]
        })
      else
        filterData.push({ field: key, operator: '==', value: filter[key] })
    })
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, filters: filterData }, filter: filter }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }

    const onSuccessCreate = () => {
     const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }

  return {
    items, onSort, onRowsPerPageChange,
    onEdit,onSuccessCreate,
    onNext, onBack, buildState,
    columns, rowAction, topFilter,
    loading, filterParams,

  }


}

