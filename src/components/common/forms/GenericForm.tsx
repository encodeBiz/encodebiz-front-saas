// GenericForm.tsx
import React from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';

// Define types for our form component
export type FormField = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'date';
  required?: boolean;
  component: React.ComponentType<any>;
  options?: Array<{ value: any; label: string }>; // For select inputs
  [key: string]: any; // Allow additional props
};

type GenericFormProps<T> = {
  initialValues: T;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<any>;
  fields: FormField[];
  title?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  formContainerProps?: any;
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
  formContainerProps,
}: GenericFormProps<T>) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        padding: theme.spacing(4),
        maxWidth: 800,
        margin: '0 auto',
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
      >
        {(formikProps: FormikProps<T>) => (
          <Form noValidate>
            <Grid container spacing={3}>
              {fields.map((field) => {
                const FieldComponent = field.component;
                const isInvalid =
                  formikProps.touched[field.name] && Boolean(formikProps.errors[field.name]);
                const errorText = formikProps.errors[field.name];

                return (
                  <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.name}>
                    <FieldComponent
                      name={field.name}
                      label={field.label}
                      type={field.type}
                      required={field.required}
                      fullWidth
                      variant="outlined"
                      error={isInvalid}
                      helperText={isInvalid ? errorText : ''}
                      value={formikProps.values[field.name]}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      options={field.options}
                      {...field.extraProps}
                    />
                  </Grid>
                );
              })}

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  {onCancel && (
                    <Button
                      variant="outlined"
                      onClick={onCancel}
                      sx={{ minWidth: 120 }}
                    >
                      {cancelButtonText}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formikProps.isSubmitting || !formikProps.isValid}
                    sx={{ minWidth: 120 }}
                  >
                    {formikProps.isSubmitting ? 'Submitting...' : submitButtonText}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default GenericForm;