'use client'
// components/EntitySwitcher.tsx
import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography
} from '@mui/material';


import { useEntity } from '@/hooks/useEntity';
import IUserEntity from '@/domain/auth/IUserEntity';
import { useRouter } from 'nextjs-toploader/app';
export const locales = ['en', 'es']; // Define your supported locales

interface EntitySwitcherProps { }

const EntitySwitcher: React.FC<EntitySwitcherProps> = () => {
  const t = useTranslations(); // 'EntitySwitcher' refers to the key in your message files
  const { entityList, currentEntity, changeCurrentEntity } = useEntity()
  const { push } = useRouter()


  const handleChange = (event: SelectChangeEvent) => {
    const newEntityId = event.target.value as string;
    changeCurrentEntity(newEntityId);
  };

  return (
    <Box sx={{ minWidth: 120, mt: 4 }}>

      {currentEntity && <FormControl fullWidth >
        <InputLabel id="locale-switcher-label">
          {t('layout.header.entity')}
        </InputLabel>
        <Select
          labelId="locale-switcher-label"
          id="locale-switcher-select"
          value={currentEntity?.id}
          label={t('layout.header.entity')}
          onChange={handleChange}
        >
          {entityList.map((entity: IUserEntity, i: number) => (
            <MenuItem key={i} value={entity.id}>
              <Typography>{entity.entity.name}</Typography>
            </MenuItem>
          ))}

          <MenuItem onClick={() => push('/main/entity/create')} value={undefined}>
            <Typography>Crear entidad</Typography>
          </MenuItem>
        </Select>
      </FormControl>}
    </Box>
  );
};

export default EntitySwitcher;