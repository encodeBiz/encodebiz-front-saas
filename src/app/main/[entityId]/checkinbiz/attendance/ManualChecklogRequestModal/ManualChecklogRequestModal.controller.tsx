/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useAppLocale } from '@/hooks/useAppLocale';
import { useFormStatus } from '@/hooks/useFormStatus';
import { fetchEmployee } from '@/services/checkinbiz/employee.service';
import { fetchSucursal } from '@/services/checkinbiz/sucursal.service';
import { requestManualChecklog, IManualChecklogResponse } from '@/services/checkinbiz/manualChecklog.service';
import { requiredRule, maxLengthRule } from '@/config/yupRules';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import SearchIndexFilterInput from '@/components/common/forms/fields/SearchFilterInput';
import SelectInput from '@/components/common/forms/fields/SelectInput';
import TextInput from '@/components/common/forms/fields/TextInput';
import TimeInput from '@/components/common/forms/fields/TimeInput';
import { Alert } from '@mui/material';
import React from 'react';

const TODAY = dayjs().format('YYYY-MM-DD');

const PendingNoteAlert = () => {
  const t = useTranslations();
  return <Alert severity="info" sx={{ py: 0.5 }}>{t('attendance.manualRequest.pendingValidationNote')}</Alert>;
};

const AutoTimeNoteAlert = () => {
  const t = useTranslations();
  const { formStatus } = useFormStatus();
  const noTimes = !formStatus?.values?.checkinAt && !formStatus?.values?.checkoutAt;
  if (!noTimes) return null;
  return <Alert severity="info" sx={{ py: 0.5 }}>{t('attendance.manualRequest.autoTimeNote')}</Alert>;
};

const AutoCheckoutNoteAlert = () => {
  const t = useTranslations();
  const { formStatus } = useFormStatus();
  if (formStatus?.values?.checkoutAt) return null;
  return <Alert severity="info" sx={{ py: 0.5 }}>{t('attendance.manualRequest.autoTimeNote')}</Alert>;
};

export default function useManualChecklogRequestController(onSuccess: () => void) {
  const t = useTranslations();
  const { showToast } = useToast();
  const { token } = useAuth();
  const { currentEntity } = useEntity();
  const { closeModal, open } = useCommonModal();
  const { currentLocale } = useAppLocale();
  const { formStatus } = useFormStatus();

  const prefill = open.args ?? {};
  const isModeB = !!(prefill.checkinId);

  const [branchOptions, setBranchOptions] = useState<Array<{ label: string; value: string }>>([]);

  // useMemo en lugar de useState para que se recalcule cuando open.args cambia
  // (el modal no se desmonta al cerrar, solo cambia open.open)
  const initialValues = useMemo<any>(() => {
    if (isModeB) {
      return {
        employeeId: prefill.employeeId ?? '',
        branchId: prefill.branchId ?? '',
        checkinId: prefill.checkinId ?? '',
        checkoutAt: null,
        reason: '',
        employeeDisplay: prefill.employeeName ?? '',
        branchDisplay: prefill.branchName ?? '',
        dateDisplay: prefill.checkinDate ?? '',
        checkinTimeDisplay: prefill.checkinTime ?? '',
      };
    }
    return {
      employeeId: prefill.employeeId ?? '',
      branchId: prefill.branchId ?? '',
      date: prefill.date ?? TODAY,
      checkinAt: null,
      checkoutAt: null,
      reason: '',
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open.args]);

  const validationSchema = useMemo<any>(() => {
    if (isModeB) {
      return {
        checkoutAt: Yup.mixed().nullable().optional(),
        reason: requiredRule(t)
          .concat(maxLengthRule(t, 500))
          .concat(Yup.string().min(10, t('core.formValidatorMessages.min') + '10')),
      };
    }
    return {
      employeeId: requiredRule(t),
      branchId: requiredRule(t),
      date: requiredRule(t),
      checkinAt: Yup.mixed().nullable().test(
        'both-or-neither-checkin',
        '',
        function (value) {
          const { checkoutAt } = this.parent;
          if (value && !checkoutAt) return false;
          if (!value && checkoutAt) return false;
          return true;
        }
      ),
      checkoutAt: Yup.mixed().nullable().test(
        'both-or-neither-checkout',
        '',
        function (value) {
          const { checkinAt } = this.parent;
          if (value && !checkinAt) return false;
          if (!value && checkinAt) return false;
          return true;
        }
      ),
      reason: requiredRule(t).concat(maxLengthRule(t, 500)),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModeB]);

  const loadBranchesForEmployee = async (employeeId: string) => {
    try {
      const entityId = currentEntity?.entity?.id as string;
      const employee = await fetchEmployee(entityId, employeeId);
      if (!employee?.branchId?.length) { setBranchOptions([]); return; }
      const branches = await Promise.all(
        employee.branchId.map(async (id: string) => {
          const branch = await fetchSucursal(entityId, id);
          return { label: branch?.name ?? id, value: id };
        })
      );
      setBranchOptions(branches);
    } catch {
      setBranchOptions([]);
    }
  };

  useEffect(() => {
    if (isModeB) return;
    if (formStatus?.values?.employeeId) {
      loadBranchesForEmployee(formStatus.values.employeeId);
    } else {
      setBranchOptions([]);
    }
  }, [formStatus?.values?.employeeId]);

  const handleSubmit = async (values: any, formikHelpers: any) => {
    try {
      const payload: any = {
        entityId: currentEntity?.entity?.id as string,
        employeeId: values.employeeId,
        branchId: values.branchId,
        reason: values.reason,
      };

      if (isModeB) {
        payload.checkinId = values.checkinId;
        if (values.checkoutAt) payload.checkoutAt = dayjs(values.checkoutAt).format('HH:mm');
      } else {
        payload.date = values.date;
        if (values.checkinAt) payload.checkinAt = dayjs(values.checkinAt).format('HH:mm');
        if (values.checkoutAt) payload.checkoutAt = dayjs(values.checkoutAt).format('HH:mm');
      }

      const response: IManualChecklogResponse = await requestManualChecklog(payload, token, currentLocale);

      closeModal(CommonModalType.MANUAL_CHECKLOG_REQUEST);
      showToast(
        isModeB
          ? t('attendance.manualRequest.closingSuccessToast')
          : t('attendance.manualRequest.successToast'),
        'success'
      );

      if (isModeB) {
        if (response.autofilledFields?.includes('checkoutAt')) {
          setTimeout(() => showToast(t('attendance.manualRequest.closingAutofilledNote'), 'info'), 800);
        }
      } else {
        const autofilledTimes =
          response.autofilledFields?.includes('checkinAt') || response.autofilledFields?.includes('checkoutAt');
        if (autofilledTimes) {
          setTimeout(() => showToast(t('attendance.manualRequest.autofilledNote'), 'info'), 800);
        }
      }

      if (typeof onSuccess === 'function') onSuccess();
    } catch (error: any) {
      formikHelpers.setSubmitting(false);
      let errorJson: { message: string; code: string } = { message: error.message, code: '' };
      try { errorJson = JSON.parse(error.message); } catch {}
      showToast(errorJson.message || t('attendance.manualRequest.errorGeneric'), 'error');
    }
  };

  const fieldsA = [
    { name: '_pendingNote', label: '', component: PendingNoteAlert, fullWidth: true },
    { name: 'employeeId', label: t('core.label.employee'), type: 'text', required: true, component: SearchIndexFilterInput, fullWidth: true },
    { name: 'branchId', label: t('core.label.sucursal'), required: true, component: SelectInput, options: [{ value: '', label: t('core.label.select') }, ...branchOptions], disabled: branchOptions.length === 0 },
    { name: 'date', label: t('core.label.date'), required: true, component: TextInput, type: 'date', extraProps: { InputLabelProps: { shrink: true } } },
    { name: 'checkinAt', label: t('core.label.checkin'), component: TimeInput },
    { name: 'checkoutAt', label: t('core.label.checkout'), component: TimeInput },
    { name: '_autoTimeNote', label: '', component: AutoTimeNoteAlert, fullWidth: true },
    { name: 'reason', label: t('core.label.reason'), type: 'textarea', required: true, component: TextInput, fullWidth: true },
  ];

  const fieldsB = [
    { name: '_pendingNote', label: '', component: PendingNoteAlert, fullWidth: true },
    { name: 'employeeDisplay', label: t('core.label.employee'), type: 'text', component: TextInput, disabled: true, fullWidth: true },
    { name: 'branchDisplay', label: t('core.label.sucursal'), type: 'text', component: TextInput, disabled: true },
    { name: 'dateDisplay', label: t('core.label.date'), type: 'text', component: TextInput, disabled: true },
    { name: 'checkinTimeDisplay', label: t('attendance.manualRequest.checkinEntry'), type: 'text', component: TextInput, disabled: true },
    { name: 'checkoutAt', label: t('core.label.checkout'), component: TimeInput },
    { name: '_autoCheckoutNote', label: '', component: AutoCheckoutNoteAlert, fullWidth: true },
    { name: 'reason', label: t('core.label.reason'), type: 'textarea', required: true, component: TextInput, fullWidth: true },
  ];

  return {
    fields: isModeB ? fieldsB : fieldsA,
    validationSchema,
    handleSubmit,
    initialValues,
    isModeB,
  };
}
