import { useTranslations } from 'next-intl';
import { IPlan } from '@/domain/core/IPlan';
 
export default function useSalesPlanController() {

 
  const t = useTranslations();
  const salesPlans: IPlan[] = [
    {
      id: "freemium",
      name: t("salesPlan.free"),
      price: '$19',
      period: `/${t("salesPlan.month")}`,
      features: [
        t("salesPlan.upToFive"),
        t("salesPlan.branding"),
        t("salesPlan.cost"),
        t("salesPlan.price")
      ],
      featured: false
    },
    {
      id: "bronze",
      name: t("salesPlan.bronze"),
      price: '$49',
      period: `/${t("salesPlan.month")}`,
      features: [
        t("salesPlan.model"),
        t("salesPlan.priceEmited"),
        t("salesPlan.branding"),
        t("salesPlan.cost"),
        t("salesPlan.estimateRange")
      ],
      featured: true
    },
    {
      id: "enterprise",
      name: t("salesPlan.premium"),
      price: '$99',
      period: `/${t("salesPlan.month")}`,
      features: [
        t("salesPlan.unlimitedProducts"),
        t("salesPlan.limit"),
        t("salesPlan.modelCustom"),
        t("salesPlan.brandingCustom"),
        t("salesPlan.priceMonthly"),
        t("salesPlan.costEstimated"),
        t("salesPlan.estimateRangeCustom"),
      ],
      featured: false
    },
  ];





  return { salesPlans }
}