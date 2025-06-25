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
import { changePassword, reAuth, updateAccout } from '@/services/common/account.service';
import ImageUploadInput from '@/components/common/forms/fields/ImageUploadInput';
import { uploadFile } from '@/lib/firebase/storage/fileManager';
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
    const { user } = useAuth();
    const { showToast } = useToast()
    const [pending, setPending] = useState(false)



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
        email: Yup.string().email(t('core.formValidatorMessages.email')).required(t('core.formValidatorMessages.required')),
        name: Yup.string().required(t('core.formValidatorMessages.required')),
        phone: Yup.string().required(t('core.formValidatorMessages.required')),
        avatar: Yup.mixed()
            .required('An image is required')
            .test('fileSize', t('core.formValidatorMessages.avatarMaxSize'), (value: any) => {

                if (!value) return true; // if no file, let required handle it
                return value.size <= 5000000; // 5MB
            })
            .test('fileType', t('core.formValidatorMessages.avatarUpload'), (value: any) => {
                if (!value) return true; // if no file, let required handle it
                return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
            }),
    });

    const passwordValidationSchema = Yup.object().shape({
        currentPassword: Yup.string().required(t('core.formValidatorMessages.required')),
        password: Yup.string()
            .required(t('core.formValidatorMessages.required'))
            .min(8, t('core.formValidatorMessages.password')),
        passwordConfirm: Yup.string().required(t('core.formValidatorMessages.required'))
            .oneOf([Yup.ref('password'), ''], t('core.formValidatorMessages.passwordMatch'))

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
            await updateAccout(uri, values.name)
             showToast(t('core.feedback.success'), 'success');
            setPending(false)
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
            setPending(false)
        }
    };

    const changePasswordAction = async (values: PasswordFormValues) => {
        try {
            setPending(true)
            await reAuth(values.currentPassword)
            await changePassword(values.password)
            setPending(false)
            showToast(t('core.feedback.success'), 'success');
            setPasswordwordValues({
                "password": "" as string,
                "passwordConfirm": "" as string,
                currentPassword: "" as string
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
            setPending(false)
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

