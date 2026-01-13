/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { addIssue, fetchIssue, updateIssue } from "@/services/checkinbiz/employee.service";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { IIssue } from "@/domain/features/checkinbiz/IIssue";
import { search } from "@/services/checkinbiz/sucursal.service";
import SearchIndexFilterInput from "@/components/common/forms/fields/SearchFilterInput";



export default function useFormController(isFromModal: boolean, onSuccess?: () => void) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { user } = useAuth()
  const { open, closeModal } = useCommonModal()

  const { id } = useParams<{ id: string }>()
  const itemId = isFromModal ? open.args?.id : id
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()


  const fetchSucursalList = async () => {
    const data = await search(currentEntity?.entity.id as string, { ...{} as any, limit: 100 })
    return data
  }

  const [validationSchema] = useState({
    branchId: requiredRule(t),
    employeeId: requiredRule(t),
    comments: requiredRule(t),
    fromRole: requiredRule(t),
    includeLocation: requiredRule(t),
    localtion: Yup.object().shape({
      latitude: requiredRule(t),
      longiude: requiredRule(t)
    }),
    state: requiredRule(t),
    toRole: requiredRule(t),
    type: requiredRule(t),
  })


  const [fields, setFields] = useState<Array<any>>([])
  const [initialValues, setInitialValues] = useState<Partial<IIssue>>({
    branchId: '',
    employeeId: '',
    comments: '',
    fromRole: 'supervisor',
    includeLocation: false,
    localtion: {
      latitude: 0,
      longiude: 0
    },
    state: 'in_review',
    toRole: 'worker',
    type: 'other',

  });





  const handleSubmit = async (values: Partial<IIssue>, callback?: () => void) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      delete values.createdAt
      const data = {
        ...values,
        responseCount: 0,
        createdAt: new Date(),
        entityId: currentEntity?.entity.id,
        userId: user?.id as string,
      }

       

      if (itemId)
        await updateIssue(data as IIssue)
      else {
        await addIssue(data as IIssue)
      }


      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');

      if (typeof onSuccess === 'function') onSuccess()
      if (typeof callback === 'function') callback()

      if (isFromModal)
        closeModal(CommonModalType.FORM)
      else {
        if (itemId)
          navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/issues/${itemId}/detail`)
        else
          navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/issues`)
      }
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };



  const fetchData = async () => {

    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const issueItem: IIssue = await fetchIssue(itemId)
      setInitialValues(issueItem)
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }


  const inicialize = async () => {
    changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
    const branchList = await fetchSucursalList()
    setFields([
      {
        name: 'branchId',
        label: t('core.label.sucursal'),
        type: 'text',
        required: true,
     
        component: SelectInput,
        options: [...branchList.map(e => ({ label: e.name, value: e.id }))]
      },

      {
        name: 'employeeId',
        label: t('core.label.employee'),
        type: 'text',
        required: true,
       
        component: SearchIndexFilterInput,

      },

      {
        name: 'comments',
        label: t('core.label.comments'),
        type: 'textarea',
           fullWidth: true,
        required: true,
        component: TextInput,
      },

      {
        name: 'fromRole',
        label: t('core.label.fromRole'),
        component: SelectInput,
        required: true,
        options: [
          { value: 'worker', label: t('core.label.worker') },
          { value: 'supervisor', label: t('core.label.supervisor') },
        ],
      },

      {
        name: 'toRole',
        label: t('core.label.toRole'),
        component: SelectInput,
        required: true,
        options: [
          { value: 'worker', label: t('core.label.worker') },
          { value: 'supervisor', label: t('core.label.supervisor') },
        ],
      },


      {
        name: 'state',
        label: t('core.label.state'),
        component: SelectInput,
        required: true,
        options: [
          { value: 'resolved', label: t('core.label.resolved') },
          { value: 'in_review', label: t('core.label.in_review') },
          { value: 'pending', label: t('core.label.pending') },
        ],
      },

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



    ])

    changeLoaderState({ show: false })
  }




  useEffect(() => {
    if (currentEntity?.entity.id) {
      inicialize()
    }
    if (currentEntity?.entity.id && user?.id && itemId)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, itemId])


  return { fields, initialValues, validationSchema, handleSubmit }
}
