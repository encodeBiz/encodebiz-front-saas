import { subscribeInSassProduct, unSubscribeInSassProduct } from '@/services/common/subscription.service';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useEffect, useState } from 'react';

import { useToast } from '@/hooks/useToast';
import { ISubscription, IUnSubscription } from '@/domain/auth/ISubscription';
import { useLayout } from '@/hooks/useLayout';
import { useTranslations } from 'next-intl';
export default function usePricingCardController(id: string, fromService: "passinbiz" | "checkinbiz") {
    const { currentEntity, fetchSuscriptionEntity } = useEntity();
    const { token } = useAuth()
    const [loadingGetPlan, setLoadingGetPlan] = useState(false);
    const { showToast } = useToast()
    const { changeLoaderState } = useLayout()
    const t = useTranslations()

   


    const subcribeAction = async () => {
        try {
            setLoadingGetPlan(true);
            const data: ISubscription = {
                entityId: currentEntity?.entity?.id ? currentEntity.entity.id : "",
                serviceId: fromService,
                planId: id
            }
            changeLoaderState({ show: true, args: { text: t('core.title.loaderActionBilling') } })

            const dataResult = await subscribeInSassProduct(data, token)
            fetchSuscriptionEntity()
            showToast(`La suscripción al plan ${id} del servicio ${fromService} se ha completado con exito'`, 'success');
            setLoadingGetPlan(false);
            changeLoaderState({ show: false })
        } catch (error: unknown) {
            setLoadingGetPlan(false);
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
            changeLoaderState({ show: false })
        }
    }

    const ubSubcribeAction = async () => {
        try {
            setLoadingGetPlan(true);
            const data: IUnSubscription = {
                entityId: currentEntity?.entity?.id ? currentEntity.entity.id : "",
                serviceId: fromService
            }
            changeLoaderState({ show: true, args: { text: t('core.title.loaderActionBilling') } })

            const dataResult = await unSubscribeInSassProduct(data, token)
            fetchSuscriptionEntity()
            showToast(`La suscripción al servicio ${fromService} se ha eliminado con exito`, 'success');
            setLoadingGetPlan(false);
            changeLoaderState({ show: false })

        } catch (error: unknown) {
            setLoadingGetPlan(false);
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
            changeLoaderState({ show: false })

        }
    }
    return { subcribeAction, ubSubcribeAction, loadingGetPlan, setLoadingGetPlan }
}