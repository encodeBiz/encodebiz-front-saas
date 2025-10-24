/* eslint-disable react-hooks/exhaustive-deps */
// GenericForm.tsx
import React, { useEffect } from 'react';
import { Formik, Form, FormikProps, FormikHelpers, useFormikContext } from 'formik';
import * as Yup from 'yup';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,

  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { IUserMedia } from '@/domain/core/IUserMedia';
import { useFormStatus } from '@/hooks/useFormStatus';
import { BorderBox } from '../tabs/BorderBox';
import { SassButton } from '../buttons/GenericButton';
import Link from 'next/link';
import { ExpandMoreOutlined } from '@mui/icons-material';


// A component that watches the form state
const FormStatusWatcher = () => {
  // Access the entire Formik state
  const { dirty, isSubmitting, isValid, status, values, validateForm, setSubmitting } = useFormikContext();
  const { updateFromStatus } = useFormStatus()

  useEffect(() => {

    updateFromStatus({
      isValid,
      isSubmitting,
      setSubmitting,
      dirty,
      status,
      values,
      validateForm
    })


  }, [dirty, isSubmitting, isValid, status, values]); // Add dependencies to watch

  return null; // This component doesn't render anything
};

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
  column?: 1 | 2 | 3;
  isGroup?: boolean;
  fieldList?: Array<FormField>

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
  activateWatchStatus?: boolean;
  linkForm?: boolean;

};

const FieldItem = ({ field, i, formikProps, column, disabled }: { field: FormField, disabled: boolean, i: number, formikProps: any, column: 1 | 2 | 3 }) => {

  const FieldComponent = field.component;
  const isInvalid =
    formikProps.touched[field.name] && Boolean(formikProps.errors[field.name]);
  const errorText = formikProps.errors[field.name];
  if (field.isDivider) return <Grid size={{
    xs: 12,
    sm: 12
  }} key={i} sx={{ width: '100%', position: 'relative', top: 10, mt: 2 }}>
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
      }} key={field.name} sx={{ width: '100%', textAlign: 'center', }}>
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
}

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
  activateWatchStatus = false,
  hideBtn = false,
  linkForm = false,
  formRef
}: GenericFormProps<T>) => {
  const t = useTranslations()
  const theme = useTheme()

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
        <Typography variant="h5" component="h2" align="center">
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
            {JSON.stringify(formikProps.errors)}

            {activateWatchStatus && <FormStatusWatcher />}
            <Grid container spacing={3}>
              {fields.map((field, i) => {
                if (field.isCollapse)
                  return <Accordion key={i} sx={{ width: '100%' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreOutlined />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{ height: 56 }}
                    > <Box display={'flex'} flexDirection={'column'}>
                        <Typography component="span" textTransform={'uppercase'}>{field.label as string}</Typography>
                        {field.hit && <Typography color='textSecondary' component="span" >{field.hit as string}</Typography>}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ width: '100%', p: 4 }}>
                        <Grid display={'flex'} flexDirection={{
                          xs: 'column',
                          sm: 'column',
                          md: 'column',
                          lg: 'row',
                          xl: 'row',
                        }} container spacing={3}>
                          {
                            field.fieldList?.map((fieldInner, index) => {
                              return <FieldItem key={index + '-' + i} field={fieldInner} i={index} disabled={disabled} column={field.column ? field.column : column} formikProps={formikProps} />
                            })
                          }
                        </Grid>
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                else
                  if (field.isGroup)
                    return <BorderBox key={i} sx={{ width: '100%', p: 4 }}>
                      <Grid display={'flex'} flexDirection={{
                        xs: 'column',
                        sm: 'column',
                        md: 'column',
                        lg: 'row',
                        xl: 'row',
                      }} container spacing={3}>
                        {
                          field.fieldList?.map((fieldInner, index) => {
                            return <FieldItem key={index + '-' + i} field={fieldInner} i={index} disabled={disabled} column={field.column ? field.column : column} formikProps={formikProps} />
                          })
                        }
                      </Grid>
                    </BorderBox>
                  else
                    return <FieldItem key={i} field={field} i={i} disabled={disabled} column={column} formikProps={formikProps} />

              })}
              {linkForm && <Typography variant="body2">
                <Link style={{ color: theme.palette.primary.main, textDecoration: 'none' }} href="/auth/recovery">{t('core.signup.recovery')}</Link>
              </Typography>}

              <Grid sx={{ width: '100%' }}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  {onCancel && (
                    <SassButton sx={{ mt: 3, mb: 2, py: 1.5 }} onClick={onCancel} disabled={formikProps.isSubmitting || disabled} fullWidth={btnFullWidth} variant="outlined" color="primary" >
                      {cancelButtonText}
                    </SassButton>
                  )}

                  {!hideBtn && <SassButton sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={formikProps.isSubmitting || disabled || !formikProps.isValid} type="submit" fullWidth={btnFullWidth} variant="contained" color="primary" >
                    {formikProps.isSubmitting ? t('core.button.submitting') : submitButtonText}
                  </SassButton>}
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