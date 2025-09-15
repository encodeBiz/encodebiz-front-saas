'use client';
import { Container, Box } from '@mui/material';
import { useTranslations } from "next-intl";
import useSucursalListController from './page.controller';
import { GenericTable } from "@/components/common/table/GenericTable";
import { CommonModalType } from '@/contexts/commonModalContext';
import { Add } from '@mui/icons-material';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { SassButton } from '@/components/common/buttons/GenericButton';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { useLayout } from '@/hooks/useLayout';
import { useCommonModal } from '@/hooks/useCommonModal';

export default function SucursalList() {
  const t = useTranslations();
  const {
    items, rowAction, onRowsPerPageChange, onSort,
    onNext, onBack, onDelete, deleting,
    filterParams, topFilter,
    columns, buildState,
    loading } = useSucursalListController();
  const { navivateTo } = useLayout()
  const { open } = useCommonModal()
  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("sucursal.list")}
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <SassButton
              onClick={() => navivateTo(`/checkinbiz/sucursal/add?params=${buildState()}`)}
              variant='contained'
              startIcon={<Add />}
            >{t('sucursal.add')}</SassButton>
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
      {open.type === CommonModalType.DELETE && <ConfirmModal
        isLoading={deleting}
        title={t('sucursal.deleteConfirmModalTitle')}
        description={t('sucursal.deleteConfirmModalTitle2')}
        onOKAction={(args: { data: any }) => onDelete(args.data)}
      />}
    </Container>
  );
}
