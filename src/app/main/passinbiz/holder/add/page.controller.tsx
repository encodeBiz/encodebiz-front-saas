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

export interface HolderFormValues {
  "fullName": string;
  "email": string;
  "phoneNumber": string;
  "customFields": DynamicFields;
  isLinkedToUser: boolean
  entityId: string
};

export default function useHolderController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { push } = useRouter()
  const { token } = useAuth()
  const { currentEntity } = useEntity()
  const [initialValues] = useState<HolderFormValues>({
    fullName: "",
    email: "",
    phoneNumber: "",
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

  const setDinamicDataAction = async (values: HolderFormValues) => {
    console.log('llegando con los values:::', values);
    try {
      const data = await createHolder({
        ...values,
        isLinkedToUser: true,
        entityId: currentEntity?.entity.id as string
      }, token)
      showToast(t('core.feedback.success'), 'success');
      push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/dashboard`)
    } catch (error: any) {
      showToast(error.message, 'error')
    }
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