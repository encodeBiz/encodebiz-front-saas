import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
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
import SelectInput from "@/components/common/forms/fields/SelectInput";
import { search } from "@/services/passinbiz/event.service";
import { FormField } from "@/components/common/forms/GenericForm";
import { IEvent } from "@/domain/features/passinbiz/IEvent";

export interface HolderFormValues {
  "fullName": string;
  "email": string;
  "phoneNumber": string;
  "customFields"?: DynamicFields;
  isLinkedToUser: boolean
  type: "credential" | "event",
  entityId: string
  uid?: string
  parentId?: string
  passStatus?: string
  metadata?: any
};

export default function useHolderController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { push } = useRouter()
  const { token, user } = useAuth()
  const { currentEntity } = useEntity()
  const [type, setType] = useState()
  const [eventList, setEventList] = useState<Array<IEvent>>([])
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
    /*
    {
      name: 'type',
      label: t('core.label.passStatus'),
      type: 'text',
      required: true,
      options: [
        { value: 'pending', label: t('core.label.pending') },
        { value: 'revoke', label: t('core.label.revoke') }
      ],
      component: SelectInput,
      onChange: (value: any) => {
        console.log(value);
        setType(value)
      }
    },
    */
    {
      name: 'customFields',
      label: t('core.label.billingEmail'),
      type: "text",
      require: true,
      component: DynamicKeyValueInput,
    },
  ])
  const [initialValues] = useState<HolderFormValues>({
    fullName: "",
    email: "",
    phoneNumber: "",
    type: 'credential',
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
    try {
      const data = await createHolder({
        "uid": user?.id as string,
        "fullName": values.fullName,
        "email": values.email,
        "phoneNumber": values.phoneNumber,
        "entityId": currentEntity?.entity?.id as string,
        "passStatus": "pending",
        "type": values.type,
        "parentId": "",
        "isLinkedToUser": false,
        "metadata": {
          "auxiliaryFields": values.customFields
        },

      }, token)
      showToast(t('core.feedback.success'), 'success');
      push(`/${MAIN_ROUTE}/passinbiz/holder`)
    } catch (error: any) {
      showToast(error.message, 'error')
    }
  };


  const fetchingEvent = () => {
    const params: any = []
    return search(currentEntity?.entity.id as string, { ...params, limit: 100 }).then(e => setEventList(e as Array<IEvent>))

  }


  useEffect(() => {
    if (type === 'event') {
      setFields([
        ...fields,

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
      setFields([...fields.filter(e => e.name !== 'parentId')])
    }
  }, [type])

  useEffect(() => {
    fetchingEvent()
  }, [])




  //setFields(fieldsList as FormField[])

  return { fields, initialValues, validationSchema, setDinamicDataAction }
}