"use client";

import {
  Archive,
  ArrowBack,
  CheckCircleOutline,
  Download,
  Edit,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import HeaderPage from "@/components/features/dashboard/HeaderPage/HeaderPage";
import { SassButton } from "@/components/common/buttons/GenericButton";
import {
  DOCUMENT_ROLE_LABELS,
  DOCUMENT_SCOPE_LABELS,
  DOCUMENT_TYPE_LABELS,
  DocumentScopeChip,
  DocumentStatusChip,
  DocumentTypeChip,
  formatFileSize,
  isSensitiveDocument,
} from "../../components/documentUi";
import DocumentArchiveDialog from "../../components/DocumentArchiveDialog";
import DocumentAckDialog from "../../components/DocumentAckDialog";
import useDocumentDetailController from "./page.controller";
import { DocumentVisibilityRole } from "@/domain/features/checkinbiz/IDocument";
import { format_date_with_locale } from "@/lib/common/Date";
import { useAppLocale } from "@/hooks/useAppLocale";

export default function DocumentDetailPage() {
  const {
    document,
    loading,
    archiving,
    acknowledging,
    downloading,
    saving,
    openArchive,
    openAck,
    openEdit,
    setOpenArchive,
    setOpenAck,
    setOpenEdit,
    onDownload,
    onArchive,
    onAcknowledge,
    onSaveEdit,
    goBack,
  } = useDocumentDetailController();

  const { currentLocale } = useAppLocale();

  const [editValues, setEditValues] = useState({ title: "", description: "", expiresAt: "", visibleToRoles: [] as DocumentVisibilityRole[] });

  const startEdit = () => {
    if (!document) return;
    setEditValues({
      title: document.title,
      description: document.description ?? "",
      expiresAt: document.expiresAt ? String(document.expiresAt).substring(0, 10) : "",
      visibleToRoles: [...document.visibleToRoles],
    });
    setOpenEdit(true);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!document) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography color="text.secondary">Documento no disponible.</Typography>
          <Button startIcon={<ArrowBack />} onClick={goBack} sx={{ mt: 2 }}>
            Volver
          </Button>
        </Box>
      </Container>
    );
  }

  const sensitive = isSensitiveDocument(document);
  const isArchived = document.status === "archived";

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={sensitive ? `[${DOCUMENT_TYPE_LABELS[document.type]}]` : document.title}
        actions={
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button startIcon={<ArrowBack />} onClick={goBack} variant="outlined" size="small">
              Volver
            </Button>
            <SassButton startIcon={<Download />} onClick={onDownload} disabled={downloading} size="small">
              {downloading ? "Descargando…" : "Descargar"}
            </SassButton>
            {!isArchived && (
              <>
                <SassButton startIcon={<Edit />} onClick={startEdit} size="small" variant="outlined">
                  Editar
                </SassButton>
                <SassButton
                  startIcon={<Archive />}
                  onClick={() => setOpenArchive(true)}
                  size="small"
                  color="warning"
                  variant="outlined"
                >
                  Archivar
                </SassButton>
              </>
            )}
            {document.requiresAcknowledgement && !isArchived && (
              <SassButton
                startIcon={<CheckCircleOutline />}
                onClick={() => setOpenAck(true)}
                size="small"
                color="success"
                variant="outlined"
              >
                Acusar recibo
              </SassButton>
            )}
          </Box>
        }
      >
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <Paper variant="outlined" sx={{ p: 3, flex: "2 1 400px", minWidth: 0 }}>
            <Stack spacing={2}>
              <Box display="flex" gap={1} flexWrap="wrap">
                <DocumentScopeChip scope={document.scope} />
                <DocumentTypeChip type={document.type} />
                <DocumentStatusChip status={document.status} />
                {document.version > 1 && (
                  <Chip label={`v${document.version}`} size="small" variant="outlined" />
                )}
              </Box>

              <Box>
                <Typography variant="h6">{document.title}</Typography>
                {document.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {document.description}
                  </Typography>
                )}
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Archivo
                </Typography>
                <Typography variant="body2">
                  {document.filename} — {formatFileSize(document.sizeBytes)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {document.mimeType}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Visibilidad
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {document.visibleToRoles.map((role) => (
                    <Chip key={role} label={DOCUMENT_ROLE_LABELS[role] ?? role} size="small" />
                  ))}
                </Box>
              </Box>

              {document.requiresAcknowledgement && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Acuse de recibo
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {document.acknowledgementMode === "single_employee"
                        ? "Empleado afectado"
                        : document.acknowledgementMode === "branch_employees"
                        ? "Empleados de la sucursal/proyecto"
                        : "—"}
                    </Typography>
                  </Box>
                </>
              )}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, flex: "1 1 240px", minWidth: 0 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Ámbito
                </Typography>
                <Typography variant="body2">{DOCUMENT_SCOPE_LABELS[document.scope]}</Typography>
              </Box>

              {document.branchId && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Sucursal/Proyecto
                  </Typography>
                  <Typography variant="body2">{document.branchId}</Typography>
                </Box>
              )}

              {document.employeeId && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Empleado
                  </Typography>
                  <Typography variant="body2">{document.employeeId}</Typography>
                </Box>
              )}

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Creado
                </Typography>
                <Typography variant="body2">
                  {format_date_with_locale(document.createdAt, currentLocale as "en" | "es")}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Actualizado
                </Typography>
                <Typography variant="body2">
                  {format_date_with_locale(document.updatedAt, currentLocale as "en" | "es")}
                </Typography>
              </Box>

              {document.expiresAt && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Vence
                  </Typography>
                  <Typography variant="body2">
                    {format_date_with_locale(document.expiresAt, currentLocale as "en" | "es")}
                  </Typography>
                </Box>
              )}

              {isArchived && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Archivado
                    </Typography>
                    <Typography variant="body2">
                      {document.archivedAt
                        ? format_date_with_locale(document.archivedAt, currentLocale as "en" | "es")
                        : "—"}
                    </Typography>
                    {document.archiveReason && (
                      <Typography variant="caption" color="text.secondary">
                        {document.archiveReason}
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </Stack>
          </Paper>
        </Box>
      </HeaderPage>

      {/* Edit inline dialog */}
      {openEdit && (
        <Box
          component={Paper}
          variant="outlined"
          sx={{ p: 3, mt: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Editar metadatos
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Título"
              size="small"
              fullWidth
              value={editValues.title}
              onChange={(e) => setEditValues((prev) => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              label="Descripción"
              size="small"
              fullWidth
              multiline
              rows={2}
              value={editValues.description}
              onChange={(e) => setEditValues((prev) => ({ ...prev, description: e.target.value }))}
            />
            <TextField
              label="Fecha de vencimiento"
              size="small"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={editValues.expiresAt}
              onChange={(e) => setEditValues((prev) => ({ ...prev, expiresAt: e.target.value }))}
            />
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button onClick={() => setOpenEdit(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                disabled={saving}
                onClick={() => onSaveEdit(editValues)}
              >
                {saving ? "Guardando…" : "Guardar"}
              </Button>
            </Box>
          </Stack>
        </Box>
      )}

      <DocumentArchiveDialog
        open={openArchive}
        loading={archiving}
        onClose={() => setOpenArchive(false)}
        onConfirm={onArchive}
      />

      <DocumentAckDialog
        open={openAck}
        loading={acknowledging}
        documentTitle={document.title}
        onClose={() => setOpenAck(false)}
        onConfirm={onAcknowledge}
      />
    </Container>
  );
}
