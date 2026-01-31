/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import DynamicKeyValueInput from "@/components/common/forms/fields/DynamicKeyValueInput";
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { addressSchema, emailRule, requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { ArrayToObject, excludeKeyOfObject, objectToArray } from "@/lib/common/String";
import { createEmployee, fetchEmployee, updateEmployee } from "@/services/checkinbiz/employee.service";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import ToggleInput from "@/components/common/forms/fields/ToggleInput";
import PhoneNumberInput from "@/components/common/forms/fields/PhoneNumberInput";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useAppLocale } from "@/hooks/useAppLocale";
import AddressComplexInput from "@/components/common/forms/fields/AddressComplexInput";
import CalendarSection from "@/app/main/[entityId]/checkinbiz/calendar/components/CalendarSection";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import { Holiday } from "@/domain/features/checkinbiz/ICalendar";
import { upsertCalendar } from "@/services/checkinbiz/calendar.service";



export default function useFormController(isFromModal: boolean, onSuccess?: () => void) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const { open, closeModal } = useCommonModal()

  const { id } = useParams<{ id: string }>()
  const itemId = isFromModal ? open.args?.id : id
  const { currentLocale } = useAppLocale()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const [scheduleLoaded, setScheduleLoaded] = useState(false)
  const [calendarDraft, setCalendarDraft] = useState<any>(null)
  const [initialCalendarHash, setInitialCalendarHash] = useState<string>("")
  const [initialHolidays, setInitialHolidays] = useState<Holiday[]>([])




  const [validationSchema, setValidationSchema] = useState({
    metadata: Yup.array()
      .of(
        Yup.object().shape({
          label: requiredRule(t),
          value: requiredRule(t)
        })
      )
      .nullable(),
    fullName: requiredRule(t),
    phone: requiredRule(t),
    email: emailRule(t),
  })


  const [fields, setFields] = useState<Array<any>>([])
  const [initialValues, setInitialValues] = useState<Partial<IEmployee> & {
    overridesSchedule: any;
    enableDayTimeRange: boolean;
    disableBreak: boolean;
    timeBreak: number;
    notifyBeforeMinutes: number;
    overridesDisabled?: boolean;
    baseSchedule?: any;
    overrideSchedule?: any;
    baseAdvance?: any;
    overrideAdvance?: any;
    calendarConfig?: any;
  }>({
    "fullName": '',
    email: '',
    phone: '',
    role: "internal",
    status: 'active',
    nationalId: 'N/A',
    metadata: [],
    enableRemoteWork: false,
    enableA2F: true,
    enableDayTimeRange: false,
    disableBreak: false,
    timeBreak: 60,
    notifyBeforeMinutes: 15,
    overridesSchedule: {
      monday: { enabled: true, disabled: false, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
      tuesday: { enabled: true, disabled: false, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
      wednesday: { enabled: true, disabled: false, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
      thursday: { enabled: true, disabled: false, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
      friday: { enabled: true, disabled: false, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
      saturday: { enabled: false, disabled: true, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
      sunday: { enabled: false, disabled: true, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
    },
    baseSchedule: undefined,
    overrideSchedule: undefined,
    baseAdvance: undefined,
    overrideAdvance: undefined,
    overridesDisabled: true,
    calendarConfig: '',

  });

  const sanitizeSchedule = (schedule?: any, enableDayTimeRange?: boolean) => {
    const cleaned: any = {};
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
    dayKeys.forEach((dayKey) => {
      const dayValue: any = (schedule ?? {})[dayKey] ?? {};
      const start = dayValue.start ?? { hour: 9, minute: 0 };
      const end = dayValue.end ?? { hour: 17, minute: 0 };
      const isDisabled = dayValue.disabled ?? (dayValue.enabled === false);
      cleaned[dayKey] = {
        start,
        end,
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
      normalized[dayKey] = {
        start: dayValue.start ?? { hour: 9, minute: 0 },
        end: dayValue.end ?? { hour: 17, minute: 0 },
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





  const handleSubmit = async (values: Partial<IEmployee>, callback?: () => void) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      delete values.createdAt
      const {
        overridesSchedule,
        enableDayTimeRange,
        disableBreak,
        timeBreak,
        notifyBeforeMinutes,
        overridesDisabled,
        baseSchedule,
        overrideSchedule,
        baseAdvance,
        overrideAdvance,
        calendarConfig,
        ...employeeValues
      } = values as any

      const data = {
        ...employeeValues,
         "uid": user?.id as string,
        "metadata": {
          ...ArrayToObject(employeeValues.metadata as any),
        },
        "id": itemId,
        entityId: currentEntity?.entity.id
      }

      const calendarPayload = calendarDraft
        ? {
          overridesSchedule: calendarDraft.payloadSchedule,
          advance: calendarDraft.advance,
          holidays: calendarDraft.holidays ?? [],
          overridesDisabled: calendarDraft.overridesDisabled ?? false,
        }
        : null;
      const currentCalendarHash = calendarDraft ? buildCalendarHash(calendarDraft) : initialCalendarHash;
      const calendarDirty = calendarDraft && currentCalendarHash !== initialCalendarHash;

      let response
      if (itemId)
        await updateEmployee(data, token, currentLocale)
      else {
        response = await createEmployee(data, token, currentLocale)

      }


      if ((itemId || response?.employee?.id) && calendarDirty) {
        await upsertCalendar(
          {
            scope: "employee",
            entityId: currentEntity?.entity.id as string,
            employeeId: (itemId ?? response?.employee?.id) as string,
            overridesSchedule: calendarPayload?.overridesSchedule,
            advance: calendarPayload?.advance,
            holidays: calendarPayload?.holidays,
            timezone: values.address?.timeZone ?? currentEntity?.entity?.legal?.address?.timeZone ?? "UTC",
            overridesDisabled: calendarPayload?.overridesDisabled ?? false,
          } as any,
          token,
          currentLocale
        );
        setInitialCalendarHash(currentCalendarHash);
      }

      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');

      if (typeof onSuccess === 'function') onSuccess()
      if (typeof callback === 'function') callback()

      if (isFromModal)
        closeModal(CommonModalType.FORM)
      else {
        if (itemId)
          navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee/${itemId}/detail`)
        else
          navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee/${response.employee.id}/detail`)
      }
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };



  const fetchData = async () => {

    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const event: IEmployee = await fetchEmployee(currentEntity?.entity.id as string, itemId)
      const addressData = event?.address
      const entityCalendar = await getRefByPathData(`entities/${currentEntity?.entity.id}/calendar/config`);
      const employeeCalendar = await getRefByPathData(`entities/${currentEntity?.entity.id}/employees/${itemId}/calendar/config`);
      const fallbackSchedule = entityCalendar?.defaultSchedule
        ? Object.fromEntries(Object.entries(entityCalendar.defaultSchedule).map(([k, v]: any) => [k, { ...v, enabled: v.disabled ? false : v.enabled ?? true }]))
        : initialValues.overridesSchedule;
      const entityAdvance = entityCalendar?.advance ?? {
        enableDayTimeRange: false,
        disableBreak: false,
        timeBreak: 30,
        notifyBeforeMinutes: 15,
      };
      const employeeOverridesDisabled = employeeCalendar?.overridesDisabled ?? !employeeCalendar;
      const overrideScheduleRaw = employeeCalendar?.overridesSchedule ?? fallbackSchedule;
      const overrideAdvanceRaw = employeeCalendar?.advance ?? entityAdvance;
      const employeeSchedule = employeeOverridesDisabled ? fallbackSchedule : overrideScheduleRaw;
      const employeeAdvance = employeeOverridesDisabled ? entityAdvance : overrideAdvanceRaw;
      const scheduleForHash = sanitizeSchedule(employeeSchedule, employeeAdvance.enableDayTimeRange);
      const holidaysLoaded = employeeCalendar?.holidays ?? [];

      const initialValuesData = {
        ...event,
        enableA2F: event.enableA2F ?? true,
        metadata: objectToArray(event.metadata),
        overridesSchedule: normalizeScheduleForForm(employeeSchedule, fallbackSchedule),
        enableDayTimeRange: employeeAdvance.enableDayTimeRange ?? false,
        disableBreak: employeeAdvance.disableBreak ?? false,
        timeBreak: employeeAdvance.timeBreak ?? 30,
        notifyBeforeMinutes: employeeAdvance.notifyBeforeMinutes ?? 15,
        overridesDisabled: employeeOverridesDisabled,
        baseSchedule: fallbackSchedule,
        overrideSchedule: overrideScheduleRaw,
        baseAdvance: entityAdvance,
        overrideAdvance: overrideAdvanceRaw,
      }
      if (event.enableRemoteWork) {
        Object.assign(initialValuesData, {
          address: addressData
        })

        remoteFieldHandleValueChanged(event.enableRemoteWork)
      }

      setInitialValues(initialValuesData)
      setInitialHolidays(holidaysLoaded)
      setInitialCalendarHash(
        buildCalendarHash({
          payloadSchedule: scheduleForHash,
          advance: employeeAdvance,
          holidays: holidaysLoaded,
          overridesDisabled: employeeOverridesDisabled,
        })
      )
      setScheduleLoaded(true)
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }

  const remoteFieldHandleValueChanged = (checked: boolean) => {
    if (checked) {
      setFields(prevFields => [
        ...prevFields.filter(e => e.name !== 'metadata' && e.name !== 'additional_data_section' && e.name !== 'address'),
        {
          name: 'address',
          label: t('core.label.address'),
          required: true,
          fullWidth: true,
          component: AddressComplexInput,
        },
        ...addDataFields
      ])

      setValidationSchema(prevSchema => ({
        ...prevSchema,
        address: addressSchema(t)
      }))
    }
    else {
      setFields(prevFields => [
        ...prevFields.filter(f => !['address'].includes(f.name))
      ])    
     

      setValidationSchema(prevSchema => ({
        ...excludeKeyOfObject(prevSchema, 'address'),
      }))
    }
  }

  const buildFields = (vals: any = initialValues, holidays: Holiday[] = initialHolidays) => [
    {
      isDivider: true,
      label: t('core.label.personalData'),
    },
    {
      name: 'fullName',
      label: t('core.label.name'),
      type: 'text',
      required: true,
      component: TextInput,
    },

    {
      name: 'email',
      label: t('core.label.email'),
      type: 'text',
      disabled: !!itemId,
      required: true,
      component: TextInput,
    },
    {
      name: 'phone',
      label: t('core.label.phone'),
      type: 'text',
      required: true,
      component: PhoneNumberInput,
    },
    {
      name: 'role',
      label: t('core.label.role'),
      component: SelectInput,
      required: true,
      options: [
        { value: 'internal', label: t('core.label.internal') },
        { value: 'collaborator', label: t('core.label.collaborator') },

      ],
    },
    {
      name: 'status',
      label: t('core.label.status'),
      type: 'text',
      required: false,

      options: [
        { label: t('core.label.active'), value: 'active' },
        { label: t('core.label.inactive'), value: 'inactive' },
        { label: t('core.label.vacation'), value: 'vacation' },
        { label: t('core.label.sick_leave'), value: 'sick_leave' },
        { label: t('core.label.leave_of_absence'), value: 'leave_of_absence' },
        { label: t('core.label.paternity_leave'), value: 'paternity_leave' },
        { label: t('core.label.maternity_leave'), value: 'maternity_leave' },
      ],
      component: SelectInput,
    },



    {
      name: 'nationalId',
      label: t('core.label.nationalId'),
      type: 'text',
      required: false,
      component: TextInput,

    },

    {
      name: 'enableA2F',
      label: t('core.label.enableA2F'),
      required: false,
      component: ToggleInput,
    },
    {
      name: 'enableRemoteWork',
      label: t('core.label.enableRemoteWork'),
      required: false,
      component: ToggleInput,

      extraProps: {
        onHandleChange: remoteFieldHandleValueChanged,
      },
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
      component: CalendarSection,
      fullWidth: true,
      extraProps: {
        textAlign: 'left',
        scope: 'employee',
        entityId: currentEntity?.entity.id,
        employeeId: itemId,
        timezone: (vals as any)?.address?.timeZone ?? currentEntity?.entity?.legal?.address?.timeZone ?? "UTC",
        initialSchedule: vals?.overridesSchedule,
        initialAdvance: {
          enableDayTimeRange: vals?.enableDayTimeRange,
          disableBreak: vals?.disableBreak,
          timeBreak: vals?.timeBreak,
          notifyBeforeMinutes: vals?.notifyBeforeMinutes,
        },
        baseSchedule: (vals as any)?.baseSchedule,
        overrideSchedule: (vals as any)?.overrideSchedule,
        baseAdvance: (vals as any)?.baseAdvance,
        overrideAdvance: (vals as any)?.overrideAdvance,
        initialOverridesDisabled: vals?.overridesDisabled,
        initialHolidays: holidays,
        token: token,
        locale: currentLocale,
        onSaved: () => { },
        hideSaveButton: true,
        disableHolidayActions: !itemId,
        onChange: (data: any) => setCalendarDraft(data),
      }
    },

    ...addDataFields
  ];

  const inicialize = async () => {
    changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
    if (!itemId) {
      const entityCalendar = await getRefByPathData(`entities/${currentEntity?.entity.id}/calendar/config`);
      const fallbackSchedule = entityCalendar?.defaultSchedule
        ? Object.fromEntries(Object.entries(entityCalendar.defaultSchedule).map(([k, v]: any) => [k, { ...v, enabled: v.disabled ? false : v.enabled ?? true }]))
        : initialValues.overridesSchedule;
      const fallbackAdvance = entityCalendar?.advance ?? {
        enableDayTimeRange: false,
        disableBreak: false,
        timeBreak: 30,
        notifyBeforeMinutes: 15,
      };
      const scheduleForHash = sanitizeSchedule(fallbackSchedule, fallbackAdvance.enableDayTimeRange);
      setInitialCalendarHash(
        buildCalendarHash({
          payloadSchedule: scheduleForHash,
          advance: fallbackAdvance,
          holidays: [],
          overridesDisabled: true,
        })
      );
      setInitialHolidays([]);
      setInitialValues({
        "fullName": '',
        email: '',
        phone: '',
        role: "internal",
        nationalId: 'N/A',
        status: 'active',
        enableRemoteWork: false,
        enableA2F: true,
        metadata: [],
        address: { "country": "", "city": "", "postalCode": "", "street": "", "geo": { "lat": 0, "lng": 0 }, "timeZone": "" },
        overridesSchedule: normalizeScheduleForForm(fallbackSchedule, fallbackSchedule),
        enableDayTimeRange: fallbackAdvance.enableDayTimeRange ?? false,
        disableBreak: fallbackAdvance.disableBreak ?? false,
        timeBreak: fallbackAdvance.timeBreak ?? 30,
        notifyBeforeMinutes: fallbackAdvance.notifyBeforeMinutes ?? 15,
        overridesDisabled: true,
        baseSchedule: fallbackSchedule,
        overrideSchedule: fallbackSchedule,
        baseAdvance: fallbackAdvance,
        overrideAdvance: fallbackAdvance,
      } as any)
      setScheduleLoaded(true)
    }
    setFields([
      {
        isDivider: true,
        label: t('core.label.personalData'),
      },
      {
        name: 'fullName',
        label: t('core.label.name'),
        type: 'text',
        required: true,
        component: TextInput,
      },

      {
        name: 'email',
        label: t('core.label.email'),
        type: 'text',
        disabled: !!itemId,
        required: true,
        component: TextInput,
      },
      {
        name: 'phone',
        label: t('core.label.phone'),
        type: 'text',
        required: true,
        component: PhoneNumberInput,
      },
      {
        name: 'role',
        label: t('core.label.role'),
        component: SelectInput,
        required: true,
        options: [
          { value: 'internal', label: t('core.label.internal') },
          { value: 'collaborator', label: t('core.label.collaborator') },

        ],
      },
      {
        name: 'status',
        label: t('core.label.status'),
        type: 'text',
        required: false,

        options: [
          { label: t('core.label.active'), value: 'active' },
          { label: t('core.label.inactive'), value: 'inactive' },
          { label: t('core.label.vacation'), value: 'vacation' },
          { label: t('core.label.sick_leave'), value: 'sick_leave' },
          { label: t('core.label.leave_of_absence'), value: 'leave_of_absence' },
          { label: t('core.label.paternity_leave'), value: 'paternity_leave' },
          { label: t('core.label.maternity_leave'), value: 'maternity_leave' },
        ],
        component: SelectInput,
      },



      {
        name: 'nationalId',
        label: t('core.label.nationalId'),
        type: 'text',
        required: false,
        component: TextInput,

      },

      {
        name: 'enableA2F',
        label: t('core.label.enableA2F'),
        required: false,
        component: ToggleInput,
      },
      {
        name: 'enableRemoteWork',
        label: t('core.label.enableRemoteWork'),
        required: false,
        component: ToggleInput,

        extraProps: {
          onHandleChange: remoteFieldHandleValueChanged,
        },
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
      component: CalendarSection,
      fullWidth: true,
      extraProps: {
        textAlign: 'left',
        scope: 'employee',
          entityId: currentEntity?.entity.id,
          employeeId: itemId,
          timezone: (initialValues as any)?.address?.timeZone ?? currentEntity?.entity?.legal?.address?.timeZone ?? "UTC",
          initialSchedule: initialValues?.overridesSchedule,
          initialAdvance: {
            enableDayTimeRange: initialValues?.enableDayTimeRange,
            disableBreak: initialValues?.disableBreak,
            timeBreak: initialValues?.timeBreak,
            notifyBeforeMinutes: initialValues?.notifyBeforeMinutes,
          },
          baseSchedule: (initialValues as any)?.baseSchedule,
          overrideSchedule: (initialValues as any)?.overrideSchedule,
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
      },

      ...addDataFields
    ])

    changeLoaderState({ show: false })
  }

  const addDataFields = [
    {
      isDivider: true,
      name: 'additional_data_section',
      label: t('core.label.aditionalData'),
    },
    {
      name: 'metadata',
      label: t('core.label.setting'),
      type: 'text',
      required: true,
      fullWidth: true,
      component: DynamicKeyValueInput,
    }
  ]



  useEffect(() => {
    if (currentEntity?.entity.id) {
      inicialize()
    }
    if (currentEntity?.entity.id && user?.id && itemId)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, itemId])

  useEffect(() => {
    setFields(buildFields(initialValues, initialHolidays));
  }, [initialValues, initialHolidays]);


  return { fields, initialValues, validationSchema, handleSubmit }
}
