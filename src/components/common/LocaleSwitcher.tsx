'use client'
// components/LocaleSwitcher.tsx
import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box
} from '@mui/material';

// Import your defined locales from i18n.ts
import { useAppLocale } from '@/hooks/useAppLocale';
export const locales = ['en', 'es', 'de', 'fr']; // Define your supported locales

interface LocaleSwitcherProps { }

const LocaleSwitcher: React.FC<LocaleSwitcherProps> = () => {
  const t = useTranslations(); // 'LocaleSwitcher' refers to the key in your message files
  const { changeLocale, currentLocale } = useAppLocale()
  const [selectedLocale, setSelectedLocale] = useState(currentLocale);

  // Update internal state if currentLocale changes externally (e.g., initial load)
  useEffect(() => {
    setSelectedLocale(currentLocale);
  }, [currentLocale]);

  const handleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value as string;
    setSelectedLocale(newLocale);
    changeLocale(newLocale); // Inform parent about the locale change
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="locale-switcher-label">
          {t('label')}
        </InputLabel>
        <Select
          labelId="locale-switcher-label"
          id="locale-switcher-select"
          value={selectedLocale}
          label={t('label')}
          onChange={handleChange}
        >
          {locales.map((locale) => (
            <MenuItem key={locale} value={locale}>
              {/* You can map locale codes to user-friendly names */}
              {locale === 'en' && t('english')}
              {locale === 'es' && t('spanish')}
              {locale === 'fr' && t('french')}
              {locale === 'de' && t('germany')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LocaleSwitcher;