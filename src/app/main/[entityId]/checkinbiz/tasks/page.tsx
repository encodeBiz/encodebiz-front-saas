"use client";

import { SassButton } from "@/components/common/buttons/GenericButton";
import EmptyList from "@/components/common/EmptyState/EmptyList";
import { GenericTable } from "@/components/common/table/GenericTable";
import HeaderPage from "@/components/features/dashboard/HeaderPage/HeaderPage";
import { Add } from "@mui/icons-material";
import { Box, Container } from "@mui/material";
import emptyImage from "../../../../../../public/assets/images/empty/reportes.svg";
import TaskFormDialog from "./components/TaskFormDialog";
import useTasksListController from "./page.controller";

export default function TasksList() {
  const {
    items,
    rowAction,
    onRowsPerPageChange,
    onSort,
    onNext,
    onBack,
    filterParams,
    topFilter,
    columns,
    loading,
    saving,
    openForm,
    setOpenForm,
    onCreate,
  } = useTasksListController();

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title="Gestión de tareas"
        actions={
          <Box display="flex" justifyContent="flex-end" alignItems="flex-end" gap={2} sx={{ width: "100%" }}>
            <SassButton onClick={() => setOpenForm(true)} variant="contained" startIcon={<Add />}>
              Crear tarea
            </SassButton>
          </Box>
        }
      >
        <GenericTable
          data={items}
          rowAction={rowAction}
          columns={columns}
          title=""
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

        {items.length === 0 && !loading && (
          <EmptyList imageUrl={emptyImage} title="Todavía no hay tareas" description="Aquí se mostrarán las tareas operativas asignadas a sucursales y equipos." />
        )}
      </HeaderPage>

      <TaskFormDialog open={openForm} loading={saving} onClose={() => setOpenForm(false)} onSubmit={onCreate} />
    </Container>
  );
}
