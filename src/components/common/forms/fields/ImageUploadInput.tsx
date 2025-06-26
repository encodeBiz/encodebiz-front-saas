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

interface ImageFieldProps {
  accept: string
}
const ImageUploadInput = ({ name, label, accept = 'image/*',  ...props }: any & FieldProps & TextFieldProps & ImageFieldProps) => {
  const t = useTranslations();
  const [field, meta, helper] = useField(name);
  const { touched, error } = meta
  const helperText = touched && error;

  const {
    validateField,
  } = useFormikContext();
   

  useEffect(() => {
    if(typeof field.value === 'string') setPreview(field.value)
  }, [field.value])
  
   
  const [preview, setPreview] = useState(field.value);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback((event: any) => {
    const file = event.currentTarget.files[0];

    if (!file) return;
    setIsUploading(true);
    // Simulate upload delay (remove in production)
    setTimeout(() => {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setIsUploading(false);
        helper.setValue(file);
        helper.setTouched(true)
        setTimeout(() => {
          validateField(name)
        }, 1);
      };
      reader.readAsDataURL(file);
    }, 1000);
  }, [name]);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    helper.setValue(null);
   
  }, [name]);

  return (
    <FormControl required sx={{ m: 1, width: '100%' }}>
      <InputLabel error={!!helperText} id="demo-simple-select-required-label">{label}</InputLabel>
      <Box sx={{ paddingTop: 5 }}>
 
        {preview ? (
          <Box sx={{ position: 'relative', display: 'inline-block', borderRadius: '1px solid red' }}>
          
            <Avatar
              src={preview}
              alt="Preview"
              sx={{ width: '100%', height: '100%', mb: 1, maxWidth:300 }}
              variant="rounded"
            />
            <IconButton disabled={isUploading || props.disabled}
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
            disabled={isUploading || props.disabled}
          >

            {isUploading ? (
              <CircularProgress size={24} />
            ) : (
              t('core.label.uploadResourse')
            )}

            <TextField
             
              onChange={handleFileChange}
              onBlur={(e) => field.onBlur(e)}
              type="file"
             
              style={{
                border: 1,
                clip: 'rect(0 0 0 0)',
                height: '1px',
                margin: '-1px',
                overflow: 'hidden',
                padding: 0,
                position: 'absolute',
                whiteSpace: 'nowrap',
                width: '1px',
              }}

              //accept={accept}
              disabled={isUploading || props.disabled}
            />

          </Button>
        )}

        <FormHelperText error={!!helperText}>{helperText as string}</FormHelperText>
      </Box>
    </FormControl>

  );
};

export default ImageUploadInput;