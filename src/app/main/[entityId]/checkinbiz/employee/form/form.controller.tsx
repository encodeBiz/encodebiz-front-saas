/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import DynamicKeyValueInput from "@/components/common/forms/fields/DynamicKeyValueInput";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { addressSchema, emailRule, requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { ArrayToObject, objectToArray } from "@/lib/common/String";
import { createEmployee, fetchEmployee, updateEmployee } from "@/services/checkinbiz/employee.service";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import ToggleInput from "@/components/common/forms/fields/ToggleInput";
import PhoneNumberInput from "@/components/common/forms/fields/PhoneNumberInput";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useAppLocale } from "@/hooks/useAppLocale";
import AddressComplexInput from "@/components/common/forms/fields/AddressComplexInput";



export default function useFormController(isFromModal: boolean, onSuccess?: () => void) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const { open, closeModal } = useCommonModal()

  const { id } = useParams<{ id: string }>()
  const itemId = isFromModal ? open.args?.id : id
  const { currentLocale } = useAppLocale()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()




  const [validationSchema, setValidationSchema] = useState({
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
  })

 
  const [fields, setFields] = useState<Array<any>>([])
  const [initialValues, setInitialValues] = useState<Partial<IEmployee>>({
    "fullName": '',
    email: '',
    phone: '',
    role: "internal",
    status: 'active',
    metadata: [],
    enableRemoteWork: false,

  });





  const handleSubmit = async (values: Partial<IEmployee>, callback?: () => void) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data = {
        ...values,
        "uid": user?.id as string,
        "metadata": {
          ...ArrayToObject(values.metadata as any),          
        },
        "id": itemId,
        entityId: currentEntity?.entity.id
      }

      let response
      if (itemId)
        await updateEmployee(data, token, currentLocale)
      else {
        response = await createEmployee(data, token, currentLocale)

      }


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
          navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee/${response.employee.id}/detail`)
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
      const addressData = event?.address
      
      const initialValuesData = {
        ...event,
        metadata: objectToArray(event.metadata)
      }
      if (event.enableRemoteWork) {      
        Object.assign(initialValuesData, {
          address: addressData
        })

        remoteFieldHandleValueChanged(event.enableRemoteWork)
      }

      setInitialValues(initialValuesData)
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }

  const remoteFieldHandleValueChanged = (checked: boolean) => {
    if (checked) {
      setFields(prevFields => [
        ...prevFields.filter(e => e.name !== 'metadata' && e.name !== 'additional_data_section' && e.name !== 'address'),
        {
          name: 'address',
          label: t('cofe.label.address'),
          required: true,
          fullWidth: true,
          component: AddressComplexInput,
        },
        ...addDataFields
      ])

      setValidationSchema(prevSchema => ({
        ...prevSchema,
        address: addressSchema(t)
      }))
    }
    else {
      setFields(prevFields => [
        ...prevFields.filter(f => !['address'].includes(f.name))
      ])

      setValidationSchema(prevSchema => ({
        ...prevSchema,
        
      }))
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
        metadata: [],
        address: { "country": "", "city": "", "postalCode": "", "street": "", "geo": { "lat": 0, "lng": 0 }, "timeZone": "" }
      } as any)
    }
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
        name: 'enableRemoteWork',
        label: t('core.label.enableRemoteWork'),
        required: false,
        component: ToggleInput,

        extraProps: {
          onHandleChange: remoteFieldHandleValueChanged,
        },
      },

      ...addDataFields
    ])

    changeLoaderState({ show: false })
  }

  const addDataFields = [
    {
      isDivider: true,
      name: 'additional_data_section',
      label: t('core.label.aditionalData'),
    },
    {
      name: 'metadata',
      label: t('core.label.setting'),
      type: 'text',
      required: true,
      fullWidth: true,
      component: DynamicKeyValueInput,
    }
  ]



  useEffect(() => {
    if (currentEntity?.entity.id) {
      inicialize()
    }
    if (currentEntity?.entity.id && user?.id && itemId)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, itemId])


  return { fields, initialValues, validationSchema, handleSubmit }
}