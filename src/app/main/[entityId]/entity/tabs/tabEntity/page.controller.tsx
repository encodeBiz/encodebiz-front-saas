/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import * as Yup from 'yup';
import { useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { SxProps, Theme } from '@mui/material';
import TextInput from '@/components/common/forms/fields/TextInput';
import { useToast } from '@/hooks/useToast';
import SelectInput from '@/components/common/forms/fields/SelectInput';
import { formatDate } from '@/lib/common/Date';
import { createSlug } from '@/lib/common/String';
import { fetchEntity, updateEntity } from '@/services/core/entity.service';
import { addressSchema, requiredRule } from '@/config/yupRules';
import { useLayout } from '@/hooks/useLayout';
import IEntity from '@/domain/core/auth/IEntity';
import { useAppLocale } from '@/hooks/useAppLocale';
import AddressComplexInput from '@/components/common/forms/fields/AddressComplexInput';

export interface EntityUpdatedFormValues {
    "uid": string
    "name": string
    "active": boolean

    //"region": string
    "taxId": string
    legalName: string
    billingEmail: string
    language?: 'EN' | 'ES'
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

    const { changeLoaderState } = useLayout()
    const { user, token } = useAuth();
    const { showToast } = useToast()
    const [pending, setPending] = useState(false)

    const { currentLocale } = useAppLocale()

    const [initialValues, setInitialValues] = useState<any>({
        uid: currentEntity?.entity?.id as string ?? "",
        "name": currentEntity?.entity?.name as string ?? "",
        "active": currentEntity?.entity?.active as boolean ?? true,
        "address": currentEntity?.entity?.legal?.address,
        "taxId": currentEntity?.entity?.legal?.taxId as string ?? "",
        "legalName": currentEntity?.entity?.legal?.legalName as string ?? "",
        billingEmail: currentEntity?.entity?.billingEmail as string ?? "",
        language: currentEntity?.entity?.language as any,
    });

    const validationSchema = Yup.object().shape({
        name: requiredRule(t),

        taxId: requiredRule(t),
        legalName: requiredRule(t),
        language: requiredRule(t),

        address: addressSchema(t),


    });





    const fields = [
        {
            isDivider: true,
            label: t('core.label.comercial'),
        },
        {
            name: 'name',
            label: t('core.label.companyName'),
            type: 'text',
            required: true,

            component: TextInput,
        },
        {
            name: 'language',
            label: t('core.label.languageNotification'),
            component: SelectInput,
            options: [{ label: t('layout.header.spanish'), value: 'ES' }, { label: t('layout.header.english'), value: 'EN' }]
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
            name: 'taxId',
            label: t('core.label.taxId'),
            type: 'text',
            component: TextInput,
        },
        {
            name: 'billingEmail',
            label: t('core.label.companyEmail'),
            type: 'email',
            component: TextInput,
        },

        {
            name: 'address',
            label: t('core.label.addressData'),
            required: true,
            fullWidth: true,
            component: AddressComplexInput,
        },


    ];







    const setEntityDataAction = async (values: any) => {
        try {

            setPending(true)
            const updateData = {
                "id": currentEntity?.entity?.id,
                "name": values.name,
                "slug": createSlug(values.name),
                "billingEmail": values.billingEmail,
                "language": values?.language ?? 'ES',
                "legal": {
                    "legalName": values.legalName,
                    "taxId": values.taxId,
                    "address": values.address
                },
                "active": true
            }
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            await updateEntity(updateData, token, currentLocale)
            changeLoaderState({ show: false })
            showToast(t('core.feedback.success'), 'success');
            setPending(false)

        } catch (error: any) {

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
        try {
            const entity: IEntity = await fetchEntity(currentEntity?.entity.id as string, currentLocale)
            setInitialValues({
                uid: entity?.id as string ?? "",
                "name": entity?.name as string ?? "",
                "active": entity?.active as boolean ?? true,
                "address": entity?.legal?.address,
                "taxId": entity?.legal?.taxId as string ?? "",
                "legalName": entity?.legal?.legalName as string ?? "",
                "language": entity?.language as any,
                billingEmail: entity?.billingEmail as string ?? user?.email as string ?? ''
            })

        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }

        }
    }

    useEffect(() => {
        if (currentEntity?.entity.id)
            fetchData()
    }, [currentEntity?.entity.id])








    useEffect(() => {
        if (currentEntity?.entity?.createdAt)
            formatDate(currentEntity.entity.createdAt, t('locale'));

       
    }, [currentEntity?.entity.createdAt]);


    /*
    const updateService = async () => {
        const serviceSuscription: Array<IService> = await getServices()
        const passinService = serviceSuscription.find(e => e.id === 'passinbiz') 
        const plans = await getPlan('passinbiz')        
        plans.forEach(async element => {
            await updateDocument<any>({
                collection: `service/passinbiz/plan`,
                data: {
                    items_es: passinService?.featuredList.es,
                    items_en: passinService?.featuredList.en,
                },
                id: element.id,
            });
        });
    }
    */

    return { validationSchema, initialValues, setEntityDataAction, fields, pending }
}

