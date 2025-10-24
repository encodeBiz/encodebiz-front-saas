/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { priceRule, requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { searchJobs, handleRespnsability } from "@/services/checkinbiz/employee.service";
import { useAppLocale } from "@/hooks/useAppLocale";
import { EmployeeEntityResponsibility, Job } from "@/domain/features/checkinbiz/IEmployee";
import TextInput from "@/components/common/forms/fields/TextInput";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import SelectCreatableInput from "@/components/common/forms/fields/SelectCreatableInput";


export default function useSucursalFromItemController(item: EmployeeEntityResponsibility) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { token, user } = useAuth()

  const itemId = item.id
  const { currentLocale } = useAppLocale()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const [active, setActive] = useState(item.active??1)
  const [typeOwner, setTypeOwner] = useState(item.responsibility??'worker')

  const [initialValues, setInitialValues] = useState<Partial<any>>({
    job: item?.job?.job ?? '',
    price: item?.job?.price ?? 0,
    responsibility: item?.responsibility ?? '',
    active: item?.active ?? 1,


  });

  const validationSchema = Yup.object().shape({
    job: requiredRule(t),
    responsibility: requiredRule(t),
    price: priceRule(t),
  });

  const handleSubmit = async (values: Partial<any>) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: any = {
        employeeId: item.employeeId,
        level: values.responsibility,
        scope: 'branch',
        job: {
          job: values.job,
          price: values.price,
        },
        assignedBy: user?.uid as string,
        active: active,
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




  const [jobList, setJobList] = useState<Array<Job>>([])
  const fetchJobList = async () => {
    try {
      setJobList(await searchJobs(currentEntity?.entity.id as string))
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
    changeLoaderState({ show: false })
  }


  useEffect(() => {
    if (currentEntity?.entity.id) {
      fetchJobList()
    }

  }, [currentEntity?.entity.id, user?.id, itemId])


  const fields = [
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
      options: [...jobList.map(e => ({ label: e.job, value: e.id }))],
      component: SelectCreatableInput,
      extraProps: {
        onHandleChange: (data: { label: string, value: any }) => {
           if (jobList.find(e => e.id === data?.value)) {
            const item = jobList.find(e => e.id === data.value)
            setInitialValues({ price: item?.price, responsibility:typeOwner })
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

  ]

  return { fields, initialValues, validationSchema, handleSubmit, active, setActive }
}