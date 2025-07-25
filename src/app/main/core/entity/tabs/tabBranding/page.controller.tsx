'use client'

import * as Yup from 'yup';
import { useState, ReactNode, useEffect } from 'react';
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
    });

    const brandValidationSchema = Yup.object().shape({
        backgroundColor: requiredRule(t),
        labelColor: requiredRule(t),
        textColor: requiredRule(t),
        logoUrl: requiredRule(t),
        stripImageUrl: requiredRule(t),
        iconUrl: requiredRule(t)
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
            label: t('core.label.icon2x'),
            component: ImageUploadInput,
            required: true,
            type: 'icon'
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

    const fetchData = async () => {

        setInitialBrandValues({
            "backgroundColor": currentEntity?.entity?.branding?.backgroundColor as string | "",
            "labelColor": currentEntity?.entity?.branding?.labelColor as string | "",
            "textColor": currentEntity?.entity?.branding?.textColor as string | "",
            logoUrl: currentEntity?.entity?.branding?.logo as string | "",
            stripImageUrl: currentEntity?.entity?.branding?.stripImage as string | "",
            iconUrl: currentEntity?.entity?.branding?.icon as string | "",
            icon2Url: currentEntity?.entity?.branding?.iconx2 as string | "",
        })
    }
    useEffect(() => {
        fetchData()
    }, [currentEntity?.entity.id])




    useEffect(() => {
        if (currentEntity?.entity?.createdAt)
            formatDate(currentEntity.entity.createdAt, t('locale'));
    }, [currentEntity]);




    return { brandValidationSchema, changeBrandAction, pending, fields2, initialBrandValues }
}

