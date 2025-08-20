import { buildSearch, Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { deleteEvent, search } from "@/services/passinbiz/event.service";
import { useRouter } from "nextjs-toploader/app";
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from "@/config/routes";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { Person2, Search } from "@mui/icons-material";
import { Box, Chip, IconButton, MenuItem, Select, TextField, Tooltip } from "@mui/material";




export default function useIEventListController() {
  const t = useTranslations();
  const { token } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const { push } = useRouter()
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Límite inicial
  const [params, setParams] = useState<any>({ filters: [{ field: 'status', operator: '==', value: 'published' }] });
  const [loading, setLoading] = useState<boolean>(true);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false)
  const [last, setLast] = useState<any>()
  const [pagination, setPagination] = useState(``);
  const [items, setItems] = useState<IEvent[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const { closeModal } = useCommonModal()
  const [filter, setFilter] = useState<any>({ status: 'published' });

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


  const onFilter = () => {
    const filterData: Array<{ field: string, operator: string, value: any }> = []
    Object.keys(filter).forEach((key) => {
      filterData.push({ field: key, operator: '==', value: filter[key] })

    })
    const paramsData = { ...params, startAfter: null, limit: rowsPerPage, filters: filterData }
    setParams({ ...paramsData })
  }

  const options = [
    { value: 'draft', label: t('core.label.draft') },
    { value: 'published', label: t('core.label.published') },
    { value: 'archived', label: t('core.label.archived') },
  ]


  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>
    <Select sx={{ minWidth: 120, height: 55 }}
      value={filter.status}
      defaultValue={'published'}
      onChange={(e: any) => setFilter({ ...filter, status: e.target.value })}  >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
    <TextField
      variant="outlined"
      placeholder={t('core.label.name')}
      value={filter.name}
      onChange={(e) => {
        setFilter({ ...filter, name: e.target.value });
      }}
    />
    <Tooltip title="Filter">
      <IconButton onClick={() => { if (typeof onFilter === 'function') onFilter() }}>
        <Search />
      </IconButton>
    </Tooltip>
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
      format: (value, row) => <Chip
        size="small"
        label={t(`core.label.${row.status}`)}
        variant="outlined"
      />,
    },
    {
      id: 'location',
      label: t("core.label.location"),
      minWidth: 170,
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

  const fetchingData = useCallback(() => {
    setLoading(true)
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

  }, [params, rowsPerPage, currentEntity?.entity.id, showToast])

  useEffect(() => {
    if (params && currentEntity?.entity?.id)
      fetchingData()
  }, [params, currentEntity?.entity?.id, fetchingData])

  useEffect(() => {
    setCurrentPage(0)
    setParams((prev: any) => ({ ...prev, limit: rowsPerPage }))
    setAtStart(true)
  }, [rowsPerPage])

  const [deleting, setDeleting] = useState(false)
  const onEdit = async (item: any) => {
    push(`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/event/${item.id}/edit`)
  }


  const onDelete = async (item: any) => {
    try {
      setDeleting(true)
      const id = item[0]
      await deleteEvent(currentEntity?.entity.id as string, id, token)
      setItemsHistory(itemsHistory.filter(e => e.id !== id))
      setItems(itemsHistory.filter(e => e.id !== id))
      setDeleting(false)
      closeModal(CommonModalType.DELETE)
    } catch (e: any) {
      showToast(e?.message, 'error')
      setDeleting(false)
    }
  }

  const rowAction: Array<IRowAction> = [
    { icon: <Person2 />, label: t('core.label.staff'), allowItem: () => true, onPress: (item: IEvent) => push(`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/event/${item.id}/staff`) },
  ]

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity?.id, watchServiceAccess])

  return {
    onDelete, items, total, topFilter,
    atEnd, onEdit, onSearch,
    atStart, onBack, onNext,
    pagination, currentPage,
    columns, deleting, rowAction,
    loading, rowsPerPage, setRowsPerPage
  }


}