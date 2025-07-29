
'use client'
import React from 'react';
import {
    Box,

} from '@mui/material';
import { useTranslations } from 'next-intl';

import { EntityUpdatedFormValues, useSettingEntityController } from './page.controller';
import { BaseButton } from '@/components/common/buttons/BaseButton';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { createSlug } from '@/lib/common/String';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useCommonModal } from '@/hooks/useCommonModal';

const EntityPreferencesTab = () => {
    const t = useTranslations();
    const { initialValues, validationSchema, setEntityDataAction, fields, pending, handleDeleteEntity } = useSettingEntityController();
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    const { openModal } = useCommonModal()
    return (
        <>
            <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' sx={{ width: '100%' }}>
                <BaseButton disabled={!user?.id || !currentEntity} onClick={() => openModal(CommonModalType.DELETE, { entityId: currentEntity?.entity.id })} variant='contained' color='warning' >{t('entity.tabs.tab2.btn')}</BaseButton>

            </Box>
            <GenericForm<EntityUpdatedFormValues>
                column={2}
                disabled={!user?.id || !currentEntity || pending}
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
};

export default EntityPreferencesTab;
