'use client'

import * as Yup from 'yup';
import { useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { SxProps, Theme } from '@mui/material';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import TextInput from '@/components/common/forms/fields/TextInput';
import ColorPickerInput from '@/components/common/forms/fields/ColorPickerInput';
import UploadAvatar from '@/components/common/avatar/UploadAvatar';
import { useToast } from '@/hooks/useToast';
import moment from 'moment';

type FirestoreTimestamp = {
    seconds: number;
    nanoseconds: number;
};

export interface EntityFormValues {
    "uid": string
    "name": string
    "active": boolean
    "createAt": string
};

export interface BrandFormValues {
    "brandColor": string
};

export type TabItem = {
    label: string | ReactNode;
    icon?: ReactNode;
    content: ReactNode;
    disabled?: boolean;
    sx?: SxProps<Theme>;
};

export const useSettingEntityController = () => {
    const t = useTranslations();
    const { currentEntity } = useEntity();
    const { showToast } = useToast()
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [createAtDate, setCreateAtDate] = useState<string>("");
    const [initialValues, setInitialValues] = useState<EntityFormValues>({
        uid: currentEntity?.entity?.id as string | "",
        "name": currentEntity?.entity?.name as string | "",
        "createAt": "",
        "active": currentEntity?.entity?.active as boolean | true
    });

    const [initialBrandValues, setInitialBrandValues] = useState<BrandFormValues>({
        "brandColor": "#ffffff" as string,
    });

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t('core.formValidatorMessages.required')),
    });

    const brandValidationSchema = Yup.object().shape({
        brandColor: Yup.string(),
    });

    const fields = [
        {
            name: 'name',
            label: t('core.label.legalEntityName'),
            type: 'text',
            required: true,
            component: TextInput,
        },
        {
            name: 'createAt',
            label: t('core.label.createAt'),
            type: 'text',
            disabled: true,
            component: TextInput,
        },
    ];

    const fields2 = [
        {
            name: 'brandColor',
            label: t('core.label.color'),
            component: ColorPickerInput,
            required: true,
        },
    ];

    const onImageChangeAction = async (file: File | null) => {
        if (!file) return;

        setAvatarFile(file);
    };

    const setEntityDataAction = async (values: EntityFormValues) => {
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

    const changeBrandAction = async (values: BrandFormValues) => {
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

    const formatDate = async (
        timestamp: FirestoreTimestamp | Date,
    ) => {
        // Configurar el idioma
        const locale = t('locale');
        moment.locale(locale);

        let jsDate: Date;
        if (timestamp instanceof Date) {
            jsDate = timestamp;
        } else {
            jsDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1_000_000);
        }
        const format = locale === 'es' ? 'D [de] MMMM [de] YYYY' : 'MMMM D, YYYY';

        setCreateAtDate(moment(jsDate).format(format));
    };

    const formTabs1 = () => {
        return (
            <>
                <GenericForm<EntityFormValues>
                    column={2}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={setEntityDataAction}
                    fields={fields as FormField[]}
                    submitButtonText={t('core.button.submit')}
                    enableReinitialize

                />
            </>
        );
    }

    const formTabs2 = () => {
        return (
            <>
                <div style={{ paddingBottom: "20px" }}>
                    <UploadAvatar
                        initialImage={avatarSrc}
                        onImageChange={onImageChangeAction}
                        variant='rounded'
                        label={t("core.label.logo")}
                        size={150}
                    />
                </div>
                <GenericForm<BrandFormValues>
                    column={2}
                    initialValues={initialBrandValues}
                    validationSchema={brandValidationSchema}
                    onSubmit={changeBrandAction}
                    fields={fields2 as FormField[]}
                    submitButtonText={t('core.button.submit')}
                    enableReinitialize
                />
            </>
        );
    }

    const tabsRender: TabItem[] = [
        {
            label: `${t("entity.tabs.tab1.title")}`,
            content: formTabs1(),
        }, {
            label: `${t("entity.tabs.tab2.title")}`,
            content: formTabs2(),
        },
    ];

    useEffect(() => {
        if (currentEntity?.entity?.createdAt)
            formatDate(currentEntity.entity.createdAt);
    }, [currentEntity]);

    useEffect(() => {
        if (createAtDate !== "") {
            setInitialValues({
                uid: currentEntity?.entity?.id as string | "",
                "name": currentEntity?.entity?.name as string | "",
                "createAt": createAtDate as string,
                "active": currentEntity?.entity?.active as boolean | true
            })
        }
    }, [createAtDate]);


    return { validationSchema, initialValues, tabsRender }
}

