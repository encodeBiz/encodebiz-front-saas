import { useTranslations } from "next-intl";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useLayout } from "@/hooks/useLayout";
import { ContactFromModel } from "@/domain/core/IContact";
import { sendFormContact } from "@/services/core/helper.service";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import PhoneNumberInput from "../../forms/fields/PhoneNumberInput";
import { useAppLocale } from "@/hooks/useAppLocale";


export default function useFormContactController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { token } = useAuth()
  const { changeLoaderState } = useLayout()
  const { closeModal } = useCommonModal()
  const { currentLocale } = useAppLocale()

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
      await sendFormContact(data, currentLocale)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      closeModal(CommonModalType.CONTACT)
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
      component: TextInput,
    },
    {
      name: 'email',
      label: t('core.label.email'),
      type: 'text',
      required: true,
      component: TextInput,
    },
    {
      name: 'phone',
      label: t('core.label.phone'),
      type: 'text',
      disabled: false,
      required: true,
      component: PhoneNumberInput,
    },
    {
      name: 'name',
      label: t('core.label.name'),
      type: 'text',
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



  return { fields, validationSchema, setDinamicDataAction }
}