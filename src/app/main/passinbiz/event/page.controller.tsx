import { buildSearch, Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTheme } from "@emotion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useStyles } from "./page.styles";

import { useLayout } from "@/hooks/useLayout";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { deleteEvent, search } from "@/services/passinbiz/event.service";
import { useRouter } from "nextjs-toploader/app";
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from "@/config/routes";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";




export default function useIEventListController() {
  const t = useTranslations();
  const theme = useTheme();
  const classes = useStyles()
  const { token, user } = useAuth()
  const { currentEntity } = useEntity()
  const { showToast } = useToast()
  const { push } = useRouter()
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Límite inicial
  const [params, setParams] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false)
  const [last, setLast] = useState<any>()
  const [pagination, setPagination] = useState(``);
  const [items, setItems] = useState<IEvent[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const { changeLoaderState } = useLayout()
  const { closeModal } = useCommonModal()
  const rowAction: Array<IRowAction> = []

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




  const columns: Column<IEvent>[] = [
    {
      id: 'name',
      label: t("core.label.name"),
      minWidth: 170,
    },
    {
      id: 'description',
      label: t("core.label.description"),
      minWidth: 170,
    },
    {
      id: 'date',
      label: t("core.label.date"),
      minWidth: 170,
    },
    {
      id: 'location',
      label: t("core.label.location"),
      minWidth: 170,

    },


  ];

  const fetchingData = () => {
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
          setItemsHistory([...itemsHistory, ...res])
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

  }

  useEffect(() => {
    if (params && currentEntity?.entity?.id)
      fetchingData()
  }, [params, currentEntity?.entity?.id])

  useEffect(() => {
    setCurrentPage(0)
    setParams({ limit: rowsPerPage })
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

  return {
    onDelete, items,
    atEnd, onEdit, onSearch,
    atStart, onBack, onNext,
    pagination, currentPage,
    columns, deleting, rowAction,
    loading, rowsPerPage, setRowsPerPage
  }


}