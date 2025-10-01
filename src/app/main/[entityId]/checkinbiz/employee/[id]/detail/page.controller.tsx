/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { objectToArray } from "@/lib/common/String";
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import { deleteEmployee, fetchEmployee, searchLogs } from "@/services/checkinbiz/employee.service";
import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";
import { Column } from "@/components/common/table/GenericTable";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { format_date } from "@/lib/common/Date";
import { SelectFilter } from "@/components/common/table/filters/SelectFilter";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";
import { search as searchBranch, fetchSucursal as fetchSucursalData } from "@/services/checkinbiz/sucursal.service";
import { Box } from "@mui/material";

interface IFilterParams {
  filter: { branchId: '' }
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
export default function useEmployeeDetailController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { user, token } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity } = useEntity()
  const { changeLoaderState, navivateTo } = useLayout()
  const [initialValues, setInitialValues] = useState<Partial<IEmployee>>({
    "fullName": '',
    email: '',
    phone: '',
    role: "internal",
    status: 'active',
    branchId: [],
    metadata: []
  });

  const fetchData = async () => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const employee: IEmployee = await fetchEmployee(currentEntity?.entity.id as string, id)
      setInitialValues({
        ...employee,
        metadata: objectToArray(employee.metadata ?? {})
      })
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }


  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, id])


  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IChecklog[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IChecklog[]>([]);
  const [filterParams, setFilterParams] = useState<any>({
    filter: { branchId: 'none' },
    startAfter: null,
    currentPage: 0,
    total: 0,
    params: {
      filters: [],
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
      {
        field: 'employeeId',
        operator: '==',
        value: id
      }]
    setLoading(true)
    searchLogs(currentEntity?.entity.id as string, { ...(filterParams.params as any), filters }).then(async res => {

      if (res.length !== 0) {
        setFilterParams({ ...filterParams, params: { ...filterParams.params, startAfter: res.length > 0 ? (res[res.length - 1] as any).last : null } })

        const data: Array<IChecklog> = await Promise.all(
          res.map(async (item) => {
            const branchId = (await fetchSucursalData(currentEntity?.entity.id as string, item.branchId as string))?.name
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


  const columns: Column<IChecklog>[] = [
    {
      id: 'branchId',
      label: t("core.label.branch"),
      minWidth: 170,
      format: (value, row) => row.branchId
    },
    {
      id: 'type',
      label: t("core.label.register"),
      minWidth: 170,
      format: (value, row) => t('core.label.' + row.type)
    },
    {
      id: 'timestamp',
      label: t("core.label.date"),
      minWidth: 170,
      format: (value, row) => format_date(row.timestamp, 'DD/MM/YYYY')
    },
    {
      id: 'id',
      label: t("core.label.time"),
      minWidth: 170,
      format: (value, row) => format_date(row.timestamp, 'hh:mm')
    },


  ];





  useEffect(() => {
    if (currentEntity?.entity?.id && id) {
      fetchingData(filterParams)
      fetchSucursal()
    }
  }, [currentEntity?.entity?.id, id])

  const { closeModal } = useCommonModal()
  const [deleting, setDeleting] = useState(false)
  const onDelete = async (item: IEmployee | Array<IEmployee>) => {
    try {
      setDeleting(true)
      let ids = []
      if (Array.isArray(item)) {
        ids = (item as Array<IEmployee>).map(e => e.id)
      } else {
        ids.push(item.id)
      }
      await Promise.all(
        ids.map(async (id) => {
          try {
            await deleteEmployee(currentEntity?.entity.id as string, id as string, token)
          } catch (e: any) {
            showToast(e?.message, 'error')
            setDeleting(false)
          }
        })
      );


      setDeleting(false)
      closeModal(CommonModalType.DELETE)
      navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee`)
    } catch (e: any) {
      showToast(e?.message, 'error')
      setDeleting(false)
    }
  }


  const [branchList, setBranchList] = useState<Array<ISucursal>>([])
  const fetchSucursal = async () => {
    setBranchList(await searchBranch(currentEntity?.entity.id as string, { ...{} as any, limit: 100 }))
  }


  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>

    {branchList.length > 0 && <SelectFilter
      first
      label={t('core.label.subEntity')}
      defaultValue={'none'}
      value={filterParams.filter.branchId}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, branchId: value } })}
      items={branchList.map(e => ({ value: e.id, label: e.name }))}
    />}


  </Box>


  const onFilter = (filterParamsData: any) => {

    const filterData: Array<{ field: string, operator: any, value: any }> = []
    const filter = filterParamsData.filter
    Object.keys(filter).forEach((key) => {
      filterData.push({ field: key, operator: '==', value: filter[key] })
    })
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, filters: filterData }, filter: filter }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }

  return {
    items, onSort, onRowsPerPageChange,
    onDelete, deleting, topFilter,
    onNext, onBack,
    columns,
    loading, filterParams,
    initialValues
  }
}