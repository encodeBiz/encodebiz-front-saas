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
import ConfirmModal from '@/components/common/modals/ConfirmModal';

export default function HolderList() {
  const t = useTranslations();
  const {
    items, rowAction,
    onNext, onBack, onEdit, onDelete, deleting,
    currentPage,
    columns, onSearch,
    loading, rowsPerPage, setRowsPerPage } = useHolderListController();
  const { open } = useCommonModal()

  return (
    <Container maxWidth="lg">
      <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
        <BaseButton
          role='link'
          href='/main/passinbiz/staff/add'
          variant='contained'
        ><Add /> {t('staff.add')}</BaseButton>       
      </Box>
      <br />
      <GenericTable
        data={items}
        rowAction={rowAction}
        columns={columns}
        title={t("staff.holderList")}
        keyField="id"
        loading={loading}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onBack={onBack}
        onNext={onNext}
        onEdit={(data) => onEdit(data)}
        onSearch={(data) => onSearch(data)}
        search={true}

      />
     
      {open.type === CommonModalType.DELETE && <ConfirmModal
        isLoading={deleting}
        title={t('staff.revokeConfirmModalTitle')}
        description={t('staff.revokeConfirmModalTitle2')}
             onOKAction={(args: { data: any }) => onDelete(args.data)}
      />}      
    </Container>
  );
}
