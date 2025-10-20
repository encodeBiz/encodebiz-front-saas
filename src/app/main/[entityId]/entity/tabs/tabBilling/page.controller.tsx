'use client'

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { SxProps, Theme } from '@mui/material';
import { configBilling } from '@/services/core/subscription.service';
import { useLayout } from '@/hooks/useLayout';
import { useAppLocale } from '@/hooks/useAppLocale';



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
    const { currentEntity } = useEntity();
    const { token } = useAuth()
    const { changeLoaderState } = useLayout()
    const { currentLocale } = useAppLocale()


    const configBillingAction = async () => {
        changeLoaderState({ show: true, args: { text: t('core.title.loaderActionBilling') } })
        const data: { url: string } = await configBilling({
            entityId: currentEntity?.entity.id as string
        }, token, currentLocale)
        if (data.url)
            window.open(data.url, 'blank')
        changeLoaderState({ show: false })

    }


    return { configBillingAction }
}

