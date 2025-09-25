/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { objectToArray } from "@/lib/common/String";
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import { fetchEmployee } from "@/services/checkinbiz/employee.service";
import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";
import { Column } from "@/components/common/table/GenericTable";


export default function useEmployeeDetailController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const [initialValues, setInitialValues] = useState<Partial<IEmployee>>({
    "fullName": '',
    email: '',
    phone: '',
    role: "internal",
    status: 'active',
    branchId: [],
    metadata: []
  });

  const fetchData = async () => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const employee: IEmployee = await fetchEmployee(currentEntity?.entity.id as string, id)
      setInitialValues({
        ...employee,
        metadata: objectToArray(employee.metadata ?? {})
      })
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }


  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, id])


  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IChecklog[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IChecklog[]>([]);
  const [filterParams, setFilterParams] = useState<any>({
    startAfter: null,
    currentPage: 0,
    total: 0,
    params: {
      filters: [],
      startAfter: null,
      limit: 5,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    }
  })

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
      const filterParamsUpdated: any = { ...filterParams, currentPage: filterParams.currentPage + 1 }
      fetchingData(filterParamsUpdated)
    }
  
  
  
    /** Sort Change */
    const onSort = (sort: { orderBy: string, orderDirection: 'desc' | 'asc' }) => {
      const filterParamsUpdated: any = { ...filterParams, currentPage: 0, params: { ...filterParams.params, ...sort, startAfter: null, } }
      setFilterParams(filterParamsUpdated)
      fetchingData(filterParamsUpdated)
    }
  
  
    /** Limit Change */
    const onRowsPerPageChange = (limit: number) => {
      const filterParamsUpdated: any = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, limit } }
      setFilterParams(filterParamsUpdated)
      fetchingData(filterParamsUpdated)
    }
  
  
    const fetchingData = (filterParams: any) => {}
  
  
    const columns: Column<IChecklog>[] = [
      {
        id: 'id',
        label: t("core.label.name"),
        minWidth: 170,
      },
      {
        id: 'id',
        label: t("core.label.email"),
        minWidth: 170,
      },
      {
        id: 'id',
        label: t("core.label.phone"),
        minWidth: 170,
      },
      {
        id: 'id',
        label: t("core.label.role"),
        minWidth: 170,
      },
  
  
    ];

  return { 
      items, onSort, onRowsPerPageChange,
    
    onNext, onBack,  
    columns, 
    loading, filterParams,
    initialValues }
}