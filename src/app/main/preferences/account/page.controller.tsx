'use client'

import { useTranslations } from 'next-intl';
import { useState, ReactNode, useEffect } from 'react';
import * as Yup from 'yup';
import { useAuth } from '@/hooks/useAuth';
import { SxProps, Theme } from '@mui/material';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import TextInput from '@/components/common/forms/fields/TextInput';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

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
    const t = useTranslations()
    const { user } = useAuth();
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    const [initialValues, setInitialValues] = useState<UserFormValues>({
        uid: user?.uid as string | "",
        "name": user?.displayName as string | "",
        "email": user?.email as string | "",
        "phone": user?.phoneNumber as string | "",
        "lastlogin": user?.metadata.lastSignInTime as string | "",
        "active": true,
    })
    const [newPasswordValues] = useState<PasswordFormValues>({
        "newpass": "" as string,
        "passcheck": "" as string
    })

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

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validación: Tipo de archivo debe ser imagen
        if (!file.type.startsWith('image/')) {
            const errorMessage = t(`core.formValidatorMessages.avatarUpload`);
            setError(errorMessage);
            //if (onError) onError(errorMessage);
            return;
        }

        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSizeInBytes) {
            const errorMessage = t(`core.formValidatorMessages.avatarMaxSize`);
            setError(errorMessage);
            //if (onError) onError(errorMessage);
            return;
        }

        // Si pasa las validaciones:
        setError(null);

        const reader = new FileReader();
        reader.onload = () => {
            setAvatarSrc(reader.result as string);
            //if (onImageChange) onImageChange(file);
        };
        reader.readAsDataURL(file);
    };

    const formTabs1 = () => {
        return (
            <>
                <div style={{ paddingBottom: "20px" }}>
                    <ButtonBase
                        component="label"
                        role={undefined}
                        tabIndex={-1} // prevent label from tab focus
                        aria-label="Avatar image"
                        sx={{
                            borderRadius: '40px',
                            '&:has(:focus-visible)': {
                                outline: '2px solid',
                                outlineOffset: '2px',
                            },
                        }}
                    >
                        <Avatar
                            alt="new avatar"
                            src={avatarSrc}
                            sx={{ width: 100, height: 100, border: 1, borderColor: "lightgrey" }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            style={{
                                border: 1,
                                clip: 'rect(0 0 0 0)',
                                height: '1px',
                                margin: '-1px',
                                overflow: 'hidden',
                                padding: 0,
                                position: 'absolute',
                                whiteSpace: 'nowrap',
                                width: '1px',
                            }}
                            onChange={handleAvatarChange}
                        />
                    </ButtonBase>
                    {error && (
                        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                            {error}
                        </Typography>
                    )}
                </div>
                <GenericForm<UserFormValues>
                    column={2}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={() => { console.log(`Sending account form...`) }}
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
                onSubmit={() => { console.log(`Sending new Password form...`) }}
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

