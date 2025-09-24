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
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import { deleteEmployee, search } from "@/services/checkinbiz/employee.service";
import { useLayout } from "@/hooks/useLayout";
import { useParams, useSearchParams } from "next/navigation";
import { DeleteOutline, Edit, ListAltOutlined } from "@mui/icons-material";
import { decodeFromBase64, encodeToBase64 } from "@/lib/common/base64";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import { Box } from "@mui/material";


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

export default function useEmployeeListController() {
  const t = useTranslations();
  const { id } = useParams<{ id: string }>()

  const searchParams = useSearchParams()
  const { token } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IEmployee[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IEmployee[]>([]);
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

  const { closeModal, openModal } = useCommonModal()
  const rowAction: Array<IRowAction> = id ? [] : [
    {
      actionBtn: true,
      color: 'error',
      icon: <DeleteOutline color="error" />,
      label: t('core.button.delete'),
      allowItem: () => true,
      showBulk: true,
      onPress: (item: IEmployee) => openModal(CommonModalType.DELETE, { data: item }),
      bulk: true
    },

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





  const columns: Column<IEmployee>[] = [
    {
      id: 'fullName',
      label: t("core.label.name"),
      minWidth: 170,
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
      id: 'role',
      label: t("core.label.role"),
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


  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('checkinbiz')
    }
  }, [currentEntity?.entity?.id, watchServiceAccess])

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      if (searchParams.get('params') && localStorage.getItem('employeeIndex'))
        inicializeFilter(searchParams.get('params') as string)
      else
        fetchingData(filterParams)
    }
  }, [currentEntity?.entity?.id, searchParams.get('params')])








  const onEdit = async (item: any) => {
    navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee/${item.id}/edit`)
  }


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

      const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
      fetchingData(filterParamsUpdated)
      setDeleting(false)
      closeModal(CommonModalType.DELETE)
    } catch (e: any) {
      showToast(e?.message, 'error')
      setDeleting(false)
    }
  }



  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>


    <SearchIndexFilter
      type="staff"
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


  return {
    items, onSort, onRowsPerPageChange,
    onEdit,
    onNext, onBack, buildState,
    columns, rowAction, onDelete, topFilter,
    loading, deleting, filterParams,

  }


}