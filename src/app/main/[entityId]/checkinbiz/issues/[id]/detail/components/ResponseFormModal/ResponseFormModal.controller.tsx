/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useLayout } from "@/hooks/useLayout";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useState } from "react";
import { useEntity } from "@/hooks/useEntity";
import { addResponse } from "@/services/checkinbiz/employee.service";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import { useFormStatus } from "@/hooks/useFormStatus";
import { useAppLocale } from "@/hooks/useAppLocale";
import TextInput from "@/components/common/forms/fields/TextInput";
import { IIssue, IIssueResponse } from "@/domain/features/checkinbiz/IIssue";


export default function useResponseFormModalController(onSuccess: () => void, issue: IIssue) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { user } = useAuth()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const { formStatus } = useFormStatus()
  const { closeModal } = useCommonModal()
  const { currentLocale } = useAppLocale()


  const [initialValues, setInitialValues] = useState<Partial<IIssueResponse>>({
    message: '',
    newState: ''
  })

  const [branchList, setBranchList] = useState<Array<any>>([])
  const [validationSchema, setValidationSchema] = useState<any>({
    message: requiredRule(t),
    newState: requiredRule(t)
  })


  const createResponse = async (values: Partial<IIssueResponse>, callback: () => void) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      await addResponse({
        issueId: issue?.id,
        userId: user?.id,
        employeeId: issue?.employeeId,
        message: values?.message?.trim(),
        oldState: issue?.state,
        newState: values?.newState,
        createdAt: new Date()
      })
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      closeModal(CommonModalType.CHECKLOGFORM)
      if (typeof onSuccess === 'function') onSuccess()
      if (typeof callback === 'function') callback()

    } catch (error: any) {
      formStatus?.setSubmitting(false)
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };
  let fields = [


    {
      name: 'newState',
      label: t('core.label.status'),
      component: SelectInput,
      fullWidth: true,
      options: [
        { value: '' as string, label: t('core.label.select') },
        { label: t('core.label.resolved'), value: 'resolved' },
        { label: t('core.label.in_review'), value: 'in_review' },
        { label: t('core.label.rejected'), value: 'rejected' },
      ]

    },
    {
      name: 'message',
      label: t('core.label.message'),
      type: 'textarea',
      fullWidth: true,
      component: TextInput,

    },

  ];









  return { fields, validationSchema, createResponse, initialValues }
}