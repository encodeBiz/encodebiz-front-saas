import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from 'react';
import DynamicKeyValueInput from "@/components/common/forms/fields/DynamicKeyValueInput";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { emailRule, requiredRule } from '@/config/yupRules';
import { createHolder, fetchHolder, updateHolder } from "@/services/passinbiz/holder.service";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import { search } from "@/services/passinbiz/event.service";
import { useLayout } from "@/hooks/useLayout";
import { useParams, useSearchParams } from "next/navigation";
import { Holder } from "@/domain/features/passinbiz/IHolder";
import ImageUploadInput from "@/components/common/forms/fields/ImageUploadInput";


export default function useHolderController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { changeLoaderState } = useLayout()
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()

  const fieldList = [
    {
      name: 'fullName',
      label: t('core.label.fullName'),
      type: 'text',
      required: true,
      fullWidth: true,
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
      fullWidth: true,
      options: [
        { value: 'credential', label: t('core.label.credencial') },
        { value: 'event', label: t('core.label.event') }
      ],
      component: SelectInput,
      extraProps: {
        onHandleChange: (value: any) => {
          onChangeType(value)
        },
      }
    },


    {
      isDivider: true,
      label: t('core.label.customFields'),
    },

    {
      name: 'customFields',
      label: t('core.label.billingEmail'),
      type: "text",
      require: true,
      fullWidth: true,
      component: DynamicKeyValueInput,
    },

  ]
  const [loadForm, setLoadForm] = useState(false)
  const [fields, setFields] = useState<any[]>([...fieldList])

  const inicializeField = async () => {
    setFields(fieldList)
    setLoadForm(true)
  }



  if (currentEntity?.entity.id && !loadForm) inicializeField()



  const [initialValues, setInitialValues] = useState<Partial<Holder>>({
    fullName: "",
    email: "",
    phoneNumber: "",
    type: '',
    thumbnail: '',
    customFields: [],
    isLinkedToUser: true,
    entityId: currentEntity?.entity.id as string
  });

  const validationSchema: any = Yup.object().shape({
    customFields: Yup.array()
      .of(
        Yup.object().shape({
          label: requiredRule(t),
          value: requiredRule(t)
        })
      )
      .nullable(),
    fullName: requiredRule(t),

    type: requiredRule(t),
    email: emailRule(t),
    phoneNumber: Yup.string().optional(),
  });

  const submitForm = async (values: Partial<Holder>) => {
    try {
      const dataForm: Partial<Holder> = {

        "fullName": values.fullName,
        "email": values.email,
        "phoneNumber": values.phoneNumber,
        "entityId": currentEntity?.entity?.id as string,
        "passStatus": "active",
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
      navivateTo(`/passinbiz/holder}`)
      changeLoaderState({ show: false })
    } catch (error: any) {
      showToast(error.message, 'error')
      changeLoaderState({ show: false })
    }
  };

  const onChangeType = async (typeValue: any) => {
    if (typeValue === 'event') {
      const eventList = await search(currentEntity?.entity.id as string, {
        ...{
          filters: [
            {
              field: 'status',
              value: 'published',
              operator: '=='
            }
          ]
        } as any, limit: 100
      })
      const fieldList = fields.filter(e => e.name !== 'thumbnail')
      fieldList.splice(4, 0, {
        name: 'parentId',
        label: t('core.label.event'),
        type: 'text',
        required: true,
        fullWidth: true,
        options: [...eventList.map((e) => ({ value: e.id, label: e.name }))],
        component: SelectInput,
      })
      setFields(fieldList.filter(e => e.name !== 'thumbnail'))

    }

    if (typeValue === 'credential') {
      const fieldList = fields.filter(e => e.name !== 'parentId')
      fieldList.splice(4, 0, {
        name: 'thumbnail',
        label: t('core.label.thumbnail'),
        type: 'thumbnail',
        required: true,
        fullWidth: true,
        component: ImageUploadInput,
      })
      setFields(fieldList.filter(e => e.name !== 'parentId'))
    }
  }


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
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity.id, user?.id, watchServiceAccess])


  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id)
      fetchData()


  }, [currentEntity?.entity.id, user?.id, id, fetchData])


  return { fields, initialValues, validationSchema, submitForm }
}


