/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import PasswordInput from '@/components/common/forms/fields/PasswordInput';
import TextInput from '@/components/common/forms/fields/TextInput';
import { MAIN_ROUTE, GENERAL_ROUTE } from '@/config/routes';
import { emailRule, passwordRestrictionRule } from '@/config/yupRules';
import { CommonModalType } from '@/contexts/commonModalContext';
import IUserEntity from '@/domain/core/auth/IUserEntity';
import { useAppLocale } from '@/hooks/useAppLocale';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useLayout } from '@/hooks/useLayout';
import { useToast } from '@/hooks/useToast';
import { signInEmail, signInGoogle } from '@/services/core/account.service';
import { fetchUserEntities } from '@/services/core/entity.service';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useState } from 'react';
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
    const search = useSearchParams()
    const { openModal } = useCommonModal()
    const { currentLocale } = useAppLocale()

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
            const userAuth = await signInEmail(values.email, values.password, currentLocale)
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

    useEffect(() => {
        if (search.get('expiredToken'))
            openModal(CommonModalType.INFO)

    }, [search.get('expiredToken')])



    


    return { signInWithGoogle, signInWithEmail, validationSchema, initialValues, fields }
}

