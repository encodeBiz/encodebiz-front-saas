'use client'
// components/EntitySwitcher.tsx
import React, { } from 'react';
import { useTranslations } from 'next-intl';
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
import { useLayout } from '@/hooks/useLayout';
import { GENERAL_ROUTE, MAIN_ROUTE } from '@/config/routes';
import { Add } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
export const locales = ['en', 'es']; // Define your supported locales


const EntitySwitcher: React.FC = () => {
  const t = useTranslations(); // 'EntitySwitcher' refers to the key in your message files
  const { entityList, currentEntity, changeCurrentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const { user } = useAuth()

  const { push } = useRouter()


  const handleChange = (event: SelectChangeEvent) => {
    const newEntityId = event.target.value as string;
    if (newEntityId) {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderChangeEntity') } })
      changeCurrentEntity(newEntityId, user?.id as string, () => changeLoaderState({ show: false }));
    }
  };

  return (
    <Box sx={{ minWidth: 120, mt: 2 }}>

      {currentEntity && <FormControl fullWidth >
        <InputLabel id="locale-switcher-label">
          {t('layout.header.entity')}
        </InputLabel>
        <Select
          labelId="locale-switcher-label"
          id="locale-switcher-select"
          value={currentEntity?.entity.id}
          label={t('layout.header.entity')}
          onChange={handleChange} style={{ textAlign: 'left' }}
        >
          {entityList.map((entity: IUserEntity, i: number) => (
            <MenuItem key={i} value={entity.entity.id} style={{ textAlign: 'left' }}>
              <Typography>  {entity.entity.name}</Typography>
            </MenuItem>
          ))}

          <MenuItem style={{ textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 4 }} onClick={() => push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity/create`)} value={undefined}>
            <Add /><Typography>Crear entidad</Typography>
          </MenuItem>
        </Select>
      </FormControl>}
    </Box>
  );
};

export default EntitySwitcher;