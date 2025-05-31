'use client'

import PasswordInput from '@/components/common/forms/fields/PasswordInput';
import PhoneNumberInput from '@/components/common/forms/fields/PhoneNumberInput';
import SelectInput from '@/components/common/forms/fields/SelectField';
import SimpleCheck from '@/components/common/forms/fields/SimpleCheck';
import TextInput from '@/components/common/forms/fields/TextInput';
import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useState } from 'react';
import * as Yup from 'yup';


export interface RegisterFormValues {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
};

export const useRegisterController = () => {
    const [initialValues, setInitialValues] = useState<RegisterFormValues>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    })

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        role: Yup.string().required('Role is required'),
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
            name: 'firstName',
            label: 'First Name',
            type: 'text',
            required: true,
            component: TextInput,
            fullWidth: true
        },
        {
            name: 'lastName',
            label: 'Last Name',
            type: 'text',
            required: true,
            component: TextInput,
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

