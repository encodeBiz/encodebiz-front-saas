/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { objectToArray } from "@/lib/common/String";
import { EmployeeEntityResponsibility, IEmployee, Job } from "@/domain/features/checkinbiz/IEmployee";
import { createEmployee, deleteEmployee, fetch2FAData, fetchEmployee, searchJobs, searchLogs, searchResponsability } from "@/services/checkinbiz/employee.service";
import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";
import { Column } from "@/components/common/table/GenericTable";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { format_date, getDateRange } from "@/lib/common/Date";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";
import { fetchSucursal, fetchSucursal as fetchSucursalData, search } from "@/services/checkinbiz/sucursal.service";
import { Box } from "@mui/material";

import { onGoMap } from "@/lib/common/maps";
import { Edit, MapOutlined } from "@mui/icons-material";
import { CustomChip } from "@/components/common/table/CustomChip";
import { useAppLocale } from "@/hooks/useAppLocale";
import SearchFilter from "@/components/common/table/filters/SearchFilter";
import { DateRangeFilter, DateRange } from "../../../panel/components/statsDashboard/DateRangeFilter";

interface IFilterParams {
  filter: { branchId: string, status: string, range: { start: any, end: any } | null },
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
  const { openModal } = useCommonModal()
  const { currentLocale } = useAppLocale()

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
      const data: { twoFA: boolean, trustedDevicesId: Array<string> } = await fetch2FAData(currentEntity?.entity.id as string, id)
      setInitialValues({
        ...employee,
        twoFA: data.twoFA,
        trustedDevicesId: data.trustedDevicesId,
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
    filter: { branchId: 'none', range: { start: getDateRange('today').start, end: getDateRange('today').end }, status: 'valid' },
    startAfter: null,
    currentPage: 0,
    total: 0,
    params: {
      filters: [
        { field: 'timestamp', operator: '>=', value: getDateRange('today').start },
        { field: 'timestamp', operator: '<=', value: getDateRange('today').end },
        { field: 'status', operator: '==', value: 'valid' }
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

    if (filterParams.params.filters.find((e: any) => e.field === 'branchId' && e.value === 'none'))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "branchId")
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
          res?.map(async (item) => {
            const branch = (await fetchSucursalData(currentEntity?.entity.id as string, item.branchId as string))
            return { ...item, branch };
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
      format: (value, row) => row.branch?.name ?? ' - '
    },
    {
      id: 'type',
      label: t("core.label.register"),
      minWidth: 170,
      format: (value, row) => t('core.label.' + row.type)
    },
    {
      id: 'timestamp',
      label: t("core.label.date-hour"),
      minWidth: 170,
      format: (value, row) => format_date(row.timestamp, 'DD/MM/YYYY') + ' ' + format_date(row.timestamp, 'hh:mm')
    },

    {
      id: 'status',
      label: t("core.label.status"),
      minWidth: 170,
      format: (value, row) => <CustomChip role={row.status == 'failed' ? 'button' : 'text'} background={row.status} text={row.status == 'failed' ? t("error." + row.failedCode) : null}
        size="small"
        label={t("core.label." + row.status)}
      />,
    },


  ];





  useEffect(() => {
    if (currentEntity?.entity?.id && id) {
      fetchingData(filterParams)

    }
  }, [currentEntity?.entity?.id, id])

  const { closeModal } = useCommonModal()
  const [deleting, setDeleting] = useState(false)
  const onDelete = async (item: IEmployee | Array<IEmployee>) => {
    try {
      setDeleting(true)
      let ids = []
      if (Array.isArray(item)) {
        ids = (item as Array<IEmployee>)?.map(e => e.id)
      } else {
        ids.push(item.id)
      }
      await Promise.all(
        ids?.map(async (id) => {
          try {
            await deleteEmployee(currentEntity?.entity.id as string, id as string, token, currentLocale)
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





  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>
    <SearchFilter
      label={t('core.label.status')}
      value={filterParams.filter.status}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, status: value } })}
      options={[{ value: 'valid' as string, label: t('core.label.valid') }, { value: 'failed' as string, label: t('core.label.failed') }, { value: 'pending-employee-validation' as string, label: t('core.label.pending-employee-validation') }]}
    />


    <DateRangeFilter value={{ from: filterParams.filter.range.start?.toISOString(), to: filterParams.filter.range.end?.toISOString() }}
      onChange={(rg: DateRange) => {
        onFilter({ ...filterParams, filter: { ...filterParams.filter, range: { start: new Date(rg.from), end: new Date(rg.to) } } })
      }}
    />


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

  const onSuccessCreate = () => {
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }


  const onEdit = async (item: any) => {
    openModal(CommonModalType.CHECKLOGFORM, { data: item })
  }

  const onResend = async (values: IEmployee) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data = {
        ...values,
      }
      await createEmployee(data, token, currentLocale)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');

    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };


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
    icon: <MapOutlined color="primary" />,
    label: t('sucursal.map'),
    bulk: false,
    allowItem: () => true,
    onPress: (item: IChecklog) => onGoMap(item.geo.lat, item.geo.lng)
  }]


  const onSuccess = () => fetchData()

  const [branchList, setBranchList] = useState<Array<ISucursal>>([])
  const fetchSucursalList = async () => {
    setBranchList(await search(currentEntity?.entity.id as string, { ...{} as any, limit: 100 }))
  }

  useEffect(() => {
    fetchSucursalList()
  }, [])


  const [entityResponsibilityList, setEntityResponsibilityListList] = useState<Array<EmployeeEntityResponsibility>>([])
  const addEntityResponsibility = async (branchId: string) => {
    setEntityResponsibilityListList([...entityResponsibilityList, {
      employeeId: initialValues.id as string,
      responsibility: 'worker',
      level: 4,
      scope: { entityId: currentEntity?.entity.id as string, branchId, scope: 'branch' },
      job: {
        job: '',
        price: 0,
        id: ''
      },
      metadata: [],
      active: 1,
      branch: await fetchSucursal(currentEntity?.entity.id as string, branchId)
    }])
  }


  const [jobList, setJobList] = useState<Array<Job>>([])
  const fetchJobList = async () => {
    try {
      setJobList(await searchJobs(currentEntity?.entity.id as string))
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
    changeLoaderState({ show: false })
  }



  const [responsabilityLimit, setResponsabilityLimit] = useState(5)
  const [responsabilityTotal, setResponsabilityTotal] = useState(0)
  const [responsabilityFilter, setResponsabilityFilter] = useState([
    { field: 'active', operator: '==', value: 1 }
  ])
  const fetchResponsabilityList = async (limit: number = 5) => {
    try {
      setResponsabilityLimit(limit)
      const data: Array<EmployeeEntityResponsibility> = await searchResponsability(currentEntity?.entity.id as string, initialValues.id as string, limit, responsabilityFilter)
      setEntityResponsibilityListList(data)
      if (data.length > 0) setResponsabilityTotal(data[0].totalItems as number)
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
    changeLoaderState({ show: false })
  }

  const loadMore = () => {
    fetchResponsabilityList(responsabilityLimit + 5)
  }


  useEffect(() => {
    if (currentEntity?.entity.id && initialValues.id) {
      fetchJobList()
      fetchResponsabilityList()
    }

  }, [currentEntity?.entity.id, user?.id, initialValues.id])

  const addResponsabiltyItem = () => {
    if (entityResponsibilityList.length <= branchList.length) {
      if (branchList.length === 1) addEntityResponsibility(branchList[0].id as string)
      else {
        openModal(CommonModalType.BRANCH_SELECTED)
      }
    } else {
      showToast("Ya tienes todas las sucursales con responsabilidades asociadas", 'info')
    }

  }

  return {
    items, onSort, onRowsPerPageChange, onSuccess,
    onDelete, deleting, topFilter, addResponsabiltyItem,
    onNext, onBack, onSuccessCreate,
    columns, addEntityResponsibility,
    loading, filterParams, onResend, entityResponsibilityList, responsabilityFilter, setResponsabilityFilter,
    initialValues, rowAction, branchList, jobList, loadMore, responsabilityTotal, responsabilityLimit
  }
}