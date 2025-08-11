import { IPlan } from "@/domain/core/IPlan";
import { IService } from "@/domain/core/IService";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { useToast } from "@/hooks/useToast";
import { fetchAvailablePlans, fetchService } from "@/services/common/subscription.service";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react"

export default function useDashboardController() {
  const { service } = useParams<any>()
  const { user } = useAuth()
  const [serviceData, setServiceData] = useState<IService>()
  const { showToast } = useToast()
  const t = useTranslations()
  const { changeLoaderState } = useLayout()
 
  const { currentEntity } = useEntity();
  const [planList, setPlanList] = useState<Array<IPlan>>()
 


  const [pending, setPending] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setPending(true)
      const planData = await fetchAvailablePlans(service)
      const planList: Array<IPlan> = []
      planData.forEach(element => {
        const featuredList = [
          t("salesPlan.unlimitedProducts"),
          t("salesPlan.limit"),
          t("salesPlan.priceMonthly"),
          t("salesPlan.costEstimated"),
          t("salesPlan.estimateRangeCustom"),
        ]
        if (element.allowCustomTemplate && element.allowBranding) featuredList.push(t("salesPlan.brandingCustom"))
        planList.push({
          id: element.id as string,
          name: element.id,
          //price: '$99',
          period: `/${t("salesPlan.month")}`,
          features: featuredList,
          featured: false
        })
      });
      setPlanList(planList)

      setPending(false)
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast(String(error), 'error');
      }
      setPending(false)
    }
  }, [service, showToast, t])

  const fetchServiceData = useCallback(async () => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      setServiceData(await fetchService(service as string))
      await fetchData()
      changeLoaderState({ show: false })
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast(String(error), 'error');
      }
      changeLoaderState({ show: false })
    }
  }, [changeLoaderState, fetchData, service, showToast, t])

  useEffect(() => {
    if (service && user?.id && currentEntity?.entity.id)
      fetchServiceData()
  }, [user?.id, service, currentEntity?.entity.id, fetchServiceData])



  return { serviceData, pending, planList }
}