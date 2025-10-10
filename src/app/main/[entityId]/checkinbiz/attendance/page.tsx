'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import { GenericTable } from "@/components/common/table/GenericTable";
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import useAttendanceController from './page.controller';
 
export default function AttendanceList() {
  const t = useTranslations();
  const {
    items,   onRowsPerPageChange, onSort,
    onNext, onBack,  
    filterParams, topFilter,
    columns,  
    loading } = useAttendanceController();
   
   return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("attendance.list")}
         
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
