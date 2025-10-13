import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";
import { createLog } from "@/services/checkinbiz/employee.service";
import { fetchChecklog, updateChecklog } from "@/services/checkinbiz/report.service";
import DateInput from "@/components/common/forms/fields/Datenput";


export default function useChecklogFormController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()

  const [initialValues, setInitialValues] = useState<Partial<IChecklog>>({
    "status": undefined,
    timestamp: null


  });

  const validationSchema = Yup.object().shape({
    timestamp: requiredRule(t),
    status: requiredRule(t),
  });

  const handleSubmit = async (values: Partial<IChecklog>) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: Partial<IChecklog> = {
        ...values,
        "id": id,
        entityId: currentEntity?.entity.id as string
      }
      if (id)
        await updateChecklog(data, token)
      else
        await createLog(data as IChecklog, token)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');

      if (id)
        navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/branch/${id}/detail`)
      else
        navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/branch`)
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };


  const fields = [


    {
      name: 'status',
      label: t('core.label.status'),
      component: SelectInput,
      options: [{ value: 'valid' as string, label: t('core.label.valid') }, { value: 'failed' as string, label: t('core.label.failed') }]
    },

    {
      name: 'timestamp',
      label: t('core.label.timestamp'),
      component: TextInput,
      fullWidth: true,
      options: DateInput
    },

  ];

  const fetchData = useCallback(async () => {

    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const checklog: IChecklog | Partial<IChecklog> = await fetchChecklog(currentEntity?.entity.id as string, id)
      setInitialValues({
        ...checklog
      })
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }, [changeLoaderState, currentEntity?.entity.id, id, showToast, t])

  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, id, fetchData])


  return { fields, initialValues, validationSchema, handleSubmit }
}