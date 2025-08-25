
'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import { useSettingEntityController } from './page.controller';
import { useEntity } from '@/hooks/useEntity';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { Box, Typography } from '@mui/material';
import { SassButton } from '@/components/common/buttons/GenericButton';
import visa from '../../../../../../../public/assets/images/Visa.svg'
import mastercard from '../../../../../../../public/assets/images/mastercard.svg'
import card from '../../../../../../../public/assets/images/card.svg'
import Image from 'next/image';
const cards: any = {
    visa, mastercard, card
}
const BillingPreferencesPage = () => {
    const t = useTranslations();
    const { configBillingAction } = useSettingEntityController();
    const { currentEntity } = useEntity()

    return (
        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', gap: 1, }}>
            {currentEntity?.entity?.billingConfig?.payment_method && currentEntity?.entity?.billingConfig?.payment_method?.length > 0 && <Typography variant='h5'>{t('billing.title2')}</Typography>}
            <BorderBox sx={{ mb: 4 }}>
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 6, }}>
                    {currentEntity?.entity?.billingConfig?.payment_method && currentEntity?.entity?.billingConfig?.payment_method?.length > 0 ? <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                        {currentEntity?.entity?.billingConfig?.payment_method.map((pm) => (
                            <Box key={pm.id} sx={{ p: 2, width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap:2 }}>
                                <Image src={cards[pm.brand] ?? card} alt='Cards' width={74} height={57} />
                                <Typography textTransform={'capitalize'} variant='body1'>{`${pm.brand}  ●●●●  ${pm.last4}`}</Typography>
                            </Box>
                        ))}

                    </Box> :
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                            <Typography variant='h5'>{t('billing.title')}</Typography>
                            <Typography variant='body1'>{t('billing.subtitle')}</Typography>
                        </Box>}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', textAlign: 'center' }}>
                        <SassButton sx={{
                            width: {
                                sx: '90%',
                                sm: '90%',
                                md: '90%',
                                lg: 610,
                                xl: 610
                            }
                        }} variant='contained' color='primary' disabled={!currentEntity?.entity.legal?.legalName && !currentEntity?.entity.legal?.taxId} onClick={configBillingAction}>{
                                currentEntity?.entity?.billingConfig?.payment_method && currentEntity?.entity?.billingConfig?.payment_method?.length > 0 ? t('billing.btn2') :
                                    t('billing.btn')}</SassButton>
                    </Box>
                </Box>
            </BorderBox>
        </Box>
    );
};

export default BillingPreferencesPage;
