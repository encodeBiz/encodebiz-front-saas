'use client';
import { Container, Box } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderListController from './page.controller';

import { GenericTable } from "@/components/common/table/GenericTable";
import { BaseButton } from '@/components/common/buttons/BaseButton';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { Add } from '@mui/icons-material';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { SassButton } from '@/components/common/buttons/GenericButton';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';

export default function HolderList() {
  const t = useTranslations();
  const {
    items, rowAction,
    onNext, onBack, onDelete, deleting,
    currentPage, topFilter,
    columns, onSearch,
    loading, rowsPerPage, setRowsPerPage } = useHolderListController();
  const { open, openModal } = useCommonModal()

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("staff.list")}
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <SassButton
              role='link'
              href='/main/passinbiz/staff/add'
              variant='contained'
              startIcon={<Add />}
            >{t('staff.add')}</SassButton>
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
          onBack={onBack}
          onNext={onNext}

          onSearch={(data) => onSearch(data)}
          onDelete={(data) => openModal(CommonModalType.DELETE, { data })}
          topFilter={topFilter}

        />
      </HeaderPage>
      {open.type === CommonModalType.DELETE && <ConfirmModal
        isLoading={deleting}
        title={t('staff.deleteConfirmModalTitle')}
        description={t('staff.deleteConfirmModalTitle2')}
        onOKAction={(args: { data: any }) => onDelete(args.data)}
      />}
    </Container>
  );
}
