import { subscribeInSassProduct, unSubscribeInSassProduct } from '@/services/common/subscription.service';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useState } from 'react';

import { useToast } from '@/hooks/useToast';
import { IEntitySuscription, ISubscription, IUnSubscription } from '@/domain/auth/ISubscription';
import { BizType } from '@/domain/core/IService';
export default function usePricingCardController(plan: IEntitySuscription) {
    const { currentEntity, fetchSuscriptionEntity } = useEntity();
    const { token } = useAuth()
    const [loadingGetPlan, setLoadingGetPlan] = useState(false);
    const { showToast } = useToast()

     const ubSubcribeAction = async () => {
            try {
                setLoadingGetPlan(true);
                const data: IUnSubscription = {
                    entityId: currentEntity?.entity?.id ? currentEntity.entity.id : "",
                    serviceId: plan.serviceId as any
                }
                const dataResult = await unSubscribeInSassProduct(data, token)
                fetchSuscriptionEntity()
                showToast(`La suscripción al servicio ${plan.serviceId as any} se ha eliminado con exito`, 'success');
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
    return { ubSubcribeAction, loadingGetPlan, setLoadingGetPlan }
}