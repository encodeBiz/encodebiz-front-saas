/* eslint-disable react-hooks/exhaustive-deps */
import { Column, IRowAction } from "@/components/common/table/GenericTable";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { EmployeeEntityResponsibility } from "@/domain/features/checkinbiz/IEmployee";
import { searchResponsabilityByBranch } from "@/services/checkinbiz/employee.service";
import { fetchEmployee as fetchEmployeeData, search as searchEmployee } from "@/services/checkinbiz/employee.service";

import { useLayout } from "@/hooks/useLayout";
import { useParams, useSearchParams } from "next/navigation";
import { ListAltOutlined, SignalWifi4Bar, SignalWifi4BarLockOutlined } from "@mui/icons-material";
import { decodeFromBase64 } from "@/lib/common/base64";
import { Box, Tooltip } from "@mui/material";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";


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
  const searchParams = useSearchParams()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<EmployeeEntityResponsibility[]>([]);

  const [filterParams, setFilterParams] = useState<IFilterParams>({

    startAfter: null,
    currentPage: 0,
    total: 0,
    params: {
      filters: [],
      startAfter: null,
      limit: 5,
      orderBy: 'assignedAt',
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
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: filterParams.currentPage - 1 }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
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
      onClick: (item: EmployeeEntityResponsibility) => onDetail(item.employee),
      format: (value, row) => row.employee?.email
    },

    {
      id: 'phone',
      label: t("core.label.phone"),
      minWidth: 170,
      onClick: (item: EmployeeEntityResponsibility) => onDetail(item.employee),
      format: (value, row) => row.employee?.phone

    },

    {
      id: 'responsibility',
      label: t("core.label.responsibility"),
      minWidth: 170,
      onClick: (item: EmployeeEntityResponsibility) => onDetail(item.employee),
      format: (value, row) => t("core.label." + row.responsibility)
    },

    {
      id: 'job',
      label: t("core.label.job"),
      minWidth: 170,
      onClick: (item: EmployeeEntityResponsibility) => onDetail(item.employee),
      format: (value, row) => row.job?.job
    },


  ];

  const fetchingData = (filterParams: IFilterParams) => {

    setLoading(true)





    searchResponsabilityByBranch(currentEntity?.entity.id as string, branchId, {
      ...(filterParams.params as any),
      filters: [...filterParams.params.filters],
      startAfter: null,
      limit: 10000,
    }).then(async data => {
      const activeItems: Array<any> = (await Promise.all(
        data.map(async (item) => {
          const employee = (await fetchEmployeeData(currentEntity?.entity.id as string, item.employeeId as string))
          if (employee?.status !== 'active') return null;
          return { ...item, employee };
        })
      )).filter(Boolean);
      const start = filterParams.currentPage * filterParams.params.limit;
      const res = activeItems
        .slice(start, start + filterParams.params.limit)
        .map((item) => ({ ...item, totalItems: activeItems.length }));

      setFilterParams({ ...filterParams, params: { ...filterParams.params, startAfter: res.length > 0 ? (res[res.length - 1] as any).last : null } })
      setItems(res)

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








  const onSuccessResponsability = () => {
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }


  const addResponsabiltyItem = async () => {
    let totalEmployee = 0
    const employeeList = await searchEmployee(currentEntity?.entity.id as any, { limit: 1 } as any)
    if (employeeList.length > 0) totalEmployee = employeeList[0].totalItems as number
    let totalAssigned = 0
    if (items.length > 0) totalAssigned = items[0].totalItems as number
    if (totalAssigned < totalEmployee || totalEmployee != 0) {
      openModal(CommonModalType.FORM, { id: 'responsability' })
    } else {
      openModal(CommonModalType.INFO, { id: 'maxSelectionBranch' })
    }

  }


  return {
    items, onSort, onRowsPerPageChange,
    onEdit, onSuccessResponsability,
    onNext, onBack, addResponsabiltyItem,
    columns, rowAction,
    loading, filterParams,

  }


}
