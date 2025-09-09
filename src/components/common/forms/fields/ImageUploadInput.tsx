import React, { useState, useCallback, useEffect } from 'react';
import { FieldProps, useField, useFormikContext } from 'formik';
import {
  Box,
  TextFieldProps,
  FormHelperText,
  FormControl,
  Paper,
  Typography,
  CardContent,
} from '@mui/material';
import { CloudUploadOutlined, DeleteOutline, Upload } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import MediaModalSelectedFiles from '../../modals/MediaModalSelectedFiles/MediaModalSelectedFiles';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { IUserMedia, IUserMediaType } from '@/domain/core/IUserMedia';
import ImagePreview from '../../ImagePreview';
import { fileTypes } from '@/config/constants';
import { SassButton } from '../../buttons/GenericButton';
import { BorderBox } from '../../tabs/BorderBox';

interface ImageFieldProps {
  accept: string
  typeUpload: IUserMediaType
}
const ImageUploadInput = ({ name, ...props }: any & FieldProps & TextFieldProps & ImageFieldProps) => {
  const t = useTranslations();
  const [field, meta, helper] = useField(name);
  const { touched, error } = meta
  const typeUpload = props.type

  const width = fileTypes(t).find(e => e.value === typeUpload)?.size?.boxW || 120;
  const height = fileTypes(t).find(e => e.value === typeUpload)?.size?.boxH || 120;;
  const helperText = touched && error;
  const { open, openModal } = useCommonModal()
  const {
    validateField,
  } = useFormikContext();

  useEffect(() => {
    if (typeof field.value === 'string') setPreview(field.value)
  }, [field.value])


  const handleOnSelected = useCallback((file: IUserMedia) => {
    setPreview(file.url);
    helper.setValue(file.url);
    helper.setTouched(true)
    setTimeout(() => {
      validateField(name)
    }, 1);
  }, [helper, name, validateField]);



  const [preview, setPreview] = useState(field.value);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    helper.setValue(null);
  }, [helper]);

  return (
    <FormControl key={name} required sx={{ m: 1, width: '100%' }}>

      <Box sx={{ paddingTop: 5 }}>
        {preview ? (<Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={1}>
          <BorderBox>
            <CardContent>
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={1}>
                <Typography textTransform={'uppercase'}>{t('core.label.' + typeUpload)}</Typography>
                <Box sx={{ position: 'relative', display: 'inline-block', borderRadius: '1px solid red' }}>
                  <ImagePreview
                    src={preview}
                    alt=""
                    width={width + 'px'}
                    height={height + 'px'}

                    zoomIconPosition="center"
                  />
                </Box>
              </Box>
              <Typography variant='caption'>{t('core.label.medida')}: {fileTypes(t).find(e => e.value === typeUpload)?.size.w} x {fileTypes(t).find(e => e.value === typeUpload)?.size.h} px. PNG.</Typography>
              </CardContent>
          </BorderBox>
          <Box display={'flex'} gap={1} sx={{ pt: 1 }}>
            <SassButton sx={{ height: 35, textTransform: 'capitalize' }} onClick={() => openModal(CommonModalType.FILES, { name })} size='small' variant='contained' color='primary' startIcon={<Upload />}>
              {t('core.button.replaceImage')}
            </SassButton>
            <SassButton sx={{ height: 35, textTransform: 'capitalize' }} onClick={handleRemoveImage} size='small' variant='contained' color='secondary' startIcon={<DeleteOutline />}>
              {t('core.button.delete')}
            </SassButton>
          </Box>
        </Box>) : (


          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography textTransform={'uppercase'}>{props.label}</Typography>
            <Paper onClick={() => openModal(CommonModalType.FILES, { name })}
              variant="outlined"
              sx={{
                position: 'relative',
                width: width,
                height: height,
                border: '2px dashed #476BE7',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 84, 202, 0.08)',
                cursor: props.disabled ? 'not-allowed' : 'pointer',
                opacity: props.disabled ? 0.6 : 1,
                overflow: 'hidden',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: props.disabled ? '#ccc' : '#476BE7',
                  backgroundColor: props.disabled ? 'transparent' : 'rgba(0, 84, 202, 0.16)'
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  p: 2
                }}
              >
                <CloudUploadOutlined sx={{ fontSize: 20, color: (theme) => theme.palette.primary.main }} />
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {t('core.label.addImage')}
                </Typography>

              </Box>
            </Paper>
            <Typography variant='caption'>{t('core.label.medida')}: {fileTypes(t).find(e => e.value === typeUpload)?.size.w} x {fileTypes(t).find(e => e.value === typeUpload)?.size.h} px. PNG.</Typography>
          </Box>

        )}
      </Box>
      <FormHelperText error={!!helperText}>{helperText as string}</FormHelperText>
      {CommonModalType.FILES == open.type && open.open && open.args.name === name && <MediaModalSelectedFiles type={typeUpload} key={name} onSelected={handleOnSelected} />}

    </FormControl >

  );
};

export default ImageUploadInput;