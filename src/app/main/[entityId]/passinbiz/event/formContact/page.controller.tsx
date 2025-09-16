import { useTranslations } from "next-intl";
import { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { ContactFromModel } from "@/domain/core/IContact";
import { sendFormContact } from "@/services/core/helper.service";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";


export default function useFormContactController() {
  const t = useTranslations();
  const { showToast } = useToast()
  
  const { token, user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { changeLoaderState } = useLayout()
  const { openModal } = useCommonModal()
  const formRef = useRef(null)
  const validationSchema = Yup.object().shape({
    message: requiredRule(t),

  });

  const setDinamicDataAction = async (values: Partial<ContactFromModel>) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: ContactFromModel = {
        name: values.name as string,
        phone: values.phone as string,
        "subject": values.subject as string,
        "message": values.message as string,
        email: values.email as string,
        token: token as string,

      }
      await sendFormContact(data)

      changeLoaderState({ show: false })
      openModal(CommonModalType.INFO)
      if (formRef.current) {
        (formRef.current as any).resetForm()
      }

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
      name: 'email',
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
      name: 'name',
      label: t('core.label.companyName'),
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


  return { fields, validationSchema, setDinamicDataAction, formRef }
}