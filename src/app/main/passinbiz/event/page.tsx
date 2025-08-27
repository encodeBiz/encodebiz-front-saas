'use client';
import { Container, Box } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderListController from './page.controller';
import { GenericTable } from "@/components/common/table/GenericTable";
import { BaseButton } from '@/components/common/buttons/BaseButton';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { Add, ArrowUpward, UploadFile } from '@mui/icons-material';
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { useEntity } from '@/hooks/useEntity';
import FormContact from './formContact/page';
import { SassButton } from '@/components/common/buttons/GenericButton';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';

export default function HolderList() {
  const t = useTranslations();
  const {
    items, rowAction, onDelete, deleting,
    onNext, onBack, onEdit,
    currentPage, topFilter,
    columns, onSearch,
    loading, rowsPerPage, setRowsPerPage } = useHolderListController();
  const { openModal } = useCommonModal()
  const { entitySuscription } = useEntity()

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("event.list")}
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            {!entitySuscription.find(e => e.serviceId === "passinbiz" && e.plan === "freemium") ? <SassButton
              role='link'
              href={`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/event/add`}
              variant='contained'
              startIcon={<Add />}
            > {t('event.add')}</SassButton> :
              <SassButton
                role='link'
                href={`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/onboarding`}
                variant='contained'
                color='warning'
                startIcon={<ArrowUpward />}
              > {t('core.button.upgrade')}</SassButton>
            }
          </Box>
        }
      >
        {!entitySuscription.find(e => e.serviceId === "passinbiz" && e.plan === "freemium") ?
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
            onEdit={(data) => onEdit(data)}
            onDelete={(data) => openModal(CommonModalType.DELETE, { data })}
            onSearch={(data) => onSearch(data)}
            topFilter={topFilter}
          /> :
          <FormContact />
        }
      </HeaderPage>



      <ConfirmModal
        isLoading={deleting}
        title={t('event.deleteConfirmModalTitle')}
        description={t('event.deleteConfirmModalTitle2')}
        onOKAction={(args: { data: Array<string> }) => onDelete(args.data)}
      />
    </Container>
  );
}
