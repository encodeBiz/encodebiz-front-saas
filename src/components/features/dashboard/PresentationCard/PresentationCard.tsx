import React, { ReactNode } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Stack
} from '@mui/material';
import Image from 'next/image';
import { useStyles } from './PresentationCard.styles';
import { PrimaryButton } from '@/components/common/buttons/GenericButton';
import { BaseButton } from '@/components/common/buttons/BaseButton';
export interface PresentationCardProps {
  title?: string
  description?: string
  image?: any
  action1?: () => void
  action2?: () => void
  action1Text?: string
  action2Text?: string

  children?: ReactNode
}

export default function PresentationCard({ children, title, description, image, action1, action2, action1Text, action2Text }: PresentationCardProps) {
  const styles = useStyles()
  return (
    <Box  >
      <Paper elevation={2} sx={styles.base}>
        <Box sx={styles.root}>
          <Box sx={styles.container}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              {title}
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4, textAlign: 'left' }}>
              {description}
            </Typography>
            <Stack direction="row" spacing={2} sx={styles.stack}>
              {typeof action1 === 'function' && <PrimaryButton onClick={action1}>{action1Text}</PrimaryButton>}
              {typeof action2 === 'function' && <BaseButton variant="outlined" onClick={action2}>{action2Text}</BaseButton>}
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