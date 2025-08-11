'use client'

import TextInput from '@/components/common/forms/fields/TextInput';
import { emailRule } from '@/config/yupRules';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useToast } from '@/hooks/useToast';
import { recoveryPassword } from '@/services/common/account.service';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as Yup from 'yup';


export interface RecoveryFormValues {
    email: string
};

export const useRegisterController = () => {
    const t = useTranslations()
    const { showToast } = useToast()
    const { openModal } = useCommonModal()
    const [initialValues] = useState<RecoveryFormValues>({
        email: '',
    })

    const validationSchema = Yup.object().shape({
        email: emailRule(t),
    });



    const handleRecoveryPassword = async (values: RecoveryFormValues) => {
        try {
            await recoveryPassword(values.email)
            openModal(CommonModalType.RECOVERY)
        } catch (error: any) {             
            showToast(error.message, 'error')
        }
    };

    const fields = [

        {
            name: 'email',
            label: t('core.label.email'),
            type: 'email',
            required: true,
            component: TextInput,
        },




    ];



    return { handleRecoveryPassword, validationSchema, initialValues, fields }
}

