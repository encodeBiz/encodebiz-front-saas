'use client';
import { Container, Box } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderListController from './page.controller';
import { GenericTable } from "@/components/common/table/GenericTable";
import { BaseButton } from '@/components/common/buttons/BaseButton';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { Add } from '@mui/icons-material';
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';

export default function HolderList() {
  const t = useTranslations();
  const {
    items, rowAction,
    onNext, onBack, onEdit,
    currentPage,
    columns, onSearch,
    loading, rowsPerPage, setRowsPerPage } = useHolderListController();
  const { openModal } = useCommonModal()

  return (
    <Container maxWidth="lg">
      <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
        <BaseButton
          role='link'
          href={`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/event/add`}
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
        onEdit={(data) => onEdit(data)}
        onDelete={(data) => openModal(CommonModalType.DELETE, { data })}
        onSearch={(data) => onSearch(data)}
        search={true}

      />

    </Container>
  );
}
