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


export default function useFormController(isFromModal: boolean, onSuccess?: () => void) {
  const t = useTranslations();
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const { currentLocale } = useAppLocale()

  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()

  const { open, closeModal, openModal } = useCommonModal()
  const { id } = useParams<{ id: string }>()
  const itemId = isFromModal ? open.args?.id : id
  const [disableBreak, setDisableBreak] = useState(false)
  const [, setDisableRatioChecklog] = useState(false)

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
      else
        await createSucursal(data, token, currentLocale)
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
      label: t('core.label.advance'),
    },
    {
      isDivider: true,
      label: t('core.label.adviseWorkDay'),
      hit: t('core.label.adviseWorkDayText'),
    },
    {
      name: 'notifyBeforeMinutes',
      label: t('core.label.minute'),
      type: 'number',
      component: TextInput,
    },

    {
      isCollapse: true,
      column: 3,
      hit: t('core.label.timeBreakDesc'),
      label: t('core.label.breakTimeRange'),
      extraProps: {
        alertMessage: <Box>
          <Alert sx={{ borderRadius: 2, mt: 2, color: '#FFF', bgcolor: theme => disableBreak ? theme.palette.primary.main : theme.palette.grey[800] }} icon={<InfoOutline sx={{ color: '#FFF' }} />} >
            {disableBreak ? <><Typography>{t('sucursal.fieldHelp1')} <strong>{t('sucursal.fieldHelp2')}</strong>{t('sucursal.fieldHelp3')}</Typography>
              <Typography>{t('sucursal.fieldHelp4')}<strong>{t('sucursal.fieldHelp5')}</strong>{t('sucursal.fieldHelp6')}</Typography>
              <Typography>{t('sucursal.fieldHelp7')}</Typography>
            </> : <>
              <Typography>{t('sucursal.fieldHelp8')} <strong>{t('sucursal.fieldHelp9')}</strong>{t('sucursal.fieldHelp10')}</Typography>
              <Typography>{t('sucursal.fieldHelp11')}</Typography>
            </>}
          </Alert>
        </Box>
      },
      fieldList: [

        {
          name: 'timeBreak',
          label: t('core.label.timeBreak'),
          component: TextInput,
          type: 'number',
          required: true,
        },
        {
          name: 'disableBreak',
          label: disableBreak ? t('sucursal.breakEnableText') : t('sucursal.breakDisabledText'),
          component: ToggleInput,
          required: true,
          extraProps: {
            onHandleChange: setDisableBreak
          },
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
      const sucursal: ISucursal = await fetchSucursal(currentEntity?.entity.id as string, itemId)


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
        "disableBreak": sucursal?.advance?.disableBreak,
        "timeBreak": sucursal?.advance?.timeBreak,
        notifyBeforeMinutes: sucursal?.advance?.notifyBeforeMinutes,

      })
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }, [currentEntity?.entity.id, itemId])

  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && itemId)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, itemId])



  return { fields, initialValues, validationSchema, handleSubmit }
}
