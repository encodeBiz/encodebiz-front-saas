'use client'

import PasswordInput from '@/components/common/forms/fields/PasswordInput';
import TextInput from '@/components/common/forms/fields/TextInput';
import { useToast } from '@/hooks/useToast';
import { signInEmail, signInGoogle } from '@/services/common/account.service';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as Yup from 'yup';


export interface LoginFormValues {
    email: string
    password: string
};

export const useRegisterController = () => {
    const t = useTranslations()
    const { showToast } = useToast()
    const [initialValues, setInitialValues] = useState<LoginFormValues>({
        email: '',
        password: '',

    })

    const validationSchema = Yup.object().shape({
        email: Yup.string().email(t('core.formValidatorMessages.email')).required(t('core.formValidatorMessages.required')),
        password: Yup.string()
            .required(t('core.formValidatorMessages.required'))
            .min(8, t('core.formValidatorMessages.password')),

    });

   const signInWithGoogle = async () => {
        try {
            await signInGoogle()
        } catch (error: any) {
            showToast(error.message, 'error')
        }
    };

    const signInWithFacebook: any = (values: LoginFormValues, actions: any) => {

    };

    const signInWithEmail = async (values: LoginFormValues, actions: any) => {
        try {
            await signInEmail(values.email, values.password)
        } catch (error: any) {
            showToast(error.message, 'error')
        }
    };

    const fields = [

        {
            name: 'email',
            label: t('core.label.email'),
            type: 'email',
            required: true,
            component: TextInput,
        },

        {
            name: 'password',
            label: t('core.label.password'),
            type: 'password',
            required: true,
            component: PasswordInput,
        },


    ];



    return { signInWithGoogle, signInWithFacebook, signInWithEmail, validationSchema, initialValues, fields }
}

