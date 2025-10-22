'use client'
import * as Yup from 'yup';
import { useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import TextInput from '@/components/common/forms/fields/TextInput';
import { useToast } from '@/hooks/useToast';
import { recoveryPassword, updateAccout } from '@/services/core/account.service';
import ImageUploadInput from '@/components/common/forms/fields/ImageUploadInput';
import { uploadFile } from '@/lib/firebase/storage/fileManager';
import { emailRule, fileImageRule, requiredRule } from '@/config/yupRules';
import { useLayout } from '@/hooks/useLayout';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import PhoneNumberInput from '@/components/common/forms/fields/PhoneNumberInput';
import { useAppLocale } from '@/hooks/useAppLocale';
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
    id?: string
};

export const useUserAccountController = () => {
    const t = useTranslations();
    const { user, updateUserData } = useAuth();
    const { showToast } = useToast()
    const [pending, setPending] = useState(false)
    const { changeLoaderState } = useLayout()
    const { openModal } = useCommonModal()
    const [initialValues, setInitialValues] = useState<UserFormValues>({
        uid: user?.uid as string | "",
        "name": user?.displayName as string | "",
        "email": user?.email as string | "",
        "phone": user?.phoneNumber as string | "",
        avatar: user?.photoURL as string | "",
        "active": true,
    });
    const { currentLocale } = useAppLocale()

    const changePasswrod = async () => {
        changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
        await recoveryPassword(user?.email as string,currentLocale)
        changeLoaderState({ show: false })
        openModal(CommonModalType.INFO,{id:'recovery'})
    }

    const validationSchema = Yup.object().shape({
        email: emailRule(t),
        name: requiredRule(t),
        phone: Yup.string().optional(),
        avatar: fileImageRule(t)

    });



    const fields = [
        {
            name: 'avatar',
            label: t('core.label.avatar'),
            type: 'logo',
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
            component: PhoneNumberInput,
        }
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
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            await updateAccout(uri, values.phone, values.name, currentLocale)
            updateUserData()

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
                    submitButtonText={t('core.button.save')}

                />
            </>
        );
    }

    const formTabs2 = () => {
        return (
            <Box px={5} pb={5} display={'flex'} justifyContent={'flex-start'} alignItems={'flex-start'} flexDirection={'column'} width={'100%'}>
                <Typography variant="h4" component="h1" align="left" sx={{ textAlign: 'left' }} >
                    {t('account.tabs.tab2.title')}
                </Typography>
                <Typography variant="subtitle1" align="left" color="text.secondary" sx={{ mb: 4, textAlign: 'left' }}>
                    {t('account.tabs.tab2.text')}
                </Typography>
                <Box px={5} pb={5} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} width={'100%'}>

                    <SassButton sx={{
                        width: {
                            xs: '90%',
                            sm: '90%',
                            md: '90%',
                            lg: 610,
                            xl: 610
                        }
                    }} variant='contained' color='primary' onClick={changePasswrod}>{t('account.tabs.tab2.title')}</SassButton>
                </Box>
            </Box>

        );
    }

    const tabsRender: TabItem[] = [
        {
            label: `${t("account.tabs.tab1.title")}`,
            content: formTabs1(),
            id: 'account'
        }, {
            label: `${t("account.tabs.tab2.title")}`,
            content: formTabs2(),
            id: 'password'
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

    }, [user]);

    return { validationSchema, initialValues, tabsRender }
}

