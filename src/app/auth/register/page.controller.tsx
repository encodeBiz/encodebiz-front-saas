'use client'

import PasswordInput from '@/components/common/forms/fields/PasswordInput';
import PhoneNumberInput from '@/components/common/forms/fields/PhoneNumberInput';
import SimpleCheckTerm from '@/components/common/forms/fields/SimpleCheckTerm';
import TextInput from '@/components/common/forms/fields/TextInput';
import { emailRule, passwordRestrictionRule, requiredRule } from '@/config/yupRules';
import { useToast } from '@/hooks/useToast';
import { signInGoogle, signUpEmail } from '@/services/common/account.service';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as Yup from 'yup';


export interface RegisterFormValues {
    fullName: string
    email: string
    phone: string
    password: string
    passwordConfirm: string
    acceptTerms: boolean
    legalEntityName: string
};

export const useRegisterController = () => {
    const { showToast } = useToast()

    const t = useTranslations()
    const [initialValues, setInitialValues] = useState<RegisterFormValues>({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        legalEntityName: '',
        passwordConfirm: '',
        acceptTerms: false
    })

    const validationSchema = Yup.object().shape({
        fullName: requiredRule(t),
        legalEntityName: requiredRule(t),
        email: emailRule(t),
        phone: requiredRule(t),
        acceptTerms: Yup.boolean().oneOf([true], t('core.formValidatorMessages.acceptTerm'))
            .required(t('core.formValidatorMessages.required')),
        password: passwordRestrictionRule(t),
        passwordConfirm: requiredRule(t)
            .oneOf([Yup.ref('password'), ''], t('core.formValidatorMessages.passwordMatch'))


    });




    const signInWithGoogle = async () => {
        try {
            const data = await signInGoogle()
 
           
        } catch (error: any) {
            showToast(error.message, 'error')
        }
    };

    const signInWithFacebook: any = (values: RegisterFormValues) => { };

    const signInWithEmail = async (values: RegisterFormValues) => {
        try {
            await signUpEmail(values)
        } catch (error: any) {
            showToast(error.message, 'error')
        }
    };


    const fields = [
        {
            name: 'fullName',
            label: t('core.label.fullName'),
            type: 'text',
            required: true,
            component: TextInput,
            fullWidth: true
        },

        {
            name: 'email',
            label: t('core.label.email'),
            type: 'email',
            required: true,
            component: TextInput,
        },
        {
            name: 'phone',
            label: t('core.label.phone'),
            type: 'phone',
            required: true,
            component: PhoneNumberInput,
        },
        ,
        {
            name: 'legalEntityName',
            label: t('core.label.legalEntityName'),
            type: 'text',
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
        {
            name: 'passwordConfirm',
            label: t('core.label.passwordConfirm'),
            type: 'password',
            required: true,
            component: PasswordInput,
        },
        {
            name: 'acceptTerms',
            label: 'acceptTerms',
            type: 'checkbox',
            required: true,
            component: SimpleCheckTerm,
        },

    ];



    return { signInWithGoogle, signInWithFacebook, signInWithEmail, validationSchema, initialValues, fields }
}

