/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import DynamicKeyValueInput from "@/components/common/forms/fields/DynamicKeyValueInput";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { addressSchema, requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { PASSSINBIZ_MODULE_ROUTE } from "@/config/routes";
import { createEvent, fetchEvent, updateEvent } from "@/services/passinbiz/event.service";
import DateInput from "@/components/common/forms/fields/Datenput";
import ImageUploadInput from "@/components/common/forms/fields/ImageUploadInput";
import ColorPickerInput from "@/components/common/forms/fields/ColorPickerInput";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { ArrayToObject, objectToArray } from "@/lib/common/String";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import { country } from "@/config/country";
import { formatLocalDateTime } from "@/lib/common/Date";
import AddressInput from "@/components/common/forms/fields/AddressInput";
import { Timestamp } from "firebase/firestore";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useAppLocale } from "@/hooks/useAppLocale";
import AddressComplexInput from "@/components/common/forms/fields/AddressComplexInput";


export default function useFormController(isFromModal: boolean, onSuccess?: () => void) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const { open, closeModal } = useCommonModal()
  const { currentLocale } = useAppLocale()
  const { id } = useParams<{ id: string }>()
  const itemId = isFromModal ? open.args?.id : id
  const { currentEntity, watchServiceAccess } = useEntity()

  const { changeLoaderState } = useLayout()
  const [initialValues, setInitialValues] = useState<Partial<IEvent>>({
    "name": '',
    "description": '',
 
    "language": 'ES',
    "date": null,
    "endDate": null,
  
    "template": 'default',
    "logoUrl": '',
    "imageUrl": '',
    assignedStaff: [],
    "colorPrimary": '',
    "colorAccent": '',
    'status': 'published',
    metadata: []
  });



  const validationSchema = Yup.object().shape({

    name: requiredRule(t),
    //description: requiredRule(t),
    date: requiredRule(t),
    endDate: requiredRule(t),
    address: addressSchema(t),
    imageUrl: requiredRule(t),
    logoUrl: requiredRule(t),
    template: requiredRule(t),
    colorPrimary: requiredRule(t),
    colorAccent: requiredRule(t),
  });

  const handleSubmit = async (values: Partial<IEvent>) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const codeLocale = country.find(e => e.name === values.address?.country)?.code2
      const data: Partial<IEvent> = {
        "uid": user?.id as string,
        address: values.address,
        "createdBy": user?.id as string,
        "name": values.name,
        "description": values.description,

        "entityId": currentEntity?.entity?.id as string,
        "colorPrimary": values.colorPrimary,
        "colorAccent": values.colorAccent,
        "imageUrl": values.imageUrl,
        "logoUrl": values.logoUrl,
        "language": values.language,
        "date": new Date(values.date).toISOString(),
        "dateLabel": formatLocalDateTime(codeLocale ?? 'ES', new Date(values.date)),
        "status": values.status as "draft" | "published" | "archived",
        "endDate": new Date(values.endDate).toISOString(),
        template: values.template as "default" | "vip" | "expo" | "festival",
        "metadata": ArrayToObject(values.metadata),
        "id": itemId,
      }
      if (itemId) await updateEvent(data, token, currentLocale)
      else await createEvent(data, token, currentLocale)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');

      if (typeof onSuccess === 'function') onSuccess()

      if (isFromModal)
        closeModal(CommonModalType.FORM)
      else {
        navivateTo(`/${PASSSINBIZ_MODULE_ROUTE}/event`)
      }
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };


  const fields = [
    {
      isDivider: true,
      label: t('core.label.comercialEvent'),
    },
    {
      name: 'name',
      label: t('core.label.name'),
      type: 'text',
      required: true,
      component: TextInput,
    },
    {
      name: 'description',
      label: t('core.label.description'),
      type: 'textarea',
      required: false,

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
      required: true,
      fullWidth: true,
      component: AddressComplexInput,
    },


    {
      isDivider: true,
      label: t('core.label.brandEvent'),
    },
    {
      name: 'colorPrimary',
      label: t('core.label.colorText'),
      type: 'text',
      required: true,
      component: ColorPickerInput,
    }, {
      name: 'colorAccent',
      label: t('core.label.colorBg'),
      type: 'text',
      required: true,

      component: ColorPickerInput,
    },

    {
      isDivider: true,
      label: t('core.label.resourceEvent'),
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
    },
    {
      isDivider: true,
      label: t('core.label.configEvent'),
    },
    {
      name: 'language',
      label: t('core.label.language'),
      component: SelectInput,
      required: true,
      options: [
        { value: 'ES', label: t('layout.header.spanish') },
        { value: 'EN', label: t('layout.header.english') },

      ],
    },
    {
      name: 'status',
      label: t('core.label.status'),
      type: 'text',
      required: false,

      options: [
        { value: 'draft', label: t('core.label.draft') },
        { value: 'published', label: t('core.label.published') },
        { value: 'archived', label: t('core.label.archived') },
      ],
      component: SelectInput,
    },
    {

      isDivider: true,
      label: t('core.label.setting'),
    },


    {
      name: 'metadata',
      label: t('core.label.setting'),

      required: false,
      fullWidth: true,
      component: DynamicKeyValueInput,
    },

  ];

  const fetchData = async () => {

    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const event: IEvent = await fetchEvent(currentEntity?.entity.id as string, itemId)

      const location = event.location.split('+++')


      setInitialValues({
        ...event,
        date: (event.date instanceof Timestamp) ? event.date.toDate() : new Date(event.date),
        endDate: (event.endDate instanceof Timestamp) ? event.endDate.toDate() : new Date(event.endDate),
        metadata: objectToArray(event.metadata)
      })


    
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }


  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && itemId) {
      fetchData()
    }

    if (currentEntity?.entity.id && user?.id) {
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity.id, user?.id, itemId])


  return { fields, initialValues, validationSchema, handleSubmit }
}