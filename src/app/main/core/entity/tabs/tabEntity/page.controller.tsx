'use client'

import * as Yup from 'yup';
import { useState, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { SxProps, Theme } from '@mui/material';
import TextInput from '@/components/common/forms/fields/TextInput';
import { useToast } from '@/hooks/useToast';
import SelectInput from '@/components/common/forms/fields/SelectInput';
import { country } from '@/config/country';
import { formatDate } from '@/lib/common/Date';
import { createSlug } from '@/lib/common/String';
import { deleteEntity, fetchEntity, updateEntity } from '@/services/common/entity.service';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { requiredRule } from '@/config/yupRules';
import { useLayout } from '@/hooks/useLayout';
import IEntity from '@/domain/auth/IEntity';



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
    const { closeModal } = useCommonModal()

    const { changeLoaderState } = useLayout()
    const { user, token } = useAuth();
    const { showToast } = useToast()
    const [pending, setPending] = useState(false)

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
        name: requiredRule(t),
        street: requiredRule(t),
        country: requiredRule(t),
        city: requiredRule(t),
        postalCode: requiredRule(t),
        //region: requiredRule(t),
        taxId: requiredRule(t),
        legalName: requiredRule(t),

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
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            await updateEntity(updateData, token)
            changeLoaderState({ show: false })
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
            changeLoaderState({ show: false })

        }
    };


    const fetchData = useCallback(async () => {
        try {
            const entity: IEntity = await fetchEntity(currentEntity?.entity.id as string)
            setInitialValues({
                uid: entity?.id as string | "",
                "name": entity?.name as string | "",
                "active": entity?.active as boolean | true,
                "street": entity?.legal?.address.street as string | "",
                "country": entity?.legal?.address.country as string | "",
                "city": entity?.legal?.address.city as string | "",
                "postalCode": entity?.legal?.address.postalCode as string | "",
                "taxId": entity?.legal?.taxId as string | "",
                "legalName": entity?.legal?.legalName as string | "",
                billingEmail: entity?.billingEmail as string ?? user?.email as string ?? ''
            })
            setCityList(country.find(e => e.name === entity?.legal?.address.country)?.states?.map(e => ({ label: e.name, value: e.name })) ?? [])
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }

        }
    }, [currentEntity?.entity.id, showToast, user?.email])

    useEffect(() => {
        if (currentEntity?.entity.id)
            fetchData()
    }, [currentEntity?.entity.id, fetchData])



    const handleDeleteEntity = async (entityId: string) => {
        setPending(true)
        try {
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            await deleteEntity({
                uid: user?.id as string,
                entityId: entityId
            }, token)
            changeLoaderState({ show: false })
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
            setPending(false)
            changeLoaderState({ show: false })
        }
    }




    useEffect(() => {
        if (currentEntity?.entity?.createdAt)
            formatDate(currentEntity.entity.createdAt, t('locale'));
    }, [currentEntity?.entity.createdAt, t]);




    return { validationSchema, initialValues, setEntityDataAction, fields, pending, handleDeleteEntity }
}

