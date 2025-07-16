import { subscribeInSassProduct } from '@/services/common/subscription.service';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useState } from 'react';

import { useToast } from '@/hooks/useToast';
import { IEntitySuscription, ISubscription } from '@/domain/auth/ISubscription';
import { BizType } from '@/domain/core/IService';
export default function usePricingCardController(plan: IEntitySuscription) {
    const { currentEntity } = useEntity();
    const { token } = useAuth()
    const [loadingGetPlan, setLoadingGetPlan] = useState(false);
    const { showToast } = useToast()

    const renuewAction = async () => {
        try {
            setLoadingGetPlan(true);
            const data: ISubscription = {
                entityId: currentEntity?.entity?.id ? currentEntity.entity.id : "",
                serviceId: plan.serviceId as BizType,
                planId: plan.plan
            }

            await subscribeInSassProduct(data, token)
        } catch (error: unknown) {
            setLoadingGetPlan(false);
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
        }
    }
    return { renuewAction, loadingGetPlan, setLoadingGetPlan }
}