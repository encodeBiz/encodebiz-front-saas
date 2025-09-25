/* eslint-disable react-hooks/exhaustive-deps */
import { Column, IRowAction } from "@/components/common/table/GenericTable";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { archivedEvent, search } from "@/services/passinbiz/event.service";
import { PASSSINBIZ_MODULE_ROUTE } from "@/config/routes";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { ArchiveOutlined, Edit, Person2 } from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";
import { formatDateInSpanish } from "@/lib/common/Date";
import { SelectFilter } from "@/components/common/table/filters/SelectFilter";
import { decodeFromBase64, encodeToBase64 } from "@/lib/common/base64";
import { useSearchParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";


interface IFilterParams {
  filter: { status: string, name: string }
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
export default function useIEventListController() {
  const t = useTranslations();
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { closeModal } = useCommonModal()
  const searchParams = useSearchParams()

  /** Filter and PAgination Control */
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IEvent[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IEvent[]>([]);
  const [filterParams, setFilterParams] = useState<IFilterParams>({
    startAfter: null,
    currentPage: 0,
    total: 0,
    filter: { status: 'published', name: '' },
    params: {
      filters: [{ field: 'status', operator: '==', value: 'published' }],
      startAfter: null,
      limit: 5,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    }
  })
  /** Filter and PAgination Control */
  const { openModal } = useCommonModal()


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

  const options = [
    { value: 'draft', label: t('core.label.draft') },
    { value: 'published', label: t('core.label.published') },
    { value: 'archived', label: t('core.label.archived') },
  ]


  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>
    <SelectFilter first={false}
      defaultValue={'published'}
      value={filterParams.filter.status}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, status: value } })}
      items={options}
    />

     
    <SearchIndexFilter
      type="events"
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

  const columns: Column<IEvent>[] = [
    {
      id: 'name',
      label: t("core.label.name"),
      minWidth: 170,
    },
    {
      id: 'date',
      label: t("core.label.date"),
      minWidth: 170,
      format: (value, row) => <Typography sx={{ textTransform: 'capitalize' }}>{formatDateInSpanish(row.date)}</Typography>,
    },

    {
      id: 'address',
      label: t("core.label.address"),
      minWidth: 170,
    },
    {
      id: 'status',
      label: t("core.label.status"),
      minWidth: 170,
      format: (value, row) => <Chip
        size="small"
        label={t(`core.label.${row.status}`)}
        variant="outlined"
      />,
    },

  ];

  const fetchingData = (filterParams: IFilterParams) => {
    setLoading(true)

    if (filterParams.params.filters.find((e: any) => e.field === 'status' && e.value === 'none'))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "status")
    if (filterParams.params.filters.find((e: any) => e.field === 'name' && e.value === ''))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== 'name')


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

  const buildState = () => {
    const dataStatus = {
      items,
      itemsHistory,
    }
    localStorage.setItem('eventIndex', JSON.stringify(dataStatus))
    return encodeToBase64({ ...filterParams })
  }

  const [deleting, setDeleting] = useState(false)
  const onEdit = async (item: any) => {
    navivateTo(`/${PASSSINBIZ_MODULE_ROUTE}/event/${item.id}/edit?params=${buildState()}`)
  }


  const onArchived = async (item: IEvent | Array<IEvent>) => {
    try {
      setDeleting(true)
      let ids = []
      if (Array.isArray(item)) {
        ids = (item as Array<IEvent>).map(e => e.id)
      } else {
        ids.push(item.id)
      }
      await Promise.all(
        ids.map(async (id) => {
          try {
            await archivedEvent(currentEntity?.entity.id as string, id)
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

  const rowAction: Array<IRowAction> = [


    {
      actionBtn: true,
      color: 'primary',
      icon: <Person2 color="primary" />,
      label: t('core.label.staff1'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: IEvent) => navivateTo(`/${PASSSINBIZ_MODULE_ROUTE}/event/${item.id}/staff?params=${buildState()}`)
    },

    {
      actionBtn: true,
      color: 'primary',
      icon: <Edit color="primary" />,
      label: t('core.button.edit'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: IEvent) => onEdit(item)
    },

    {
      actionBtn: true,
      bulk: true,
      showBulk: true,
      color: 'error',
      icon: <ArchiveOutlined color="error" />,
      label: t('core.label.archivedHolder'),
      allowItem: () => true,
      onPress: (item: IEvent) => openModal(CommonModalType.DELETE, { data: item })
    },

  ]

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity?.id])

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      if (searchParams.get('params') && localStorage.getItem('holderIndex'))
        inicializeFilter(searchParams.get('params') as string)
      else
        fetchingData(filterParams)
    }
  }, [currentEntity?.entity?.id, searchParams.get('params')])



  return {
    onArchived, items, onSort, onRowsPerPageChange, topFilter,
    onEdit,
    onBack, onNext, buildState,
    columns, deleting, rowAction,
    loading, filterParams
  }


}