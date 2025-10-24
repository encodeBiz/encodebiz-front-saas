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
import { createEmployee, deleteEmployee, fetch2FAData, fetchEmployee, searchJobs, searchLogs } from "@/services/checkinbiz/employee.service";
import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";
import { Column } from "@/components/common/table/GenericTable";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { format_date, rmNDay } from "@/lib/common/Date";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";
import { fetchSucursal, fetchSucursal as fetchSucursalData, search } from "@/services/checkinbiz/sucursal.service";
import { Box } from "@mui/material";

import { DateRangePicker } from "@/app/main/[entityId]/passinbiz/stats/components/filters/fields/DateRangeFilter";
import { onGoMap } from "@/lib/common/maps";
import { Edit, MapOutlined } from "@mui/icons-material";
import { CustomChip } from "@/components/common/table/CustomChip";
import { useAppLocale } from "@/hooks/useAppLocale";

interface IFilterParams {
  filter: { branchId: '', range: { start: any, end: any } | null },
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
  const [branchListEmployee, setBranchListEmployee] = useState<Array<ISucursal>>()

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

      const dataSucursalList: Array<ISucursal> = []


      await Promise.all(
        employee.branchId?.map(async (branchId) => {
          dataSucursalList.push((await fetchSucursalData(currentEntity?.entity.id as string, branchId as string)))
        })
      );
      setBranchListEmployee(dataSucursalList)
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
    filter: { branchId: 'none', range: { start: rmNDay(new Date(), 1), end: new Date() } },
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
      label: t("core.label.date-hour"),
      minWidth: 170,
      format: (value, row) => format_date(row.timestamp, 'DD/MM/YYYY') + ' ' + format_date(row.timestamp, 'hh:mm')
    },

    {
      id: 'status',
      label: t("core.label.status"),
      minWidth: 170,
      format: (value, row) => <CustomChip background={row.status} text={t("error." + row.failedCode)}
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


  useEffect(() => {
    if (currentEntity?.entity.id) {
      fetchJobList()
    }

  }, [currentEntity?.entity.id, user?.id])

  return {
    items, onSort, onRowsPerPageChange, onSuccess,
    onDelete, deleting, topFilter,
    onNext, onBack, onSuccessCreate,
    columns, branchListEmployee, addEntityResponsibility,
    loading, filterParams, onResend, entityResponsibilityList,
    initialValues, rowAction, branchList, jobList
  }
}