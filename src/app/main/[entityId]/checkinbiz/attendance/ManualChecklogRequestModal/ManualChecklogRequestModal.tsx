'use client';
import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { CustomTypography } from '@/components/common/Text/CustomTypography';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useFormStatus } from '@/hooks/useFormStatus';
import * as Yup from 'yup';
import useManualChecklogRequestController from './ManualChecklogRequestModal.controller';

interface Props {
  onSuccess: () => void;
}

const ManualChecklogRequestModal = ({ onSuccess }: Props): React.JSX.Element => {
  const { open, closeModal } = useCommonModal();
  const theme = useTheme();
  const t = useTranslations();
  const formRef = useRef(null);
  const { formStatus } = useFormStatus();

  const { fields, validationSchema, handleSubmit, initialValues, isModeB } =
    useManualChecklogRequestController(onSuccess);

  const handleClose = (event: any, reason: any) => {
    if (reason !== 'backdropClick') closeModal(CommonModalType.MANUAL_CHECKLOG_REQUEST);
  };

  const handleExternalSubmit = () => {
    if (formRef.current) (formRef.current as any).submitForm();
  };

  const v = formStatus?.values;
  const hasRequired = isModeB
    ? !!(v?.reason?.trim() && v?.reason?.trim().length >= 10)
    : !!(v?.employeeId && v?.branchId && v?.date && v?.reason?.trim());
  const oneTimeOnly = !isModeB && ((v?.checkinAt && !v?.checkoutAt) || (!v?.checkinAt && v?.checkoutAt));
  const isSubmitDisabled = !hasRequired || !!oneTimeOnly || !!formStatus?.isSubmitting;

  return (
    <Dialog
      open={open.open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { sx: { p: 2, borderRadius: 2 } } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
          <CustomTypography>
            {isModeB ? t('attendance.manualRequest.closingTitle') : t('attendance.manualRequest.title')}
          </CustomTypography>
        </Box>
        <CustomIconBtn onClick={() => handleClose(null, 'manual')} color={theme.palette.primary.main} />
      </DialogTitle>

      <DialogContent>
        <BorderBox sx={{ p: 2 }} key={open.open + '_' + (open.args?.checkinId ?? 'modeA')}>
          <GenericForm
            column={2}
            initialValues={initialValues}
            validationSchema={Yup.object().shape(validationSchema)}
            onSubmit={handleSubmit}
            fields={fields as FormField[]}
            submitButtonText={t('core.button.submit')}
            enableReinitialize
            hideBtn
            activateWatchStatus
            formRef={formRef}
          />
        </BorderBox>
      </DialogContent>

      <DialogActions>
        <SassButton
          color="primary"
          variant="outlined"
          onClick={(e) => handleClose(e, 'manual')}
          disabled={formStatus?.isSubmitting}
          size="small"
        >
          {t('core.button.cancel')}
        </SassButton>
        <SassButton
          onClick={handleExternalSubmit}
          disabled={isSubmitDisabled}
          color="primary"
          size="small"
          variant="contained"
        >
          {t('core.button.submit')}
        </SassButton>
      </DialogActions>
    </Dialog>
  );
};

export default ManualChecklogRequestModal;
