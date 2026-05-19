"use client";

import { SassButton } from "@/components/common/buttons/GenericButton";
import EmptyList from "@/components/common/EmptyState/EmptyList";
import { GenericTable } from "@/components/common/table/GenericTable";
import HeaderPage from "@/components/features/dashboard/HeaderPage/HeaderPage";
import { Add, ExpandMore } from "@mui/icons-material";
import { Box, Button, Container } from "@mui/material";
import emptyImage from "../../../../../../public/assets/images/empty/reportes.svg";
import DocumentUploadModal from "./components/DocumentUploadModal";
import useDocumentsListController from "./page.controller";

export default function DocumentsPage() {
  const {
    items,
    columns,
    rowAction,
    loading,
    saving,
    topFilter,
    nextCursor,
    openUpload,
    setOpenUpload,
    onLoadMore,
    onUploadSubmit,
  } = useDocumentsListController();

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title="Gestión Documental"
        actions={
          <Box display="flex" justifyContent="flex-end" alignItems="flex-end" gap={2} sx={{ width: "100%" }}>
            <SassButton onClick={() => setOpenUpload(true)} variant="contained" startIcon={<Add />}>
              Subir documento
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
          page={0}
          rowsPerPage={items.length}
          onRowsPerPageChange={() => {}}
          onSorteable={() => {}}
          sort={{ orderBy: "createdAt", orderDirection: "desc" }}
          onBack={() => {}}
          onNext={() => {}}
          topFilter={topFilter}
          disableRowHover
        />

        {items.length === 0 && !loading && (
          <EmptyList
            imageUrl={emptyImage}
            title="Sin documentos"
            description="Aquí se mostrarán los documentos de entidad, sucursales y empleados."
          />
        )}

        {nextCursor && !loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="outlined" startIcon={<ExpandMore />} onClick={onLoadMore}>
              Cargar más
            </Button>
          </Box>
        )}
      </HeaderPage>

      <DocumentUploadModal
        open={openUpload}
        loading={saving}
        onClose={() => setOpenUpload(false)}
        onSubmit={onUploadSubmit}
      />
    </Container>
  );
}
