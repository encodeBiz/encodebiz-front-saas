import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import DynamicKeyValueInput, { DynamicFields } from "@/components/common/forms/fields/DynamicKeyValueInput";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { emailRule, requiredRule } from '@/config/yupRules';
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
import { createStaff, fetchStaff, updateStaff } from "@/services/passinbiz/staff.service";
import { IStaff } from "@/domain/features/passinbiz/IStaff";
 
export interface StaffFormValues {
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
  id?: string
};

export default function useStaffController() {
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
  ])
  const [initialValues, setInitialValues] = useState<StaffFormValues>({
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

  const submitForm = async (values: StaffFormValues) => {
    try {
      const dataForm = {
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
        id
      }
      if (!id)
        await createStaff(dataForm, token)
      else
        await updateStaff(dataForm, token)
      showToast(t('core.feedback.success'), 'success');
      push(`/${MAIN_ROUTE}/passinbiz/Staff`)
    } catch (error: any) {
      showToast(error.message, 'error')
    }
  };


  const fetchingEvent = () => {
    const params: any = []
    return search(currentEntity?.entity.id as string, { ...params, limit: 100 }).then(e => setEventList(e as Array<IEvent>))

  }

 const fetchData = async () => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const Staff: IStaff = await fetchStaff(currentEntity?.entity.id as string, id)
      setInitialValues({
        fullName: Staff.fullName ?? "",
        email: Staff.email ?? "",
        phoneNumber: Staff.phoneNumber ?? "",
        type: Staff.type,
        customFields: Staff.metadata?.auxiliaryFields ?? [],
        isLinkedToUser: Staff.isLinkedToUser,
        entityId: currentEntity?.entity.id as string
      })
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }

  useEffect(() => {
    if (currentEntity?.entity.id && user?.id) {
      fetchingEvent()
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity.id, user?.id])


  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, id])


  return { fields, initialValues, validationSchema, submitForm }
}

 
