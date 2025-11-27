'use client';
import { Container, Box } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderListController from './page.controller';
import { GenericTable } from "@/components/common/table/GenericTable";
import { Add, ArchiveOutlined } from '@mui/icons-material';
import { PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { useEntity } from '@/hooks/useEntity';
import FormContact from './formContact/page';
import { SassButton } from '@/components/common/buttons/GenericButton';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { useLayout } from '@/hooks/useLayout';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';
import FormModal from './edit/FormModal';

export default function HolderList() {
  const t = useTranslations();
  const {
    items, rowAction, onArchived, deleting,
    onNext, onBack, onSort, onRowsPerPageChange,
    topFilter, onSuccess, filterParams,
    columns, loading, } = useHolderListController();
  const { entitySuscription } = useEntity()
  const { navivateTo } = useLayout()
  const { open } = useCommonModal()

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("event.list")}
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            {!entitySuscription.find(e => e.serviceId === "passinbiz" && e.plan === "freemium") ? <SassButton
              role='link'
              onClick={() => navivateTo(`/${PASSSINBIZ_MODULE_ROUTE}/event/add`)}
              variant='contained'
              startIcon={<Add />}
            > {t('event.add')}</SassButton> :
              <SassButton
                onClick={() => navivateTo(`/${PASSSINBIZ_MODULE_ROUTE}/onboarding?to=plans`)}
                variant='contained'
                color='primary'
                sx={{width:200}}              
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
            page={filterParams.currentPage}
            rowsPerPage={filterParams.params.limit}
            onRowsPerPageChange={onRowsPerPageChange}
            onSorteable={onSort}
            sort={{ orderBy: filterParams.params.orderBy, orderDirection: filterParams.params.orderDirection }}
            onBack={onBack}
            onNext={onNext}
            topFilter={topFilter}
            selectable
          /> :
          <FormContact />
        }
      </HeaderPage>



      {open.type === CommonModalType.DELETE && <ConfirmModal
        isLoading={deleting}
        colorBtn='warning'
        closeIcon={false}
        textBtn={t('core.button.archived')}
        title={t('event.deleteConfirmModalTitle')}
        description={t('event.deleteConfirmModalTitle2')}
        onOKAction={(args: { data: Array<string> }) => onArchived(args.data as any)}
      />}

      {open.type === CommonModalType.FORM && <FormModal onSuccess={onSuccess} />}

    </Container>
  );
}
