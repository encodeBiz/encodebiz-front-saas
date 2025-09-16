import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from 'react';
import DynamicKeyValueInput from "@/components/common/forms/fields/DynamicKeyValueInput";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { emailRule, requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import DateInput from "@/components/common/forms/fields/Datenput";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { ArrayToObject, objectToArray } from "@/lib/common/String";
import { createEmployee, fetchEmployee, updateEmployee } from "@/services/checkinbiz/employee.service";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import SelectInput from "@/components/common/forms/fields/SelectInput";


export default function useEmployeeController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const [initialValues, setInitialValues] = useState<Partial<IEmployee>>({
    "fullName": '',
    email: '',
    phone: '',
    role: "internal",
    status: 'active',
    subEntity: '',
  });

  const validationSchema = Yup.object().shape({
    metadata: Yup.array()
      .of(
        Yup.object().shape({
          label: requiredRule(t),
          value: requiredRule(t)
        })
      )
      .nullable(),
    fullName: requiredRule(t),
    phone: requiredRule(t),
    email: emailRule(t),

  });

  const handleSubmit = async (values: Partial<IEmployee>) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data = {
        ...values,
        "uid": user?.id as string,
        "metadata": ArrayToObject(values.metadata as any),
        "id": id,
        entityId: currentEntity?.entity.id
      }
      if (id)
        await updateEmployee(data, token)
      else
        await createEmployee(data, token)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee`)
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };


  const fields = [
    {
      isDivider: true,
      label: t('core.label.personalData'),
    },
    {
      name: 'fullName',
      label: t('core.label.name'),
      type: 'text',
      required: true,
      component: TextInput,
    },

    {
      name: 'email',
      label: t('core.label.email'),
      type: 'text',
      required: true,
      component: TextInput,
    },
    {
      name: 'phone',
      label: t('core.label.phone'),
      type: 'text',
      required: true,
      component: TextInput,
    },
    {
      name: 'role',
      label: t('core.label.role'),
      component: SelectInput,
      required: true,
      options: [
        { value: 'internal', label: t('core.label.internal') },
        { value: 'collaborator', label: t('core.label.collaborator') },

      ],
    },
    {
      name: 'status',
      label: t('core.label.status'),
      type: 'text',
      required: false,

      options: [
        { value: 'active', label: t('core.label.active') },
        { value: 'inactive', label: t('core.label.inactive') },
      ],
      component: SelectInput,
    },
    {
      name: 'subEntity',
      label: t('core.label.subEntity'),
      type: 'text',
      required: false,
      options: [],
      component: SelectInput,
    },
    {
      isDivider: true,
      label: t('core.label.aditionalData'),
    },

    {
      name: 'metadata',
      label: t('core.label.setting'),
      type: 'text',
      required: true,
      component: DynamicKeyValueInput,
    },

  ];

  const fetchData = useCallback(async () => {

    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const event: IEmployee = await fetchEmployee(currentEntity?.entity.id as string, id)
      setInitialValues({
        ...event,
        metadata: objectToArray(event.metadata)
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