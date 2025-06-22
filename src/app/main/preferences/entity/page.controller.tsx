'use client'

import * as Yup from 'yup';
import { useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { Box, SxProps, Theme } from '@mui/material';
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
import { deleteEntity, updateEntity, updateEntityBranding } from '@/services/common/entity.service';
import ImageUploadInput from '@/components/common/forms/fields/ImageUploadInput';
import { BaseButton } from '@/components/common/buttons/BaseButton';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import ConfirmModal from '@/components/common/modals/ConfirmModal';



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
    "backgroundColor": string
    "labelColor": string
    "textColor": string
    logoUrl: File | string,
    stripImageUrl: File | string,
    iconUrl: File | string,
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
    const { openModal, closeModal } = useCommonModal()
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


    const [initialBrandValues, setInitialBrandValues] = useState<BrandFormValues>({
        "backgroundColor": "#417505" as string,
        "labelColor": "#b62929" as string,
        "textColor": "#4a90e2" as string,
        logoUrl: '',
        stripImageUrl: '',
        iconUrl: '',
    });

    const brandValidationSchema = Yup.object().shape({
        backgroundColor: Yup.string().required(t('core.formValidatorMessages.required')),
        labelColor: Yup.string().required(t('core.formValidatorMessages.required')),
        textColor: Yup.string().required(t('core.formValidatorMessages.required')),
        logoUrl: Yup.mixed()
            .required('An image is required')
            .test('fileSize', t('core.formValidatorMessages.avatarMaxSize'), (value: any) => {

                if (!value) return true; // if no file, let required handle it
                return value.size <= 5000000; // 5MB
            })
            .test('fileType', t('core.formValidatorMessages.avatarUpload'), (value: any) => {
                if (!value) return true; // if no file, let required handle it
                return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
            }),
        stripImageUrl: Yup.mixed()
            .required('An image is required')
            .test('fileSize', t('core.formValidatorMessages.avatarMaxSize'), (value: any) => {
                if (!value) return true; // if no file, let required handle it
                return value.size <= 5000000; // 5MB
            })
            .test('fileType', t('core.formValidatorMessages.avatarUpload'), (value: any) => {
                if (!value) return true; // if no file, let required handle it
                return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
            }),
        iconUrl: Yup.mixed()
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

    const fields2 = [


        {
            name: 'backgroundColor',
            label: t('core.label.backgroundColor'),
            component: ColorPickerInput,
            required: true,
        },
        {
            name: 'labelColor',
            label: t('core.label.labelColor'),
            component: ColorPickerInput,
            required: true,
        },
        {
            name: 'textColor',
            label: t('core.label.textColor'),
            component: ColorPickerInput,
            required: true,
        },
        {
            name: 'logoUrl',
            label: t('core.label.logo'),
            component: ImageUploadInput,
            required: true,
        },
        {
            name: 'stripImageUrl',
            label: t('core.label.stripImageUrl'),
            component: ImageUploadInput,
            required: true,
        },
        {
            name: 'iconUrl',
            label: t('core.label.iconUrl'),
            component: ImageUploadInput,
            required: true,
        },
    ];



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

            const form = new FormData();
            form.append('entityId', currentEntity?.entity.id as string);
            form.append('backgroundColor', values.backgroundColor);
            form.append('labelColor', values.labelColor);
            form.append('textColor', values.textColor);
            form.append('logo', values.logoUrl);
            form.append('icon', values.iconUrl);
            form.append('stripImage', values.stripImageUrl);
            const updateData = {
                entityId: currentEntity?.entity.id,
                backgroundColor: values.backgroundColor,
                labelColor: values.labelColor,
                textColor: values.textColor,
                files: {
                    logo: values.logoUrl,
                    icon: values.iconUrl,
                    stripImage: values.stripImageUrl,
                }
            }
            await updateEntityBranding(form, token)
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


    const handleDeleteEntity = async (entityId: string) => {
        setPending(true)
        try {
            await deleteEntity({
                uid: user?.id as string,
                entityId: entityId
            }, token)
            refrestList(user?.id as string)
            showToast(t('core.feedback.success'), 'success');
            setPending(false)
            closeModal(CommonModalType.DELETE)
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
        }
    }


    const formTabs1 = () => {
        return (
            <>
                <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' sx={{ width: '100%' }}>
                    <BaseButton onClick={() => openModal(CommonModalType.DELETE, { entityId: currentEntity?.entity.id })} variant='contained' color='warning' >Eliminar entidad</BaseButton>
                </Box>
                <GenericForm<EntityUpdatedFormValues>
                    column={2}

                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={setEntityDataAction}
                    fields={fields as FormField[]}
                    submitButtonText={t('core.button.save')}
                    enableReinitialize

                />
                <ConfirmModal
                    codeValidator
                    isLoading={pending}
                    word={createSlug(currentEntity?.entity.name as string ?? '')}
                    title={t('entity.tabs.tab1.deleteConfirmModalTitle')}
                    description={t('entity.tabs.tab1.deleteConfirmModalTitle2')}
                    label={t('entity.tabs.tab1.deleteConfirmModalTitle2')}
                    onOKAction={(args: { entityId: string }) => handleDeleteEntity(args.entityId)}
                />
            </>
        );
    }

    const formTabs2 = () => {
        return (
            <>

                <GenericForm<BrandFormValues>
                    column={3}
                    initialValues={initialBrandValues}
                    validationSchema={brandValidationSchema}
                    onSubmit={changeBrandAction}
                    fields={fields2 as FormField[]}
                    submitButtonText={t('core.button.save')}
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

