import React, { ReactNode } from 'react';
import {
  Box,
  Typography,
  Paper
} from '@mui/material';
import Image from 'next/image';
import { useStyles } from './OnboardingCard.styles';
import { useAuth } from '@/hooks/useAuth';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useTranslations } from 'next-intl';
import { IService } from '@/domain/core/IService';
export interface OnboardingCardProps {
  title?: string
  description?: string
  image?: any
  onPress?: () => void
  children?: ReactNode
  right?: number
  top?: number
  width?: number
  height?: number
  heightCard?: number
  serviceData?:IService
}

export default function OnboardingCard({ children,serviceData, title, description, image, onPress,heightCard=250, right = -10, top = -60, width = 705, height = 422 }: OnboardingCardProps) {
  const { user } = useAuth()
  const styles = useStyles(!!user?.id)
  const t = useTranslations()
   
 

  return (
  
      <Paper  sx={{...styles.base,minHeight:heightCard}}>
        <Box sx={image ? styles.root : styles.rootSimple}>
          <Box sx={styles.container}>
            <Typography sx={styles.title} variant="h4" component="h1" align="center" >
              {title}
            </Typography>
            <Typography sx={styles.subtitle} variant="subtitle1" align="center" >
              {description}
            </Typography>
            {typeof onPress === 'function' && serviceData?.status==='active' && <SassButton onClick={onPress} variant="contained" color="primary" sx={{ mt: 2 }}>{t('core.button.start')}</SassButton>}
            {serviceData?.status==='cooming_soon' &&  <Typography mt={5} textAlign={'center'} fontSize={36} fontWeight={400} variant="body1">{t('cards.card3.comminsoom')}</Typography>}
          </Box>
          {image && <Box sx={{ ...styles.imageContainer, right, top }}>
            <Image width={width} height={height} alt='EncodeBiz' src={image} />
          </Box>}
        </Box>
        <Box sx={styles.content}>
          {children}
        </Box>
      </Paper>
 
  );
}