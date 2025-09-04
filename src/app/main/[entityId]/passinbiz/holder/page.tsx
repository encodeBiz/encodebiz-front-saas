'use client';
import { Container, Box } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderListController from './page.controller';
import { GenericTable } from "@/components/common/table/GenericTable";
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import CSVUploadModal from '@/components/common/modals/CSVUploadModal';
import { Add, ArchiveOutlined, PanoramaFishEyeOutlined, ReplyAllOutlined, UploadFile } from '@mui/icons-material';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import CSVConfigModal from '@/components/common/modals/CSVConfigModal';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useLayout } from '@/hooks/useLayout';
import { PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';

export default function HolderList() {
  const t = useTranslations();
  const { handleUploadConfirm, handleConfigConfirm,
    items, rowAction, onRowsPerPageChange, onSort,
    onNext, onBack, filterParams, onAction, revoking,
    topFilter,
    columns, buildState,
    loading,
  } = useHolderListController();
  const { open, closeModal, openModal } = useCommonModal()
  const { navivateTo } = useLayout()

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
              onClick={() => navivateTo(`/${PASSSINBIZ_MODULE_ROUTE}/holder/add?params=${buildState()}`)}
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
          page={filterParams.currentPage}
          rowsPerPage={filterParams.params.limit}
          onRowsPerPageChange={onRowsPerPageChange}
          onSorteable={onSort}
          sort={{ orderBy: filterParams.params.orderBy, orderDirection: filterParams.params.orderDirection }}
          onBack={onBack}
          onNext={onNext}
          topFilter={topFilter}
          selectable


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
        onOKAction={(args: { data: any }) => onAction(args.data, 'revoked')}
      />}

      {open.type === CommonModalType.REACTIVE && <ConfirmModal
        isLoading={revoking}
        title={t('holders.reactiveConfirmModalTitle')}
        description={t('holders.reactiveConfirmModalTitle2')}
        textBtn={t('core.button.reactive')}
        icon={<ReplyAllOutlined />}
        onOKAction={(args: { data: any }) => onAction(args.data, 'active', 'pending')}
      />}

      {open.type === CommonModalType.SEND && <ConfirmModal
        isLoading={revoking}
        title={t('holders.sendConfirmModalTitle')}
        description={t('holders.sendConfirmModalTitle2')}
        textBtn={t('core.button.send')}
        icon={<PanoramaFishEyeOutlined />}
        onOKAction={(args: { data: any }) => onAction(args.data, 'active', 'pending')}
      />}

      {open.type === CommonModalType.ARCHIVED && <ConfirmModal
        isLoading={revoking}
        title={t('holders.archivedConfirmModalTitle')}
        description={t('holders.archivedConfirmModalTitle2')}
        textBtn={t('core.label.archivedHolder')}
        icon={<ArchiveOutlined />}
        onOKAction={(args: { data: any }) => onAction(args.data, 'archived')}
      />}
    </Container>
  );
}
