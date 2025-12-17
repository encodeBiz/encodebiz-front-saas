
'use client'
import React, { } from 'react';
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useMediaList } from './page.controller';
import { GenericTable } from '@/components/common/table/GenericTable';
import ConfirmModal from '@/components/common/modals/ConfirmModal';

import { fileTypes } from '@/config/constants';
import { ImageCropper } from '@/components/common/ImageCropper/ImageCropper';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';

const EntityPreferencesPage = () => {
  const t = useTranslations();
  const { items,
    onDelete, rowAction,
    onNext, onBack, onRowsPerPageChange,
    filterParams, selectedType, handleFileChange, isUploading, setSelectedType,
    columns, deleting,
    loading } = useMediaList();
  const { open } = useCommonModal()



  return (
    <Container maxWidth="lg">

      <HeaderPage
        title={t("media.title")}
        actions={
          <Box display={'flex'} flexDirection={'row-reverse'} justifyContent={'flex-end'} gap={4} alignItems='flex-end' sx={{ width: '100%' }} >
            <ImageCropper disabled={!selectedType} size={selectedType !== 'custom' ? fileTypes(t).find(e => e.value === selectedType)?.size : { locked: false, w: 0, h: 0 }} isUploading={isUploading} onComplete={handleFileChange} />

            <FormControl required sx={{ width: '100%' }}>
              <InputLabel id="demo-simple-select-required-label">{t('media.labelType')}</InputLabel>
              <Select
                style={{ minWidth: 100 }}
                labelId="locale-switcher-label"
                id="locale-switcher-select"
                value={selectedType}
                label={t('media.labelType')}
                disabled={isUploading}
                onChange={(e) => setSelectedType(e.target.value as string)}
              >
                {fileTypes(t).map((item: { label: string, value: string }, i: number) => (
                  <MenuItem key={i} value={item.value}>
                    <Typography sx={{ textTransform: 'capitalize' }}>{item.label}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        }
      >
        <GenericTable
          data={items}
          rowAction={rowAction}
          columns={columns}
          title={''}
          keyField="id"
          loading={loading}
          page={filterParams.currentPage}
          rowsPerPage={filterParams.params.limit}
          onRowsPerPageChange={onRowsPerPageChange}

          sort={{ orderBy: filterParams.params.orderBy, orderDirection: filterParams.params.orderDirection }}
          onBack={onBack}
          onNext={onNext}

        />
      </HeaderPage>



      {open.type === CommonModalType.DELETE && <ConfirmModal closeIcon={false}
        isLoading={deleting}
        title={t('media.deleteConfirmModalTitle')}
        description={t('media.deleteConfirmModalTitle2')}
        onOKAction={(args: { data: Array<string> }) => onDelete(args.data)}
      />}
    </Container>
  );
};

export default EntityPreferencesPage;
