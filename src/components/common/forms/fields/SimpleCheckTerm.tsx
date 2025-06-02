// TextInput.tsx
import React from 'react';
import { Checkbox, FormControlLabel, FormHelperText, TextFieldProps, Typography } from '@mui/material';
import { FieldProps, useField } from 'formik';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const SimpleCheckTerm: React.FC<FieldProps & TextFieldProps> = ({
  ...props
}) => {
  const [field, meta, helper] = useField(props.name);
  const t = useTranslations()
  const { touched, error } = meta
  const helperText = touched && error;
  return (<>
 
    <FormControlLabel

      control={
        <Checkbox
          name="acceptTerms"
          checked={field.checked}
          onChange={() => helper.setValue(!field.checked)}
          color="primary"

        />
      }
      label={
        <Typography variant="body2">
          {t('core.label.accepTerm1')} <Link href="#"> {t('core.label.accepTerm2')} </Link> {t('core.label.accepTerm3')}  <Link href="#">{t('core.label.accepTerm4')} </Link>
        </Typography>
      }

      sx={{ mt: 2 }}
    />  
    {helperText && !!error && <FormHelperText sx={{
      ml: 2,
      color: error ? 'error.main' : 'text.secondary'
    }}>
      {error}
    </FormHelperText>}
  </>
  );
};

export default SimpleCheckTerm;