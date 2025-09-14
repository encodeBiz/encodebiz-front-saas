/* eslint-disable react-hooks/exhaustive-deps */
import { Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Holder } from "@/domain/features/passinbiz/IHolder";
import { importHolder, search, updateHolder } from "@/services/passinbiz/holder.service";
import { ArchiveOutlined, NotInterested, PanoramaFishEyeOutlined, ReplyAllOutlined } from "@mui/icons-material";
import { useLayout } from "@/hooks/useLayout";
import { Box } from "@mui/material";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { search as searchEvent } from "@/services/passinbiz/event.service";
import { CustomChip } from "@/components/common/table/CustomChip";
import { SelectFilter } from "@/components/common/table/filters/SelectFilter";
import { decodeFromBase64, encodeToBase64 } from "@/lib/common/base64";
import { useSearchParams } from "next/navigation";
import { PASSSINBIZ_MODULE_ROUTE } from "@/config/routes";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";

interface IFilterParams {
  filter: { passStatus: string, type: string, email: string, parentId: string }
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


export default function useHolderListController() {
  const t = useTranslations();
  const { token, user } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const { changeLoaderState } = useLayout()
  const { openModal, closeModal } = useCommonModal()
  const [revoking, setRevoking] = useState(false)
  const { navivateTo } = useLayout()

  /** Filter and PAgination Control */
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Holder[]>([]);
  const [itemsHistory, setItemsHistory] = useState<Holder[]>([]);

  const [filterParams, setFilterParams] = useState<IFilterParams>({
    startAfter: null,
    currentPage: 0,
    total: 0,
    filter: { passStatus: 'active', type: 'none', email: '', parentId: 'none' },
    params: {
      filters: [{ field: 'passStatus', operator: '==', value: 'active' }],
      startAfter: null,
      limit: 5,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    }
  })
  /** Filter and PAgination Control */
  const searchParams = useSearchParams()
  const rowAction: Array<IRowAction> = [
    {
      actionBtn: true,
      color: 'error',
      icon: <NotInterested color="error" />,
      label: t('core.button.revoke'),
      bulk: true,
      allowItem: (item: Holder) => (item.passStatus === 'pending' || item.passStatus === 'active'),
      showBulk: filterParams.filter.passStatus === 'active',
      onPress: (item: Holder) => openModal(CommonModalType.DELETE, { data: item })
    },

    {
      actionBtn: true,
      color: 'success',
      icon: <ReplyAllOutlined color="success" />,
      bulk: true,
      label: t('core.button.resend'),
      showBulk: filterParams.filter.passStatus === 'active' || filterParams.filter.passStatus === 'failed',
      allowItem: (item: Holder) => (item.passStatus === 'active' || item.passStatus === 'failed'),
      onPress: (item: Holder) => openModal(CommonModalType.SEND, { data: item })
    },

    {
      actionBtn: true,
      color: 'success',
      icon: <PanoramaFishEyeOutlined color="success" />,
      label: t('core.button.reactive'),
      bulk: true,
      showBulk: filterParams.filter.passStatus === 'revoked',
      allowItem: (item: Holder) => (item.passStatus === 'revoked'),
      onPress: (item: Holder) => openModal(CommonModalType.REACTIVE, { data: item })
    },

    {
      actionBtn: true,
      color: 'warning',
      icon: <ArchiveOutlined color="warning" />,
      label: t('core.label.archivedHolder'),
      bulk: true,
      showBulk: filterParams.filter.passStatus !== 'archived',
      allowItem: (item: Holder) => item.passStatus !== 'archived',
      onPress: (item: Holder) => openModal(CommonModalType.ARCHIVED, { data: item })
    },



  ]

  const holderState = [
    { value: 'failed', label: t('holders.failed') },
    { value: 'active', label: t('holders.active') },
    { value: 'revoked', label: t('holders.revoked') },
    { value: 'archived', label: t('holders.archived') }
  ]

  const holderType = [
    { value: 'event', label: t('core.label.event') },
    { value: 'credential', label: t('core.label.credential') },

  ]

  const [eventList, setEventList] = useState<Array<IEvent>>([])
  const inicializeEvent = useCallback(async () => {
    setEventList(await searchEvent(currentEntity?.entity.id as string, { ...{} as any, limit: 100 }))
  }, [currentEntity?.entity.id])

  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>

    <SelectFilter
      defaultValue={'none'}
      value={filterParams.filter.type}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, type: value } })}
      items={holderType}
    />
    {filterParams.filter.type == 'event' && <SelectFilter
      value={filterParams.filter.parentId}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, parentId: value } })}
      items={eventList.map(e => ({ label: e.name, value: e.id }))}
    />}

    <SelectFilter first={false}
      defaultValue={'active'}
      value={filterParams.filter.passStatus}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, passStatus: value } })}
      items={holderState}
    />

    <SearchIndexFilter
      type="holder"
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
  </Box >


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



  const columns: Column<Holder>[] = [
    {
      id: 'fullName',
      label: t("core.label.name"),
      minWidth: 170,
      sortable: true,
    },
    {
      id: 'email',
      label: t("core.label.email"),
      minWidth: 170,
    },

    {
      id: 'passStatus',
      label: t("core.label.state"),
      minWidth: 170,
      format: (value, row) => <CustomChip
        id={row.id}
        background={row.passStatus}
        text={row.passStatus === 'failed' ? row.failedFeedback : ''}
        size="small"
        label={t("core.label." + row.passStatus)}

      />,
    },
    {
      id: 'type',
      label: t("core.label.typePass"),
      minWidth: 170,
      format: (value, row) => <CustomChip
        size="small"
        label={t("core.label." + row.type)}
      />,
    },


  ];



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
      if (key === 'parentId' && filter[key] != '' && filter.type == 'event') {
        filterData.push({ field: key, operator: '==', value: filter[key] })
      } else {
        filterData.push({ field: key, operator: '==', value: filter[key] })
      }
    })
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, filters: filterData }, filter }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }



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
    localStorage.setItem('holderIndex', JSON.stringify(dataStatus))
    return encodeToBase64({ ...filterParams })
  }

  const fetchingData = (filterParams: IFilterParams) => {

    setLoading(true)
    if (filterParams.params.filters.find((e: any) => e.field === 'passStatus' && e.value === 'none'))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== 'passStatus')
    if (filterParams.params.filters.find((e: any) => e.field === 'type' && (e.value === 'none' || e.value === 'credencial')))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "parentId")
    if (filterParams.params.filters.find((e: any) => e.field === 'type' && e.value === 'none'))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== 'type')
    if (filterParams.params.filters.find((e: any) => e.field === 'email' && e.value === ''))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== 'email')
    if (filterParams.params.filters.find((e: any) => e.field === 'parentId' && (e.value === '' || e.value === 'none')))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== 'parentId')


    inicializeEvent()

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

  /** */
  const onAction = async (item: Holder | Array<Holder>, passStatus?: string, status?: string) => {
    try {
      setRevoking(true)
      let ids = []
      if (Array.isArray(item)) {
        ids = (item as Array<Holder>).map(e => e.id)
      } else {
        ids.push(item.id)
      }

      await Promise.all(
        ids.map(async (id) => {
          const update: any = {}
          if (passStatus) {
            update['passStatus'] = passStatus
          }
          if (status) {
            update['status'] = status
          }
          try {
            const res = await updateHolder({
              id: id,
              entityId: currentEntity?.entity?.id,
              ...update,
            }, token)
            console.log(res);
            
          } catch (e: any) {
            showToast(e?.message, 'error')            
          }
        })
      );

      setRevoking(false)
      closeModal(CommonModalType.DELETE)
      fetchingData(filterParams)
    } catch (e: any) {
      showToast(e?.message, 'error')
      setRevoking(false)
    }

  }
  const onEdit = async (item: any) => {
    navivateTo(`/${PASSSINBIZ_MODULE_ROUTE}/holder/${item.id}/edit?params=${buildState()}`)
  }



  const [isUploading, setIsUploading] = useState(false);
  const [type, setType] = useState<string>()
  const [eventId, setEventId] = useState<string>()
  const handleConfigConfirm = async ({ type, eventId = '' }: { type: 'event' | 'credential', eventId?: string }) => {
    setType(type)
    setEventId(eventId)
    closeModal(CommonModalType.CONFIG_CSV)
    setTimeout(() => {
      openModal(CommonModalType.UPLOAD_CSV)
    }, 400);
  }
  const handleUploadConfirm = async (file: File | null) => {
    try {
      setIsUploading(true)
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const form = new FormData();
      form.append('uid', user?.id as string);
      form.append('csv', file as File);
      form.append('entityId', currentEntity?.entity.id as string);
      form.append('passStatus', 'pending');
      form.append('type', type as string);
      if (type === 'event')
        form.append('event', eventId as string);
      await importHolder(form, token)
      fetchingData(filterParams)
      setIsUploading(false)
      changeLoaderState({ show: false })
    } catch (e: any) {
      showToast(e?.message, 'error')
      setIsUploading(false)
      changeLoaderState({ show: false })

    }
  };

  return {
    items, topFilter,
    onEdit, onSort, onRowsPerPageChange,
    handleUploadConfirm, isUploading, handleConfigConfirm,
    onNext, onBack,
    columns, rowAction, setFilterParams, filterParams, buildState,
    loading, onAction, revoking,

  }


}