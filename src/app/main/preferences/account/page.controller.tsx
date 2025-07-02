'use client'
import * as Yup from 'yup';
import { useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';
import { SxProps, Theme } from '@mui/material';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import TextInput from '@/components/common/forms/fields/TextInput';
import UploadAvatar from '@/components/common/avatar/UploadAvatar';
import { useToast } from '@/hooks/useToast';
import { changePassword, fetchUserAccount, reAuth, updateAccout } from '@/services/common/account.service';
import ImageUploadInput from '@/components/common/forms/fields/ImageUploadInput';
import { uploadFile } from '@/lib/firebase/storage/fileManager';
import { emailRule, fileImageRule, passwordRestrictionRule, requiredRule } from '@/config/yupRules';
import { getUser } from '@/lib/firebase/authentication/login';
import { User } from 'firebase/auth';
import { useLayout } from '@/hooks/useLayout';
export interface UserFormValues {
    "uid": string
    "name": string
    "email": string
    "phone": string
    "active": boolean
    "avatar": any

};

export interface PasswordFormValues {
    "password": string
    "passwordConfirm": string
    "currentPassword": string
};

export type TabItem = {
    label: string | ReactNode;
    icon?: ReactNode;
    content: ReactNode;
    disabled?: boolean;
    sx?: SxProps<Theme>;
};

export const useUserAccountController = () => {
    const t = useTranslations();
    const { user, setUser } = useAuth();
    const { showToast } = useToast()
    const [pending, setPending] = useState(false)
    const { changeLoaderState } = useLayout()


    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [initialValues, setInitialValues] = useState<UserFormValues>({
        uid: user?.uid as string | "",
        "name": user?.displayName as string | "",
        "email": user?.email as string | "",
        "phone": user?.phoneNumber as string | "",
        avatar: user?.photoURL as string | "",
        "active": true,
    });

    const [passwordwordValues, setPasswordwordValues] = useState<PasswordFormValues>({
        "password": "" as string,
        "passwordConfirm": "" as string,
        currentPassword: "" as string
    });

    const validationSchema = Yup.object().shape({
        email: emailRule(t),
        name: requiredRule(t),
        phone: Yup.string().optional(),
        avatar: fileImageRule(t)

    });

    const passwordValidationSchema = Yup.object().shape({
        currentPassword: requiredRule(t),
        password: passwordRestrictionRule(t),
        passwordConfirm: requiredRule(t).oneOf([Yup.ref('password'), ''], t('core.formValidatorMessages.passwordMatch'))

    });

    const fields = [
        {
            name: 'avatar',
            label: t('core.label.logo'),
            component: ImageUploadInput,

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
            component: TextInput,
        },
        {
            name: 'phone',
            label: t('core.label.phone'),
            type: 'text',
            required: true,
            component: TextInput,
        }
    ];

    const fields2 = [
        {
            name: 'currentPassword',
            label: t('core.label.currentPassword'),
            type: 'password',
            required: true,
            component: TextInput,
        },
        {
            name: 'password',
            label: t('core.label.password'),
            type: 'password',
            required: true,
            component: TextInput,
        },
        {
            name: 'passwordConfirm',
            label: t('core.label.passwordConfirm'),
            type: 'password',
            required: true,
            component: TextInput,
        },
    ];


    const setUserDataAction = async (values: UserFormValues) => {
        try {
            let uri

            setPending(true)
            if (typeof values.avatar === 'object') {
                uri = await uploadFile(values.avatar, `user-avatar/${values.avatar}`, () => { })
            } else {
                uri = values.avatar
            }
            ({ show: true, args: { text: t('core.title.loaderAction') } })
            await updateAccout(uri, values.name)
            setUser({
                ...user as any,
                ...await getUser() as User
            })

            showToast(t('core.feedback.success'), 'success');
            setPending(false)
             changeLoaderState({ show: false })
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

    const changePasswordAction = async (values: PasswordFormValues) => {
        try {
            setPending(true)
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            await reAuth(values.currentPassword)
            await changePassword(values.password)
            setPending(false)
            showToast(t('core.feedback.success'), 'success');
            setPasswordwordValues({
                "password": "" as string,
                "passwordConfirm": "" as string,
                currentPassword: "" as string
            })
            changeLoaderState({ show: false })
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

    const formTabs1 = () => {
        return (
            <>

                <GenericForm<UserFormValues>
                    column={1}
                    enableReinitialize
                    disabled={!user?.id || pending}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={setUserDataAction}
                    fields={fields as FormField[]}
                    submitButtonText={t('core.button.submit')}

                />
            </>
        );
    }

    const formTabs2 = () => {
        return (

            <GenericForm<PasswordFormValues>
                column={1}
                enableReinitialize
                disabled={!user?.id || pending}
                initialValues={passwordwordValues}
                validationSchema={passwordValidationSchema}
                onSubmit={changePasswordAction}
                fields={fields2 as FormField[]}
                submitButtonText={t('core.button.submit')}

            />
        );
    }

    const tabsRender: TabItem[] = [
        {
            label: `${t("account.tabs.tab1.title")}`,
            content: formTabs1(),
        }, {
            label: `${t("account.tabs.tab2.title")}`,
            content: formTabs2(),
        },
    ];

    useEffect(() => {
        setInitialValues({
            uid: user?.uid as string | "",
            "name": user?.displayName as string | "",
            "email": user?.email as string | "",
            "phone": user?.phoneNumber as string | "",
            avatar: user?.photoURL as string | "",
            "active": true,
        });
        setAvatarSrc(user?.photoURL as string | "");
    }, [user]);

    return { validationSchema, initialValues, tabsRender }
}

