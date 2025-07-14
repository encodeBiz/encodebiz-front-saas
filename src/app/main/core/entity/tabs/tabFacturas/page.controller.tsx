'use client'

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { configBilling } from '@/services/common/subscription.service';


 

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

