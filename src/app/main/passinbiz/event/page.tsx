'use client';
import { Container, Box } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderListController from './page.controller';

import { GenericTable } from "@/components/common/table/GenericTable";
import { BaseButton } from '@/components/common/buttons/BaseButton';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import CSVUploadModal from '@/components/common/modals/CSVUploadModal';
import { Add, UploadFile } from '@mui/icons-material';

export default function HolderList() {
  const t = useTranslations();
  const { handleUploadConfirm,
    items, rowAction,
    onNext, onBack, onEdit,
    currentPage,
    columns, modalOpen, setModalOpen,onSearch,
    loading, rowsPerPage, setRowsPerPage } = useHolderListController();
  const { openModal } = useCommonModal()

  return (
    <Container maxWidth="lg">
      <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
        <BaseButton
          role='link'
          href='/main/passinbiz/event/add'
          variant='contained'
        ><Add /> {t('event.add')}</BaseButton>
 
      </Box>
      <br />
      <GenericTable
        data={items}
        rowAction={rowAction}
        columns={columns}
        title={t("event.list")}
        keyField="id"
        loading={loading}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onBack={onBack}
        onNext={onNext}
        //onEdit={(data) => onEdit(data)}
        onDelete={(data) => openModal(CommonModalType.DELETE, { data })}
        onSearch={(data) => onSearch(data)}
        search={true}
        
      />
      <CSVUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleUploadConfirm}
      />
    </Container>
  );
}
