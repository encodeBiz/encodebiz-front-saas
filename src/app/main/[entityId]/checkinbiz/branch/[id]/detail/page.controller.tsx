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
import { fetchSucursal } from "@/services/checkinbiz/sucursal.service";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";
import { useCommonModal } from "@/hooks/useCommonModal";


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
  const { openModal } = useCommonModal()






  const fetchData = async () => {

    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const event: ISucursal = await fetchSucursal(currentEntity?.entity.id as string, id)
      setInitialValues({
        ...event,
        metadata: objectToArray(event.metadata ?? {})
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



  
  const rowAction: Array<any> = []



  return { initialValues, rowAction }
}