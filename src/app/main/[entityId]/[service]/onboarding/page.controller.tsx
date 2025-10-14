/* eslint-disable react-hooks/exhaustive-deps */
import { IPlan } from "@/domain/core/IPlan";
import { IService } from "@/domain/core/IService";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { useToast } from "@/hooks/useToast";
import { fetchAvailablePlans, fetchService } from "@/services/core/subscription.service";
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
  const { currentLocale } = useAppLocale()



  const [pending, setPending] = useState(false)

  const fetchData = async (featuredList: Array<string>) => {
    try {
      setPending(true)
      const planData = await fetchAvailablePlans(service)
      const planList: Array<IPlan> = []

      planData.sort((a, b) => a.order - b.order).forEach(element => {
        //if (element.allowCustomTemplate && element.allowBranding) featuredList.push(t("salesPlan.brandingCustom"))
        planList.push({
          id: element.id as string,
          name: element.id,
          monthlyPrice: element.monthlyPrice,
          pricePerUse: element.pricePerUse,
          priceYear: '-',
          period: element.payPerUse ? '/Pase o Credencial' : `/${t("salesPlan.month")}`,
          features: featuredList,
          featuredList: element.featuredList,
          highlighted: element.highlighted,
          order: element.order,
          description: element.description,
          payPerUse: element.payPerUse,
          maxHolders: element.maxHolders
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
  }

  const fetchServiceData = useCallback(async () => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const sData = await fetchService(service as string)
      setServiceData(sData)
      const features: any = sData.featuredList
      await fetchData(features[currentLocale])
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
  }, [user?.id, service, currentEntity?.entity.id, currentLocale])

  const dataTab1 = {
    title: t(`onboarding.${service}.stepsTitle`),
    subtitle: t(`onboarding.${service}.stepsDesc`),
    data: serviceData?.steps ? (serviceData?.steps as any)[currentLocale] : []
  }


  const dataTab2 = {
    title: t(`onboarding.${service}.targetTitle`),
    subtitle: t(`onboarding.${service}.targetDesc`),
    data: serviceData?.target ? (serviceData?.target as any)[currentLocale] : []
  }
 


  return { serviceData, pending, planList, dataTab1, dataTab2 }
}