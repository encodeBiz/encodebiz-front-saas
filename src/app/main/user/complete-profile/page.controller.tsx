'use client'
import * as Yup from 'yup';
import { useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';
import { SxProps, Theme } from '@mui/material';
import TextInput from '@/components/common/forms/fields/TextInput';
import { useToast } from '@/hooks/useToast';
import { fetchUserAccount, signUpEmail, updateAccout } from '@/services/common/account.service';
import ImageUploadInput from '@/components/common/forms/fields/ImageUploadInput';
import { uploadFile } from '@/lib/firebase/storage/fileManager';
import { emailRule, fileImageRule, requiredRule } from '@/config/yupRules';
import { getUser } from '@/lib/firebase/authentication/login';
import { getIdToken, User } from 'firebase/auth';
import IUser from '@/domain/auth/IUser';
import { useRouter } from 'nextjs-toploader/app';
import { useEntity } from '@/hooks/useEntity';
import { useLayout } from '@/hooks/useLayout';
import { MAIN_ROUTE, GENERAL_ROUTE } from '@/config/routes';
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
        avatar: fileImageRule(t)
    });


    const fields = [
        {
            name: 'avatar',
            label: t('core.label.logo'),
            component: ImageUploadInput,
            type:'custom',
            required: true,
        },
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
            disabled:true,
            component: TextInput,
        },
        {
            name: 'phone',
            label: t('core.label.phone'),
            type: 'text',
            required: true,
            component: TextInput,
        },


        {
            name: 'legalEntityName',
            label: t('core.label.legalEntityName'),
            type: 'text',
            required: true,
            component: TextInput,
        },
    ];



    const setUserDataAction = async (values: UserFormValues) => {
        try {
            let uri
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })

            setPending(true)
            if (typeof values.avatar === 'object') {
                uri = await uploadFile(values.avatar, `user-avatar/${values.avatar}`, () => { })
            } else {
                uri = values.avatar
            }

            const sessionToken = await user?.accessToken;
            if (!user) {
                showToast('Error to fetch user auth token', 'error')
            } else {
                await signUpEmail({
                    fullName: values.name as string,
                    acceptTerms: true,
                    email: values.email as string,
                    legalEntityName: values.legalEntityName,
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



    const checkProfile = async () => {
        const userData: IUser = await fetchUserAccount(user?.uid as string)
        if (userData.email) push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/dashboard`)
    }

    useEffect(() => {
        checkProfile()
        setInitialValues({
            uid: user?.uid as string | "",
            "name": user?.displayName as string | "",
            "email": user?.email as string | "",
            "phone": user?.phoneNumber as string | "",
            avatar: user?.photoURL as string | "",
            legalEntityName: '',
            "active": true,
        });



    }, [user]);

    return { validationSchema, initialValues, setUserDataAction, pending, fields }
}

