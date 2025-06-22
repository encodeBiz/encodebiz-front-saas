
import { Plan } from '@/components/common/SalesPlans';
import { useTranslations } from 'next-intl';
export default function useCheckInBizController() {
  const t = useTranslations();
  const salesPlans:Array<Plan> = [
    {
      name: t("salesPlan.free"),
      price: '$19',
      period: `/${t("salesPlan.month")}`,
      features: [
        t("salesPlan.upToTen"),
        t("salesPlan.basicAnalitics"),
        t("salesPlan.emailSuport"),
        t("salesPlan.customerTime")
      ],
      featured: false,
      //planId:'bronze'
    },
    {
      name: t("salesPlan.standard"),
      price: '$49',
      period: `/${t("salesPlan.month")}`,
      features: [
        t("salesPlan.upToTen"),
        t("salesPlan.avancedAnalitics"),
        t("salesPlan.emailPrioritySuport"),
        t("salesPlan.customerTime"),
        t("salesPlan.apiAcces")
      ],
      featured: false
    },
    {
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
      featured: true
    },
    {
      name: t("salesPlan.enterprise"),
      price: t("salesPlan.custom"),
      period: '',
      features: [
        t("salesPlan.unlimitedProducts"),
        t("salesPlan.dedicateManager"),
        t("salesPlan.customIntegrations"),
        t("salesPlan.customerTime"),
        t("salesPlan.whiteLabel"),
        t("salesPlan.onsiteTraining")
      ],
      featured: false
    }
  ];
  return { salesPlans }
}