import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import DynamicKeyValueInput from "@/components/common/forms/fields/DynamicKeyValueInput";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useRouter } from "nextjs-toploader/app";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { MAIN_ROUTE } from "@/config/routes";
import { createEvent, fetchEvent, updateEvent } from "@/services/passinbiz/event.service";
import DateInput from "@/components/common/forms/fields/Datenput";
import ImageUploadInput from "@/components/common/forms/fields/ImageUploadInput";
import ColorPickerInput from "@/components/common/forms/fields/ColorPickerInput";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { ArrayToObject, objectToArray } from "@/lib/common/String";
import SelectInput from "@/components/common/forms/fields/SelectInput";

export interface EventFromValues {
  id?: string
  uid?: string
  createdBy?: string
  entityId?: string
  "name": string
  "description": string
  address?: string
  "date": any
  endDate: any
  "location": string
  "template": string
  "logoUrl": string
  "imageUrl": string
  "colorPrimary": string
  "colorAccent": string
  metadata: any
};

export default function useHolderController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { push } = useRouter()
  const { token, user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { changeLoaderState } = useLayout()
  const [initialValues, setInitialValues] = useState<EventFromValues>({
    "name": '',
    "description": '',
    "date": new Date(),
    "endDate": new Date(),
    "location": '',
    "template": 'default',
    "logoUrl": '',
    "imageUrl": '',
    "colorPrimary": '',
    "colorAccent": '',
    metadata: []
  });

  const validationSchema = Yup.object().shape({

    name: requiredRule(t),
    //description: requiredRule(t),
    date: requiredRule(t),
    endDate: requiredRule(t),
    location: requiredRule(t),
    //logoUrl: requiredRule(t),
    //imageUrl: requiredRule(t),
    //colorPrimary: requiredRule(t),
    //colorAccent: requiredRule(t),
  });

  const setDinamicDataAction = async (values: EventFromValues) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data = {
        "uid": user?.id as string,
        "createdBy": user?.id as string,
        "name": values.name,
        "description": values.description,
        "location": values.location,
        "address": values.address,
        "entityId": currentEntity?.entity?.id as string,
        "colorPrimary": values.colorPrimary,
        "colorAccent": values.colorAccent,
        "imageUrl": values.imageUrl,
        "logoUrl": values.logoUrl,
        "date": values.date,
        "endDate": values.endDate,
        template: values.template,
        "metadata": ArrayToObject(values.metadata),
        "id": id,
      }
      if (id) await updateEvent(data, token)
      else await createEvent(data, token)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      push(`/${MAIN_ROUTE}/passinbiz/event`)
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };


  const fields = [
    {
      name: 'name',
      label: t('core.label.name'),
      type: 'text',
      required: true,
      component: TextInput,
    },
    {
      name: 'location',
      label: t('core.label.location'),
      required: true,
      type: 'textarea',
      component: TextInput,
    },

    {
      name: 'date',
      label: t('core.label.startDate'),
      type: 'text',
      required: true,
      component: DateInput,
    },
    {
      name: 'endDate',
      label: t('core.label.endDate'),
      type: 'text',
      required: true,
      component: DateInput,
    },
    {
      name: 'address',
      label: t('core.label.address'),
      type: 'textarea',
      required: true,
      fullWidth: true,
      component: TextInput,
    },
    {
      name: 'description',
      label: t('core.label.description'),
      type: 'textarea',
      required: true,
      fullWidth: true,
      component: TextInput,
    },

    {

      isDivider: true,
      label: t('core.label.designed'),
    },
    {
      name: 'colorPrimary',
      label: t('core.label.colorPrimary'),
      type: 'text',
      required: true,
      component: ColorPickerInput,
    }, {
      name: 'colorAccent',
      label: t('core.label.colorAccent'),
      type: 'text',
      required: true,

      component: ColorPickerInput,
    },
    {
      name: 'logoUrl',
      label: t('core.label.logo'),
      required: true,
      type: 'logo',
      component: ImageUploadInput,
    },
    {
      name: 'imageUrl',
      label: t('core.label.imageUrl'),
      required: true,
      type: 'stripImage',
      component: ImageUploadInput,
    }, {
      name: 'template',
      label: t('core.label.template'),
      type: 'text',
      required: true,
      options: [
        { value: 'default', label: t('core.label.default') },
        { value: 'vip', label: t('core.label.vip') },
        { value: 'expo', label: t('core.label.expo') },
        { value: 'festival', label: t('core.label.festival') }
      ],
      component: SelectInput,

    }, {

      isDivider: true,
      label: t('core.label.setting'),
    },
    {
      name: 'metadata',
      label: t('core.label.setting'),
      type: 'text',
      required: true,
      fullWidth: true,
      component: DynamicKeyValueInput,
    },

  ];

  const fetchData = async () => {

    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const event: IEvent = await fetchEvent(currentEntity?.entity.id as string, id)

      setInitialValues({
        ...event,
        metadata: objectToArray(event.metadata)
      })
     changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }

  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id) {
      fetchData()
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity.id, user?.id, id])


  return { fields, initialValues, validationSchema, setDinamicDataAction }
}