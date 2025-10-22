/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { updateBranchEmployee } from "@/services/checkinbiz/employee.service";
import { useAppLocale } from "@/hooks/useAppLocale";
import { EmployeeEntityResponsibility } from "@/domain/features/checkinbiz/IEmployee";
import TextInput from "@/components/common/forms/fields/TextInput";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import ToggleInput from "@/components/common/forms/fields/ToggleInput";


export default function useSucursalFromItemController(item: EmployeeEntityResponsibility) {
    const t = useTranslations();
    const { showToast } = useToast()
    const { token, user } = useAuth()

    const itemId = item.id
    const { currentLocale } = useAppLocale()
    const { currentEntity } = useEntity()
    const { changeLoaderState } = useLayout()
 
    const [initialValues] = useState<Partial<any>>({
        job: item?.job?.job ?? '',
        price: item?.job?.price ?? 0,
        responsibility: item?.responsibility ?? '',
        active: item?.active ?? 1,


    });

    const validationSchema = Yup.object().shape({

        job: requiredRule(t),
        responsibility: requiredRule(t),
        price: requiredRule(t),

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
                active: values.active,
                entityId: currentEntity?.entity.id
            }
            await updateBranchEmployee(data, token, currentLocale)
            changeLoaderState({ show: false })
            showToast(t('core.feedback.success'), 'success');

        } catch (error: any) {
            changeLoaderState({ show: false })
            showToast(error.message, 'error')
        }
    };



     
    const [jobList, setJobList] = useState<Array<string>>([])
    const fetchJobList = async () => {

        setJobList(['JOB1','JOB2',])
        
        changeLoaderState({ show: false })
    }
    

    useEffect(() => {
        if (currentEntity?.entity.id) {
            fetchJobList()
        }

    }, [currentEntity?.entity.id, user?.id, itemId])


    const fields=[
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
      },

      {
        name: 'job',
        label: t('core.label.jobTitle'),
        type: 'text',
        required: false,
        options: [...jobList],
        component: SelectInput,
      },

       
      {
        name: 'price',
        label: t('core.label.price'),
        type: 'number',
        required: true,
        component: TextInput,
      },  
      {
        name: 'active',
        label: t('core.label.active'),
        required: false,
        component: ToggleInput,

      },      
    ]

    return { fields, initialValues, validationSchema, handleSubmit }
}