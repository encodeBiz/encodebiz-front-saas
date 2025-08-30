'use client';
import { Container, Box } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderListController from './page.controller';

import { GenericTable } from "@/components/common/table/GenericTable";
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import CSVUploadModal from '@/components/common/modals/CSVUploadModal';
import { Add, UploadFile } from '@mui/icons-material';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import CSVConfigModal from '@/components/common/modals/CSVConfigModal';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useRouter } from 'nextjs-toploader/app';

export default function HolderList() {
  const t = useTranslations();
  const { handleUploadConfirm, handleConfigConfirm,
    items, rowAction,
    onNext, onBack, setFilterParams, filterParams, onRevoke, revoking, onSend,
    currentPage, topFilter,
    columns, onSearch, buildState,
    loading, rowsPerPage, setRowsPerPage } = useHolderListController();
  const { open, closeModal, openModal } = useCommonModal()
  const { push } = useRouter()


  return (
    <Container maxWidth="lg">
      <HeaderPage

        title={t("holders.holderList")}

        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <SassButton
              onClick={() => openModal(CommonModalType.CONFIG_CSV)}
              variant='contained'
              startIcon={<UploadFile />}
            >{t('core.button.confirmSCV')}</SassButton>

            <SassButton
              onClick={() => push(`/main/passinbiz/holder/add?params=${buildState()}`)}
              variant='contained'
              startIcon={<Add />}
            >{t('holders.addHolder')}</SassButton>
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
          page={currentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          onSorteable={(sort) => setFilterParams({ ...filterParams, sort })}
          sort={filterParams.sort}
          onBack={onBack}
          onNext={onNext}
          topFilter={topFilter}
          //onEdit={(data) => onEdit(data)}
          onSearch={(data) => onSearch(data)}


        />
      </HeaderPage>

      {open.type === CommonModalType.CONFIG_CSV && <CSVConfigModal
        open={open.open}
        onClose={() => closeModal(CommonModalType.CONFIG_CSV)}
        onConfirm={handleConfigConfirm}
      />}

      {open.type === CommonModalType.UPLOAD_CSV && <CSVUploadModal
        open={open.open}
        onClose={() => closeModal(CommonModalType.UPLOAD_CSV)}
        onConfirm={handleUploadConfirm}
      />}


      {open.type === CommonModalType.DELETE && <ConfirmModal
        isLoading={revoking}
        title={t('holders.revokeConfirmModalTitle')}
        description={t('holders.revokeConfirmModalTitle2')}
        textBtn={t('core.button.revoke')}
        onOKAction={(args: { data: any }) => onRevoke(args.data)}
      />}

      {open.type === CommonModalType.REACTIVE && <ConfirmModal
        isLoading={revoking}
        title={t('holders.reactiveConfirmModalTitle')}
        description={t('holders.reactiveConfirmModalTitle2')}
        textBtn={t('core.button.revoke')}
        onOKAction={(args: { data: any }) => onSend(args.data)}
      />}

      {open.type === CommonModalType.SEND && <ConfirmModal
        isLoading={revoking}
        title={t('holders.sendConfirmModalTitle')}
        description={t('holders.sendConfirmModalTitle2')}
        textBtn={t('core.button.send')}
        onOKAction={(args: { data: any }) => onSend(args.data)}
      />}
    </Container>
  );
}
