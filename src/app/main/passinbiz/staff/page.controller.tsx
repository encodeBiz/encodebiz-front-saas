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
import { createStaff, deleteStaff, search } from "@/services/passinbiz/staff.service";

import { DeleteOutline, Event, ReplyAllOutlined } from "@mui/icons-material";
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from "@/config/routes";
import { Box } from "@mui/material";
import { SelectFilter } from "@/components/common/table/filters/SelectFilter";
import { TextFilter } from "@/components/common/table/filters/TextFilter";
import { useLayout } from "@/hooks/useLayout";


let resource: any = null;


export default function useStaffListController() {
  const t = useTranslations();
  const { token } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Límite inicial
  const [params, setParams] = useState<any>({
    orderBy: 'createdAt',
    orderDirection: "desc"
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false)
  const [last, setLast] = useState<any>()
  const [pagination, setPagination] = useState(``);
  const [items, setItems] = useState<IStaff[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IStaff[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const { closeModal, openModal } = useCommonModal()
  const { push } = useRouter()
  const [filter, setFilter] = useState<any>({ allowedTypes: 'all', email: '' });
  const { changeLoaderState } = useLayout()

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
      icon: <DeleteOutline />,
      label: t('core.button.delete'),
      allowItem: () => true,
      onPress: (item: IStaff) => openModal(CommonModalType.DELETE, { item })
    },
    {
      actionBtn: true,
      color: 'primary',
      icon: <Event />,
      label: t('core.label.event'),
      allowItem: (item: IStaff) => item.allowedTypes.includes('event'),
      onPress: (item: IStaff) => push(`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/staff/${item.id}/events`)
    },
    {
      actionBtn: true,
      color: 'primary',
      icon: <ReplyAllOutlined />,
      label: t('core.label.resend'),
      allowItem: () => true,
      onPress: (item: IStaff) => handleResend(item)
    },
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
    if (params && currentEntity?.entity?.id) {
      fetchingData()
      watchServiceAccess('passinbiz')
    }
  }, [params, currentEntity?.entity?.id, fetchingData, watchServiceAccess])

  useEffect(() => {
    setCurrentPage(0)
    setParams((prev: any) => ({ ...prev, limit: rowsPerPage }))
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

  const onFilter = (filter: any) => {
    setFilter({ ...filter })
    const filterData: Array<{ field: string, operator: string, value: any }> = []
    Object.keys(filter).forEach((key) => {
      if (key === 'allowedTypes' && (filter[key] != 'all' || filter[key] != 'none'))
        filterData.push({ field: key, operator: 'array-contains-any', value: [filter[key]] })
      else
        if (key !== 'allowedTypes' && filter[key] != '')
          filterData.push({ field: key, operator: '==', value: filter[key] })
    })
    const paramsData = { ...params, startAfter: null, limit: rowsPerPage, filters: filterData }
    setParams({ ...paramsData })
  }

  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>
    <SelectFilter
      defaultValue={'all'}
      value={filter.allowedTypes}
      onChange={(value: any) => onFilter({ ...filter, allowedTypes: value })}
      items={holderType}
    />


    <TextFilter
      label={t('core.label.email')}
      value={filter.email}
      onChange={(value) => {
        setFilter({ ...filter, email: value });
        if (resource) clearTimeout(resource);
        resource = setTimeout(() => {
          onFilter({ ...filter, email: value });
        }, 1500);
      }}
    />
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