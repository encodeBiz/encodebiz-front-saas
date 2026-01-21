/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { addressSchema, ratioLogRule, requiredRule, timeBreakRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { ArrayToObject, objectToArray } from "@/lib/common/String";
import { createSucursal, fetchSucursal, updateSucursal } from "@/services/checkinbiz/sucursal.service";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";

import DynamicKeyValueInput from "@/components/common/forms/fields/DynamicKeyValueInput";
import ToggleInput from "@/components/common/forms/fields/ToggleInput";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useAppLocale } from "@/hooks/useAppLocale";
import AddressComplexInput from "@/components/common/forms/fields/AddressComplexInput";
import { Alert, Box, Typography } from "@mui/material";
import { InfoOutline } from "@mui/icons-material";
import WorkScheduleField from "@/components/common/forms/fields/WorkScheduleField";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import { useFormStatus } from "@/hooks/useFormStatus";
import CalendarConfig from "@/app/main/[entityId]/checkinbiz/calendar/components/CalendarConfig";


export default function useFormController(isFromModal: boolean, onSuccess?: () => void) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const { currentLocale } = useAppLocale()

  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const { formStatus } = useFormStatus()

  const { open, closeModal, openModal } = useCommonModal()
  const { id } = useParams<{ id: string }>()
  const itemId = isFromModal ? open.args?.id : id
  const [disableBreak, setDisableBreak] = useState(false)
  const [, setDisableRatioChecklog] = useState(false)
  const [scheduleLoaded, setScheduleLoaded] = useState(false)

  const [initialValues, setInitialValues] = useState<Partial<any>>({
    "name": '',
    metadata: [],
    "country": '',
    "city": '',
    geo: { lat: 0, lng: 0 },
    postalCode: '',
    status: 'active',
    region: '',
    street: '',
    ratioChecklog: 201,
    disableRatioChecklog: false,
    nif: 'N/A',
    "disableBreak": false, //poner texto  explicativo en los detalles y el form
    "timeBreak": 60,
    notifyBeforeMinutes: 15,
    enableDayTimeRange: false,
    overridesSchedule: {
      monday: { enabled: true, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
      tuesday: { enabled: true, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
      wednesday: { enabled: true, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
      thursday: { enabled: true, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
      friday: { enabled: true, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
      saturday: { enabled: true, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
      sunday: { enabled: false, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
    },
    disabled: false,
    holidaysInfo: '',
  });

  const defaultValidationSchema: any = {
    metadata: Yup.array()
      .of(
        Yup.object().shape({
          label: requiredRule(t),
          value: requiredRule(t)
        })
      )
      .nullable(),
    address: addressSchema(t),
    name: requiredRule(t),
    nif: requiredRule(t),
    status: requiredRule(t),
    ratioChecklog: ratioLogRule(t),
    timeBreak: timeBreakRule(t),
    notifyBeforeMinutes: timeBreakRule(t),
  }
  const [validationSchema] = useState(defaultValidationSchema)



  const handleSubmit = async (values: Partial<any>, callback?: () => void) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: ISucursal = {
        name: values.name,
        ratioChecklog: values.ratioChecklog ?? 0,
        disableRatioChecklog: !values.disableRatioChecklog,
        status: values.status,
        nif: values.nif,
        "metadata": ArrayToObject(values.metadata as any),
        "id": itemId,
        address: values.address,
        entityId: currentEntity?.entity.id as string,
        advance: {
          "disableBreak": values.disableBreak,
          "timeBreak": values.timeBreak,
          notifyBeforeMinutes: values.notifyBeforeMinutes,
        }
      }


      if (itemId)
        await updateSucursal(data, token, currentLocale)
      else {
        const resp = await createSucursal(data, token, currentLocale)
        if (resp?.id) {
          values.id = resp.id
        }
      }

      const branchIdToUse = itemId ?? (values.id as string | undefined)
      // calendar handled via CalendarConfig
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');

      if (typeof onSuccess === 'function') onSuccess()
      if (typeof callback === 'function') callback()

      if (isFromModal)
        closeModal(CommonModalType.FORM)
      else {
        if (itemId)
          navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/branch/${itemId}/detail`)
        else
          navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/branch`)
      }
    } catch (error: any) {
      const errorData = JSON.parse(error.message)

      if (errorData.code === 'subscription/limit_off')
        openModal(CommonModalType.INFO)
      else
        showToast(errorData.message, 'error')

      changeLoaderState({ show: false })

    }
  };


  const fields = [
    {
      isDivider: true,
      label: t('sucursal.formFirstSectionTitle'),
    },
    {
      name: 'name',
      label: t('core.label.subEntityName'),
      type: 'text',

      required: true,
      component: TextInput,
    },
    {
      name: 'nif',
      label: t('core.label.nif'),
      component: TextInput,
    },
    {
      name: 'address',
      label: t('sucursal.address'),
      required: true,
      fullWidth: true,
      component: AddressComplexInput,
    },

    {
      isDivider: true,
      label: t('core.label.ratioChecklogTitle'),
    },


    {
      name: 'ratioChecklog',
      label: t('core.label.ratioChecklog'),
      component: TextInput,
      type: 'number'


    },
    {
      name: 'disableRatioChecklog',
      label: t('core.label.disableRatioChecklogE'),
      required: false,
      component: ToggleInput,
      extraProps: {
        onHandleChange: setDisableRatioChecklog
      },
    },
    {
      name: 'status',
      label: t('core.label.status'),
      component: SelectInput,
      required: true,
      fullWidth: true,
      options: [
        { value: 'active', label: t('core.label.active') },
        { value: 'inactive', label: t('core.label.inactive') },
      ],
    },


    {
      isDivider: true,
      label: t('calendar.title'),
      hit: t('calendar.schedule.subtitle'),
      extraProps: { disabledBottomMargin: true }
    },
    {
      name: 'calendarConfig',
      label: t('calendar.title'),
      component: CalendarConfig,
      fullWidth: true,
      extraProps: {
        scope: 'branch',
        entityId: currentEntity?.entity.id,
        branchId: itemId,
        timezone: (initialValues as any)?.address?.timeZone ?? currentEntity?.entity?.legal?.address?.timeZone ?? "UTC",
        initialSchedule: (formStatus?.values as any)?.overridesSchedule,
        initialAdvance: {
          enableDayTimeRange: (formStatus?.values as any)?.enableDayTimeRange,
          disableBreak: (formStatus?.values as any)?.disableBreak,
          timeBreak: (formStatus?.values as any)?.timeBreak,
          notifyBeforeMinutes: (formStatus?.values as any)?.notifyBeforeMinutes,
        },
        initialDisabled: (formStatus?.values as any)?.disabled,
        initialHolidays: [],
        token: token,
        locale: currentLocale,
        onSaved: () => { }
      }
    },

    {
      isDivider: true,
      label: t('core.label.aditionalData'),
    },

    {
      name: 'metadata',
      label: t('core.label.setting'),
      type: 'text',
      required: true,
      fullWidth: true,
      component: DynamicKeyValueInput,
    },
  ];

  const fetchData = useCallback(async () => {

    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const sucursal: ISucursal = await fetchSucursal(currentEntity?.entity.id as string, itemId)
      const entityCalendar = await getRefByPathData(`entities/${currentEntity?.entity.id}/calendar/config`);
      const branchCalendar = await getRefByPathData(`entities/${currentEntity?.entity.id}/branches/${itemId}/calendar/config`);
      const fallbackSchedule = entityCalendar?.defaultSchedule ? Object.fromEntries(
        Object.entries(entityCalendar.defaultSchedule).map(([k, v]: any) => [k, { ...v, enabled: true }])
      ) : initialValues.overridesSchedule;
      const fallbackAdvance = entityCalendar?.advance ?? {
        enableDayTimeRange: false,
        disableBreak: false,
        timeBreak: 30,
        notifyBeforeMinutes: 15,
      };

      setDisableBreak(sucursal?.advance?.disableBreak ?? false)
      setDisableRatioChecklog((!sucursal?.disableRatioChecklog))
      setInitialValues({
        address: sucursal.address,
        postalCode: sucursal.address.postalCode,
        disableRatioChecklog: !sucursal.disableRatioChecklog,
        status: sucursal.status,
        ratioChecklog: sucursal.ratioChecklog,
        name: sucursal.name,
        nif: sucursal.nif ?? 'N/A',
        metadata: objectToArray(sucursal.metadata),
        disableBreak: branchCalendar?.advance?.disableBreak ?? fallbackAdvance.disableBreak,
        timeBreak: branchCalendar?.advance?.timeBreak ?? fallbackAdvance.timeBreak,
        notifyBeforeMinutes: branchCalendar?.advance?.notifyBeforeMinutes ?? fallbackAdvance.notifyBeforeMinutes,
        enableDayTimeRange: branchCalendar?.advance?.enableDayTimeRange ?? fallbackAdvance.enableDayTimeRange,
        overridesSchedule: branchCalendar?.overridesSchedule ?? fallbackSchedule,
        disabled: branchCalendar?.disabled ?? false,
      })
      setScheduleLoaded(true)
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }, [currentEntity?.entity.id, itemId])

  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && itemId)
      fetchData()
    else if (currentEntity?.entity.id && !itemId) {
      // carga fallback de entidad para alta
      (async () => {
        try {
          changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
          const entityCalendar = await getRefByPathData(`entities/${currentEntity?.entity.id}/calendar/config`);
          const fallbackSchedule = entityCalendar?.defaultSchedule ? Object.fromEntries(
            Object.entries(entityCalendar.defaultSchedule).map(([k, v]: any) => [k, { ...v, enabled: true }])
          ) : initialValues.overridesSchedule;
          const fallbackAdvance = entityCalendar?.advance ?? {
            enableDayTimeRange: false,
            disableBreak: false,
            timeBreak: 30,
            notifyBeforeMinutes: 15,
          };
          setInitialValues(prev => ({
            ...prev,
            overridesSchedule: fallbackSchedule,
            enableDayTimeRange: fallbackAdvance.enableDayTimeRange,
            disableBreak: fallbackAdvance.disableBreak,
            timeBreak: fallbackAdvance.timeBreak,
            notifyBeforeMinutes: fallbackAdvance.notifyBeforeMinutes,
            disabled: false,
          }))
          setScheduleLoaded(true)
        } catch (error) {
          // ignore
        } finally {
          changeLoaderState({ show: false })
        }
      })()
    }
  }, [currentEntity?.entity.id, user?.id, itemId])



  return { fields, initialValues, validationSchema, handleSubmit }
}
