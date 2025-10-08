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
import { IRowAction } from "@/components/common/table/GenericTable";
import { ListAltOutlined } from "@mui/icons-material";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";


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

  const { navivateTo } = useLayout()
  const onDetail = async (item: any) => {
    navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee/${item.id}/detail?back=${id}`)
  }

  const rowAction: Array<IRowAction> = [

    {
      actionBtn: true,
      color: 'primary',
      icon: <ListAltOutlined color="primary" />,
      label: t('employee.detail'),
      bulk: false,
      allowItem: () => true,
      onPress: (item: ISucursal) => onDetail(item)
    },

  ]

  return { initialValues , rowAction}
}