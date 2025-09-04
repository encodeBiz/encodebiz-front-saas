/* eslint-disable react-hooks/exhaustive-deps */
import { Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { IStaff } from "@/domain/features/passinbiz/IStaff";
import { createStaff, deleteStaff, search } from "@/services/passinbiz/staff.service";
import { DeleteOutline, Event, ReplyAllOutlined } from "@mui/icons-material";
import { PASSSINBIZ_MODULE_ROUTE } from "@/config/routes";
import { Box } from "@mui/material";
import { SelectFilter } from "@/components/common/table/filters/SelectFilter";
import { TextFilter } from "@/components/common/table/filters/TextFilter";
import { useLayout } from "@/hooks/useLayout";
import { useSearchParams } from "next/navigation";
import { decodeFromBase64, encodeToBase64 } from "@/lib/common/base64";


let resource: any = null;


interface IFilterParams {
  filter: { allowedTypes: string, email: string }
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


export default function useStaffListController() {
  const t = useTranslations();
  const { token } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  /** Filter and PAgination Control */
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IStaff[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IStaff[]>([]);
  const [filterParams, setFilterParams] = useState<IFilterParams>({
    startAfter: null,
    currentPage: 0,
    total: 0,
    filter: { allowedTypes: 'all', email: '' },
    params: {
      filters: [],
      startAfter: null,
      limit: 5,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    }
  })
  /** Filter and PAgination Control */


  const { closeModal, openModal } = useCommonModal()
  const { navivateTo } = useLayout()
  const { changeLoaderState } = useLayout()
  const searchParams = useSearchParams()

  const handleResend = async (item: IStaff) => {
    const dataForm = {
      "fullName": item.fullName,
      "email": item.email,
      "entityId": currentEntity?.entity?.id as string,
      allowedTypes: item.allowedTypes,
      id: item.id
    }
    changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
    await createStaff(dataForm, token)
    showToast(t('core.feedback.success'), 'success');
    changeLoaderState({ show: false })

  }

  const rowAction: Array<IRowAction> = [
    {
      actionBtn: true,
      color: 'error',
      icon: <DeleteOutline color="error" />,
      label: t('core.button.delete'),
      allowItem: () => true,
      onPress: (item: IStaff) => openModal(CommonModalType.DELETE, { item }),
      bulk: true
    },
    {
      actionBtn: true,
      bulk: false,
      color: 'primary',
      icon: <Event color="primary" />,
      label: t('core.label.event'),
      allowItem: (item: IStaff) => item?.allowedTypes?.includes('event'),
      onPress: (item: IStaff) => navivateTo(`/${PASSSINBIZ_MODULE_ROUTE}/staff/${item.id}/events?params=${buildState()}`)
    },
    {
      actionBtn: true,
      color: 'primary',
      icon: <ReplyAllOutlined color="primary" />,
      label: t('core.label.resend'),
      allowItem: () => true,
      bulk: true,
      onPress: (item: IStaff) => handleResend(item)
    },
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


  /** Filter Changed */
  const onFilter = (filterParamsData: any) => {
    const filterData: Array<{ field: string, operator: any, value: any }> = []
    const filter = filterParamsData.filter
    Object.keys(filter).forEach((key) => {
      if (key === 'allowedTypes' && (filter[key] != 'all' || filter[key] != 'none'))
        filterData.push({ field: key, operator: 'array-contains-any', value: [filter[key]] })
      else
        if (key !== 'allowedTypes' && filter[key] != '')
          filterData.push({ field: key, operator: '==', value: filter[key] })
    })
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, filters: filterData }, filter }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }

  const columns: Column<IStaff>[] = [
    {
      id: 'fullName',
      label: t("core.label.fullName"),
      minWidth: 170,
    },
    {
      id: 'email',
      label: t("core.label.email"),
      minWidth: 170,
    },

    {
      id: 'allowedTypes',
      label: t("core.label.typeStaff"),
      minWidth: 170,
      format: (value) => value.join(', ')
    },

  ];


  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity?.id, watchServiceAccess])

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      if (searchParams.get('params') && localStorage.getItem('staffIndex'))
        inicializeFilter(searchParams.get('params') as string)
      else
        fetchingData(filterParams)
    }
  }, [currentEntity?.entity?.id, searchParams.get('params')])






  const inicializeFilter = (params: string) => {
    try {
      const dataList = JSON.parse(localStorage.getItem('staffIndex') as string)
      setItems(dataList.items ?? []);
      setItemsHistory(dataList.itemsHistory ?? []);
      const filters = decodeFromBase64(params as string)
      setFilterParams(filters)
      setLoading(false)
      //localStorage.removeItem('holderIndex')
    } catch (error) {
      showToast(String(error as any), 'error')
    }

  }

  const buildState = () => {
    const dataStatus = {
      items,
      itemsHistory,
    }
    localStorage.setItem('holderIndex', JSON.stringify(dataStatus))
    return encodeToBase64({ ...filterParams })
  }

  const fetchingData = (filterParams: IFilterParams) => {
    setLoading(true)


    if (filterParams.params.filters.find((e: any) => e.field === "allowedTypes" && e.value.includes('all')))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== 'allowedTypes')
    if (filterParams.params.filters.find((e: any) => e.field === 'email' && e.value === ''))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== 'email')


    search(currentEntity?.entity.id as string, { ...(filterParams.params as any) }).then(async res => {
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
      setLoading(false)

    }).catch(e => {
      showToast(e?.message, 'error')
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity?.id])


  const onEdit = async (item: any) => {
    navivateTo(`/passinbiz/staff/${item.id}/edit`)
  }

  const [deleting, setDeleting] = useState(false)
  const onDelete = async (item: any) => {
    try {
      setDeleting(true)
      const id = item[0]
      await deleteStaff(currentEntity?.entity.id as string, id, token)
      setItemsHistory(itemsHistory.filter(e => e.id !== id))
      setItems(itemsHistory.filter(e => e.id !== id))
      setDeleting(false)
      closeModal(CommonModalType.DELETE)
    } catch (e: any) {
      showToast(e?.message, 'error')
      setDeleting(false)
    }
  }

  const holderType = [
    { value: 'all', label: t('core.label.all') },
    { value: 'event', label: t('core.label.event') },
    { value: 'credential', label: t('core.label.credential') },
  ]



  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>
    <SelectFilter
      first={false}
      defaultValue={'all'}
      value={filterParams.filter.allowedTypes}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, allowedTypes: value } })}
      items={holderType}
    />


    <TextFilter
      label={t('core.label.email')}
      value={filterParams.filter.email}
      onChange={(value) => {
        setFilterParams({ ...filterParams, filter: { ...filterParams.filter, email: value } });
        if (resource) clearTimeout(resource);
        resource = setTimeout(() => {
          onFilter({ ...filterParams, filter: { ...filterParams.filter, email: value } })
        }, 1500);
      }}
    />
  </Box>




  return {
    items, onSort, onRowsPerPageChange,
    onEdit,
    onNext, onBack, buildState,
    columns, rowAction, onDelete, topFilter,
    loading, deleting, filterParams,

  }

}