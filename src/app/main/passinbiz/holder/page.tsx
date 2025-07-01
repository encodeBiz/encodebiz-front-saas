'use client';
import { Container, Box } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderListController from './page.controller';

import { GenericTable } from "@/components/common/table/GenericTable";
import { BaseButton } from '@/components/common/buttons/BaseButton';

export default function HolderList() {
  const t = useTranslations();
  const { data, columns, loading, page, rowsPerPage, setPage, setRowsPerPage } = useHolderListController();
  return (
    <Container maxWidth="lg">
      <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' sx={{ width: '100%' }}>
        <BaseButton
          role='link'
          href='/main/passinbiz/holder/add'
          variant='contained'
        >{t('holders.addHolder')}</BaseButton>
      </Box>
      <br />
      <GenericTable
        data={data}
        columns={columns}
        title={t("holders.holderList")}
        keyField="id"
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </Container>
  );
}
