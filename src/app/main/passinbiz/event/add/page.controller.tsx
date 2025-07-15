import { useTranslations } from "next-intl";
import { useState } from 'react';
import DynamicKeyValueInput, { DynamicFields } from "@/components/common/forms/fields/DynamicKeyValueInput";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';

import { emailRule, requiredRule } from '@/config/yupRules';
import { createHolder } from "@/services/passinbiz/holder.service";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "nextjs-toploader/app";
import { useAppTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { GENERAL_ROUTE, MAIN_ROUTE } from "@/config/routes";
import { createEvent } from "@/services/passinbiz/event.service";
import DateInput from "@/components/common/forms/fields/Datenput";
import ImageUploadInput from "@/components/common/forms/fields/ImageUploadInput";
import ColorPickerInput from "@/components/common/forms/fields/ColorPickerInput";

export interface EventFromValues {
  "name": string
  "description": string
  "date": any
  "location": string
  "template": string
  "logoUrl": string
  "imageUrl": string
  "colorPrimary": string
  "colorAccent": string
};

export default function useHolderController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { push } = useRouter()
  const { token, user } = useAuth()
  const { currentEntity } = useEntity()
  const [initialValues] = useState<EventFromValues>({
    "name": '',
    "description": '',
    "date": new Date(),
    "location": '',
    "template": '',
    "logoUrl": '',
    "imageUrl": '',
    "colorPrimary": '',
    "colorAccent": '',
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

  const setDinamicDataAction = async (values: EventFromValues) => {
    try {
      /*
      const data = await createEvent({
        "uid": user?.id as string,
        "fullName": values.fullName,
        "email": values.email,
        "phoneNumber": values.phoneNumber,
        "entityId": currentEntity?.entity?.id as string,
        "passStatus": "pending",
        "type": "credential",
        "parentId": "",
        "isLinkedToUser": false,
        "metadata": {
          "auxiliaryFields": values.customFields
        },

      }, token)
      */
      showToast(t('core.feedback.success'), 'success');
      push(`/${MAIN_ROUTE}/passinbiz/holder`)
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
      type: 'text',
      required: true,
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
      type: 'text',
      required: true,
      component: ImageUploadInput,
    },
    {
      name: 'imageUrl',
      label: t('core.label.imageUrl'),
      type: 'text',
      required: true,
      component: ImageUploadInput,
    }, {

      isDivider: true,
      label: t('core.label.setting'),
    },
    {
      name: 'sponsor',
      label: t('core.label.sponsor'),
      type: 'text',
      required: true,
      component: TextInput,
    },
    {
      name: 'ticketCapacity',
      label: t('core.label.ticketCapacity'),
      type: 'number',
      required: true,
      component: TextInput,
    },
  ];

  return { fields, initialValues, validationSchema, setDinamicDataAction }
}