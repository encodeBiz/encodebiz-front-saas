'use client'

import * as Yup from 'yup';
import { useState, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { SxProps, Theme } from '@mui/material';
import ColorPickerInput from '@/components/common/forms/fields/ColorPickerInput';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/common/Date';
import { updateEntityBranding } from '@/services/common/entity.service';
import ImageUploadInput from '@/components/common/forms/fields/ImageUploadInput';
import { requiredRule } from '@/config/yupRules';
import { useLayout } from '@/hooks/useLayout';
import SelectInput from '@/components/common/forms/fields/SelectInput';



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
    icon2Url: File | string,
    language: string

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

    const { changeLoaderState } = useLayout()
    const { user, token } = useAuth();
    const { showToast } = useToast()
    const [pending, setPending] = useState(false)

    const [initialBrandValues, setInitialBrandValues] = useState<BrandFormValues>({
        "backgroundColor": "#417505" as string,
        "labelColor": "#b62929" as string,
        "textColor": "#4a90e2" as string,
        logoUrl: '',
        stripImageUrl: '',
        iconUrl: '',
        icon2Url: '',
        language: 'ES'
    });

    const brandValidationSchema = Yup.object().shape({
        backgroundColor: requiredRule(t),
        labelColor: requiredRule(t),
        textColor: requiredRule(t),
        logoUrl: requiredRule(t),
        stripImageUrl: requiredRule(t),
        iconUrl: requiredRule(t),
        icon2Url: requiredRule(t),
        language: requiredRule(t)
    });

    const fields2 = [

        {
            isDivider: true,
            label: t('core.label.colorBrand'),
        },

        {
            isGroup: true,
            column: 3,
            label: t('core.label.colorBrand'),
            fieldList: [
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
            ]
        },

        {
            isDivider: true,
            label: t('core.label.resourcesGraph'),
        },
        {
            isGroup: true,
            column: 2,
            fieldList: [
                {
                    name: 'logoUrl',
                    label: t('core.label.logo'),
                    component: ImageUploadInput,
                    required: true,
                    type: 'logo'
                },
                {
                    name: 'stripImageUrl',
                    label: t('core.label.stripImageUrl'),
                    component: ImageUploadInput,
                    required: true,
                    type: 'stripImage'
                },
                {
                    name: 'iconUrl',
                    label: t('core.label.iconUrl'),
                    component: ImageUploadInput,
                    required: true,
                    type: 'icon'
                },

                {
                    name: 'icon2Url',
                    label: t('core.label.iconx2'),
                    component: ImageUploadInput,
                    required: true,
                    type: 'iconx2'
                },
            ]

        },
        {
            isDivider: true,
            label: t('core.label.text'),
        },
        {
            isGroup: true,
            column: 2,
            fieldList: [
                {
                    name: 'language',
                    label: t('core.label.language'),
                    component: SelectInput,
                    required: true,
                    fullWidth: true,
                    options: [
                        { value: 'ES', label: t('layout.header.spanish') },
                        { value: 'EN', label: t('layout.header.english') },
                        { value: 'FR', label: t('layout.header.french') },
                        { value: 'DE', label: t('layout.header.germany') },
                    ],
                },

            ]

        },



    ];

    const changeBrandAction = async (values: BrandFormValues) => {
        try {
            setPending(true)
            const form = new FormData();
            form.append('entityId', currentEntity?.entity.id as string);
            form.append('backgroundColor', values.backgroundColor);
            form.append('labelColor', values.labelColor);
            form.append('textColor', values.textColor);
            form.append('logo', values.logoUrl);
            form.append('icon', values.iconUrl);
            form.append('iconx2', values.icon2Url);
            form.append('stripImage', values.stripImageUrl);
            const data = {
                'entityId': currentEntity?.entity.id,
                'backgroundColor': values.backgroundColor,
                'labelColor': values.labelColor,
                'textColor': values.textColor,
                "language": values.language,
                files: {
                    'logo': values.logoUrl,
                    'icon': values.iconUrl,
                    'iconx2': values.icon2Url,
                    'stripImage': values.stripImageUrl
                }
            }
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            await updateEntityBranding(data, token)
            refrestList(user?.id as string)
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

    const fetchData = useCallback(async () => {

        setInitialBrandValues({
            "backgroundColor": currentEntity?.entity?.branding?.backgroundColor as string | "",
            "labelColor": currentEntity?.entity?.branding?.labelColor as string | "",
            "textColor": currentEntity?.entity?.branding?.textColor as string | "",
            logoUrl: currentEntity?.entity?.branding?.logo as string | "",
            stripImageUrl: currentEntity?.entity?.branding?.stripImage as string | "",
            iconUrl: currentEntity?.entity?.branding?.icon as string | "",
            icon2Url: currentEntity?.entity?.branding?.iconx2 as string | "",
            "language": currentEntity?.entity?.branding?.language as string | "ES",
        })
    }, [currentEntity?.entity?.branding?.backgroundColor, currentEntity?.entity?.branding?.icon, currentEntity?.entity?.branding?.iconx2, currentEntity?.entity?.branding?.labelColor, currentEntity?.entity?.branding?.language, currentEntity?.entity?.branding?.logo, currentEntity?.entity?.branding?.stripImage, currentEntity?.entity?.branding?.textColor])


    useEffect(() => {
        fetchData()
    }, [currentEntity?.entity.id, fetchData])




    useEffect(() => {
        if (currentEntity?.entity?.createdAt)
            formatDate(currentEntity.entity.createdAt, t('locale'));
    }, [currentEntity, t]);




    return { brandValidationSchema, changeBrandAction, pending, fields2, initialBrandValues }
}

