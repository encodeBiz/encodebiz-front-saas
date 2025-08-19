import { buildSearch, Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useRouter } from "nextjs-toploader/app";
import { IStaff } from "@/domain/features/passinbiz/IStaff";
import { deleteStaff, search } from "@/services/passinbiz/staff.service";
import { search as searchEvent } from "@/services/passinbiz/event.service";

import { Event, Search } from "@mui/icons-material";
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from "@/config/routes";
import { Box, Select, MenuItem, TextField, IconButton, Tooltip } from "@mui/material";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { useSearchParams } from "next/navigation";




export default function useStaffListController() {
  const t = useTranslations();
  const { token } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Límite inicial
  const [params, setParams] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false)
  const [last, setLast] = useState<any>()
  const [pagination, setPagination] = useState(``);
  const [items, setItems] = useState<IStaff[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IStaff[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const { closeModal } = useCommonModal()
  const { push } = useRouter()
  const [filter, setFilter] = useState<any>({ allowedTypes: 'all', email: '' });
  const searchParams = useSearchParams()

  const rowAction: Array<IRowAction> = [
    { icon: <Event />, label: t('core.label.staff'), allowItem: (item: IStaff) => item.allowedTypes.includes('event'), onPress: (item: IStaff) => push(`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/staff/${item.id}/events`) },
  ]
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

  const [eventList, setEventList] = useState<Array<IEvent>>([])
  const inicializeEvent = useCallback(async () => {
    setEventList(await searchEvent(currentEntity?.entity.id as string, { ...{} as any, limit: 100 }))
  }, [currentEntity?.entity.id])

  const fetchingData = useCallback(() => {
    inicializeEvent()
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
  }, [params, rowsPerPage, currentEntity?.entity.id, showToast, inicializeEvent])

  useEffect(() => {
    if (params && currentEntity?.entity?.id) {
      fetchingData()
      watchServiceAccess('passinbiz')
    }
  }, [params, currentEntity?.entity?.id, fetchingData, watchServiceAccess])

  useEffect(() => {
    setCurrentPage(0)
    setParams({ limit: rowsPerPage })
    setAtStart(true)
  }, [rowsPerPage])

  const onEdit = async (item: any) => {
    push(`/main/passinbiz/staff/${item.id}/edit`)
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

  const onFilter = () => {
    const filterData: Array<{ field: string, operator: string, value: any }> = []
    Object.keys(filter).forEach((key) => {

      if (key === 'parentId' && filter[key] != '' && filter.allowedTypes.includes('event')) {
        filterData.push({ field: key, operator: '==', value: [filter[key]] })

      }
      if (key === 'allowedTypes' && filter[key] != 'all')
        filterData.push({ field: key, operator: 'array-contains-any', value: [filter[key]] })
      else
        if (key !== 'allowedTypes' && filter[key] != '')
          filterData.push({ field: key, operator: '==', value: filter[key] })
    })
    const paramsData = { ...params, startAfter: null, limit: rowsPerPage, filters: filterData }
    setParams({ ...paramsData })
  }

  useEffect(() => {
    if (searchParams.get('refresh')) fetchingData()
  }, [fetchingData, searchParams])


  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>
    <Select sx={{ minWidth: 120, height: 55 }}
      value={filter.allowedTypes}
      defaultValue={'all'}
      onChange={(e: any) => setFilter({ ...filter, allowedTypes: e.target.value })}  >
      {holderType.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>


    {filter.allowedTypes.includes('event') && <Select sx={{ minWidth: 120, height: 55 }}
      value={filter.parentId}
      defaultValue={''}
      onChange={(e: any) => setFilter({ ...filter, parentId: e.target.value })}  >
      {eventList.map((option) => (
        <MenuItem key={option.id} value={option.id}>
          {option.name}
        </MenuItem>
      ))}
    </Select>}


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


  return {
    items,
    atEnd, onEdit, total,
    atStart,
    onSearch, onNext, onBack,
    pagination, currentPage,
    columns, rowAction, onDelete, topFilter,
    loading, rowsPerPage, setRowsPerPage, deleting
  }

}