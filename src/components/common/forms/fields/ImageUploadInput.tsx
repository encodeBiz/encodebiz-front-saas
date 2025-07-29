import React, { useState, useCallback, useEffect } from 'react';
import { FieldProps, useField, useFormikContext } from 'formik';
import {
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  TextFieldProps,
  FormHelperText,
  InputLabel,
  FormControl,
  TextField,
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import MediaModalSelectedFiles from '../../modals/MediaModalSelectedFiles/MediaModalSelectedFiles';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { IUserMedia, IUserMediaType } from '@/domain/core/IUserMedia';
import ImagePreview from '../../ImagePreview';
import { ImageCropper } from '../../ImageCropper/ImageCropper';

interface ImageFieldProps {
  accept: string
  typeUpload: IUserMediaType
}
const ImageUploadInput = ({ name, label, accept = 'image/*', ...props }: any & FieldProps & TextFieldProps & ImageFieldProps) => {
  const t = useTranslations();
  const [field, meta, helper] = useField(name);
  const { touched, error } = meta
  const typeUpload = props.type

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
  }, [name]);



  const [preview, setPreview] = useState(field.value);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    helper.setValue(null);
  }, [name]);

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
              style={{ border: '1px solid #ddd' }}
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
          <Button
            component="label"
            variant="outlined"
            color="primary"
            startIcon={<CloudUpload />}
            disabled={props.disabled}
            onClick={() => openModal(CommonModalType.FILES, { name })}
          >{t('core.label.uploadResourse')}</Button>
        )}

        <FormHelperText error={!!helperText}>{helperText as string}</FormHelperText>
      </Box>
      {CommonModalType.FILES && open.open && open.args.name === name && <MediaModalSelectedFiles type={typeUpload} key={name} onSelected={handleOnSelected} />}
      
    </FormControl>

  );
};

export default ImageUploadInput;