import { useTranslations } from "next-intl";
import { useState } from 'react';
import DynamicKeyValueInput, { DynamicFields } from "@/components/common/forms/fields/DynamicKeyValueInput";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';

import { emailRule, requiredRule } from '@/config/yupRules';

export interface HolderFormValues {
  "fullName": string;
  "email": string;
  "phoneNumber": string;
  "customFields": DynamicFields;
};

export default function useHolderController() {
  const t = useTranslations();
  const [initialValues] = useState<HolderFormValues>({
    fullName: "",
    email: "",
    phoneNumber: "",
    customFields: []
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

  const setDinamicDataAction = async (values: HolderFormValues) => {
    console.log('llegando con los values:::', values);
  };

  const fields = [
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
    },
    {
      name: 'customFields',
      label: t('core.label.billingEmail'),
      type: "text",
      require: true,
      component: DynamicKeyValueInput,
    },
  ];

  return { fields, initialValues, validationSchema, setDinamicDataAction }
}