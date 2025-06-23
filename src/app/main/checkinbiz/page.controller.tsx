
import { useTranslations } from 'next-intl';
import { IPlan } from '@/domain/core/IPlan';
export default function useCheckInBizController() {
  const t = useTranslations();
  const salesPlans:IPlan[] = [
    {
      id: "freemium",
      name: t("salesPlan.free"),
      price: '$19',
      period: `/${t("salesPlan.month")}`,
      features: [
        t("salesPlan.upToTen"),
        t("salesPlan.basicAnalitics"),
        t("salesPlan.emailSuport"),
        t("salesPlan.customerTime")
      ],
      featured: false
    },
    {
      id: "bronze",
      name: t("salesPlan.bronze"),
      price: '$49',
      period: `/${t("salesPlan.month")}`,
      features: [
        t("salesPlan.upToTen"),
        t("salesPlan.avancedAnalitics"),
        t("salesPlan.emailPrioritySuport"),
        t("salesPlan.customerTime"),
        t("salesPlan.apiAcces")
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
        t("salesPlan.avancedAnalitics"),
        t("salesPlan.emailAndPhoneSuport"),
        t("salesPlan.customerTime"),
        t("salesPlan.apiAcces"),
        t("salesPlan.customReport")
      ],
      featured: false
    },
  ];
  return { salesPlans }
}