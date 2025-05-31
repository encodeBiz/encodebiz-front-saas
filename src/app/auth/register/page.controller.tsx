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


export interface RegisterFormValues {
    fullName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
};

export const useRegisterController = () => {
    const t = useTranslations()
    const [initialValues, setInitialValues] = useState<RegisterFormValues>({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    })

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required(t('core.formValidatorMessages.required')),
        email: Yup.string().email(t('core.formValidatorMessages.email')).required(t('core.formValidatorMessages.required')),
        phone: Yup.string().required(t('core.formValidatorMessages.required')),
        password: Yup.string()
            .required(t('core.formValidatorMessages.required'))
            .min(8, t('core.formValidatorMessages.password')),
        passwordConfirm: Yup.string().required(t('core.formValidatorMessages.required'))
            .oneOf([Yup.ref('password'), ''], t('core.formValidatorMessages.passwordMatch'))


    });




    const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential as string);
        console.log('Google login success:', decoded);
        // Handle Google login (send to your backend or process user data)
    };
    const signInWithGoogle: any = useGoogleOneTapLogin({
        onSuccess: (response: CredentialResponse) => handleGoogleSuccess(response),
    });

    const signInWithFacebook: any = (values: RegisterFormValues, actions: any) => {

    };

    const signInWithEmail = (values: RegisterFormValues, actions: any) => {

    };


    const fields = [
        {
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            required: true,
            component: TextInput,
            fullWidth: true
        },
      
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            component: TextInput,
        },
        {
            name: 'phone',
            label: 'Phone',
            type: 'phone',
            required: true,
            component: PhoneNumberInput,
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
            required: true,
            component: PasswordInput,
        },
        {
            name: 'confirmPassword',
            label: 'Confirm Password',
            type: 'password',
            required: true,
            component: PasswordInput,
        },
        {
            name: 'acceptTerms',
            label: 'acceptTerms',
            type: 'checkbox',
            required: true,
            component: SimpleCheck,
        },

    ];



    return { signInWithGoogle, signInWithFacebook, signInWithEmail, validationSchema, initialValues, fields }
}

