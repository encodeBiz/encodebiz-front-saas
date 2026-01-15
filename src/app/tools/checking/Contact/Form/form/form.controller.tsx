/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import TextInput from '@/components/common/forms/fields/TextInput';
import { requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useLayout } from "@/hooks/useLayout";
import { addIssue } from "@/services/checkinbiz/employee.service";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import { CommonModalType } from "@/contexts/commonModalContext";
import { IIssue } from "@/domain/features/checkinbiz/IIssue";
import { useCheck } from "../../../page.context";
import { useGeoPermission } from "@/hooks/useGeoPermission";



export default function useFormController(isFromModal: boolean, handleClose?: () => void, onSuccess?: () => void) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { sessionData } = useCheck()
  const { changeLoaderState } = useLayout()
  const [validationSchema, setValidationSchema] = useState({})

  const [fields, setFields] = useState<Array<any>>([])
  const [initialValues] = useState<Partial<IIssue>>({
    comments: '',
    type: 'other',
  });

  const { requestLocation } = useGeoPermission();




  const handleSubmit = async (values: Partial<IIssue>, callback?: () => void) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      delete values.createdAt
      const data = {
        ...values,
        responseCount: 0,
        createdAt: new Date(),
        entityId: sessionData?.entityId,
        userId: sessionData?.employeeId,
        employeeId: sessionData?.employeeId,
        branchId: sessionData?.branchId,
        fromRole: 'supervisor',
        includeLocation: true,
        localtion: {
          latitude: 0,
          longiude: 0
        },
        state: 'in_review',
        toRole: 'worker',
      }
      requestLocation().then(async pos => {
        Object.assign(data, {
          localtion: {
            latitude: pos?.lat,
            longiude: pos?.lng
          },
        })

        await addIssue(data as IIssue)
        changeLoaderState({ show: false })
        showToast(t('core.feedback.success'), 'success');

        if (typeof onSuccess === 'function') onSuccess()
        if (typeof callback === 'function') callback()
        if (typeof handleClose === 'function') handleClose()
      }).catch(err => {

        changeLoaderState({ show: false })
        showToast(err?.message, 'error')
      })


    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };



  const inicialize = async () => {
    changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })

    setValidationSchema({
      comments: requiredRule(t),
      type: requiredRule(t),
    })
    setFields([
      {
        name: 'type',
        label: t('core.label.type'),
        component: SelectInput,
        required: true,
        options: [
          { value: 'journeyRegistration', label: t('core.label.journeyRegistration') },
          { value: 'restRegistration', label: t('core.label.restRegistration') },
          { value: 'configuration', label: t('core.label.configuration') },
          { value: 'other', label: t('core.label.other') },
        ],
      },

      {
        name: 'comments',
        label: t('core.label.comments'),
        type: 'textarea',
        fullWidth: true,
        required: true,
        component: TextInput,
      },





    ])

    changeLoaderState({ show: false })
  }




  useEffect(() => {
    if (sessionData?.entityId)
      inicialize()
  }, [sessionData?.entityId])


  return { fields, initialValues, validationSchema, handleSubmit }
}
