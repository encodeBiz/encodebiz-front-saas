import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { emailRule, requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useRouter } from "nextjs-toploader/app";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { MAIN_ROUTE } from "@/config/routes";
import { FormField } from "@/components/common/forms/GenericForm";
import { useLayout } from "@/hooks/useLayout";
import { useParams } from "next/navigation";
import { createStaff, fetchStaff, updateStaff } from "@/services/passinbiz/staff.service";
import { IStaff } from "@/domain/features/passinbiz/IStaff";

export interface StaffFormValues {
  "fullName": string;
  "email": string;
  entityId?: string
  allowedTypes?: Array<string>;
  id?: string
};

export default function useStaffController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { push } = useRouter()
  const { token, user } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()

  const { changeLoaderState } = useLayout()
  const { id } = useParams<{ id: string }>()

  const [fields] = useState<FormField[]>([
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

  ])
  const [initialValues, setInitialValues] = useState<StaffFormValues>({
    fullName: "",
    email: "",

  });

  const validationSchema = Yup.object().shape({
    fullName: requiredRule(t),
    email: emailRule(t),
  });

  const submitForm = async (values: StaffFormValues) => {
    try {
      const dataForm = {
        "fullName": values.fullName,
        "email": values.email,
        "entityId": currentEntity?.entity?.id as string,
        allowedTypes: ['event'],
        id
      }
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      if (!id)
        await createStaff(dataForm, token)
      else
        await updateStaff(dataForm, token)
      showToast(t('core.feedback.success'), 'success');
      changeLoaderState({ show: false })

      push(`/${MAIN_ROUTE}/passinbiz/staff`)
    } catch (error: any) {
      showToast(error.message, 'error')
      changeLoaderState({ show: false })

    }
  };




  const fetchData = async () => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const Staff: IStaff = await fetchStaff(currentEntity?.entity.id as string, id)
      setInitialValues({
        fullName: Staff.fullName ?? "",
        email: Staff.email ?? "",

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

      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity.id, user?.id])


  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, id])


  return { fields, initialValues, validationSchema, submitForm }
}


