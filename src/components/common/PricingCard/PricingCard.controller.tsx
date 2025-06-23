
import { useTranslations } from 'next-intl';
import { IPlan } from '@/domain/core/IPlan';
import { subscribeInSassProduct } from '@/services/common/subscription.service';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useState } from 'react';
import { ISubscription } from './PricingCard';
import { useToast } from '@/hooks/useToast';
export default function usePricingCardController(id: "freemium" | "bronze" | "enterprise", fromService: "passinbiz" | "checkinbiz") {
    const t = useTranslations();
    const { currentEntity } = useEntity();
    const { token } = useAuth()
    const [loadingGetPlan, setLoadingGetPlan] = useState(false);
    const { showToast } = useToast()

    const subcribeAction = async () => {
        try {
            setLoadingGetPlan(true);
            const data: ISubscription = {
                entityId: currentEntity?.entity?.id ? currentEntity.entity.id : "",
                serviceId: fromService,
                planId: id
            }
            await subscribeInSassProduct(data, token)

        } catch (error: any) {
            console.log("Error:", error);
            setLoadingGetPlan(false);
            showToast(error.message, 'error')

        }
    }
    return { subcribeAction, loadingGetPlan }
}