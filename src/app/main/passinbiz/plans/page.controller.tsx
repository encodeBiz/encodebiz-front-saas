
import { useTranslations } from 'next-intl';
import { IPlan } from '@/domain/core/IPlan';
import { useEntity } from '@/hooks/useEntity';
import { useEffect, useState } from 'react';

export default function usePassInBizController() {

  const [notGetPlan, setnotGetPlan] = useState(false);
  const { currentEntity } = useEntity();
  const [dataEntity, setDataEntity] = useState({
    billingEmail: currentEntity?.entity?.billingEmail ?? "",
    legalName: currentEntity?.entity?.legal?.legalName ?? "",
    taxId: currentEntity?.entity?.legal?.taxId ?? ""
  });
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

  useEffect(() => {
    if (currentEntity) {
      setDataEntity({
        billingEmail: currentEntity.entity.billingEmail ?? "",
        legalName: currentEntity.entity.legal?.legalName ?? "",
        taxId: currentEntity.entity.legal?.taxId ?? ""
      })
    }
  }, [currentEntity]);

  useEffect(() => {
    if (dataEntity.billingEmail === "" || dataEntity.legalName === "" || dataEntity.taxId === "") {
      setnotGetPlan(true);
    } else {
      setnotGetPlan(false);
    }
  }, [dataEntity]);

  return { salesPlans, notGetPlan }
}