import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { requiredRule } from '@/config/yupRules';
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
  const [setCountrySelected] = useState<any>('España')
  const [initialValues, setInitialValues] = useState<Partial<ISucursal>>({
    "name": '',
    "country": 'España',
    "city": 'Madrid',
    address: ''

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
    address: requiredRule(t),
    country: requiredRule(t),
    city: requiredRule(t),

  });

  const handleSubmit = async (values: Partial<ISucursal>) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data = {
        ...values,
        "uid": user?.id as string,
        "metadata": ArrayToObject(values.metadata as any),
        "id": id,
        geo,

        entityId: currentEntity?.entity.id
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
      label: t('core.label.personalData'),
    },
    {
      name: 'name',
      label: t('core.label.name'),
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
          setCountrySelected(value)

        },
      },
      component: SelectInput,
      options: country.map(e => ({ label: e.name, value: e.name }))
    },
    {
      name: 'city',
      label: t('core.label.city'),
      component: SelectInput,
      options: cityList,

    },
    {
      name: 'address',
      label: t('core.label.address'),
      type: 'text',
      required: true,
      fullWidth: true,
      component: AddressInput,
      extraProps: {
        onHandleChange: (data: { lat: number, lng: number }) => {
          setGeo(data)
        },
      },

    },


  ];

  const fetchData = useCallback(async () => {

    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const event: ISucursal = await fetchSucursal(currentEntity?.entity.id as string, id)
      setInitialValues({
        ...event,
        metadata: objectToArray(event.metadata)
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