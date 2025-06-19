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
export interface UserFormValues {
    "uid": string
    "name": string
    "email": string
    "phone": string
    "active": boolean
    "lastlogin": string
};

export interface PasswordFormValues {
    "newpass": string
    "passcheck": string
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
    const { user } = useAuth();
    const { showToast } = useToast()
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [initialValues, setInitialValues] = useState<UserFormValues>({
        uid: user?.uid as string | "",
        "name": user?.displayName as string | "",
        "email": user?.email as string | "",
        "phone": user?.phoneNumber as string | "",
        "lastlogin": user?.metadata.lastSignInTime as string | "",
        "active": true,
    });

    const [newPasswordValues] = useState<PasswordFormValues>({
        "newpass": "" as string,
        "passcheck": "" as string
    });

    const validationSchema = Yup.object().shape({
        email: Yup.string().email(t('core.formValidatorMessages.email')).required(t('core.formValidatorMessages.required')),
        name: Yup.string().required(t('core.formValidatorMessages.required')),
        phone: Yup.string().required(t('core.formValidatorMessages.required')),
    });

    const passwordValidationSchema = Yup.object().shape({
        newpass: Yup.string().required(t('core.formValidatorMessages.required')),
        passcheck: Yup.string().required(t('core.formValidatorMessages.required')),
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
            name: 'lastlogin',
            label: t('account.sessionLastTime'),
            type: 'text',
            required: true,
            disabled: true,
            component: TextInput,
        },
    ];

    const fields2 = [
        {
            name: 'newpass',
            label: t('core.label.password'),
            type: 'password',
            required: true,
            component: TextInput,
        },
        {
            name: 'passcheck',
            label: t('core.label.passwordConfirm'),
            type: 'password',
            required: true,
            component: TextInput,
        },
    ];

    const onImageChangeAction = async (file: File | null) => {
        if (!file) return;

        setAvatarFile(file);
    };

    const setUserDataAction = async (values: UserFormValues) => {
        try {
            console.log("values>>>", values);
            console.log("avatarFile>>>", avatarFile);
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
        }
    };

    const changePasswordAction = async (values: PasswordFormValues) => {
        try {
            console.log("values>>>", values);
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
        }
    };

    const formTabs1 = () => {
        return (
            <>
                <div style={{ paddingBottom: "20px" }}>
                    <UploadAvatar
                        initialImage={avatarSrc}
                        onImageChange={onImageChangeAction}
                    />
                </div>
                <GenericForm<UserFormValues>
                    column={2}
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
                column={2}
                initialValues={newPasswordValues}
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
            "lastlogin": user?.metadata.lastSignInTime as string | "",
            "active": true,
        });
        setAvatarSrc(user?.photoURL as string | "");
    }, [user]);

    return { validationSchema, initialValues, tabsRender }
}

