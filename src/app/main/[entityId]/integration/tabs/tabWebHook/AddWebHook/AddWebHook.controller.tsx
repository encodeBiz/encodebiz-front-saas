import { useTranslations } from "next-intl";
import { useEffect } from 'react';
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { arrayLatestRule, requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import SelectMultipleInput from "@/components/common/forms/fields/SelectMultipleInput";
import { createWebHook } from "@/services/core/integration.service";
import { IWebHook } from "@/domain/core/integration/IWebHook";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useAppLocale } from "@/hooks/useAppLocale";

const types = ["pass.created", "pass.created.failed", "pass.revoked", "pass.sent", "credential.created", "credential.sent", "credential.sent.failed", "validation.scanned", "validation.scanned.success", "validation.scanned.failed", "attendance.clock_in", "attendance.clock_out"]
export default function useAddWebHookController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { closeModal } = useCommonModal()
  const { token, user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { changeLoaderState } = useLayout()
  const { currentLocale } = useAppLocale()

  const validationSchema = Yup.object().shape({
    url: requiredRule(t),
    subscribedEvents: arrayLatestRule(t),
  });



  const setDinamicDataAction = async (values: Partial<IWebHook>) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: Partial<IWebHook> = {
        ...values
      }
      await createWebHook(data, token, currentLocale)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      closeModal(CommonModalType.WEBHOOK);
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };


  const fields = [
    {
      name: 'url',
      label: t('core.label.urlWebbhook'),
      type: 'url',
      required: true,
    
      component: TextInput,
    },
    {
      name: 'subscribedEvents',
      label: t('core.label.subscribedEvents'),
      required: true,
      component: SelectMultipleInput,
      options: types.map(e => ({ label: e, value: e }))
    },
  ];



  useEffect(() => {
    if (currentEntity?.entity.id && user?.id) {
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity.id, user?.id, id, watchServiceAccess])


  return { fields, validationSchema, setDinamicDataAction }
}