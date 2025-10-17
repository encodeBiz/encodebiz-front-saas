/* eslint-disable react-hooks/exhaustive-deps */
import { fetchAvailablePlans, unSubscribeInSassProduct } from '@/services/core/subscription.service';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useEffect, useState } from 'react';

import { useToast } from '@/hooks/useToast';
import { IEntitySuscription, IUnSubscription } from '@/domain/core/auth/ISubscription';
import { IPlan } from '@/domain/core/IPlan';
import { useTranslations } from 'next-intl';
import { useAppLocale } from '@/hooks/useAppLocale';
export default function usePricingCardController(planSubscription: IEntitySuscription) {
    const { currentEntity } = useEntity();
    const { token } = useAuth()
    const t = useTranslations()
    const [loadingGetPlan, setLoadingGetPlan] = useState(false);
    const { showToast } = useToast()
    const { currentLocale } = useAppLocale()
    const [planInfo, setPlanInfo] = useState<IPlan>()
    const fetchPlanData = async () => {
        const planData = await fetchAvailablePlans(planSubscription.serviceId)
        setPlanInfo(planData.find(e => e.id === planSubscription.plan))

    }

    useEffect(() => {
        fetchPlanData()
    }, [])


    const unSubcribeAction = async () => {
        try {
            setLoadingGetPlan(true);
            const data: IUnSubscription = {
                entityId: currentEntity?.entity?.id ? currentEntity.entity.id : "",
                serviceId: planSubscription.serviceId as any
            }
            await unSubscribeInSassProduct(data, token, currentLocale)
            showToast(`${t('salesPlan.feedText1')} ${planSubscription.serviceId as any} ${t('salesPlan.feedText4')}`, 'success');
            setLoadingGetPlan(false);
        } catch (error: unknown) {
            setLoadingGetPlan(false);
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
        }
    }
    return { unSubcribeAction, loadingGetPlan, setLoadingGetPlan, planInfo }
}