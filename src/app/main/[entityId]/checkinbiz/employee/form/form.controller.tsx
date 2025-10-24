/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import DynamicKeyValueInput from "@/components/common/forms/fields/DynamicKeyValueInput";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { emailRule, priceRule, requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { ArrayToObject, objectToArray } from "@/lib/common/String";
import { addJobs, createEmployee, fetchEmployee, handleRespnsability, searchJobs, updateEmployee } from "@/services/checkinbiz/employee.service";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { IEmployee, Job } from "@/domain/features/checkinbiz/IEmployee";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import ToggleInput from "@/components/common/forms/fields/ToggleInput";
import PhoneNumberInput from "@/components/common/forms/fields/PhoneNumberInput";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useAppLocale } from "@/hooks/useAppLocale";
import SelectCreatableInput from "@/components/common/forms/fields/SelectCreatableInput";
import { useFormStatus } from "@/hooks/useFormStatus";


export default function useFormController(isFromModal: boolean, onSuccess?: () => void) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const { open, closeModal } = useCommonModal()
  const { formStatus } = useFormStatus()

  const { id } = useParams<{ id: string }>()
  const itemId = isFromModal ? open.args?.id : id
  const { currentLocale } = useAppLocale()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const [fields, setFields] = useState<Array<any>>([])
  const [typeOwner, setTypeOwner] = useState('worker')
  const [jobData, setJob] = useState<Job | null>()
  const [initialValues, setInitialValues] = useState<Partial<IEmployee>>({
    "fullName": '',
    email: '',
    phone: '',
    role: "internal",
    status: 'active',
    metadata: [],
    enableRemoteWork: false,


    price: 0,
    responsibility: 'worker',
    job: ''
  });

  const validationSchema = Yup.object().shape({
    metadata: Yup.array()
      .of(
        Yup.object().shape({
          label: requiredRule(t),
          value: requiredRule(t)
        })
      )
      .nullable(),
    fullName: requiredRule(t),
    phone: requiredRule(t),
    email: emailRule(t),

    job: requiredRule(t),
    responsibility: requiredRule(t),
    price: priceRule(t),

  });


  const handleSubmitRespnsability = async (values: Partial<any>, employeeId: string) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: any = {
        employeeId: employeeId,
        level: values.responsibility,
        scope: 'branch',
        job: {
          job: values.job,
          price: values.price,
        },
        assignedBy: user?.uid as string,
        active: 1,
        entityId: currentEntity?.entity.id
      }
      await handleRespnsability(data, token, currentLocale)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');

    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };


  const handleSubmit = async (values: Partial<IEmployee>, callback?: () => void) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data = {
        ...values,
        "uid": user?.id as string,
        "metadata": ArrayToObject(values.metadata as any),
        "id": itemId,
        entityId: currentEntity?.entity.id
      }


      if (itemId)
        await updateEmployee(data, token, currentLocale)
      else {
        const response = await createEmployee(data, token, currentLocale)
        if (response.code == "employee/created") {
          handleSubmitRespnsability(data, response.employee.id)
        }
      }

      addJobs(currentEntity?.entity.id as string, data.job as string, data.price as number)

      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');

      if (typeof onSuccess === 'function') onSuccess()
      if (typeof callback === 'function') callback()

      if (isFromModal)
        closeModal(CommonModalType.FORM)
      else {
        if (itemId)
          navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee/${itemId}/detail`)
        else
          navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee`)
      }
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };



  const fetchData = async () => {

    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const event: IEmployee = await fetchEmployee(currentEntity?.entity.id as string, itemId)

      setInitialValues({
        ...event,
        metadata: objectToArray(event.metadata)
      })
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }

  const inicialize = async () => {
    changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
    if (!itemId) {
      setInitialValues({
        "fullName": '',
        email: '',
        phone: '',
        role: "internal",
        status: 'active',
        enableRemoteWork: false,
        price: 0,
        responsibility: 'worker',
        job: '',
        metadata: []
      })
    }
    const items: Array<Job> = await fetchJobList() as Array<Job>
    setFields([
      {
        isDivider: true,
        label: t('core.label.personalData'),
      },
      {
        name: 'fullName',
        label: t('core.label.name'),
        type: 'text',
        required: true,
        component: TextInput,
      },

      {
        name: 'email',
        label: t('core.label.email'),
        type: 'text',
        disabled: !!itemId,
        required: true,
        component: TextInput,
      },
      {
        name: 'phone',
        label: t('core.label.phone'),
        type: 'text',
        required: true,
        component: PhoneNumberInput,
      },
      {
        name: 'role',
        label: t('core.label.role'),
        component: SelectInput,
        required: true,
        options: [
          { value: 'internal', label: t('core.label.internal') },
          { value: 'collaborator', label: t('core.label.collaborator') },

        ],
      },
      {
        name: 'status',
        label: t('core.label.status'),
        type: 'text',
        required: false,

        options: [
          { label: t('core.label.active'), value: 'active' },
          { label: t('core.label.inactive'), value: 'inactive' },
          { label: t('core.label.vacation'), value: 'vacation' },
          { label: t('core.label.sick_leave'), value: 'sick_leave' },
          { label: t('core.label.leave_of_absence'), value: 'leave_of_absence' },
          { label: t('core.label.paternity_leave'), value: 'paternity_leave' },
          { label: t('core.label.maternity_leave'), value: 'maternity_leave' },
        ],
        component: SelectInput,
      },



      {
        name: 'nationalId',
        label: t('core.label.nationalId'),
        type: 'text',
        required: false,
        component: TextInput,

      },
      {
        isDivider: true,
        label: t('core.label.configData'),
      },
      {
        name: 'responsibility',
        label: t('core.label.responsibility'),
        required: false,
        options: [
          { label: t('core.label.owner'), value: 'owner' },
          { label: t('core.label.manager'), value: 'manager' },
          { label: t('core.label.supervisor'), value: 'supervisor' },
          { label: t('core.label.worker'), value: 'worker' }
        ],
        component: SelectInput,
        extraProps: {
          onHandleChange: (data: any) => {
            setTypeOwner(data)
          },
        },
      },

      {
        name: 'job',
        label: t('core.label.jobTitle'),
        type: 'text',
        required: false,
        options: [...items.map(e => ({ label: e.job, value: e.id }))],
        component: SelectCreatableInput,
        extraProps: {
          onHandleChange: (data: { label: string, value: any }) => {
            if (items.find(e => e.id === data?.value)) {
              const item = items.find(e => e.id === data.value)
              setJob(item as Job)
            }
          },
        },
      },


      {
        name: 'price',
        label: t('core.label.price'),
        type: 'number',
        required: true,
        component: TextInput,
      },
      {
        name: 'enableRemoteWork',
        label: t('core.label.enableRemoteWork'),
        required: false,
        component: ToggleInput,
      },

      {
        isDivider: true,
        label: t('core.label.aditionalData'),
      },


      {
        name: 'metadata',
        label: t('core.label.setting'),
        type: 'text',
        required: true,
        fullWidth: true,
        component: DynamicKeyValueInput,
      },
    ])

    changeLoaderState({ show: false })
  }


  const [jobList, setJobList] = useState<Array<Job>>([])
  const fetchJobList = async () => {
    try {
      const items = await searchJobs(currentEntity?.entity.id as string)
      setJobList(items)
      return items
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
    changeLoaderState({ show: false })
  }


  useEffect(() => {
    if (jobData) {
      setInitialValues({...formStatus?.values, price:jobData.price})       
    }
  }, [jobData])

  useEffect(() => {
    if (currentEntity?.entity.id) {
      inicialize()
    }
    if (currentEntity?.entity.id && user?.id && itemId)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, itemId])


  return { fields, initialValues, validationSchema, handleSubmit }
}