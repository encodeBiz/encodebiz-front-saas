import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from 'react';
import DynamicKeyValueInput, { DynamicFields } from "@/components/common/forms/fields/DynamicKeyValueInput";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { emailRule, requiredRule } from '@/config/yupRules';
import { createHolder, fetchHolder, updateHolder } from "@/services/passinbiz/holder.service";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "nextjs-toploader/app";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { MAIN_ROUTE } from "@/config/routes";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import { search } from "@/services/passinbiz/event.service";
import { FormField } from "@/components/common/forms/GenericForm";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { useLayout } from "@/hooks/useLayout";
import { useParams } from "next/navigation";
import { Holder } from "@/domain/features/passinbiz/IHolder";
import ImageUploadInput from "@/components/common/forms/fields/ImageUploadInput";

 
export default function useHolderController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { push } = useRouter()
  const { token, user } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const [type, setType] = useState()
  const [eventList, setEventList] = useState<Array<IEvent>>([])
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
      name: 'phoneNumber',
      label: t('core.label.phone'),
      type: 'text',
      required: true,
      component: TextInput,
    }, {
      name: 'type',
      label: t('core.label.typePass'),
      type: 'text',
      required: true,
      options: [
        { value: 'credential', label: t('core.label.credencial') },
        { value: 'event', label: t('core.label.event') }
      ],
      component: SelectInput,
      onChange: (value: any) => {
        setType(value)
      }
    },

    {
      name: 'customFields',
      label: t('core.label.billingEmail'),
      type: "text",
      require: true,
      fullWidth: true,
      component: DynamicKeyValueInput,
    },

    {
      name: 'thumbnail',
      label: t('core.label.thumbnail'),
      type: 'thumbnail',
      required: true,
      component: ImageUploadInput,
    },
  ])


  const [initialValues, setInitialValues] = useState<Partial<Holder>>({
    fullName: "",
    email: "",
    phoneNumber: "",
    type: 'credential',
    thumbnail: '',
    customFields: [],
    isLinkedToUser: true,
    entityId: currentEntity?.entity.id as string
  });

  const validationSchema = Yup.object().shape({
    customFields: Yup.array()
      .of(
        Yup.object().shape({
          label: requiredRule(t),
          value: requiredRule(t)
        })
      )
      .nullable(),
    fullName: requiredRule(t),
    email: emailRule(t),
    phoneNumber: Yup.string().optional(),
  });

  const submitForm = async (values: Partial<Holder>) => {
    try {
      const dataForm: Partial<Holder> = {
        "uid": user?.id as string,
        "fullName": values.fullName,
        "email": values.email,
        "phoneNumber": values.phoneNumber,
        "entityId": currentEntity?.entity?.id as string,
        "passStatus": "pending",
        "type": values.type,
        "thumbnail": values.thumbnail,
        "parentId": values.parentId ?? "",
        "isLinkedToUser": false,
        "metadata": {
          "auxiliaryFields": values.customFields
        },
        id
      }
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      if (!id)
        await createHolder(dataForm, token)
      else
        await updateHolder(dataForm, token)
      showToast(t('core.feedback.success'), 'success');
      push(`/${MAIN_ROUTE}/passinbiz/holder`)
      changeLoaderState({ show: false })
    } catch (error: any) {
      showToast(error.message, 'error')
      changeLoaderState({ show: false })
    }
  };


  const fetchingEvent = useCallback(() => {
    const params: any = []
    return search(currentEntity?.entity.id as string, { ...params, limit: 100 }).then(e => setEventList(e as Array<IEvent>))

  }, [currentEntity?.entity.id])


  useEffect(() => {
    if (type === 'event') {
      setFields(prev => [
        ...prev.filter(e => e.name !== 'thumbnail'),
        {
          name: 'parentId',
          label: t('core.label.event'),
          type: 'text',
          required: true,
          options: [...eventList.map((e) => ({ value: e.id, label: e.name }))],
          component: SelectInput,
        },
      ])
    } else {
      setFields(prev => [
        ...prev.filter(e => e.name !== 'parentId'),
        {
          name: 'thumbnail',
          label: t('core.label.thumbnail'),
          type: 'thumbnail',
          required: true,
          component: ImageUploadInput,
        }

      ])
    }
  }, [eventList, t, type])


  const fetchData = useCallback(async () => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const holder: Holder = await fetchHolder(currentEntity?.entity.id as string, id)
      setInitialValues({
        fullName: holder.fullName ?? "",
        email: holder.email ?? "",
        phoneNumber: holder.phoneNumber ?? "",
        type: holder.type,
        customFields: holder.metadata?.auxiliaryFields ?? [],
        isLinkedToUser: holder.isLinkedToUser,
        thumbnail: holder.thumbnail,
        entityId: currentEntity?.entity.id as string
      })
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }, [changeLoaderState, currentEntity?.entity.id, id, showToast, t])

  useEffect(() => {
    if (currentEntity?.entity.id && user?.id) {
      fetchingEvent()
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity.id, fetchingEvent, user?.id, watchServiceAccess])


  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, id, fetchData])

  return { fields, initialValues, validationSchema, submitForm }
}


