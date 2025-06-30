'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderListController from './page.controller';

import { GenericTable } from "@/components/common/table/GenericTable";

export default function HolderList() {
  const t = useTranslations();
  const { data, columns, loading, page, rowsPerPage, setPage, setRowsPerPage } = useHolderListController();
  return (
    <Container maxWidth="lg">
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
