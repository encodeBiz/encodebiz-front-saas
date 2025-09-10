import React from 'react';
import {
  Box,
  Typography,
  Paper
} from '@mui/material';
import { useStyles } from './DescriptionCard.styles';
import { useAuth } from '@/hooks/useAuth';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useTranslations } from 'next-intl';
export interface DescriptionCardProps {
  title1?: string
  title2?: string
  description1?: string
  description2?: string
}

export default function DescriptionCard({ title1, title2, description1, description2 }: DescriptionCardProps) {
  const { user } = useAuth()
  const styles = useStyles(!!user?.id)
  const t = useTranslations()
  return (
  
      <Paper elevation={0} sx={styles.base}>
        <Box sx={styles.rootSimple}>
          <Box sx={styles.container}>
            <Typography sx={styles.title} variant="h4" component="h1" align="center" >
              {title1}
            </Typography>
            {title2 && <Typography sx={styles.title} variant="h4" component="h1" align="center" >
              {title2}
            </Typography>}
            <Typography sx={styles.subtitle} variant="subtitle1" align="center" >
              {description1}
            </Typography>
            <Typography sx={styles.subtitle} variant="subtitle1" align="center" >
              {description2}
            </Typography>

            <SassButton variant="contained" color="primary" sx={{ mt: 2, textTransform:'none' }}>{t('core.button.contactUs')}</SassButton>

          </Box>

        </Box>

      </Paper>
 
  );
}