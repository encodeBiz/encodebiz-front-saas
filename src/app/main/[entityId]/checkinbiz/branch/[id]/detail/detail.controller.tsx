/* eslint-disable react-hooks/exhaustive-deps */
import { Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { EmployeeEntityResponsibility, IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import { searchResponsabilityByBranch, updateEmployee } from "@/services/checkinbiz/employee.service";
 import { fetchEmployee as fetchEmployeeData } from "@/services/checkinbiz/employee.service";

import { useLayout } from "@/hooks/useLayout";
import { useParams, useSearchParams } from "next/navigation";
import { ListAltOutlined, SignalWifi4Bar, SignalWifi4BarLockOutlined } from "@mui/icons-material";
import { decodeFromBase64 } from "@/lib/common/base64";
import { Box, Tooltip } from "@mui/material";
import { SelectFilter } from "@/components/common/table/filters/SelectFilter";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useAppLocale } from "@/hooks/useAppLocale";


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

export default function useEmployeeResponsabilityController(branchId: string) {
  const t = useTranslations();
  const { id } = useParams<{ id: string }>()
  const { changeLoaderState } = useLayout()
  const { currentLocale } = useAppLocale()
  const searchParams = useSearchParams()
  const { token, user } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<EmployeeEntityResponsibility[]>([]);
  const [itemsHistory, setItemsHistory] = useState<EmployeeEntityResponsibility[]>([]);

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


  const rowAction: Array<IRowAction> = id ? [] : [




    {
      actionBtn: true,
      color: 'primary',
      icon: <ListAltOutlined color="primary" />,
      label: t('employee.detail'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: EmployeeEntityResponsibility) => onDetail(item)
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


  const columns: Column<any>[] = [
    {
      id: 'fullName',
      label: t("core.label.name"),
      minWidth: 170,
      onClick: (item: EmployeeEntityResponsibility) => onDetail(item.employee),
      format: (value, row) => <Box>
        <div style={{ display: "flex", alignItems: 'center', cursor: 'help', gap: 4 }}>
          <Tooltip title={row.employee?.enableRemoteWork ? t('core.label.enableRemoteWorkEnable') : t('core.label.enableRemoteWorkDisabled')}>
            <span>{row.employee?.enableRemoteWork ? <SignalWifi4Bar color="primary" /> : <SignalWifi4BarLockOutlined color="secondary" />}</span>
          </Tooltip>
          {row.employee?.fullName}
        </div>
      </Box>

    },

    {
      id: 'email',
      label: t("core.label.email"),
      minWidth: 170,
      onClick: (item: EmployeeEntityResponsibility) => onDetail(item.employee)
    },

    {
      id: 'phone',
      label: t("core.label.phone"),
      minWidth: 170,
      onClick: (item: EmployeeEntityResponsibility) => onDetail(item)

    },

    {
      id: 'responsibility',
      label: t("core.label.responsibility"),
      minWidth: 170,
      onClick: (item: EmployeeEntityResponsibility) => onDetail(item),
      format: (value, row) => row.responsibility
    },

    {
      id: 'job',
      label: t("core.label.job"),
      minWidth: 170,
      onClick: (item: EmployeeEntityResponsibility) => onDetail(item),
      format: (value, row) => row.job.name
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



    searchResponsabilityByBranch(currentEntity?.entity.id as string, branchId, { ...(filterParams.params as any), filters: [...filterParams.params.filters, ...filters] }).then(async data => {
      const res: Array<any> = await Promise.all(
        data.map(async (item) => {
          const employee = (await fetchEmployeeData(currentEntity?.entity.id as string, item.employeeId as string))?.fullName
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

  const updateStatus = async (dataUpdated: EmployeeEntityResponsibility) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: Partial<IEmployee> = {
        "uid": user?.id as string,
        "id": dataUpdated?.employee?.id,
        entityId: currentEntity?.entity.id as string,
        status: dataUpdated.employee?.status
      }
      await updateEmployee(data, token, currentLocale)
      const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
      fetchingData(filterParamsUpdated)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');

    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };


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








  const onSuccess = () => {
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }

  return {
    items, onSort, onRowsPerPageChange,
    onEdit, onSuccess,
    onNext, onBack,
    columns, rowAction,
    loading, filterParams,

  }


}

