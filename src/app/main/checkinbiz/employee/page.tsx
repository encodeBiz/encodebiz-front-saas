'use client';
import { Container, Box } from '@mui/material';
import { useTranslations } from "next-intl";
import useEmployeeListController from './page.controller';
import { GenericTable } from "@/components/common/table/GenericTable";
import { BaseButton } from '@/components/common/buttons/BaseButton';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { Add } from '@mui/icons-material';
import { CHECKINBIZ_MODULE_ROUTE, MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';
import ConfirmModal from '@/components/common/modals/ConfirmModal';

export default function EmployeeList() {
  const t = useTranslations();
  const {
    items, rowAction,onDelete,deleting,
    onNext, onBack, onEdit,
    currentPage,
    columns, onSearch,
    loading, rowsPerPage, setRowsPerPage } = useEmployeeListController();
  const { openModal } = useCommonModal()

  return (
    <Container maxWidth="lg">
      <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
        <BaseButton
          role='link'
          href={`/${MAIN_ROUTE}/${CHECKINBIZ_MODULE_ROUTE}/employee/add`}
          variant='contained'
        ><Add /> {t('employee.add')}</BaseButton>

      </Box>
      <br />
      <GenericTable
        data={items}
        rowAction={rowAction}
        columns={columns}
        title={t("employee.list")}
        keyField="id"
        loading={loading}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onBack={onBack}
        onNext={onNext}
        onEdit={(data) => onEdit(data)}
        onDelete={(data) => openModal(CommonModalType.DELETE, { data })}
        onSearch={(data) => onSearch(data)}
        

      />


      <ConfirmModal
        isLoading={deleting}
        title={t('employee.deleteConfirmModalTitle')}
        description={t('employee.deleteConfirmModalTitle2')}
        onOKAction={(args: { data: Array<string> }) => onDelete(args.data)}
      />
    </Container>
  );
}
