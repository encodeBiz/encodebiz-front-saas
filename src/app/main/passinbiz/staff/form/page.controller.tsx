import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { emailRule, requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useRouter } from "nextjs-toploader/app";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { MAIN_ROUTE } from "@/config/routes";
import { FormField } from "@/components/common/forms/GenericForm";
import { useLayout } from "@/hooks/useLayout";
import { useParams } from "next/navigation";
import { createStaff, fetchStaff, updateStaff } from "@/services/passinbiz/staff.service";
import { IStaff } from "@/domain/features/passinbiz/IStaff";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import SelectMultipleInput from "@/components/common/forms/fields/SelectMultipleInput";
import { search } from "@/services/passinbiz/event.service";


export default function useStaffController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { push } = useRouter()
  const { token, user } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()

  const { changeLoaderState } = useLayout()
  const { id } = useParams<{ id: string }>()

  const [fields, setFields] = useState<FormField[]>([
    {
      name: 'fullName',
      label: t('core.label.fullName'),
      type: 'text',
      required: true,
      component: TextInput,
    },
    {
      name: 'email',
      label: t('core.label.email'),
      type: 'email',
      required: true,
      component: TextInput,
    },


    {
      name: 'allowedTypes',
      label: t('core.label.typeStaff'),
      type: 'text',
      required: true,
      options: [
        { value: 'event', label: t('core.label.event') },
        { value: 'credential', label: t('core.label.credential') }
      ],
      component: SelectMultipleInput,
      onChange: (value: any) => {
        onChangeType(value)
      }
    },


  ])
  const [initialValues, setInitialValues] = useState<Partial<IStaff>>({
    fullName: "",
    email: "",
    role: "validator_credential",
    allowedTypes: []

  });

  const validationSchema = Yup.object().shape({
    fullName: requiredRule(t),
    email: emailRule(t),
    role: requiredRule(t),
  });

  const onChangeType = async (typeValue: Array<'credential' | 'event'>) => {
    console.log(typeValue);
    
    if (typeValue.includes('event')) {
      const eventList = await search(currentEntity?.entity.id as string, { ...{} as any, limit: 100 })
      setFields(prev => [...prev,
      {
        name: 'eventList',
        label: t('core.label.event'),
        type: 'text',
        required: true,
        options: [...eventList.map(e => ({ label: e.name, value: e.id }))],
        component: SelectMultipleInput,
      }
      ])

    } else {
      setFields(prev => [...prev.filter(e => e.name !== 'eventList')])

    }
  }


  const submitForm = async (values: Partial<IStaff>) => {
    try {
      const dataForm = {
        "fullName": values.fullName,
        "email": values.email,
        "entityId": currentEntity?.entity?.id as string,
        allowedTypes: values.allowedTypes,

        id
      }
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      if (!id)
        await createStaff(dataForm, token)
      else
        await updateStaff(dataForm, token)
      showToast(t('core.feedback.success'), 'success');
      changeLoaderState({ show: false })

      push(`/${MAIN_ROUTE}/passinbiz/staff`)
    } catch (error: any) {
      showToast(error.message, 'error')
      changeLoaderState({ show: false })

    }
  };




  const fetchData = useCallback(async () => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const staff: IStaff = await fetchStaff(currentEntity?.entity.id as string, id)
      setInitialValues({
        fullName: staff.fullName ?? "",
        email: staff.email ?? "",
        entityId: currentEntity?.entity.id as string,
        ...staff
      })
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }, [changeLoaderState, currentEntity?.entity.id, id, showToast, t])

  useEffect(() => {
    if (currentEntity?.entity.id && user?.id) {
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity.id, watchServiceAccess, user?.id])


  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, id, fetchData])


  return { fields, initialValues, validationSchema, submitForm }
}


