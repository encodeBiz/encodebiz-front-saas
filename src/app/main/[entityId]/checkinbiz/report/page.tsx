'use client';
import { Container, Box } from '@mui/material';
import { useTranslations } from "next-intl";
import useEmployeeListController from './page.controller';
import { GenericTable } from "@/components/common/table/GenericTable";
import { Add } from '@mui/icons-material';
import { SassButton } from '@/components/common/buttons/GenericButton';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
 
export default function ReportList() {
  const t = useTranslations();
  const {
    items,   onRowsPerPageChange, onSort,
    onNext, onBack,  
    filterParams, topFilter,
    columns, handleExport ,
    loading } = useEmployeeListController();
   
   return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("report.list")}
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <SassButton
              onClick={handleExport}
              variant='contained'
              startIcon={<Add />}
            >{t('report.export')}</SassButton>
          </Box>
        }
      >
        <GenericTable
          data={items}
          rowAction={[]}
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
     
    </Container>
  );
}
