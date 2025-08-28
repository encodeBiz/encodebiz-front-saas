import { useTranslations } from "next-intl";
import { useEffect } from 'react';
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useRouter } from "nextjs-toploader/app";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { MAIN_ROUTE } from "@/config/routes";
import { createContact } from "@/services/passinbiz/event.service";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { IContact } from "@/domain/core/IContact";


export default function useFormContactController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { push } = useRouter()
  const { token, user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { changeLoaderState } = useLayout()
 
  const validationSchema = Yup.object().shape({
    message: requiredRule(t),
  });

  const setDinamicDataAction = async (values: Partial<IContact>) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: Partial<IContact> = {
        "subject": user?.id as string,
        "message": values.message,
        "from": values.from,
      }
      await createContact(data, token)
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
      name: 'subject',
      label: t('core.label.subject'),
      type: 'text',
      required: true,
      disabled: true,
      component: TextInput,
    },
    {
      name: 'from',
      label: t('core.label.email'),
      type: 'text',
      disabled: true,
      required: true,
      component: TextInput,
    },
    {
      name: 'phone',
      label: t('core.label.phone'),
      type: 'text',
      disabled: true,
      required: true,
      component: TextInput,
    },
    {
      name: 'displayName',
      label: t('core.label.name'),
      type: 'text',
      disabled: true,
      required: true,
      component: TextInput,
    },
    {
      name: 'message',
      label: t('core.label.message'),
      required: true,
      fullWidth: true,
      type: 'textarea',
      component: TextInput,
    },



  ];



  useEffect(() => {

    if (currentEntity?.entity.id && user?.id) {
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity.id, user?.id, id, watchServiceAccess])


  return { fields, validationSchema, setDinamicDataAction }
}