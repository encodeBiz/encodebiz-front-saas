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
  const { handleUploadConfirm,
    items, rowAction,
    onNext, onBack, setSort,sort, onRevoke, revoking, onSend,
    currentPage,topFilter,
    columns, modalOpen, setModalOpen, onSearch,
    loading, rowsPerPage, setRowsPerPage } = useHolderListController();
  const {  open } = useCommonModal()

  return (
    <Container maxWidth="lg">
      <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
        <BaseButton
          role='link'
          href='/main/passinbiz/holder/add'
          variant='contained'
        ><Add /> {t('holders.addHolder')}</BaseButton>

        <BaseButton
          role='link'
          onClick={() => setModalOpen(true)}
          variant='contained'
        ><UploadFile /> {t('holders.import')}</BaseButton>
      </Box>
      <br />
      <GenericTable
        data={items}
        rowAction={rowAction}
        columns={columns}
        title={t("holders.holderList")}
        keyField="id"
        loading={loading}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onSorteable={setSort}
        sort={sort}
        onBack={onBack}
        onNext={onNext}
        topFilter={topFilter}
        //onEdit={(data) => onEdit(data)}
        onSearch={(data) => onSearch(data)}
         

      />
      <CSVUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleUploadConfirm}
      />

      {open.type===CommonModalType.DELETE && <ConfirmModal
        isLoading={revoking}
        title={t('holders.revokeConfirmModalTitle')}
        description={t('holders.revokeConfirmModalTitle2')}
        textBtn={t('core.button.revoke')}
        onOKAction={(args: { data: any }) => onRevoke(args.data)}
      />}

      {open.type===CommonModalType.SEND && <ConfirmModal
        isLoading={revoking}
        title={t('holders.sendConfirmModalTitle')}
        description={t('holders.sendConfirmModalTitle2')}
        textBtn={t('core.button.send')}
        onOKAction={(args: { data: any }) => onSend(args.data)}
      />}
    </Container>
  );
}
