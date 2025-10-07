import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { ratioLogRule, requiredRule } from '@/config/yupRules';
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
import { country } from "@/config/country";
import AddressInput from "@/components/common/forms/fields/AddressInput";
import DynamicKeyValueInput from "@/components/common/forms/fields/DynamicKeyValueInput";


export default function useSucursalController() {
  const t = useTranslations();
  const { showToast } = useToast()

  const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const [geo, setGeo] = useState<{ lat: number, lng: number }>({ lat: 0, lng: 0 })
  const [cityList, setCityList] = useState<any>(country.find(e => e.name === 'España')?.states.map(e => ({ label: e.name, value: e.name })))

  const [initialValues, setInitialValues] = useState<Partial<any>>({
    "name": '',
    metadata: [],
    "country": 'España',
    "city": 'Madrid',
    geo: { lat: 0, lng: 0 },
    postalCode: '',
    region: '',
    street: '',
    ratioChecklog:100, 
   

  });

  const validationSchema = Yup.object().shape({
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
    ratioChecklog:ratioLogRule(t)
  });

  const handleSubmit = async (values: Partial<any>) => {
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
          street: values.street
        },
        entityId: currentEntity?.entity.id as string
      }
      if (id)
        await updateSucursal(data, token)
      else
        await createSucursal(data, token)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/sucursal`)
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
      fullWidth: true,
      required: true,
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
      options: cityList
    },

    {
      name: 'street',
      label: t('core.label.street'),
      type: 'textarea',
      fullWidth: true,
      component: AddressInput,
      extraProps: {
        onHandleChange: (data: { lat: number, lng: number }) => {
          setGeo(data)
        },
      },
    },

    {
      name: 'region',
      label: t('core.label.region'),
      component: TextInput,


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
      setInitialValues({
        "country": sucursal.address.country,
        "city": sucursal.address.city,
        geo: { lat: sucursal.address.geo.lat, lng: sucursal.address.geo.lng },
        postalCode: sucursal.address.postalCode,
        region: sucursal.address.region,
        street: sucursal.address.street,
        status:sucursal.status,
        ratioChecklog:sucursal.ratioChecklog,
        name:sucursal.name,
        metadata: objectToArray(sucursal.metadata)
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
  }, [currentEntity?.entity.id, user?.id, id, fetchData])


  return { fields, initialValues, validationSchema, handleSubmit }
}