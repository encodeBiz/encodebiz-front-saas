/* eslint-disable react-hooks/exhaustive-deps */
import { buildSearch, Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Holder } from "@/domain/features/passinbiz/IHolder";
import { importHolder, search, updateHolder } from "@/services/passinbiz/holder.service";
import { NotInterested, PanoramaFishEyeOutlined, ReplyAllOutlined } from "@mui/icons-material";
import { useLayout } from "@/hooks/useLayout";
import { Box } from "@mui/material";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useRouter } from "nextjs-toploader/app";
import { format_date } from "@/lib/common/Date";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { search as searchEvent } from "@/services/passinbiz/event.service";
import { CustomChip } from "@/components/common/table/CustomChip";
import { SelectFilter } from "@/components/common/table/filters/SelectFilter";
import { TextFilter } from "@/components/common/table/filters/TextFilter";
import { decodeFromBase64, encodeToBase64 } from "@/lib/common/base64";
import { useSearchParams } from "next/navigation";
import { useTableStatus } from "@/hooks/useTableStatus";




let resource: any = null;
export default function useHolderListController() {
  const t = useTranslations();
  const { token, user } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Límite inicial

  const [loading, setLoading] = useState<boolean>(true);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false)
  const [last, setLast] = useState<any>()
  const [pagination, setPagination] = useState(``);
  const [items, setItems] = useState<Holder[]>([]);
  const [itemsHistory, setItemsHistory] = useState<Holder[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const { changeLoaderState } = useLayout()
  const { openModal, closeModal } = useCommonModal()
  const [revoking, setRevoking] = useState(false)
  const { push } = useRouter()

  const { tableStatus, updateFromStatus } = useTableStatus()

  const [filterParams, setFilterParams] = useState<any>({
    filter: { passStatus: 'active', type: 'none', email: '', parentId: 'none' },
    sort: { field: 'createdAt', order: 'desc' },
    params: { filters: [{ field: 'passStatus', operator: '==', value: 'active' }], startAfter: null, limit: rowsPerPage }
  })

  const searchParams = useSearchParams()
  const rowAction: Array<IRowAction> = [
    {
      actionBtn: true,
      color: 'error',
      icon: <NotInterested />,
      label: t('core.button.revoke'),
      allowItem: (item: Holder) => (item.passStatus === 'pending' || item.passStatus === 'active'),
      onPress: (item: Holder) => openModal(CommonModalType.DELETE, { data: item })
    },

    {
      actionBtn: true,
      color: 'success',
      icon: <ReplyAllOutlined />,
      label: t('core.button.resend'),
      allowItem: (item: Holder) => (item.passStatus === 'failed'),
      onPress: (item: Holder) => openModal(CommonModalType.SEND, { data: item })
    },

    {
      actionBtn: true,
      color: 'success',
      icon: <PanoramaFishEyeOutlined />,
      label: t('core.button.reactive'),
      allowItem: (item: Holder) => (item.passStatus === 'revoked'),
      onPress: (item: Holder) => openModal(CommonModalType.REACTIVE, { data: item })
    },

  ]

  const holderState = [
    { value: 'failed', label: t('holders.failed') },
    { value: 'active', label: t('holders.active') },
    { value: 'revoked', label: t('holders.revoked') }
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

    <SelectFilter
      defaultValue={'active'}
      value={filterParams.filter.passStatus}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, passStatus: value } })}
      items={holderState}
    />

    <TextFilter
      label={t('holders.filter.email')}
      value={filterParams.filter.email}
      onChange={(value) => {
        setFilterParams({ ...filterParams, filter: { ...filterParams.filter, email: value } });
        if (resource) clearTimeout(resource);
        resource = setTimeout(() => {
          onFilter({ ...filterParams, filter: { ...filterParams.filter, email: value } })
        }, 1500);
      }}
    />



  </Box >

  const onSearch = (term: string): void => {
    setFilterParams({ ...filterParams, params: { ...filterParams.params, startAfter: null, filters: buildSearch(term) } })
  }

  const onBack = (): void => {
    const backSize = items.length
    itemsHistory.splice(-backSize)
    setItemsHistory([...itemsHistory])
    setItems([...itemsHistory.slice(-rowsPerPage)])
    setAtEnd(false)
    setCurrentPage(currentPage - 1)
    setLast((itemsHistory[itemsHistory.length - 1] as any).last)
  }


  const onNext = async (): Promise<void> => {
    setLoading(true)
    setFilterParams({ ...filterParams, params: { ...filterParams.params, startAfter: last } })
    setCurrentPage(currentPage + 1)
  }

  useEffect(() => {
    setAtStart(itemsHistory.length <= rowsPerPage)
  }, [itemsHistory.length, rowsPerPage])




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
      format: (value, row) => <><CustomChip
        id={row.id}
        background={row.passStatus}
        text={row.passStatus === 'failed' ? row.failedFeedback : ''}
        size="small"
        label={t("core.label." + row.passStatus)}

      /> {row.passStatus === 'failed' ? row.failedFeedback : ''}</>,
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

    {
      id: 'createdAt',
      sortable: true,
      label: t("core.label.date"),
      minWidth: 170,
      format: (value, row) => format_date(row.createdAt, 'DD/MM/yyyy')
    },
  ];


  const fetchingData = useCallback(() => {

    setLoading(true)

    if (filterParams.params.filters.find((e: any) => e.field === 'passStatus' && e.value === 'none'))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== 'passStatus')
    if (filterParams.params.filters.find((e: any) => e.field === 'type' && (e.value === 'none' || e.value === 'credencial'))) {
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "parentId")
    }
    if (filterParams.params.filters.find((e: any) => e.field === 'type' && e.value === 'none'))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== 'type')
    if (filterParams.params.filters.find((e: any) => e.field === 'email' && e.value === ''))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== 'email')
    if (filterParams.params.filters.find((e: any) => e.field === 'parentId' && (e.value === '' || e.value === 'none')))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== 'parentId')


    inicializeEvent()


    search(currentEntity?.entity.id as string, { ...filterParams.params, limit: rowsPerPage }).then(async res => {
      if (res.length < rowsPerPage || res.length === 0)
        setAtEnd(true)
      else
        setAtEnd(false)

      if (res.length !== 0) {
        setItems(res)
        if (!filterParams.params.startAfter)
          setItemsHistory([...res])
        else
          setItemsHistory(prev => [...prev, ...res])
        setLoading(false)
      }

      if (!filterParams.startAfter && res.length === 0) {
        setItems([])
        setItemsHistory([])
      }

      setLast(res.length > 0 ? (res[0] as any).last : null)
      setPagination(`Total ${res.length > 0 ? (res[0] as any).totalItems : 0}`)
      setTotal(res.length > 0 ? (res[0] as any).totalItems : 0)

    }).catch(e => {
      showToast(e?.message, 'error')
    }).finally(() => {
      setLoading(false)
    })

  }, [filterParams.params, rowsPerPage, currentEntity?.entity.id]);

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity?.id, watchServiceAccess])

  useEffect(() => {
    if (currentEntity?.entity?.id)
      fetchingData()
  }, [filterParams.params, currentEntity?.entity?.id, searchParams.get('params')])

  useEffect(() => {
    setCurrentPage(0)
    const paramsData = { startAfter: null, limit: rowsPerPage }
    if (filterParams.sort.field && filterParams.sort.order)
      Object.assign(paramsData, {
        orderBy: filterParams.sort.field,
        orderDirection: filterParams.sort.order,
      })

    setFilterParams((prev: any) => ({ ...prev, params: { ...prev.params, ...paramsData } }))
    setAtStart(true)
  }, [rowsPerPage, filterParams.sort])

  const onFilter = (filterParamsData: any) => {
    const filterData: Array<{ field: string, operator: string, value: any }> = []
    const filter = filterParamsData.filter
    Object.keys(filter).forEach((key) => {
      if (key === 'parentId' && filter[key] != '' && filter.type == 'event') {
        filterData.push({ field: key, operator: '==', value: filter[key] })
      } else {
        filterData.push({ field: key, operator: '==', value: filter[key] })
      }
    })
    const paramsData = { ...filterParams.params, startAfter: null, limit: rowsPerPage, filters: filterData }
    setFilterParams({ ...filterParams, filter, params: paramsData })
  }


  const onEdit = async (item: any) => {
    push(`/main/passinbiz/holder/${item.id}/edit?params=${buildState()}`)
  }


  const onRevoke = async (item: any) => {
    try {
      setRevoking(true)
      const id = item.id
      await updateHolder({
        ...{} as any,
        id: item.id,
        entityId: currentEntity?.entity?.id,
        passStatus: 'revoked',

      }, token)
      setItemsHistory(itemsHistory.filter(e => e.id !== id))
      setItems(itemsHistory.filter(e => e.id !== id))
      setRevoking(false)
      closeModal(CommonModalType.DELETE)
    } catch (e: any) {
      showToast(e?.message, 'error')
      setRevoking(false)
    }
  }

  const onSend = async (item: any) => {
    try {
      setRevoking(true)
      const id = item.id
      await updateHolder({
        ...{} as any,
        id: item.id,
        entityId: currentEntity?.entity?.id,
        passStatus: 'active',
        status: 'pending'
      }, token)
      setItemsHistory(itemsHistory.filter(e => e.id !== id))
      setItems(itemsHistory.filter(e => e.id !== id))
      setRevoking(false)
      closeModal(CommonModalType.SEND)
    } catch (e: any) {
      showToast(e?.message, 'error')
      setRevoking(false)
    }
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
      fetchingData()
      setIsUploading(false)
      changeLoaderState({ show: false })
    } catch (e: any) {
      showToast(e?.message, 'error')
      setIsUploading(false)
      changeLoaderState({ show: false })

    }
  };



  useEffect(() => {
    if (searchParams.get('params')) {
      const data = decodeFromBase64(searchParams.get('params') as string)
      loadState(data.id)

    }
  }, [searchParams.get('params')])



  const loadState = (id: string) => {
    console.log(tableStatus);
    
    if (tableStatus?.id === id) {
      const params = tableStatus?.status
      setAtStart(params.atStart ?? true);
      setAtEnd(params.atEnd ?? false)
      setLast(params.last ?? null)
      setPagination(params.pagination ?? ``);
      setItems(params.items ?? []);
      setItemsHistory(params.itemsHistory ?? []);
      setCurrentPage(params.currentPage ?? 0);
      setTotal(params.total ?? 0);
      setFilterParams(params.filterParams)
    }
  }

  const buildState = () => {
    const dataStatus = {
      filterParams: filterParams,
      items,
      last,
      itemsHistory,
      atStart,
      atEnd,
      currentPage,
      pagination,
      total
    }
    const id = `${new Date().getTime()}`
    updateFromStatus({
      status: dataStatus,
      id
    })
    return encodeToBase64({ id })
  }


  return {
    items, topFilter,
    atEnd, onEdit,
    atStart, handleUploadConfirm, isUploading, handleConfigConfirm,
    onSearch, onNext, onBack,
    pagination, currentPage,
    columns, rowAction, setFilterParams, filterParams, total, buildState,
    loading, rowsPerPage, setRowsPerPage, onRevoke, revoking, onSend
  }


}