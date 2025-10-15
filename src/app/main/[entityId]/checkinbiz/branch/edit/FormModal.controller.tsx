/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { ratioLogRule, requiredRule, timeBreakRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useLayout } from "@/hooks/useLayout";
import { useCallback, useEffect, useState } from "react";
import { useEntity } from "@/hooks/useEntity";
import { createSucursal, fetchSucursal, updateSucursal } from "@/services/checkinbiz/sucursal.service";
import SelectInput from "@/components/common/forms/fields/SelectInput";
import { useFormStatus } from "@/hooks/useFormStatus";
import AddressInput from "@/components/common/forms/fields/AddressInput";
import DynamicKeyValueInput from "@/components/common/forms/fields/DynamicKeyValueInput";
import TextInput from "@/components/common/forms/fields/TextInput";
import TimeInput from "@/components/common/forms/fields/TimeInput";
import ToggleInput from "@/components/common/forms/fields/ToggleInput";
import { country } from "@/config/country";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";
import { ArrayToObject, objectToArray } from "@/lib/common/String";
import * as Yup from 'yup';
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";


export default function useFormModalController(onSuccess: () => void) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { open, closeModal } = useCommonModal()
  const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const id = open.args?.id
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const { formStatus } = useFormStatus()
  const [geo, setGeo] = useState<{ lat: number, lng: number }>({ lat: 0, lng: 0 })
  const [cityList, setCityList] = useState<any>(country.find(e => e.name === 'España')?.states.map(e => ({ label: e.name, value: e.name })))
  const [tz, setTz] = useState('')
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
    ratioChecklog: 100,
    disableRatioChecklog: false,

    startTime: null,
    endTime: null,
    "enableDayTimeRange": false,
    "disableBreak": false,
    "timeBreak": null

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
    street: requiredRule(t),
    country: requiredRule(t),
    city: requiredRule(t),
    name: requiredRule(t),
    postalCode: requiredRule(t),
    status: requiredRule(t),
    ratioChecklog: ratioLogRule(t)
  }
  const [validationSchema, setValidationSchema] = useState(defaultValidationSchema)



  const handleSubmit = async (values: Partial<any>, callback: () => void) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: ISucursal = {
        name: values.name,
        ratioChecklog: values.ratioChecklog ?? 0,
        status: values.status,
        "metadata": ArrayToObject(values.metadata as any),
        "id": id,
        address: {
          "country": values.country,
          "city": values.city,
          geo,
          postalCode: values.postalCode,
          region: values.region,
          street: values.street,
          timeZone: tz
        },
        entityId: currentEntity?.entity.id as string,
        advance: {
          "enableDayTimeRange": values.enableDayTimeRange,
          "startTimeWorkingDay": { hour: new Date(values.startTime).getHours(), minute: new Date(values.startTime).getMinutes() },
          "endTimeWorkingDay": { hour: new Date(values.endTime).getHours(), minute: new Date(values.endTime).getMinutes() },
          "disableBreak": values.disableBreak,
          "timeBreak": values.timeBreak,

        }
      }


      if (id)
        await updateSucursal(data, token)
      else
        await createSucursal(data, token)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      onSuccess()
      callback()
      if (id)
        closeModal(CommonModalType.FORM)
      else
        navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/branch`)
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };


  const fields = [
    {
      isDivider: true,
      label: t('core.label.subEntityData'),
    },
    {
      name: 'name',
      label: t('core.label.subEntityName'),
      type: 'text',

      required: true,
      component: TextInput,
    },
    {
      name: 'nit',
      label: t('core.label.nit'),
      component: TextInput,
    },
    {
      name: 'country',
      label: t('core.label.country'),
      extraProps: {
        onHandleChange: (value: any) => {
          setCityList(country.find((e: any) => e.name === value)?.states?.map(e => ({ label: e.name, value: e.name })) ?? [])
        },
      },
      component: SelectInput,
      options: country.map(e => ({ label: e.name, value: e.name }))
    },
    {
      name: 'city',
      label: t('core.label.city'),
      component: SelectInput,
      options: cityList
    },

    {
      name: 'postalCode',
      label: t('core.label.postalCode'),
      component: TextInput,
      fullWidth: true,

    },

    {
      name: 'street',
      label: t('core.label.street'),
      type: 'textarea',
      fullWidth: true,
      component: AddressInput,
      extraProps: {
        onHandleChange: (data: { lat: number, lng: number, timeZone: string }) => {
          setGeo({ lat: data.lat, lng: data.lng })
          setTz(data.timeZone)
        },
      },
    },

    {
      name: 'disableRatioChecklog',
      label: t('core.label.disableRatioChecklog'),
      required: false,
      component: ToggleInput,

    },

    {
      name: 'ratioChecklog',
      label: t('core.label.ratioChecklog'),
      component: TextInput,
      type: 'number'


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
      label: t('core.label.advance'),
    },
    {
      isCollapse: true,
      column: 3,
      label: t('core.label.dayTimeRange'),
      fieldList: [
        {
          name: 'enableDayTimeRange',
          label: t('core.label.enableDayTimeRange'),
          component: ToggleInput,
          required: true,
        },
        {
          name: 'startTime',
          label: t('core.label.startTime'),
          component: TimeInput,
          required: true,
        },
        {
          name: 'endTime',
          label: t('core.label.endTime'),
          component: TimeInput,
          required: true,
        },
      ]
    },

    {
      isCollapse: true,
      column: 3,
      label: t('core.label.breakTimeRange'),
      fieldList: [
        {
          name: 'disableBreak',
          label: t('core.label.disableBreak'),
          component: ToggleInput,
          required: true,
        },
        {
          name: 'timeBreak',
          label: t('core.label.timeBreak'),
          component: TextInput,
          type: 'number',
          required: true,
        },

      ]
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
      const sucursal: ISucursal = await fetchSucursal(currentEntity?.entity.id as string, id)
      setCityList(country.find((e: any) => e.name === sucursal.address.country)?.states?.map(e => ({ label: e.name, value: e.name })) ?? [])
      setGeo({ lat: sucursal.address.geo.lat, lng: sucursal.address.geo.lng })
      setTz(sucursal.address?.timeZone as string)

      const startTime = new Date()
      startTime.setMinutes(sucursal?.advance?.startTimeWorkingDay?.minute ?? 0)
      startTime.setHours(sucursal?.advance?.startTimeWorkingDay?.hour ?? 0)

      const endTime = new Date()
      endTime.setMinutes(sucursal?.advance?.endTimeWorkingDay?.minute ?? 0)
      endTime.setHours(sucursal?.advance?.endTimeWorkingDay?.hour ?? 0)

      setInitialValues({
        "country": sucursal.address.country,
        "city": sucursal.address.city,
        geo: { lat: sucursal.address.geo.lat, lng: sucursal.address.geo.lng },
        postalCode: sucursal.address.postalCode,
        region: sucursal.address.region,
        street: sucursal.address.street,
        status: sucursal.status,
        ratioChecklog: sucursal.ratioChecklog,
        name: sucursal.name,
        metadata: objectToArray(sucursal.metadata),
        "enableDayTimeRange": sucursal?.advance?.enableDayTimeRange,
        "startTime": startTime,
        "endTime": endTime,
        "disableBreak": sucursal?.advance?.disableBreak,
        "timeBreak": sucursal?.advance?.timeBreak,

      })
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }, [changeLoaderState, currentEntity?.entity.id, id, showToast, t])

  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, id])

  useEffect(() => {
    if (formStatus?.values?.enableDayTimeRange)
      setValidationSchema({
        ...validationSchema,
        startTime: requiredRule(t),
        endTime: requiredRule(t),
      })
    else {
      delete validationSchema.startTime
      delete validationSchema.endTime
      setValidationSchema({
        ...validationSchema,
      })
    }


    if (formStatus?.values?.disableBreak)
      setValidationSchema({
        ...validationSchema,
        timeBreak: timeBreakRule(t),
      })

    else {
      delete validationSchema.timeBreak
      setValidationSchema({
        ...validationSchema
      })
    }
  }, [formStatus?.values])

  return { fields, initialValues, validationSchema, handleSubmit }
}