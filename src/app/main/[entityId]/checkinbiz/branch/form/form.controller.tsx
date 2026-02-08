/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { addressSchema, ratioLogRule, requiredRule, timeBreakRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams, useRouter } from "next/navigation";
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
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import { useFormStatus } from "@/hooks/useFormStatus";
import CalendarSection from "@/app/main/[entityId]/checkinbiz/calendar/components/CalendarSection";
import { upsertCalendar } from "@/services/checkinbiz/calendar.service";
import { Holiday } from "@/domain/features/checkinbiz/ICalendar";


export default function useFormController(isFromModal: boolean, onSuccess?: () => void) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const { currentLocale } = useAppLocale()
  const router = useRouter()

  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const { formStatus } = useFormStatus()

  const { open, closeModal, openModal } = useCommonModal()
  const { id } = useParams<{ id: string }>()
  const itemId = isFromModal ? open.args?.id : id
  const [, setDisableRatioChecklog] = useState(false)
  const [scheduleLoaded, setScheduleLoaded] = useState(false)
  const [calendarDraft, setCalendarDraft] = useState<any>(null)
  const [initialCalendarHash, setInitialCalendarHash] = useState<string>("")
  const [initialHolidays, setInitialHolidays] = useState<Holiday[]>([])

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
    baseSchedule: undefined,
    overrideSchedule: undefined,
    baseAdvance: undefined,
    overrideAdvance: undefined,
    disabled: false,
    holidaysInfo: '',
    overridesDisabled: true,
    calendarConfig: '',
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
  const minutesOf = (time?: { hour?: number; minute?: number }) => (time?.hour ?? 0) * 60 + (time?.minute ?? 0);
  const sanitizeSchedule = (schedule?: any, enableDayTimeRange?: boolean) => {
    const cleaned: any = {};
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
    dayKeys.forEach((dayKey) => {
      const dayValue: any = (schedule ?? {})[dayKey] ?? {};
      const shifts = Array.isArray(dayValue.shifts) && dayValue.shifts.length
        ? dayValue.shifts.map((s: any, idx: number) => ({
          start: s?.start ?? { hour: 9, minute: 0 },
          end: s?.end ?? { hour: 17, minute: 0 },
          id: s?.id ?? `shift-${idx}`
        }))
        : [{ start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 }, id: 'shift-0' }];
      const isDisabled = dayValue.disabled ?? (dayValue.enabled === false);
      cleaned[dayKey] = {
        shifts,
        strictRange: enableDayTimeRange || dayValue.strictRange ? true : undefined,
        disabled: isDisabled,
      };
    });
    return cleaned;
  };
  const normalizeScheduleForForm = (schedule?: any, fallback?: any) => {
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
    const base = fallback ?? initialValues.overridesSchedule;
    const normalized: any = {};
    dayKeys.forEach((dayKey) => {
      const dayValue: any = (schedule ?? {})[dayKey] ?? (base as any)?.[dayKey] ?? {};
      const enabled = dayValue.disabled ? false : dayValue.enabled ?? true;
      const shifts = Array.isArray(dayValue.shifts) && dayValue.shifts.length
        ? dayValue.shifts
        : [{
          start: dayValue.start ?? { hour: 9, minute: 0 },
          end: dayValue.end ?? { hour: 17, minute: 0 },
          id: 'shift-0',
        }];
      normalized[dayKey] = {
        shifts,
        start: shifts[0]?.start,
        end: shifts[0]?.end,
        enabled,
        disabled: dayValue.disabled ?? !enabled,
        strictRange: dayValue.strictRange,
      };
    });
    return normalized;
  };
  const buildCalendarHash = (data?: { payloadSchedule?: any; advance?: any; holidays?: any[]; overridesDisabled?: boolean }) =>
    JSON.stringify({
      schedule: data?.payloadSchedule ?? {},
      advance: data?.advance ?? {},
      holidays: data?.holidays ?? [],
      overridesDisabled: data?.overridesDisabled ?? false,
    });



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
          enableDayTimeRange: values.enableDayTimeRange,
          disableBreak: values.disableBreak,
          timeBreak: values.timeBreak,
          notifyBeforeMinutes: values.notifyBeforeMinutes,
        }
      }

      let branchIdToUse = itemId
      if (itemId) {
        const requests: Promise<any>[] = []
        requests.push(updateSucursal(data, token, currentLocale))

        const currentCalendarHash = calendarDraft ? buildCalendarHash(calendarDraft) : initialCalendarHash
        const calendarDirty = calendarDraft && currentCalendarHash !== initialCalendarHash

        if (calendarDirty) {
          requests.push(
            upsertCalendar(
              {
                scope: "branch",
                entityId: currentEntity?.entity.id as string,
                branchId: itemId,
                overridesSchedule: calendarDraft.payloadSchedule,
                advance: calendarDraft.advance,
                timezone: values.address?.timeZone ?? currentEntity?.entity?.legal?.address?.timeZone ?? "UTC",
                overridesDisabled: calendarDraft.overridesDisabled ?? false,
              } as any,
              token,
              currentLocale
            )
          )
        }

        await Promise.all(requests)
        if (calendarDraft && calendarDirty) {
          setInitialCalendarHash(currentCalendarHash)
        }
      } else {
        const resp = await createSucursal(data, token, currentLocale)
        if (resp?.id) {
          values.id = resp.id
          branchIdToUse = resp.id
        }
        const currentCalendarHash = calendarDraft ? buildCalendarHash(calendarDraft) : initialCalendarHash
        const calendarDirty = calendarDraft && currentCalendarHash !== initialCalendarHash
        if (calendarDirty && branchIdToUse) {
          await upsertCalendar(
            {
              scope: "branch",
              entityId: currentEntity?.entity.id as string,
              branchId: branchIdToUse,
              overridesSchedule: calendarDraft.payloadSchedule,
              advance: calendarDraft.advance,
              timezone: values.address?.timeZone ?? currentEntity?.entity?.legal?.address?.timeZone ?? "UTC",
              overridesDisabled: calendarDraft.overridesDisabled ?? false,
            } as any,
            token,
            currentLocale
          )
          setInitialCalendarHash(currentCalendarHash)
        }
      }

      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      router.refresh();

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


  const fields = useMemo(() => {
    const baseFields: any[] = [
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
    ];

    baseFields.push(
      {
        isDivider: true,
        label: t('calendar.title'),
        hit: t('calendar.schedule.subtitle'),
        extraProps: { disabledBottomMargin: true }
      },
      {
        name: 'calendarConfig',
        label: t('calendar.title'),
        component: CalendarSection,
        fullWidth: true,
        extraProps: {
          textAlign: 'left',
          scope: 'branch',
          entityId: currentEntity?.entity.id,
          branchId: itemId,
          timezone: (initialValues as any)?.address?.timeZone ?? currentEntity?.entity?.legal?.address?.timeZone ?? "UTC",
          initialSchedule: initialValues?.overridesSchedule,
          baseSchedule: (initialValues as any)?.baseSchedule,
          overrideSchedule: (initialValues as any)?.overrideSchedule,
          initialAdvance: {
            enableDayTimeRange: initialValues?.enableDayTimeRange,
            disableBreak: initialValues?.disableBreak,
            timeBreak: initialValues?.timeBreak,
            notifyBeforeMinutes: initialValues?.notifyBeforeMinutes,
          },
          baseAdvance: (initialValues as any)?.baseAdvance,
          overrideAdvance: (initialValues as any)?.overrideAdvance,
          initialOverridesDisabled: initialValues?.overridesDisabled,
          initialHolidays,
          token: token,
          locale: currentLocale,
          onSaved: () => { },
          hideSaveButton: true,
          disableHolidayActions: !itemId,
          onChange: (data: any) => setCalendarDraft(data),
        }
      }
    );

    baseFields.push(
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
    );

    return baseFields;
  }, [currentEntity?.entity.id, currentLocale, initialHolidays, initialValues, itemId, setDisableRatioChecklog, setCalendarDraft, t, token]);

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
      setInitialHolidays(branchCalendar?.holidays ?? []);

      const branchOverridesDisabled = branchCalendar?.overridesDisabled ?? !branchCalendar;
      const overrideScheduleRaw = branchCalendar?.overridesSchedule ?? fallbackSchedule;
      const overrideAdvanceRaw = branchCalendar?.advance ?? fallbackAdvance;
      const effectiveAdvance = branchOverridesDisabled ? fallbackAdvance : overrideAdvanceRaw;
      const effectiveSchedule = branchOverridesDisabled ? fallbackSchedule : overrideScheduleRaw;

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
        disableBreak: effectiveAdvance.disableBreak ?? false,
        timeBreak: effectiveAdvance.timeBreak ?? fallbackAdvance.timeBreak,
        notifyBeforeMinutes: effectiveAdvance.notifyBeforeMinutes ?? fallbackAdvance.notifyBeforeMinutes,
        enableDayTimeRange: effectiveAdvance.enableDayTimeRange ?? fallbackAdvance.enableDayTimeRange,
        overridesSchedule: normalizeScheduleForForm(effectiveSchedule, fallbackSchedule),
        disabled: branchCalendar?.disabled ?? false,
        overridesDisabled: branchOverridesDisabled,
        baseSchedule: fallbackSchedule,
        overrideSchedule: overrideScheduleRaw,
        baseAdvance: fallbackAdvance,
        overrideAdvance: overrideAdvanceRaw,
      })
      const scheduleForHash = sanitizeSchedule(
        effectiveSchedule,
        effectiveAdvance.enableDayTimeRange ?? fallbackAdvance.enableDayTimeRange
      );
      setInitialCalendarHash(
        buildCalendarHash({
          payloadSchedule: scheduleForHash,
          advance: effectiveAdvance,
          holidays: branchCalendar?.holidays ?? [],
          overridesDisabled: branchOverridesDisabled,
        })
      )
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
          const scheduleForHash = sanitizeSchedule(fallbackSchedule, fallbackAdvance.enableDayTimeRange);
          setInitialHolidays([]);
          setInitialValues(prev => ({
            ...prev,
            overridesSchedule: normalizeScheduleForForm(undefined, fallbackSchedule),
            enableDayTimeRange: fallbackAdvance.enableDayTimeRange,
            disableBreak: fallbackAdvance.disableBreak,
            timeBreak: fallbackAdvance.timeBreak,
            notifyBeforeMinutes: fallbackAdvance.notifyBeforeMinutes,
            disabled: false,
            overridesDisabled: true,
            baseSchedule: fallbackSchedule,
            overrideSchedule: fallbackSchedule,
            baseAdvance: fallbackAdvance,
            overrideAdvance: fallbackAdvance,
          }))
          setInitialCalendarHash(
            buildCalendarHash({
              payloadSchedule: scheduleForHash,
              advance: {
                enableDayTimeRange: fallbackAdvance.enableDayTimeRange,
                disableBreak: fallbackAdvance.disableBreak,
                timeBreak: fallbackAdvance.timeBreak,
                notifyBeforeMinutes: fallbackAdvance.notifyBeforeMinutes,
              },
              holidays: [],
              overridesDisabled: true,
            })
          )
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
