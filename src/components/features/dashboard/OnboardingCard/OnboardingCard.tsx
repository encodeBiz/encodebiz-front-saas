import React, { ReactNode } from 'react';
import {
  Box,
  Typography,
  Paper} from '@mui/material';
import Image from 'next/image';
import { useStyles } from './OnboardingCard.styles';
import { useAuth } from '@/hooks/useAuth';
export interface OnboardingCardProps {
  title?: string
  description?: string
  image?: any
  children?: ReactNode
}

export default function OnboardingCard({ children, title, description, image, }: OnboardingCardProps) {
  const {user} = useAuth()
  const styles = useStyles(!!user?.id)
  return (
    <Box  >
      <Paper elevation={2} sx={styles.base}>
        <Box sx={image ? styles.root : styles.rootSimple}>
          <Box sx={styles.container}>
            <Typography sx={styles.title} variant="h4" component="h1" align="center" gutterBottom>
              {title}
            </Typography>
            <Typography sx={styles.subtitle} variant="subtitle1" align="center" >
              {description}
            </Typography>
          </Box>
          {image && <Box sx={styles.imageContainer}>
            <Image width={705} height={422} alt='EncodeBiz' src={image} />
          </Box>}
        </Box>
        <Box sx={styles.content}>
          {children}
        </Box>
      </Paper>

    </Box>
  );
}