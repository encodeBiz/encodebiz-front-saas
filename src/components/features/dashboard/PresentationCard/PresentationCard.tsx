import React, { ReactNode } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack
} from '@mui/material';
import Image from 'next/image';
import { useStyles } from './PresentationCard.styles';
import { PrimaryButton, SassButton } from '@/components/common/buttons/GenericButton';
import { BaseButton } from '@/components/common/buttons/BaseButton';
import { useTranslations } from 'next-intl';
export interface PresentationCardProps {
  title?: string
  description?: string
  image?: any
  action1?: () => void
  action2?: () => void
  titleBtn?: () => void
  action1Text?: string
  action2Text?: string
  disabledBtn?: boolean
  children?: ReactNode
}

export default function PresentationCard({ children, title, disabledBtn = false, titleBtn, description, image, action1, action2, action1Text, action2Text }: PresentationCardProps) {
  const styles = useStyles()
  const t = useTranslations()
  return (
    <Box  >
      <Paper elevation={0} sx={styles.base}>
        <Box sx={image ? styles.root : styles.rootSimple}>
          <Box sx={styles.container} width={'100%'} >
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'} width={'100%'} >
              <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ mb: 4, textAlign: 'left' }}>
                {title}
              </Typography>
              {typeof titleBtn === 'function' && <SassButton disabled={disabledBtn} variant="contained" color='primary' onClick={() => titleBtn()}>{t('core.button.saveChanges')}</SassButton>}

            </Box>
            {description && <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4, textAlign: 'left' }}>
              {description}
            </Typography>}
            <Stack direction="row" spacing={2} sx={styles.stack}>
              {typeof action1 === 'function' && <PrimaryButton disabled={disabledBtn} onClick={action1}>{action1Text}</PrimaryButton>}
              {typeof action2 === 'function' && <BaseButton disabled={disabledBtn} variant="outlined" onClick={action2}>{action2Text}</BaseButton>}
            </Stack>
          </Box>
          {image && <Box sx={styles.imageContainer}>
            <Image width={200} height={200} alt='EncodeBiz' src={image} />
          </Box>}
        </Box>
        <Box sx={styles.content}>
          {children}
        </Box>
      </Paper>

    </Box>
  );
}