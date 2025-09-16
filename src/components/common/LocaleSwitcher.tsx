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
import { Language } from '@mui/icons-material';
import { useEntity } from '@/hooks/useEntity';
import { updateExtraEntity } from '@/services/core/entity.service';
import { useToast } from '@/hooks/useToast';
import { usePathname } from 'next/navigation';
export const locales = ['en', 'es']; // Define your supported locales

const LocaleSwitcher: React.FC = () => {
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
    if(currentEntity || pathname.includes('/main')) 
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
    <Box sx={{ minWidth: 160, mt: 1 }}>
      <FormControl fullWidth>
        <Select
          labelId="locale-switcher-label"
          id="locale-switcher-select"
          value={selectedLocale}
          onChange={handleChange}
          size='small'
          sx={{
            "& .MuiSelect-icon": {
              marginLeft: '20px'
            },
          }}
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
                <Language />
                {locale === 'en' && <Typography textTransform={'uppercase'}>{t('layout.header.english')}</Typography>}
                {locale === 'es' && <Typography textTransform={'uppercase'}>{t('layout.header.spanish')}</Typography>}
                {locale === 'fr' && <Typography textTransform={'uppercase'}>{t('layout.header.french')}</Typography>}
                {locale === 'de' && <Typography textTransform={'uppercase'}>{t('layout.header.germany')}</Typography>}

              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LocaleSwitcher;