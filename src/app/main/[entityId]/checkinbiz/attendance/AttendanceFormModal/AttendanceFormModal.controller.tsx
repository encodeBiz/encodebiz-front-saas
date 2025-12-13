/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { maxLengthRule, requiredRule } from '@/config/yupRules';
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
import { Timestamp } from "firebase/firestore";
import { updateChecklog } from "@/services/checkinbiz/report.service";
import { useAppLocale } from "@/hooks/useAppLocale";
import TextInput from "@/components/common/forms/fields/TextInput";


export default function useAttendanceFormModalController(onSuccess: () => void, employeeId?: string, branchId?: string,) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { token, user } = useAuth()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const { formStatus } = useFormStatus()
  const { closeModal, open } = useCommonModal()
  const { currentLocale } = useAppLocale()


  const [initialValues, setInitialValues] = useState<Partial<IChecklog>>({
    status: 'valid',
    branchId: branchId ?? '' as string,
    employeeId: employeeId ?? '' as string,
    type: undefined,
    timestamp: null,
    reason: ''
  })

  const [branchList, setBranchList] = useState<Array<any>>([])
  const [validationSchema, setValidationSchema] = useState<any>({
    employeeId: requiredRule(t),
    branchId: requiredRule(t),
    type: requiredRule(t),
    timestamp: requiredRule(t),
    reason: maxLengthRule(t, 400)
  })


  const setDinamicDataAction = async (values: Partial<IChecklog>, callback: () => void) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      if (!open.args?.data) {
        const branch = await fetchSucursal(currentEntity?.entity?.id as string, (branchId ?? values.branchId) as string)
        const data: IChecklog & { isAdmin: boolean } = {
          "employeeId": employeeId ?? values.employeeId as string,
          "entityId": currentEntity?.entity?.id as string,
          "branchId": branchId ?? values.branchId as string,
          "type": values.type as "checkout" | "checkin" | "restin" | "restout",
          "geo": {
            "lat": branch.address.geo.lat,
            "lng": branch.address.geo.lng
          },
          timestamp: values.timestamp,
          updateId: user?.id,
          status: 'valid',
          failedCode: '',
          isAdmin: true
        }

        await createLog(data, token, currentLocale)
      } else {
        const data: Partial<IChecklog> = {
          entityId: open.args?.data?.entityId,
          employeeId: open.args?.data?.employeeId,
          branchId: open.args?.data?.branchId,
          type: open.args?.data?.type,
          id: open.args?.data?.id,
          timestamp: values.timestamp,
          status: values.status as any,
          failedCode: '',
          reason: values.reason
        }
        await updateChecklog(data, token, currentLocale)

      }

      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      closeModal(CommonModalType.CHECKLOGFORM)
      if (typeof onSuccess === 'function') onSuccess()
      if (typeof callback === 'function') callback()

    } catch (error: any) {
      formStatus?.setSubmitting(false)
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };
  let fields = []
  if (!open.args?.data) {
    fields = [
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
  } else {
    fields = [
      {
        name: 'status',
        label: t('core.label.status'),
        component: SelectInput,
        options: [
          { value: 'valid' as string, label: t('core.label.valid') },
          { value: 'failed' as string, label: t('core.label.failed') },
        ]
      },
      {
        name: 'timestamp',
        label: t('core.label.timestamp'),
        component: DateInput,

      },

      {
        name: 'reason',
        label: t('core.label.reason'),
        type: 'textarea',
        fullWidth: true,
        required: true,
        component: TextInput,
      },


    ];
  }


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


  useEffect(() => {
    if (open.args?.data) {
      console.log(open.args?.data);      
      setInitialValues({
        ...initialValues,
        status: open.args?.data ? open.args?.data.status : 'valid',
        timestamp: (open.args?.data.timestamp instanceof Timestamp) ? open.args?.data.timestamp.toDate() : new Date(open.args?.data.timestamp),
        reason: open.args?.data?.reason ?? ''
      })
      setValidationSchema({
        status: requiredRule(t),
        timestamp: requiredRule(t),
      })
    }
  }, [open.args?.data])



  return { fields, validationSchema, setDinamicDataAction, initialValues }
}