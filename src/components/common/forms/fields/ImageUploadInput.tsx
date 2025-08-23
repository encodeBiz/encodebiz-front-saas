import React, { useState, useCallback, useEffect } from 'react';
import { FieldProps, useField, useFormikContext } from 'formik';
import {
  Box,
  Button,
  IconButton,
  TextFieldProps,
  FormHelperText,
  InputLabel,
  FormControl,
  Paper,
  Typography,
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import MediaModalSelectedFiles from '../../modals/MediaModalSelectedFiles/MediaModalSelectedFiles';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { IUserMedia, IUserMediaType } from '@/domain/core/IUserMedia';
import ImagePreview from '../../ImagePreview';
import { fileTypes } from '@/config/constants';

interface ImageFieldProps {
  accept: string
  typeUpload: IUserMediaType
}
const ImageUploadInput = ({ name, label, ...props }: any & FieldProps & TextFieldProps & ImageFieldProps) => {
  const t = useTranslations();
  const [field, meta, helper] = useField(name);
  const { touched, error } = meta
  const typeUpload = props.type

  const aspectRatio = (fileTypes(t).find(e => e.value === typeUpload)?.size?.w ?? 0) / (fileTypes(t).find(e => e.value === typeUpload)?.size?.h ?? 0)
  const width = 300
  const height = width / aspectRatio;
  const isDragging = false
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
      <InputLabel error={!!helperText} id="demo-simple-select-required-label">{label}</InputLabel>
      <Box sx={{ paddingTop: 5 }}>
        {preview ? (
          <Box sx={{ position: 'relative', display: 'inline-block', borderRadius: '1px solid red' }}>
            <ImagePreview
              src={preview}
              alt=""
              width={'200px'}
              height={'200px'}
              style={{
                width: '100%',
                height: height,
                border: '1px solid #ddd'
              }}
              zoomIconPosition="center"
            />
            <IconButton disabled={props.disabled}
              onClick={handleRemoveImage}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <Delete color="error" />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ width: '100%', maxWidth: width }}>
            <Paper onClick={() => openModal(CommonModalType.FILES, { name })}
              variant="outlined"
              sx={{
                position: 'relative',
                width: '100%',
                height: height,
                border: isDragging ? '2px dashed #1976d2' : '2px dashed #ccc',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDragging ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                cursor: props.disabled ? 'not-allowed' : 'pointer',
                opacity: props.disabled ? 0.6 : 1,
                overflow: 'hidden',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: props.disabled ? '#ccc' : '#1976d2',
                  backgroundColor: props.disabled ? 'transparent' : 'rgba(25, 118, 210, 0.04)'
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
                <CloudUpload sx={{ fontSize: 40, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {t('core.label.addImage')}
                </Typography>

              </Box>
            </Paper>

          </Box>

        )}
      </Box>
      <FormHelperText error={!!helperText}>{helperText as string}</FormHelperText>
      {CommonModalType.FILES == open.type && open.open && open.args.name === name && <MediaModalSelectedFiles type={typeUpload} key={name} onSelected={handleOnSelected} />}

    </FormControl >

  );
};

export default ImageUploadInput;