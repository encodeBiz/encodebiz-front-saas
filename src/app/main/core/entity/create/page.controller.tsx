'use client'
import SelectInput from '@/components/common/forms/fields/SelectInput';
import TextInput from '@/components/common/forms/fields/TextInput';
import { country } from '@/config/country';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useToast } from '@/hooks/useToast';
import { createEntity } from '@/services/common/entity.service';
import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { requiredRule } from '@/config/yupRules';
import { MAIN_ROUTE, GENERAL_ROUTE } from '@/config/routes';


export interface EntityFormValues {
    "uid": string
    "name": string
    "active": boolean
    "street": string
    "country": string
    "city": string
    "postalCode": string
    //"region": string
    "taxId": string
    legalName: string
    billingEmail: string
};

export const useRegisterController = () => {
    const t = useTranslations()
    const { showToast } = useToast()
    const { user, token } = useAuth()
    const { refrestList } = useEntity()
    const { push } = useRouter()
    const [cityList, setCityList] = useState<any>([])
    const [initialValues, setInitialValues] = useState<EntityFormValues>({
        uid: user?.id as string,
        "name": "",
        "active": true,
        "street": "",
        "country": "",
        "city": "",
        "postalCode": "",
        //"region": currentEntity?.entity?.legal?.address.region as string | "",
        "taxId": "",
        "legalName": "",
        billingEmail: user?.email as string | ""
    });
    const validationSchema = Yup.object().shape({
        name: requiredRule(t),
        street: requiredRule(t),
        country: requiredRule(t),
        city: requiredRule(t),
        postalCode: requiredRule(t),
        //region: requiredRule(t),
        taxId: requiredRule(t),
        legalName: requiredRule(t),

    });
    const handleCreateEntity = async (values: EntityFormValues) => {
        try {
            await createEntity(values, token)
            refrestList(user?.id as string)
            showToast(t('core.feedback.success'), 'success');
            push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/dashboard`)
        } catch (error: any) {
            showToast(error.message, 'error')
        }
    };

    const fields = [

        {
            name: 'name',
            label: t('core.label.name'),
            type: 'text',
            required: true,
            fullWidth: true,
            component: TextInput,
        },

        {
            isDivider: true,
            label: t('core.label.legal'),
        },
        {
            name: 'legalName',
            label: t('core.label.legalEntityName'),
            type: 'text',
            required: true,
            fullWidth: true,
            component: TextInput,
        },
        {
            name: 'billingEmail',
            label: t('core.label.billingEmail'),
            type: 'email',
            component: TextInput,
        },
        {
            name: 'taxId',
            label: t('core.label.taxId'),
            type: 'text',
            component: TextInput,
        },
        {
            isDivider: true,
            label: t('core.label.address'),
        },
        {
            name: 'street',
            label: t('core.label.street'),
            type: 'textarea',
            fullWidth: true,
            component: TextInput,
        },
        {
            name: 'country',
            label: t('core.label.country'),
            onChange: (event: any) => {
                setCityList(country.find(e => e.name === event)?.states?.map(e => ({ label: e.name, value: e.name })) ?? [])
            },
            component: SelectInput,
            options: country.map(e => ({ label: e.name, value: e.name }))
        },
        {
            name: 'city',
            label: t('core.label.city'),
            component: SelectInput,
            options: cityList
        },
         
        {
            name: 'postalCode',
            label: t('core.label.postalCode'),
            component: TextInput,
            fullWidth: true,
            options: cityList
        },


    ];


    useEffect(() => {
        if (user?.id) {
            setInitialValues({
                uid: user?.uid as string,
                "name": '',
                "billingEmail": user?.email as string,
                "active": true,
                city: '',
                country: '',
                legalName: '',
                postalCode: '',
                street: '',
                taxId: '',
            })
        }
        return () => { }
    }, [user?.email, user?.id, user?.uid])



    return { validationSchema, initialValues, fields, handleCreateEntity }
}

