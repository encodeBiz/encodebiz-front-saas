/* eslint-disable react-hooks/exhaustive-deps */
import { Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { IIssue } from "@/domain/features/checkinbiz/IIssue";
import { deleteSucursal, fetchSucursal } from "@/services/checkinbiz/sucursal.service";
import { useLayout } from "@/hooks/useLayout";
import { ListAltOutlined } from "@mui/icons-material";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import { Box } from "@mui/material";
import { useAppLocale } from "@/hooks/useAppLocale";
import { SelectFilter } from "@/components/common/table/filters/SelectFilter";
import { CustomChip } from "@/components/common/table/CustomChip";
import { format_date } from "@/lib/common/Date";
import { fetchEmployee, getIssues } from "@/services/checkinbiz/employee.service";
import SearchFilter from "@/components/common/table/filters/SearchFilter";
import { DateRangePicker } from "../../passinbiz/stats/components/filters/fields/DateRangeFilter";


interface IFilterParams {
  filter: { branchId: string, employeeId: string, state: 'resolved' | "in_review" | "pending" },
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

export default function useIIssuesListController() {
  const t = useTranslations();
  const { token } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const { currentLocale } = useAppLocale()
  const { navivateTo } = useLayout()
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IIssue[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IIssue[]>([]);
  const [filterParams, setFilterParams] = useState<IFilterParams>({
    filter: { branchId: 'none', employeeId: 'none', state: 'resolved' },
    startAfter: null,
    currentPage: 0,
    total: 0,
    params: {
      filters: [{ field: 'state', operator: '==', value: 'resolved' }],
      startAfter: null,
      limit: 5,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    }
  })

  const { closeModal, openModal } = useCommonModal()
  const rowAction: Array<IRowAction> = [
    /* {
       actionBtn: true,
       color: 'primary',
       icon: <Edit color="primary" />,
       label: t('core.button.edit'),
       bulk: false,
       allowItem: () => true,
       onPress: (item: IIssue) => onEdit(item)
     },*/

    {
      actionBtn: true,
      color: 'primary',
      icon: <ListAltOutlined color="primary" />,
      label: t('employee.detail'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: IIssue) => onDetail(item)
    },

    /*{
      actionBtn: true,
      color: 'error',
      icon: <DeleteOutline color="error" />,
      label: t('core.button.delete'),
      allowItem: () => true,
      showBulk: true,
      onPress: (item: IIssue) => openModal(CommonModalType.DELETE, { data: item }),
      bulk: true
    },*/

  ]




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
    { label: t('core.label.resolved'), value: 'resolved' },
    { label: t('core.label.in_review'), value: 'in_review' },
    { label: t('core.label.pending'), value: 'pending' },
  ]



  const columns: Column<IIssue>[] = [
    {
      id: 'comments',
      label: t("core.label.comments"),
      minWidth: 170,
      onClick: (item: IIssue) => onDetail(item),
    },

    {
      id: 'branch',
      label: t("core.label.branch"),
      minWidth: 170,
      format: (value, row) => row.branch?.name,
      onClick: (item: IIssue) => onDetail(item),
    },

    {
      id: 'employee',
      label: t("core.label.employee"),
      minWidth: 170,
      format: (value, row) => row.employee?.fullName,
      onClick: (item: IIssue) => onDetail(item),
    },

    {
      id: 'state',
      label: t("core.label.status"),
      minWidth: 170,
      format: (value, row) => <CustomChip background={row.state} label={t("core.label." + row.state)} />,
    },

    {
      id: 'createdAt',
      label: t("core.label.createAt"),
      minWidth: 170,
      format: (value, row) => format_date(row.createdAt),
    },


  ];



  const fetchingData = (filterParams: IFilterParams) => {
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
    getIssues(currentEntity?.entity.id as string, { ...(filterParams.params as any), filters }).then(async data => {
      const res: Array<any> = await Promise.all(
        data.map(async (item) => {
          const employee = (await fetchEmployee(currentEntity?.entity.id as string, item.employeeId as string))
          const branch = (await fetchSucursal(currentEntity?.entity.id as string, item.branchId as string))
          return { ...item, employee, branch };
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




  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('checkinbiz')
    }
  }, [currentEntity?.entity?.id, watchServiceAccess])

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      fetchingData(filterParams)
    }
  }, [currentEntity?.entity?.id])



  const onEdit = async (item: any) => {
    openModal(CommonModalType.FORM, { ...item })
  }



  const onDetail = async (item: any) => {

    navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/branch/${item.id}/detail`)
  }

  const [deleting, setDeleting] = useState(false)
  const onDelete = async (item: IIssue | Array<IIssue>) => {
    try {
      setDeleting(true)
      let ids = []
      if (Array.isArray(item)) {
        ids = (item as Array<IIssue>).map(e => e.id)
      } else {
        ids.push(item.id)
      }
      await Promise.all(
        ids.map(async (id) => {
          try {
            await deleteSucursal(currentEntity?.entity.id as string, id as string, token, currentLocale)
          } catch (e: any) {
            showToast(e?.message, 'error')
            setDeleting(false)
          }
        })
      );

      const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
      fetchingData(filterParamsUpdated)
      setDeleting(false)
      closeModal(CommonModalType.DELETE)
    } catch (e: any) {
      showToast(e?.message, 'error')
      setDeleting(false)
    }
  }

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


  const topFilter = <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap', width: '100%', justifyContent: 'flex-end' }}>


    <SearchFilter
      label={t('core.label.status')}
      value={filterParams.filter.state}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, state: value } })}
      options={[...options]}
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
        } else {
          onFilter({ ...filterParams, filter: { ...filterParams.filter, branchId: 'none' } })
        }
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


  </Box>


  const onSuccess = () => {
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
    fetchingData(filterParamsUpdated)
  }



  return {
    items, onSort, onRowsPerPageChange,
    onEdit, onSuccess,
    onNext, onBack,
    columns, rowAction, onDelete, topFilter,
    loading, deleting, filterParams,

  }


}