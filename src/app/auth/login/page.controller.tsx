'use client'

import PasswordInput from '@/components/common/forms/fields/PasswordInput';
import PhoneNumberInput from '@/components/common/forms/fields/PhoneNumberInput';
import SelectInput from '@/components/common/forms/fields/SelectField';
import SimpleCheck from '@/components/common/forms/fields/SimpleCheck';
import TextInput from '@/components/common/forms/fields/TextInput';
import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as Yup from 'yup';


export interface LoginFormValues {
    email: string
    password: string
};

export const useRegisterController = () => {
    const t = useTranslations()
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

    const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential as string);
        console.log('Google login success:', decoded);
        // Handle Google login (send to your backend or process user data)
    };
    const signInWithGoogle: any = useGoogleOneTapLogin({
        onSuccess: (response: CredentialResponse) => handleGoogleSuccess(response),
    });

    const signInWithFacebook: any = (values: LoginFormValues, actions: any) => {

    };

    const signInWithEmail = (values: LoginFormValues, actions: any) => {

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

