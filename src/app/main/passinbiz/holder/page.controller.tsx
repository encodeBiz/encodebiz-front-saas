import { buildSearch, Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Holder } from "@/domain/features/passinbiz/IHolder";
import { importHolder, search, updateHolder } from "@/services/passinbiz/holder.service";
import { RemoveDone, Search, Send } from "@mui/icons-material";
import { useLayout } from "@/hooks/useLayout";
import { Box, Chip, IconButton, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useRouter } from "nextjs-toploader/app";
import { format_date } from "@/lib/common/Date";





export default function useHolderListController() {
  const t = useTranslations();
  const { token, user } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const [rowsPerPage, setRowsPerPage] = useState<number>(2); // Límite inicial
  const [params, setParams] = useState<any>({ filters: [], startAfter: null, limit: rowsPerPage });
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

  const [sort, setSort] = useState<{ field: string, order: 'desc' | 'asc' }>({ field: 'createdAt', order: 'desc' })
  const [filter, setFilter] = useState<any>({ state: 'all', email: '' });

  const rowAction: Array<IRowAction> = [
    { icon: <RemoveDone />, label: t('core.button.revoke'), allowItem: (item: Holder) => (item.passStatus === 'pending' || item.passStatus === 'active'), onPress: (item: Holder) => openModal(CommonModalType.DELETE, { data: item }) },
    { icon: <Send />, label: t('core.button.resend'), allowItem: (item: Holder) => (item.passStatus === 'revoked' || item.passStatus === 'not_generated'), onPress: (item: Holder) => openModal(CommonModalType.SEND, { data: item }) }
  ]

  const holderState = [
    { value: 'all', label: t('core.label.select') },
    { value: 'pending', label: t('holders.pending') },
    { value: 'failed', label: t('holders.failed') }
  ]

  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>

    <Select sx={{ minWidth: 120, height: 55 }}
      value={filter.state}
      defaultValue={'all'}
      onChange={(e: any) => setFilter({ ...filter, state: e.target.value })}  >
      {holderState.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
    <TextField
      variant="outlined"
      placeholder={t('holders.filter.email')}
      value={filter.email}
      onChange={(e) => {

        setFilter({ ...filter, email: e.target.value });
      }}
    />
    <Tooltip title="Filter">
      <IconButton onClick={() => { if (typeof onFilter === 'function') onFilter() }}>
        <Search />
      </IconButton>
    </Tooltip>
  </Box>

  const onSearch = (term: string): void => {
    setParams({ ...params, startAfter: null, filters: buildSearch(term) })
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
    setParams({ ...params, startAfter: last })
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
      id: 'phoneNumber',
      label: t("core.label.phone"),
      minWidth: 170,
    },
    {
      id: 'passStatus',
      label: t("core.label.state"),
      minWidth: 170,
      format: (value, row) => <Chip
        size="small"
        label={row.passStatus}
        variant="outlined"
      />,
    },
    {
      id: 'failedFeedback',
      label: t("core.label.message"),
      minWidth: 170,
    },
    {
      id: 'createdAt',
      sortable: true,
      label: t("core.label.createAt"),
      minWidth: 170,
      format: (value, row) => format_date(row.createdAt, 'DD/MM/yyyy HH:mm:ss')
    },
  ];


  const fetchingData = useCallback(() => {
    setLoading(true)
    if (params.filters.find((e: any) => e === 'state' && e.value === 'all'))
      params.filters = params.filters.filter((e: any) => e.field !== 'state')

    search(currentEntity?.entity.id as string, { ...params, limit: rowsPerPage }).then(async res => {
      if (res.length < rowsPerPage || res.length === 0)
        setAtEnd(true)
      else
        setAtEnd(false)

      if (res.length !== 0) {
        setItems(res)
        if (!params.startAfter)
          setItemsHistory([...res])
        else
          setItemsHistory(prev => [...prev, ...res])
        setLoading(false)
      }

      if (!params.startAfter && res.length === 0) {
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

  }, [params, rowsPerPage, currentEntity?.entity.id, showToast]);

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity?.id, watchServiceAccess])

  useEffect(() => {
    if (params && currentEntity?.entity?.id)
      fetchingData()
  }, [params, currentEntity?.entity?.id, fetchingData])

  useEffect(() => {
    setCurrentPage(0)
    const paramsData = { ...params, startAfter: null, limit: rowsPerPage }
    if (sort.field && sort.order)
      Object.assign(paramsData, {
        orderBy: sort.field,
        orderDirection: sort.order,
      })
    setParams({ ...paramsData })
    setAtStart(true)
  }, [params, rowsPerPage, sort])

  const onFilter = () => {
    const filterData: Array<{ field: string, operator: string, value: any }> = []
    Object.keys(filter).forEach((key) => {
      filterData.push({ field: key, operator: '==', value: filter[key] })
    })
    const paramsData = { ...params, startAfter: null, limit: rowsPerPage, filters: filterData }
    setParams({ ...paramsData })
  }


  const onEdit = async (item: any) => {
    push(`/main/passinbiz/holder/${item.id}/edit`)
  }


  const onRevoke = async (item: any) => {
    try {
      console.log(item);

      setRevoking(true)
      const id = item.id
      await updateHolder({
        ...{} as any,
        passStatus: 'revoked'
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
        passStatus: 'pending'
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
  const [modalOpen, setModalOpen] = useState(false);

  const handleUploadConfirm = async (file: File) => {
    try {
      setIsUploading(true)
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const form = new FormData();
      form.append('uid', user?.id as string);
      form.append('csv', file);
      form.append('entityId', currentEntity?.entity.id as string);
      form.append('passStatus', 'pending');
      await importHolder(form, token)
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
    atEnd, onEdit,
    atStart, handleUploadConfirm, isUploading,
    onSearch, onNext, onBack,
    pagination, currentPage, modalOpen, setModalOpen,
    columns, rowAction, setSort, sort, total,
    loading, rowsPerPage, setRowsPerPage, onRevoke, revoking, onSend
  }


}