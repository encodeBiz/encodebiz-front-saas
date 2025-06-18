'use client'

import PasswordInput from '@/components/common/forms/fields/PasswordInput';
import TextInput from '@/components/common/forms/fields/TextInput';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useToast } from '@/hooks/useToast';
import { signInEmail, signInGoogle } from '@/services/common/account.service';
import { createEntity } from '@/services/common/entity.service';
import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';


export interface EntityFormValues {
    "uid": string
    "name": string
    "billingEmail": string
    "active": boolean
};

export const useRegisterController = () => {
    const t = useTranslations()
    const { showToast } = useToast()
    const { user, token } = useAuth()
    const { refrestList } = useEntity()
    const { push } = useRouter()
    const [initialValues, setInitialValues] = useState<EntityFormValues>({
        uid: user?.uid as string,
        "name": '',
        "billingEmail": user?.email as string,
        "active": true,

    })

    const validationSchema = Yup.object().shape({
        billingEmail: Yup.string().email(t('core.formValidatorMessages.email')).required(t('core.formValidatorMessages.required')),
        name: Yup.string().required(t('core.formValidatorMessages.required')),

    });
    const handleCreateEntity = async (values: EntityFormValues) => {
        try {
            await createEntity(values, token)
            refrestList(user?.id as string)
            push('/main/dashboard')
        } catch (error: any) {
            showToast(error.message, 'error')
        }
    };

    const fields = [

        {
            name: 'billingEmail',
            label: t('core.label.billingEmail'),
            type: 'email',
            required: true,
            component: TextInput,
        },

        {
            name: 'name',
            label: t('core.label.legalEntityName'),
            type: 'text',
            required: true,
            component: TextInput,
        },


    ];


    useEffect(() => {
        if (user?.id) {
            setInitialValues({
                uid: user?.uid as string,
                "name": '',
                "billingEmail": user?.email as string,
                "active": true,

            })
        }
        return () => { }
    }, [user?.id])



    return { validationSchema, initialValues, fields, handleCreateEntity }
}

