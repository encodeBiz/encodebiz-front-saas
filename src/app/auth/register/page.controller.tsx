'use client'

import PasswordInput from '@/components/common/forms/fields/PasswordInput';
import PhoneNumberInput from '@/components/common/forms/fields/PhoneNumberInput';
import SimpleCheckTerm from '@/components/common/forms/fields/SimpleCheckTerm';
import TextInput from '@/components/common/forms/fields/TextInput';
import { codeError } from '@/config/errorLocales';
import { GENERAL_ROUTE, MAIN_ROUTE } from '@/config/routes';
import { emailRule, passwordRestrictionRule, requiredRule } from '@/config/yupRules';
import { useAppLocale } from '@/hooks/useAppLocale';
import { useAuth } from '@/hooks/useAuth';
import { useLayout } from '@/hooks/useLayout';
import { useToast } from '@/hooks/useToast';
import { createUser } from '@/lib/firebase/authentication/create';
import { signUpEmail } from '@/services/core/account.service';
import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';
import { useState } from 'react';
import * as Yup from 'yup';


export interface RegisterFormValues {
    fullName: string
    email: string
    phone: string
    password: string
    passwordConfirm: string
    acceptTerms: boolean
};

export const useRegisterController = () => {
    const { showToast } = useToast()
    const { changeLoaderState } = useLayout()
    const { updateUserData } = useAuth()
    const { push } = useRouter()
    const { currentLocale } = useAppLocale()
    const t = useTranslations()
    const [initialValues] = useState<RegisterFormValues>({
        fullName: '',
        email: '',
        phone: '',
        password: '',

        passwordConfirm: '',
        acceptTerms: false
    })

    const validationSchema = Yup.object().shape({
        fullName: requiredRule(t),

        email: emailRule(t),
        phone: requiredRule(t),
        acceptTerms: Yup.boolean().oneOf([true], t('core.formValidatorMessages.acceptTerm'))
            .required(t('core.formValidatorMessages.required')),
        password: passwordRestrictionRule(t),
        passwordConfirm: requiredRule(t)
            .oneOf([Yup.ref('password'), ''], t('core.formValidatorMessages.passwordMatch'))


    });





    const signInWithEmail = async (values: RegisterFormValues,) => {
        try {

            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            const responseAuth = await createUser(values.email, values.password);
            const sessionToken = await responseAuth.user.getIdToken();
            if (!responseAuth) {
                showToast('Error to fetch user auth token', 'error')
            } else {
                await signUpEmail(values, sessionToken, responseAuth.user.uid as string, currentLocale)
                await updateUserData()
                push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity/create`)
                changeLoaderState({ show: false })

            }
        } catch (error: any) {
            if (error.message.includes('auth/email-already-in-use')) {
                showToast(codeError[currentLocale]['auth/email-already-in-use'] ? codeError[currentLocale]['auth/email-already-in-use'] : error.message
                    , 'error')
            } else {
                if (error.message.includes('auth/email-already-exists')) {
                    showToast(codeError[currentLocale]['auth/email-already-exists'] ? codeError[currentLocale]['auth/email-already-exists'] : error.message
                        , 'error')
                } else {
                    showToast(error.message, 'error')
                }
            }
            changeLoaderState({ show: false })
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
        {
            name: 'phone',
            label: t('core.label.phone'),
            type: 'number',
            required: true,
            component: PhoneNumberInput,
        },


        {
            name: 'passwordConfirm',
            label: t('core.label.passwordConfirm'),
            type: 'password',
            required: true,
            component: PasswordInput,
        },

        {
            name: 'fullName',
            label: t('core.label.fullName'),
            type: 'text',
            required: true,
            component: TextInput,
            fullWidth: true
        },
        {
            name: 'acceptTerms',
            label: 'acceptTerms',
            type: 'checkbox',
            required: true,
            fullWidth: true,
            component: SimpleCheckTerm,
        },

    ];



    return { signInWithEmail, validationSchema, initialValues, fields }
}

