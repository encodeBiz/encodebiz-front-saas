'use client'

import PasswordInput from '@/components/common/forms/fields/PasswordInput';
import TextInput from '@/components/common/forms/fields/TextInput';
import { MAIN_ROUTE, GENERAL_ROUTE } from '@/config/routes';
import { emailRule, passwordRestrictionRule } from '@/config/yupRules';
import IUserEntity from '@/domain/auth/IUserEntity';
import { useLayout } from '@/hooks/useLayout';
import { useToast } from '@/hooks/useToast';
import { signInEmail, signInGoogle } from '@/services/common/account.service';
import { fetchUserEntities } from '@/services/common/entity.service';
import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';
import { useState } from 'react';
import * as Yup from 'yup';


export interface LoginFormValues {
    email: string
    password: string
};

export const useRegisterController = () => {
    const t = useTranslations()
    const { showToast } = useToast()
    const { changeLoaderState } = useLayout()
    const { push } = useRouter()
    const [initialValues] = useState<LoginFormValues>({
        email: '',
        password: '',

    })

    const validationSchema = Yup.object().shape({
        email: emailRule(t),
        password: passwordRestrictionRule(t),

    });

    const signInWithGoogle = async () => {
        try {
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            await signInGoogle()
            changeLoaderState({ show: false })
        } catch (error: any) {
            changeLoaderState({ show: false })
            showToast(error.message, 'error')
        }
    };


    const signInWithEmail = async (values: LoginFormValues) => {
        try {
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            const userAuth = await signInEmail(values.email, values.password)
            goEntity(userAuth?.user.uid)
            changeLoaderState({ show: false })
        } catch (error: any) {
            changeLoaderState({ show: false })
            showToast(error.message, 'error')
        }
    };

    const goEntity = async (uid: string) => {
        const entityList: Array<IUserEntity> = await fetchUserEntities(uid as string)
        if (entityList.length > 0) {
            const item = entityList.find(e => e.isActive) ?? entityList[0]
            push(`/${MAIN_ROUTE}/${item?.entity?.id}/dashboard`)
        } else {
            push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity/create`)
        }
    }

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



    return { signInWithGoogle, signInWithEmail, validationSchema, initialValues, fields }
}

