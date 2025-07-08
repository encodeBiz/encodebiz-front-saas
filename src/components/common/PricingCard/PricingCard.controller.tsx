import { subscribeInSassProduct } from '@/services/common/subscription.service';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useState } from 'react';
 
import { useToast } from '@/hooks/useToast';
import { ISubscription } from '@/domain/auth/ISubscription';
export default function usePricingCardController(id: string, fromService: "passinbiz" | "checkinbiz") {
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
            console.log("token>>>", token)
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
    return { subcribeAction, loadingGetPlan, setLoadingGetPlan }
}