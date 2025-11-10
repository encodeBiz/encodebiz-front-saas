/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { priceRule, requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { searchJobs, handleRespnsability, addJobs, deleteJobs, searchResponsability } from "@/services/checkinbiz/employee.service";
import { useAppLocale } from "@/hooks/useAppLocale";
import TextInput from "@/components/common/forms/fields/TextInput";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import SelectCreatableInput from "@/components/common/forms/fields/SelectCreatableInput";
import { useParams } from "next/navigation";
import { EmployeeEntityResponsibility, Job } from "@/domain/features/checkinbiz/IEmployee";
import ToggleInput from "@/components/common/forms/fields/ToggleInput";
import SearchIndexFilterInput from "@/components/common/forms/fields/SearchFilterInput";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useFormStatus } from "@/hooks/useFormStatus";
import DynamicKeyValueInput from "@/components/common/forms/fields/DynamicKeyValueInput";
import { ArrayToObject } from "@/lib/common/String";


export default function useFormLinkController(onSuccess: () => void) {
    const t = useTranslations();
    const { showToast } = useToast()
    const { token, user } = useAuth()
    const { id } = useParams<{ id: string }>()
    const { closeModal } = useCommonModal()
    const { currentLocale } = useAppLocale()
    const { currentEntity } = useEntity()
    const { changeLoaderState } = useLayout()
    const [active, setActive] = useState(1)
    const [typeOwner, setTypeOwner] = useState('worker')
    const [jobName, setJobName] = useState('')
    const { formStatus } = useFormStatus()
    const [metadata, setMetadata] = useState([])



    const [initialValues, setInitialValues] = useState<Partial<any>>({
        job: '',
        price: 0,
        responsibility: '',
        active: 1,
        metadata: []
    });

    const validationSchema = Yup.object().shape({
        job: requiredRule(t),
        responsibility: requiredRule(t),
        price: priceRule(t),
    });

    const handleSubmit = async (values: Partial<any>) => {
        try {
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })


            const listOfResponsability: Array<EmployeeEntityResponsibility> = await searchResponsability(currentEntity?.entity.id as string, values.employeeId, { limit: 1, filters: [{ field: 'scope.branchId', operator: '==', value: id }] } as any)
            if (listOfResponsability.length > 0) {
                showToast(t('sucursal.employeeUsed'), 'info')
                formStatus?.setSubmitting(false)
                changeLoaderState({ show: false })
            } else {


                const data: any = {
                    id: `${id}_${currentEntity?.entity.id}_${values.employeeId}`,
                    employeeId: values.employeeId,
                    responsibility: values.responsibility,
                    scope: { entityId: currentEntity?.entity.id as string, branchId: id, scope: 'branch' },
                    job: {
                        job: values.job,
                        price: values.price,
                    },
                    "metadata": {
                        ...ArrayToObject(values.metadata as any),
                    },
                    assignedBy: user?.uid as string,
                    active: active,
                    entityId: currentEntity?.entity.id
                }
                if (typeof data.id === 'number') {
                    delete data.id
                }
                await handleRespnsability(data, token, currentLocale, 'post')
                if (values.job)
                    addJobs(currentEntity?.entity.id as string, values.job, values.price)
                changeLoaderState({ show: false })
                showToast(t('core.feedback.success'), 'success');
                if (typeof onSuccess == 'function') onSuccess()
                closeModal(CommonModalType.FORM)
            }

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
    }, [currentEntity?.entity.id, user?.id])


    const fields = [
        {
            name: 'employeeId',
            label: t('core.label.employee'),
            type: 'text',
            required: true,
            fullWidth: true,
            component: SearchIndexFilterInput,

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
            options: [...jobList.map(e => e.job.toUpperCase())],
            component: SelectCreatableInput,
            extraProps: {
                onHandleChange: (data: string) => {
                    setJobName(data)
                },

                onDeleteItem: (data: string) => {
                    setJobList(prev => [...prev.filter(e => e.job.toLowerCase().trim() !== data.toLocaleLowerCase().trim())])
                    deleteJobs(currentEntity?.entity?.id as string, data)
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
            name: 'active',
            label: t('core.label.active'),
            required: true,
            component: ToggleInput,
        },

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
            extraProps: {
                onHandleChange: (data: any) => {
                    setMetadata(data)
                },
            },
        }

    ]

    useEffect(() => {
        if (jobName) {
            const itemData = jobList.find(e => e.job?.toLowerCase() === jobName?.toLowerCase())
            if (itemData) {
                setInitialValues({ ...formStatus?.values, price: itemData?.price, responsibility: typeOwner, job: jobName, metadata })
            }
        }
    }, [jobName])


    return { fields, initialValues, validationSchema, handleSubmit, active, setActive }
}