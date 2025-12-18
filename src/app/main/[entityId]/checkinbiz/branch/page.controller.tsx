/* eslint-disable react-hooks/exhaustive-deps */
import { Column, IRowAction } from "@/components/common/table/GenericTable";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";
import { deleteSucursal, search, updateSucursal } from "@/services/checkinbiz/sucursal.service";
import { useLayout } from "@/hooks/useLayout";
import { DeleteOutline, Edit, ListAltOutlined } from "@mui/icons-material";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import { Box } from "@mui/material";
import { useAppLocale } from "@/hooks/useAppLocale";
import { SelectFilter } from "@/components/common/table/filters/SelectFilter";


interface IFilterParams {
  filter: { status: string },
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

export default function useEmployeeListController() {
  const t = useTranslations();
  const { token } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { showToast } = useToast()
  const { currentLocale } = useAppLocale()
  const { entitySuscription } = useEntity()
  const { navivateTo, changeLoaderState } = useLayout()
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<ISucursal[]>([]);
  const [itemsHistory, setItemsHistory] = useState<ISucursal[]>([]);
  const [filterParams, setFilterParams] = useState<IFilterParams>({
    filter: { status: 'active' },
    startAfter: null,
    currentPage: 0,
    total: 0,
    params: {
      filters: [{ field: 'status', operator: '==', value: 'active' }],
      startAfter: null,
      limit: 5,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    }
  })

  const { closeModal, openModal } = useCommonModal()
  const rowAction: Array<IRowAction> = [


    {
      actionBtn: true,
      color: 'primary',
      icon: <Edit color="primary" />,
      label: t('core.button.edit'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: ISucursal) => onEdit(item)
    },

    {
      actionBtn: true,
      color: 'primary',
      icon: <ListAltOutlined color="primary" />,
      label: t('employee.detail'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: ISucursal) => onDetail(item)
    },

    {
      actionBtn: true,
      color: 'error',
      icon: <DeleteOutline color="error" />,
      label: t('core.button.delete'),
      allowItem: () => true,
      showBulk: true,
      onPress: (item: ISucursal) => openModal(CommonModalType.DELETE, { data: item }),
      bulk: true
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


  const options = [
    { label: t('core.label.active'), value: 'active' },
    { label: t('core.label.inactive'), value: 'inactive' },
  ]



  const columns: Column<ISucursal>[] = [
    {
      id: 'name',
      label: t("core.label.name"),
      minWidth: 170,
      onClick: (item: ISucursal) => onDetail(item),
    },

    {
      id: 'address',
      label: t("core.label.address"),
      minWidth: 170,
      format: (value, row) => row.address.street,
      onClick: (item: ISucursal) => onDetail(item),
    },

    {
      id: 'status',
      label: t("core.label.status"),
      minWidth: 170,
      format: (value, row) => <SelectFilter first={false}
        defaultValue={row.status}
        value={row.status}
        onChange={(value: any) => {
          row.status = value
          updateStatus(row)
        }}
        items={options}
      />
    },


  ];

  const updateStatus = async (branch: ISucursal) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: Partial<ISucursal> = {

        "id": branch.id,
        entityId: currentEntity?.entity.id as string,
        status: branch.status
      }
      await updateSucursal(data, token, currentLocale)
      const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
      fetchingData(filterParamsUpdated)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');

    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };

  const fetchingData = (filterParams: IFilterParams) => {

    setLoading(true)
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

    }).catch(e => {
      showToast(e?.message, 'error')
    }).finally(() => {
      setLoading(false)
    })
  }




  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('checkinbiz')
    }
  }, [currentEntity?.entity?.id, watchServiceAccess])

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      fetchingData(filterParams)
    }
  }, [currentEntity?.entity?.id])



  const onEdit = async (item: any) => {
    openModal(CommonModalType.FORM, { ...item })
  }



  const onDetail = async (item: any) => {

    navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/branch/${item.id}/detail`)
  }

  const [deleting, setDeleting] = useState(false)
  const onDelete = async (item: ISucursal | Array<ISucursal>) => {
    try {
      setDeleting(true)
      let ids = []
      if (Array.isArray(item)) {
        ids = (item as Array<ISucursal>).map(e => e.id)
      } else {
        ids.push(item.id)
      }
      await Promise.all(
        ids.map(async (id) => {
          try {
            await deleteSucursal(currentEntity?.entity.id as string, id as string, token, currentLocale)
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


  const topFilter = <Box sx={{ display: 'flex', gap: 2 }}>



    <SelectFilter first={false}
      label={t('core.label.status')} width={200}
      value={filterParams.filter.status}
      onChange={(value: any) => onFilter({ ...filterParams, filter: { ...filterParams.filter, status: value } })}
      items={options}
    />

    <SearchIndexFilter
      type="branch"
      label={t('sucursal.search')}
      onChange={async (value: ISearchIndex) => {
        const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
        if (value?.id) {
          const item = await getRefByPathData(value.index)
          console.log(item);
          
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

  const onSuccess = () => {
    const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } }
    fetchingData(filterParamsUpdated)
  }

  const addBranch = () => {    
    if (items.length > 0 && entitySuscription.find(e => e.serviceId === "checkinbiz" && e.plan === "freemium")) {
      openModal(CommonModalType.INFO, { id: 'maxAddBranch' })
    } else {
      navivateTo(`/checkinbiz/branch/add`)
    }
  }

  return {
    items, onSort, onRowsPerPageChange,
    onEdit, onSuccess,
    onNext, onBack, addBranch,
    columns, rowAction, onDelete, topFilter,
    loading, deleting, filterParams,

  }


}