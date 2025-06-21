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
import SelectInput from '@/components/common/forms/fields/SelectInput';
import { country } from '@/config/country';
import { formatDate } from '@/lib/common/Date';
import { createSlug } from '@/lib/common/String';
import { updateEntity } from '@/services/common/entity.service';



export interface EntityUpdatedFormValues {
    "uid": string
    "name": string
    "active": boolean
    "street": string
    "country": string
    "city": string
    "postalCode": string
    //"region": string
    "taxId": string
    legalName: string
    billingEmail: string
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
    const { currentEntity, refrestList } = useEntity();
    const { user, token } = useAuth();
    const { showToast } = useToast()
    const [pending, setPending] = useState(false)
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [cityList, setCityList] = useState<any>([])
    const [initialValues, setInitialValues] = useState<EntityUpdatedFormValues>({
        uid: currentEntity?.entity?.id as string | "",
        "name": currentEntity?.entity?.name as string | "",
        "active": currentEntity?.entity?.active as boolean | true,
        "street": currentEntity?.entity?.legal?.address.street as string | "",
        "country": currentEntity?.entity?.legal?.address.country as string | "",
        "city": currentEntity?.entity?.legal?.address.city as string | "",
        "postalCode": currentEntity?.entity?.legal?.address.postalCode as string | "",
        //"region": currentEntity?.entity?.legal?.address.region as string | "",
        "taxId": currentEntity?.entity?.legal?.taxId as string | "",
        "legalName": currentEntity?.entity?.legal?.legalName as string | "",
        billingEmail: currentEntity?.entity?.billingEmail as string | ""
    });

    const [initialBrandValues, setInitialBrandValues] = useState<BrandFormValues>({
        "brandColor": "#ffffff" as string,
    });

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t('core.formValidatorMessages.required')),
        street: Yup.string().required(t('core.formValidatorMessages.required')),
        country: Yup.string().required(t('core.formValidatorMessages.required')),
        city: Yup.string().required(t('core.formValidatorMessages.required')),
        postalCode: Yup.string().required(t('core.formValidatorMessages.required')),
        //region: Yup.string().required(t('core.formValidatorMessages.required')),
        taxId: Yup.string().required(t('core.formValidatorMessages.required')),
        legalName: Yup.string().required(t('core.formValidatorMessages.required')),

    });

    const brandValidationSchema = Yup.object().shape({
        brandColor: Yup.string(),
    });

    const fields = [
        {
            name: 'name',
            label: t('core.label.name'),
            type: 'text',
            required: true,
            fullWidth: true,
            component: TextInput,
        },

        {
            isDivider: true,
            label: t('core.label.legal'),
        },
        {
            name: 'legalName',
            label: t('core.label.legalEntityName'),
            type: 'text',
            required: true,
            fullWidth: true,
            component: TextInput,
        },
        {
            name: 'billingEmail',
            label: t('core.label.billingEmail'),
            type: 'email',
            component: TextInput,
        },
        {
            name: 'taxId',
            label: t('core.label.taxId'),
            type: 'text',
            component: TextInput,
        },
        {
            isDivider: true,
            label: t('core.label.address'),
        },
        {
            name: 'street',
            label: t('core.label.street'),
            type: 'textarea',
            fullWidth: true,
            component: TextInput,
        },
        {
            name: 'country',
            label: t('core.label.country'),
            onChange: (event: any) => {
                setCityList(country.find(e => e.name === event)?.states?.map(e => ({ label: e.name, value: e.name })) ?? [])
            },
            component: SelectInput,
            options: country.map(e => ({ label: e.name, value: e.name }))
        },
        {
            name: 'city',
            label: t('core.label.city'),
            component: SelectInput,
            options: cityList
        },
        /*
        {
            name: 'region',
            label: t('core.label.region'),
            component: TextInput,
            options: cityList
        },
        */
        {
            name: 'postalCode',
            label: t('core.label.postalCode'),
            component: TextInput,
            fullWidth: true,
            options: cityList
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

    const setEntityDataAction = async (values: EntityUpdatedFormValues) => {
        try {
            setPending(true)
            const updateData = {
                "id": currentEntity?.entity?.id,
                "name": values.name,
                "slug": createSlug(values.name),
                "billingEmail": values.billingEmail,
                "legal": {
                    "legalName": values.legalName,
                    "taxId": values.taxId,
                    "address": {
                        "street": values.street,
                        "city": values.city,
                        "postalCode": values.postalCode,
                        "country": values.country,

                    }
                },
                "active": true
            }
            await updateEntity(updateData, token)
            refrestList(user?.id as string)
            showToast(t('core.feedback.success'), 'success');
            setPending(false)

        } catch (error: any) {

            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
            setPending(false)
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

    useEffect(() => {

        setInitialValues({
            uid: currentEntity?.entity?.id as string | "",
            "name": currentEntity?.entity?.name as string | "",
            "active": currentEntity?.entity?.active as boolean | true,
            "street": currentEntity?.entity?.legal?.address.street as string | "",
            "country": currentEntity?.entity?.legal?.address.country as string | "",
            "city": currentEntity?.entity?.legal?.address.city as string | "",
            "postalCode": currentEntity?.entity?.legal?.address.postalCode as string | "",
            "taxId": currentEntity?.entity?.legal?.taxId as string | "",
            "legalName": currentEntity?.entity?.legal?.legalName as string | "",
            billingEmail: currentEntity?.entity?.billingEmail as string | ""
        })
        setCityList(country.find(e => e.name === currentEntity?.entity?.legal?.address.country)?.states?.map(e => ({ label: e.name, value: e.name })) ?? [])

    }, [currentEntity])




    const formTabs1 = () => {
        return (
            <>
                <GenericForm<EntityUpdatedFormValues>
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
            formatDate(currentEntity.entity.createdAt, t('locale'));
    }, [currentEntity]);




    return { validationSchema, initialValues, tabsRender }
}

