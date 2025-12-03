'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useIssuesListController from './page.controller';
import { GenericTable } from "@/components/common/table/GenericTable";
import { CommonModalType } from '@/contexts/commonModalContext';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { useCommonModal } from '@/hooks/useCommonModal';

export default function IssuesList() {
  const t = useTranslations();
  const {
    items, rowAction, onRowsPerPageChange, onSort,
    onNext, onBack, onDelete, deleting,
    filterParams, topFilter,
    columns,
    loading } = useIssuesListController();
  const { open } = useCommonModal()
  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("issues.list")}
       
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

    </Container>
  );
}
