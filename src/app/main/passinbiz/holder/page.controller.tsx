import { buildSearch, Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTheme } from "@emotion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import page from "./page";
import { useStyles } from "./page.styles";
import { Holder } from "@/domain/features/passinbiz/IHolder";
import { deleteHolder, importHolder, search, updateHolder } from "@/services/passinbiz/holder.service";
import { ArrowBackIosNew, DeleteForever, RemoveDone, Send } from "@mui/icons-material";
import { useLayout } from "@/hooks/useLayout";
import { Chip } from "@mui/material";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useRouter } from "nextjs-toploader/app";




export default function useHolderListController() {
  const t = useTranslations();
  const theme = useTheme();
  const classes = useStyles()
  const { token, user } = useAuth()
  const { currentEntity } = useEntity()
  const { showToast } = useToast()
  const [rowsPerPage, setRowsPerPage] = useState<number>(2); // Límite inicial
  const [params, setParams] = useState<any>({});
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
  const rowAction: Array<IRowAction> = [
    { icon: <RemoveDone />, label: t('core.button.revoke'), allowItem: (item: Holder) => (item.passStatus === 'pending' || item.passStatus === 'active'), onPress: (item: Holder) => openModal(CommonModalType.DELETE, { data:item }) },
    { icon: <Send />, label: t('core.button.resend'), allowItem: (item: Holder) => (item.passStatus === 'revoked' || item.passStatus === 'not_generated'), onPress: (item: Holder) => openModal(CommonModalType.SEND, { data:item }) }
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




  const columns: Column<Holder>[] = [
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

  ];

  const fetchingData = () => {
    setLoading(true)
    search(currentEntity?.entity.id as string, { ...params, limit: rowsPerPage }).then(async res => {
      console.log(res);

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

  const handleUploadConfirm = async (file: File, previewData: string) => {
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
    items,
    atEnd, onEdit,
    atStart, handleUploadConfirm, isUploading,
    onSearch, onNext, onBack,
    pagination, currentPage, modalOpen, setModalOpen,
    columns, rowAction,
    loading, rowsPerPage, setRowsPerPage, onRevoke, revoking, onSend
  }


}