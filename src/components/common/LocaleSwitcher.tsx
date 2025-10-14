'use client'
// components/LocaleSwitcher.tsx
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography
} from '@mui/material';

// Import your defined locales from i18n.ts
import { useAppLocale } from '@/hooks/useAppLocale';
import { useEntity } from '@/hooks/useEntity';
import { updateExtraEntity } from '@/services/core/entity.service';
import { useToast } from '@/hooks/useToast';
import { usePathname } from 'next/navigation';
export const locales = ['en', 'es']; // Define your supported locales
const flags = {
  'es': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5" width="30" height="25">
    <rect width="8" height="5" fill="#AA151B" />
    <rect width="8" height="2" y="1.5" fill="#F1BF00" />
    <rect width="8" height="0.5" y="1" fill="#AA151B" />
    <rect width="8" height="0.5" y="3.5" fill="#AA151B" />
  </svg>,
  'en': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="30" height="40">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
}
const LocaleSwitcher = ({ rmText = false }: { rmText?: boolean }) => {
  const t = useTranslations(); // 'LocaleSwitcher' refers to the key in your message files
  const { changeLocale, currentLocale } = useAppLocale()
  const [selectedLocale, setSelectedLocale] = useState(currentLocale);
  const { currentEntity } = useEntity()
  const { showToast } = useToast()
  const pathname = usePathname()
  // Update internal state if currentLocale changes externally (e.g., initial load)
  useEffect(() => {
    setSelectedLocale(currentLocale);
  }, [currentLocale]);

  const handleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value as string;
    setSelectedLocale(newLocale);
    changeLocale(newLocale); // Inform parent about the locale change
    if (currentEntity || pathname.includes('/main'))
      updateEntityLang(newLocale.toUpperCase() as 'ES' | 'EN')

  };


  const updateEntityLang = async (newLocale: 'ES' | 'EN') => {
    try {
      const updateData = {
        "id": currentEntity?.entity?.id,
        "language": newLocale,
      }
      await updateExtraEntity(updateData)
    } catch (error: any) {

      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast(String(error), 'error');
      }


    }
  };

  return (
    <Box sx={{ minWidth: rmText ? 80 : 160, mt: 1 }}>
      <FormControl fullWidth>
        <Select
          labelId="locale-switcher-label"
          id="locale-switcher-select"
          value={selectedLocale as any}
          onChange={handleChange}
          size='small'
          sx={{
            "& .MuiSelect-icon": {
              marginLeft: '20px'
            },
            '&.MuiSelect-root': {

              height: 40
            },
          }}
          renderValue={(select: 'es' | 'en') => <Box gap={1} display={'flex'} justifyItems={'center'} alignItems={'center'}>{flags[select]} {rmText ? '' : <Typography >{select === 'es' ? t('layout.header.spanish') : t('layout.header.english')}</Typography>}</Box>}
        >
          {locales.map((locale) => (
            <MenuItem key={locale} value={locale} >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 1
              }}>

                {locale === 'en' && <>{flags[locale]} <Typography textTransform={'uppercase'}>{t('layout.header.english')}</Typography></>}
                {locale === 'es' && <>{flags[locale]}<Typography textTransform={'uppercase'}>{t('layout.header.spanish')}</Typography></>}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LocaleSwitcher;