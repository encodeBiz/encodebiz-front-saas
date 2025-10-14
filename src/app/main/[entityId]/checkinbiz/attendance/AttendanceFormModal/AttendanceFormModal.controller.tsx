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
import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";
import { useEntity } from "@/hooks/useEntity";
import { fetchSucursal } from "@/services/checkinbiz/sucursal.service";
import { createLog, fetchEmployee } from "@/services/checkinbiz/employee.service";
import SearchIndexFilterInput from "@/components/common/forms/fields/SearchFilterInput";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import DateInput from "@/components/common/forms/fields/Datenput";
import { useFormStatus } from "@/hooks/useFormStatus";


export default function useAttendanceFormModalController(onSuccess: () => void, employeeId?: string, branchId?: string,) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { token } = useAuth()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const { formStatus } = useFormStatus()
  const { closeModal } = useCommonModal()
  const [initialValues] = useState<Partial<IChecklog>>({
    status: 'valid',
    branchId: branchId ?? '' as string,
    employeeId: employeeId ?? '' as string,
    type: undefined
  })

  const [branchList, setBranchList] = useState<Array<any>>([])
  const validationSchema = Yup.object().shape({
    employeeId: requiredRule(t),
    branchId: requiredRule(t),
    type: requiredRule(t),
    timestamp: requiredRule(t),
  });



  const setDinamicDataAction = async (values: Partial<IChecklog>) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const branch = await fetchSucursal(currentEntity?.entity?.id as string, (branchId ?? values.branchId) as string)
      const data: IChecklog = {
        "employeeId": employeeId ?? values.employeeId as string,
        "entityId": currentEntity?.entity?.id as string,
        "branchId": branchId ?? values.branchId as string,
        "type": values.type as "checkout" | "checkin" | "restin" | "restout",
        "geo": {
          "lat": branch.address.geo.lat,
          "lng": branch.address.geo.lng
        },
        timestamp: values.timestamp,
        status: 'valid',
        failedCode: ''
      }
      await createLog(data, token)
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
      name: 'employeeId',
      label: t('core.label.employee'),
      type: 'text',
      required: true,
      component: SearchIndexFilterInput,
    },

    {
      name: 'branchId',
      label: t('core.label.sucursal'),
      component: SelectInput,
      options: [...branchList]
    },

    {
      name: 'type',
      label: t('core.label.status'),
      component: SelectInput,
      options: [
        { value: '' as string, label: t('core.label.select') },
        { value: 'checkin' as string, label: t('core.label.checkin') },
        { value: 'checkout' as string, label: t('core.label.checkout') },
        { value: 'restin' as string, label: t('core.label.restin') },
        { value: 'restout' as string, label: t('core.label.restout') }
      ]
    },



    {
      name: 'timestamp',
      label: t('core.label.timestamp'),
      component: DateInput,

    },


  ];

  const getSucursalList = async (employeeId: string) => {
    const employee = await fetchEmployee(currentEntity?.entity.id as string, employeeId)
    return await Promise.all(
      employee?.branchId.map(async (item) => {
        const branchId = (await fetchSucursal(currentEntity?.entity.id as string, item))
        return { label: branchId?.name, value: branchId?.id };
      })
    );
  }
  useEffect(() => {
    if (formStatus?.values?.employeeId) {
      getSucursalList(formStatus?.values?.employeeId as string).then(res => {
        setBranchList(res)
      })
    }
  }, [formStatus?.values?.employeeId])




  return { fields, validationSchema, setDinamicDataAction, initialValues }
}