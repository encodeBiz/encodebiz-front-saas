
'use client'
import React, { } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useMediaList } from './page.controller';
import { GenericTable } from '@/components/common/table/GenericTable';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { CloudUpload } from '@mui/icons-material';
import { fileTypes } from '@/config/constants';

const EntityPreferencesPage = () => {
  const t = useTranslations();
  const { items,
    onDelete,
    onSearch, onNext, onBack,
    currentPage, selectedType, handleFileChange, isUploading, setSelectedType,
    columns, deleting,
    loading, rowsPerPage, setRowsPerPage } = useMediaList();
  const { openModal } = useCommonModal()



  return (
    <Container maxWidth="lg">
      <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' sx={{ width: '100%' }}>
        <Box display={'flex'} flexDirection={'row-reverse'} justifyContent={'flex-end'} gap={4} alignItems='flex-end' sx={{ width: '100%' }} >
          <Button
            component="label"
            variant="outlined"
            color="primary"
            startIcon={<CloudUpload />}
            disabled={!selectedType}
            style={{ width: 340, height: 55 }}
          >

            {isUploading ? (
              <CircularProgress size={24} />
            ) : (
              t('core.label.uploadResourse')
            )}

            <TextField
              onChange={handleFileChange}

              type="file"

              style={{
                border: 1,
                clip: 'rect(0 0 0 0)',
                height: '1px',
                margin: '-1px',
                overflow: 'hidden',
                padding: 0,
                position: 'absolute',
                whiteSpace: 'nowrap',
                width: '1px',
              }}

              //accept={accept}
              //
              disabled={!selectedType}
            />

          </Button>
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
              {fileTypes.map((item: { label: string, value: string }, i: number) => (
                <MenuItem key={i} value={item.value}>
                  <Typography sx={{ textTransform: 'capitalize' }}>{item.label}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <br />
      <GenericTable
        data={items}
        columns={columns}
        title={t("media.title")}
        keyField="id"
        loading={loading}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onBack={onBack}
        onNext={onNext}
        onDelete={(data) => openModal(CommonModalType.DELETE, { data })}
      />

      <ConfirmModal
        isLoading={deleting}
        title={t('media.deleteConfirmModalTitle')}
        description={t('media.deleteConfirmModalTitle2')}
        onOKAction={(args: { data: Array<string> }) => onDelete(args.data)}
      />
    </Container>
  );
};

export default EntityPreferencesPage;
