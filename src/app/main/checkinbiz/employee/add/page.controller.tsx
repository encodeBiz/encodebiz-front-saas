import { useTranslations } from "next-intl";
import { useState } from 'react';
import DynamicKeyValueInput from "@/components/common/forms/fields/DynamicKeyValueInput";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';

import { requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useRouter } from "nextjs-toploader/app";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { MAIN_ROUTE } from "@/config/routes";
import DateInput from "@/components/common/forms/fields/Datenput";
import ImageUploadInput from "@/components/common/forms/fields/ImageUploadInput";
import ColorPickerInput from "@/components/common/forms/fields/ColorPickerInput";
import { ArrayToObject } from "@/lib/common/String";
import { createEmployee } from "@/services/checkinbiz/employee.service";

export interface EmployeeFromValues {
  uid?: string
  id?: string
  createdBy?: string
  entityId?: string
  "name": string
  "description": string
  address?: string
  "date": any
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
  const { currentEntity } = useEntity()
  const [initialValues] = useState<EmployeeFromValues>({
    "name": '',
    "description": '',
    "date": new Date(),
    "location": '',
    "template": '',
    "logoUrl": '',
    "imageUrl": '',
    "colorPrimary": '',
    "colorAccent": '',
    metadata: []
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
    name: requiredRule(t),
    description: requiredRule(t),
    date: requiredRule(t),
    location: requiredRule(t),
    logoUrl: requiredRule(t),
    imageUrl: requiredRule(t),
    colorPrimary: requiredRule(t),
    colorAccent: requiredRule(t),
  });

  const setDinamicDataAction = async (values: EmployeeFromValues) => {
    try {

      const data = await createEmployee({
        "uid": user?.id as string,
        "createdBy": user?.id as string,
        "name": values.name,
        "description": values.description,
        "location": values.location,
        "address": values.location,

        "entityId": currentEntity?.entity?.id as string,
        "colorPrimary": values.colorPrimary,
        "colorAccent": values.colorAccent,
        "imageUrl": values.imageUrl,
        "logoUrl": values.logoUrl,
        "date": values.date,
        template: 'vip',
        "metadata": ArrayToObject(values.metadata)
      }, token)

      showToast(t('core.feedback.success'), 'success');
      push(`/${MAIN_ROUTE}/passinbiz/Employee`)
    } catch (error: any) {
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
      name: 'date',
      label: t('core.label.date'),
      type: 'text',
      required: true,
      component: DateInput,
    },
    {
      name: 'location',
      label: t('core.label.location'),

      required: true,
      type: 'textarea',
      component: TextInput,
    },
    {
      name: 'description',
      label: t('core.label.description'),
      type: 'textarea',
      required: true,
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
      component: ImageUploadInput,
      type: 'custom'
    },
    {
      name: 'imageUrl',
      label: t('core.label.imageUrl'),       
      required: true,
      type: 'custom',
      component: ImageUploadInput,
    }, {

      isDivider: true,
      label: t('core.label.setting'),
    },
    {
      name: 'metadata',
      label: t('core.label.setting'),
      type: 'text',
      required: true,
      component: DynamicKeyValueInput,
    },

  ];

  return { fields, initialValues, validationSchema, setDinamicDataAction }
}