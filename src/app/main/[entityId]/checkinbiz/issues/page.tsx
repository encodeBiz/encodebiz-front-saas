'use client';
import { Box, Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useIssuesListController from './page.controller';
import { GenericTable } from "@/components/common/table/GenericTable";
import { CommonModalType } from '@/contexts/commonModalContext';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { useCommonModal } from '@/hooks/useCommonModal';
import FormModal from './edit/FormModal';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { Add } from '@mui/icons-material';
import { useLayout } from '@/hooks/useLayout';
import { CHECKINBIZ_MODULE_ROUTE } from '@/config/routes';

export default function IssuesList() {
  const t = useTranslations();
  const {
    items, rowAction, onRowsPerPageChange, onSort,
    onNext, onBack, onDelete, deleting,
    filterParams, topFilter,
    columns, onSuccess,
    loading } = useIssuesListController();
  const { open } = useCommonModal()
  const { navivateTo } = useLayout()

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("issues.list")}
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <SassButton
              onClick={() => navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/issues/add`)}
              variant='contained'
              startIcon={<Add />}
            >{t('issues.add')}</SassButton>
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


        />
      </HeaderPage>
      {open.type === CommonModalType.DELETE && <ConfirmModal
        isLoading={deleting}
        title={t('issues.deleteConfirmModalTitle')}
        description={t('issues.deleteConfirmModalTitle2')}
        onOKAction={(args: { data: any }) => onDelete(args.data)}
      />}

      {open.type === CommonModalType.FORM && <FormModal onSuccess={onSuccess} />}


    </Container>
  );
}
