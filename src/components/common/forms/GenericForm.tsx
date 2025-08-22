// GenericForm.tsx
import React from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { BaseButton } from '../buttons/BaseButton';
import { useTranslations } from 'next-intl';
import { IUserMedia } from '@/domain/core/IUserMedia';

// Define types for our form component
export type FormField = {
  name: string;
  typeUpload?: IUserMedia;
  label: string | React.ComponentType<any>;
  type?: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'date' | 'textarea' | string;
  required?: boolean;
  component: React.ComponentType<any>;
  options?: Array<{ value: any; label: string }>; // For select inputs
  [key: string]: any; // Allow additional props  
  disabled?: boolean;
  isDivider?: boolean;
  fullWidth?: boolean;
  onChange?: (e: any) => void

};

type GenericFormProps<T> = {
  initialValues: T;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<any>;
  fields: FormField[];
  title?: string;
  btnFullWidth?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  formContainerProps?: any;
  column?: 1 | 2 | 3;
  enableReinitialize?: boolean;
  disabled?: boolean;
  hideBtn?: boolean;
  formRef?: any
};

const GenericForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  title,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  onCancel,
  column = 1,
  formContainerProps,
  enableReinitialize,
  btnFullWidth = false,
  disabled = false,
  hideBtn = false,
  formRef
}: GenericFormProps<T>) => {
  const t = useTranslations()

  return (
    <Paper
      elevation={0}
      sx={{

        width: '100%',
        ...formContainerProps?.sx,
      }}
      {...formContainerProps}
    >
      {title && (
        <Typography variant="h5" component="h2" gutterBottom align="center">
          {title}
        </Typography>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={enableReinitialize}
        validateOnBlur={true}
        validateOnChange={true}
        
        innerRef={formRef}

      >
        {(formikProps: FormikProps<T>) => (
          <Form noValidate>
            {/*JSON.stringify(formikProps.errors)*/}
            <Grid container spacing={3}>
              {fields.map((field, i) => {

                const FieldComponent = field.component;
                const isInvalid =
                  formikProps.touched[field.name] && Boolean(formikProps.errors[field.name]);
                const errorText = formikProps.errors[field.name];
                if (field.isDivider) return <Grid size={{
                  xs: 12,
                  sm: 12
                }} key={i} sx={{ width: '100%' }}>

                  <Typography variant='subtitle1'>{field.label as string}</Typography>
                </Grid>
                else
                  return (
                    <Grid size={{
                      xs: 12,
                      sm: field.fullWidth ? 12 : column == 1 ? 12 : column == 2 ? 6 : 4,
                      md: field.fullWidth ? 12 : column == 1 ? 12 : column == 2 ? 6 : 4,
                      lg: field.fullWidth ? 12 : column == 1 ? 12 : column == 2 ? 6 : 4,
                      xl: field.fullWidth ? 12 : column == 1 ? 12 : column == 2 ? 6 : 4
                    }} key={field.name} sx={{ width: '100%' }}>
                      <FieldComponent

                        name={field.name}
                        label={field.label}
                        type={field.type}
                        required={field.required}
                        disabled={field.disabled || disabled}
                        fullWidth
                        variant="outlined"
                        error={isInvalid}
                        helperText={isInvalid ? errorText : ''}
                        value={formikProps.values[field.name]}
                        onBlur={formikProps.handleBlur}
                        options={field.options}
                        {...field.extraProps}

                      />
                    </Grid>
                  );
              })}

              <Grid sx={{ width: '100%' }}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  {onCancel && (
                    <BaseButton sx={{ mt: 3, mb: 2, py: 1.5 }} onClick={onCancel} disabled={formikProps.isSubmitting || disabled} fullWidth={btnFullWidth} variant="outlined" color="primary" >
                      {cancelButtonText}
                    </BaseButton>
                  )}

                  {!hideBtn && <BaseButton sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={formikProps.isSubmitting || disabled || !formikProps.isValid} type="submit" fullWidth={btnFullWidth} variant="contained" color="primary" >
                    {formikProps.isSubmitting ? t('core.button.submitting') : submitButtonText}
                  </BaseButton>}
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper >
  );
};

export default GenericForm;