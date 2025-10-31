'use client'
import SelectInput from '@/components/common/forms/fields/SelectInput';
import TextInput from '@/components/common/forms/fields/TextInput';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useToast } from '@/hooks/useToast';
import { createEntity } from '@/services/core/entity.service';
import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { addressSchema, requiredRule } from '@/config/yupRules';
import { MAIN_ROUTE } from '@/config/routes';
import { createSlug } from '@/lib/common/String';
import { useLayout } from '@/hooks/useLayout';
import { useAppLocale } from '@/hooks/useAppLocale';
import AddressComplexInput from '@/components/common/forms/fields/AddressComplexInput';


export interface EntityFormValues {
    "uid": string
    "name": string
    "active": boolean
    address: {},
    //"region": string
    "taxId": string
    language: string
    legalName: string
    billingEmail: string
};

export const useRegisterController = () => {
    const t = useTranslations()
    const { showToast } = useToast()
    const { user, token } = useAuth()
    const { changeCurrentEntity } = useEntity()
    const { push } = useRouter()
    const { currentLocale } = useAppLocale()


    const { changeLoaderState } = useLayout()
    const [initialValues, setInitialValues] = useState<EntityFormValues>({
        uid: user?.id as string,
        "name": "",
        "active": true,
        address: {},
        //"region": currentEntity?.entity?.legal?.address.region as string | "",
        "taxId": "",
        "legalName": "",
        billingEmail: user?.email as string | "",
        "language": ""
    });
    const validationSchema = Yup.object().shape({
        name: requiredRule(t),
        address: addressSchema(t),
        language: requiredRule(t),
        taxId: requiredRule(t),
        legalName: requiredRule(t),

    });
    const handleCreateEntity = async (values: any) => {
        try {
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })

            const createData = {

                "name": values.name,
                "slug": createSlug(values.name),
                "billingEmail": values.billingEmail,
                "language": values?.language ?? 'ES',
                "legal": {
                    "legalName": values.legalName,
                    "taxId": values.taxId,
                    "address": values.address
                },
                "active": true
            }
            const data: { entity: { id: string } } = await createEntity(createData, token, currentLocale)

            if (data.entity.id) {
                changeCurrentEntity(data.entity.id, user?.id as string, () => {
                    showToast(t('core.feedback.success'), 'success');
                    push(`/${MAIN_ROUTE}/${data.entity.id}/dashboard`)
                })
            } else {
                showToast(t('core.feedback.success'), 'success');
                //navivateTo(`/${GENERAL_ROUTE}/dashboard`)

            }
            changeLoaderState({ show: false })

        } catch (error: any) {
            changeLoaderState({ show: false })
            showToast(error.message, 'error')
        }
    };

    const fields = [

        {
            name: 'name',
            label: t('core.label.companyName'),
            type: 'text',
            required: true,

            component: TextInput,
        },

        {
            name: 'language',
            label: t('core.label.language'),
            component: SelectInput,
            options: [{ label: t('layout.header.spanish'), value: 'ES' }, { label: t('layout.header.english'), value: 'EN' }]
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
            label: t('core.label.companyEmail'),
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
            name: 'address',
            label: t('core.label.addressData'),
            required: true,
            fullWidth: true,
            component: AddressComplexInput,
        },


    ];


    useEffect(() => {
        if (user?.id) {
            setInitialValues({
                uid: user?.uid as string,
                "name": '',
                "billingEmail": user?.email as string,
                "active": true,

                legalName: '',
                address: {

                },
                taxId: '',
                language: ''
            })
        }
        return () => { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id])



    return { validationSchema, initialValues, fields, handleCreateEntity }
}

