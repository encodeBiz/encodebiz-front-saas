"use client";

import {
  Archive,
  Add,
  Download,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ManagedDocument } from "@/domain/features/checkinbiz/IDocument";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useToast } from "@/hooks/useToast";
import { useLayout } from "@/hooks/useLayout";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import {
  archiveDocument,
  downloadDocument,
  fetchDocuments,
  uploadDocument,
} from "@/services/checkinbiz/document.service";
import {
  DocumentScopeChip,
  DocumentStatusChip,
  DocumentTypeChip,
  formatFileSize,
} from "../../../../documents/components/documentUi";
import DocumentUploadModal, {
  DocumentUploadFormValues,
} from "../../../../documents/components/DocumentUploadModal";
import DocumentArchiveDialog from "../../../../documents/components/DocumentArchiveDialog";

interface Props {
  branchId: string;
}

export default function BranchDocumentsSection({ branchId }: Props) {
  const { token } = useAuth();
  const { currentEntity } = useEntity();
  const { currentLocale } = useAppLocale();
  const { showToast } = useToast();
  const { navivateTo } = useLayout();

  const [docs, setDocs] = useState<ManagedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ManagedDocument | null>(null);

  const fetchData = async () => {
    if (!currentEntity?.entity.id || !branchId) return;
    setLoading(true);
    try {
      const res = await fetchDocuments(
        { entityId: currentEntity.entity.id, scope: "branch", branchId, status: "active", limit: 20 },
        token,
        currentLocale
      );
      setDocs(res.documents ?? []);
    } catch (err: any) {
      showToast(err?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const onUpload = async (values: DocumentUploadFormValues) => {
    if (!currentEntity?.entity.id) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("entityId", currentEntity.entity.id);
      formData.append("scope", "branch");
      formData.append("branchId", branchId);
      formData.append("type", values.type);
      formData.append("title", values.title.trim());
      if (values.description.trim()) formData.append("description", values.description.trim());
      formData.append("visibleToRoles", JSON.stringify(values.visibleToRoles));
      formData.append("requiresAcknowledgement", String(values.requiresAcknowledgement));
      if (values.requiresAcknowledgement) formData.append("acknowledgementMode", "branch_employees");
      if (values.expiresAt) formData.append("expiresAt", values.expiresAt);
      formData.append("file", values.file as File);
      await uploadDocument(formData, token, currentLocale);
      setOpenUpload(false);
      await fetchData();
      showToast("Documento subido correctamente", "success");
    } catch (err: any) {
      showToast(err?.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const onDownload = async (doc: ManagedDocument) => {
    if (!currentEntity?.entity.id || !doc.id) return;
    try {
      const res = await downloadDocument(doc.id, currentEntity.entity.id, token, currentLocale);
      window.open(res.url, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      showToast(err?.message ?? "Error al descargar", "error");
    }
  };

  const onArchive = async (reason?: string) => {
    if (!selectedDoc?.id || !currentEntity?.entity.id) return;
    setArchiving(true);
    try {
      await archiveDocument(selectedDoc.id, currentEntity.entity.id, reason, token, currentLocale);
      setOpenArchive(false);
      setSelectedDoc(null);
      await fetchData();
      showToast("Documento archivado", "success");
    } catch (err: any) {
      showToast(err?.message ?? "Error al archivar", "error");
    } finally {
      setArchiving(false);
    }
  };

  useEffect(() => {
    if (currentEntity?.entity.id && branchId) fetchData();
  }, [currentEntity?.entity.id, branchId]);

  return (
    <Box sx={{ mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Documentos</Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Add />}
          onClick={() => setOpenUpload(true)}
        >
          Subir documento
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!loading && docs.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          Sin documentos para esta sucursal/proyecto.
        </Typography>
      )}

      {!loading && docs.length > 0 && (
        <Stack spacing={1}>
          {docs.map((doc) => (
            <Paper key={doc.id} variant="outlined" sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Box flex={1} minWidth={0}>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {doc.title}
                  </Typography>
                  <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
                    <DocumentTypeChip type={doc.type} />
                    <DocumentStatusChip status={doc.status} />
                    <Chip label={formatFileSize(doc.sizeBytes)} size="small" variant="outlined" />
                  </Box>
                </Box>
                <Box display="flex" gap={1}>
                  <Tooltip title="Ver detalle">
                    <IconButton
                      size="small"
                      onClick={() => navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/documents/${doc.id}/detail`, true)}
                    >
                      <VisibilityOutlined fontSize="small" color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Descargar">
                    <IconButton size="small" onClick={() => onDownload(doc)}>
                      <Download fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {doc.status === "active" && (
                    <Tooltip title="Archivar">
                      <IconButton
                        size="small"
                        onClick={() => { setSelectedDoc(doc); setOpenArchive(true); }}
                      >
                        <Archive fontSize="small" color="warning" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      <Divider sx={{ mt: 3 }} />

      <DocumentUploadModal
        open={openUpload}
        loading={saving}
        defaultScope="branch"
        defaultBranchId={branchId}
        onClose={() => setOpenUpload(false)}
        onSubmit={onUpload}
      />

      <DocumentArchiveDialog
        open={openArchive}
        loading={archiving}
        onClose={() => { setOpenArchive(false); setSelectedDoc(null); }}
        onConfirm={onArchive}
      />
    </Box>
  );
}
