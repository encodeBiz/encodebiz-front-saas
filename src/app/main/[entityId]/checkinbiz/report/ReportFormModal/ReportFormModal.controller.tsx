/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import * as Yup from 'yup';
import { requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useLayout } from "@/hooks/useLayout";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useEffect, useState } from "react";
import { useEntity } from "@/hooks/useEntity";
import { search } from "@/services/checkinbiz/sucursal.service";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import { createReport } from "@/services/checkinbiz/report.service";
import { IReport } from "@/domain/features/checkinbiz/IReport";
import { format_date } from "@/lib/common/Date";


export default function useAttendanceFormModalController(onSuccess: () => void) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { token } = useAuth()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const { closeModal } = useCommonModal()
  const [initialValues] = useState<Partial<any>>({
    branchId: '',
    periocity: '',
  })

  const [branchList, setBranchList] = useState<Array<any>>([])
  const validationSchema = Yup.object().shape({
    periocity: requiredRule(t),
  });



  const setDinamicDataAction = async (values: Partial<{
    branchId: string,
    periocity: 'today' | 'week' | 'month' | 'year',
  }>) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const dateRange = getDateRange(values.periocity as 'today' | 'week' | 'month' | 'year')
      const data: Partial<IReport> = {
        entityId: currentEntity?.entity?.id as string,
        start: format_date(dateRange.start, 'YYYY-MM-DD'),
        end: format_date(dateRange.end, 'YYYY-MM-DD'),
        branchId: values.branchId ?? null

      }
      const response = await createReport(data, token)
 
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      closeModal(CommonModalType.CHECKLOGFORM)
      if (typeof onSuccess === 'function') onSuccess()
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };


  const fields = [
    {
      name: 'periocity',
      label: t('core.label.periocity'),
      component: SelectInput,
      options: [
        { value: '' as string, label: t('core.label.select') },
        { value: 'today' as string, label: t('core.label.today') },
        { value: 'week' as string, label: t('core.label.thisWeek') },
        { value: 'month' as string, label: t('core.label.thisMonth') },
        { value: 'year' as string, label: t('core.label.thisYear') }
      ]
    },

    {
      name: 'branchId',
      label: t('core.label.sucursal'),
      component: SelectInput,
      options: [{ value: '' as string, label: t('core.label.all') },
      ...branchList
      ]
    },






  ];

  const getSucursalList = async () => {
    const branckList = (await search(currentEntity?.entity.id as string, {
      limit: 100,
      filters: [
        {
          field: 'status', operator: '==', value: 'active'
        }
      ]
    } as any)).map(e => ({ value: e.id, label: e.name }))

     
    setBranchList(branckList)
  }
  useEffect(() => {
    if (currentEntity?.entity.id) {
      getSucursalList()
    }
  }, [currentEntity?.entity.id])


  function getDateRange(rangeType: 'today' | 'week' | 'month' | 'year') {
    const now = new Date();
    const result: any = { label: rangeType };

    switch (rangeType) {
      case 'today':
        result.start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        result.end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;

      case 'week':
        const day = now.getDay();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
        startOfWeek.setHours(0, 0, 0, 0);

        result.start = startOfWeek;
        result.end = new Date(startOfWeek);
        result.end.setDate(startOfWeek.getDate() + 6);
        result.end.setHours(23, 59, 59, 999);
        break;

      case 'month':
        result.start = new Date(now.getFullYear(), now.getMonth(), 1);
        result.end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;

      case 'year':
        result.start = new Date(now.getFullYear(), 0, 1);
        result.end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;

      default:
        throw new Error('Invalid range type');
    }



    return result;
  }


  return { fields, validationSchema, setDinamicDataAction, initialValues }
}