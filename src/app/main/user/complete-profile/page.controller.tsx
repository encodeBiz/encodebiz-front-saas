/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import * as Yup from 'yup';
import { useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';
import { SxProps, Theme } from '@mui/material';
import TextInput from '@/components/common/forms/fields/TextInput';
import { useToast } from '@/hooks/useToast';
import { fetchUserAccount, signUpEmail } from '@/services/common/account.service';
import { emailRule, requiredRule } from '@/config/yupRules';
import { getUser } from '@/lib/firebase/authentication/login';
import { User } from 'firebase/auth';
import IUser from '@/domain/auth/IUser';
import { useEntity } from '@/hooks/useEntity';
import { useLayout } from '@/hooks/useLayout';
import { fetchUserEntities } from '@/services/common/entity.service';
import { useRouter } from 'nextjs-toploader/app';
import { MAIN_ROUTE, GENERAL_ROUTE } from '@/config/routes';
import IUserEntity from '@/domain/auth/IUserEntity';
export interface UserFormValues {
    "uid": string
    "name": string
    "email": string
    "phone": string
    "active": boolean
    legalEntityName: string
    "avatar": any
};

export type TabItem = {
    label: string | ReactNode;
    icon?: ReactNode;
    content: ReactNode;
    disabled?: boolean;
    sx?: SxProps<Theme>;
};

export const useUserProfileController = () => {
    const t = useTranslations();
    const { user, setUser, updateUserData } = useAuth();
    const { refrestList } = useEntity();
    const { changeLoaderState } = useLayout()
    const { showToast } = useToast()
    const [pending, setPending] = useState(false)
    const { push } = useRouter()
    const [initialValues, setInitialValues] = useState<UserFormValues>({
        uid: user?.uid as string | "",
        "name": user?.displayName as string | "",
        "email": user?.email as string | "",
        "phone": user?.phoneNumber as string | "",
        avatar: user?.photoURL as string | null,
        legalEntityName: '',
        "active": true,
    });



    const validationSchema = Yup.object().shape({
        email: emailRule(t),
        name: requiredRule(t),
        legalEntityName: requiredRule(t),
        phone: Yup.string().optional(),

    });


    const fields = [

        {
            name: 'name',
            label: t('core.label.firstName'),
            type: 'text',
            required: true,
            component: TextInput,
        },
        {
            name: 'email',
            label: t('core.label.email'),
            type: 'email',
            required: true,
            disabled: true,
            component: TextInput,
        },
        {
            name: 'phone',
            label: t('core.label.phone'),
            type: 'text',
            required: true,
            component: TextInput,
        },



    ];



    const setUserDataAction = async (values: UserFormValues) => {
        try {

            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            setPending(true)

            const sessionToken = await user?.accessToken;
            if (!user) {
                showToast('Error to fetch user auth token', 'error')
            } else {
                await signUpEmail({
                    fullName: values.name as string,
                    acceptTerms: true,
                    email: values.email as string,
                    password: '123hg3j4h5gj3h4g5j',
                    passwordConfirm: '123hg3j4h5gj3h4g5j',
                    phone: values.phone as string ?? '',
                }, sessionToken, user?.uid)
                
                setUser({
                    ...user as any,
                    ...await getUser() as User
                })

                refrestList(user?.uid)
                updateUserData()
                changeLoaderState({ show: false })
               
                goEntity()

            }

            showToast(t('core.feedback.success'), 'success');
            setPending(false)
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
            setPending(false)
            changeLoaderState({ show: false })
        }
    };

    const goEntity = async () => {
        const entityList: Array<IUserEntity> = await fetchUserEntities(user?.uid as string)
        if (entityList.length > 0) {
            const item = entityList[0]
            push(`/${MAIN_ROUTE}/${item?.entity?.id}/dashboard`)
        } else {
            push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity/create`)
        }
    }


    const checkProfile = async () => {
        try {
            const userData: IUser = await fetchUserAccount(user?.uid as string)
            if (userData.email && userData.fullName !== 'Guest') goEntity()
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
        }
    }

    useEffect(() => {
        if (user?.id) {
            checkProfile()
            setInitialValues({
                uid: user?.uid as string | "",
                "name": user?.displayName !== 'Guest' ? user?.displayName as string : "",
                "email": user?.email as string | "",
                "phone": user?.phoneNumber as string | "",
                avatar: user?.photoURL as string | "",
                legalEntityName: '',
                "active": true,
            });
        }
    }, [user?.id]);

    return { validationSchema, initialValues, setUserDataAction, pending, fields }
}

