import { subscribeInSassProduct, unSubscribeInSassProduct } from '@/services/common/subscription.service';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import {  useState } from 'react';

import { useToast } from '@/hooks/useToast';
import { ISubscription, IUnSubscription } from '@/domain/auth/ISubscription';
import { useLayout } from '@/hooks/useLayout';
import { useTranslations } from 'next-intl';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';
export default function usePricingCardController(id: string, name: string, fromService: "passinbiz" | "checkinbiz") {
    const { currentEntity, fetchSuscriptionEntity, entitySuscription } = useEntity();
    const { token } = useAuth()
    const [loadingGetPlan, setLoadingGetPlan] = useState(false);
    const { showToast } = useToast()
    const { changeLoaderState } = useLayout()
    const t = useTranslations()
    const { openModal } = useCommonModal()

    const subcribeAction = async () => {
        try {
            setLoadingGetPlan(true);
            const data: ISubscription = {
                entityId: currentEntity?.entity?.id ? currentEntity.entity.id : "",
                serviceId: fromService,
                planId: id
            }
            changeLoaderState({ show: true, args: { text: t('core.title.loaderActionBilling') } })

            await subscribeInSassProduct(data, token)
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

            await unSubscribeInSassProduct(data, token)
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




    const handleSubscripe = () => {
        if (name === 'freemium') {
            if (!currentEntity || !currentEntity?.entity?.billingEmail || !currentEntity?.entity?.legal?.legalName || !currentEntity?.entity?.legal?.taxId || !currentEntity?.entity?.branding)
                openModal(CommonModalType.BILLING)
            else
                subcribeAction()
        } else {
            if (!currentEntity || !currentEntity?.entity?.billingEmail || !currentEntity?.entity?.legal?.legalName  || !currentEntity?.entity?.legal?.taxId || !currentEntity?.entity?.legal?.taxId || !currentEntity?.entity?.branding|| !currentEntity?.entity?.billingConfig?.payment_method) {
                openModal(CommonModalType.BILLING)
            } else {
                if (entitySuscription.filter(e => e.plan === id && e.serviceId === fromService).length === 0) {
                    subcribeAction()
                }
            }
        }
    }
    return { subcribeAction, ubSubcribeAction, loadingGetPlan, setLoadingGetPlan, handleSubscripe }
}