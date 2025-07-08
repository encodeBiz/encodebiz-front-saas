'use client'

import * as Yup from 'yup';
import { useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { Box, SxProps, Theme } from '@mui/material';
import TextInput from '@/components/common/forms/fields/TextInput';
import ColorPickerInput from '@/components/common/forms/fields/ColorPickerInput';
import UploadAvatar from '@/components/common/avatar/UploadAvatar';
import { useToast } from '@/hooks/useToast';
import moment from 'moment';
import SelectInput from '@/components/common/forms/fields/SelectInput';
import { country } from '@/config/country';
import { formatDate } from '@/lib/common/Date';
import { createSlug } from '@/lib/common/String';
import { deleteEntity, fetchEntity, updateEntity, updateEntityBranding } from '@/services/common/entity.service';
import ImageUploadInput from '@/components/common/forms/fields/ImageUploadInput';
import { BaseButton } from '@/components/common/buttons/BaseButton';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { configBilling } from '@/services/common/subscription.service';
import { fileImageRule, requiredRule } from '@/config/yupRules';
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
    const [iframeUrl, setIframeUrl] = useState(''); // Initial URL
    const { token } = useAuth()


    const configBillingAction = async () => {
        const data: { url: string } = await configBilling({
            entityId: currentEntity?.entity.id as string
        }, token)
        setIframeUrl(data.url)
    }


    return { configBillingAction, iframeUrl }
}

