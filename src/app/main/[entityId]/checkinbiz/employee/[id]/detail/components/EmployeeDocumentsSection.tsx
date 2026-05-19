"use client";

import {
  Archive,
  Add,
  CheckCircleOutline,
  Download,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
  acknowledgeDocument,
  archiveDocument,
  downloadDocument,
  fetchDocuments,
  uploadDocument,
} from "@/services/checkinbiz/document.service";
import {
  DocumentStatusChip,
  DocumentTypeChip,
  formatFileSize,
} from "../../../../documents/components/documentUi";
import DocumentUploadModal, {
  DocumentUploadFormValues,
} from "../../../../documents/components/DocumentUploadModal";
import DocumentArchiveDialog from "../../../../documents/components/DocumentArchiveDialog";
import DocumentAckDialog from "../../../../documents/components/DocumentAckDialog";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { collection } from "@/config/collection";

interface Props {
  employeeId: string;
}

export default function EmployeeDocumentsSection({ employeeId }: Props) {
  const { token } = useAuth();
  const { currentEntity } = useEntity();
  const { currentLocale } = useAppLocale();
  const { showToast } = useToast();
  const { navivateTo } = useLayout();

  const [docs, setDocs] = useState<ManagedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openAck, setOpenAck] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ManagedDocument | null>(null);
  const [branches, setBranches] = useState<ISucursal[]>([]);
  const [contextBranchId, setContextBranchId] = useState<string>("");

  const loadBranches = async () => {
    if (!currentEntity?.entity.id || !employeeId) return;
    try {
      const results = await searchFirestore<any>({
        collection: `${collection.ENTITIES}/${currentEntity.entity.id}/employee_responsibilities`,
        filters: [
          { field: "employeeId", operator: "==", value: employeeId },
          { field: "active", operator: "==", value: 1 },
        ],
        limit: 50,
        orderBy: "createdAt",
        orderDirection: "desc",
        includeCount: false,
      });
      const branchIds = [...new Set(results.map((r: any) => r.scope?.branchId).filter(Boolean))];
      if (branchIds.length > 0) {
        const sucursals = await Promise.all(
          branchIds.map((bId) =>
            searchFirestore<ISucursal>({
              collection: `${collection.ENTITIES}/${currentEntity.entity.id}/branches`,
              filters: [{ field: "__name__", operator: "==", value: bId as string }],
              limit: 1,
              orderBy: "createdAt",
              orderDirection: "desc",
              includeCount: false,
            }).then((arr) => arr[0])
          )
        );
        const valid = sucursals.filter(Boolean);
        setBranches(valid);
        if (valid.length > 0 && !contextBranchId) setContextBranchId((valid[0] as any).id ?? "");
      }
    } catch {}
  };

  const fetchData = async (branchId: string) => {
    if (!currentEntity?.entity.id || !employeeId) return;
    setLoading(true);
    try {
      const res = await fetchDocuments(
        { entityId: currentEntity.entity.id, scope: "employee", employeeId, branchId: branchId || undefined, status: "active", limit: 20 },
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
      formData.append("scope", "employee");
      formData.append("employeeId", employeeId);
      formData.append("branchId", values.branchId || contextBranchId);
      formData.append("type", values.type);
      formData.append("title", values.title.trim());
      if (values.description.trim()) formData.append("description", values.description.trim());
      formData.append("visibleToRoles", JSON.stringify(values.visibleToRoles));
      formData.append("requiresAcknowledgement", String(values.requiresAcknowledgement));
      if (values.requiresAcknowledgement) formData.append("acknowledgementMode", "single_employee");
      if (values.expiresAt) formData.append("expiresAt", values.expiresAt);
      formData.append("file", values.file as File);
      await uploadDocument(formData, token, currentLocale);
      setOpenUpload(false);
      await fetchData(contextBranchId);
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
      await fetchData(contextBranchId);
      showToast("Documento archivado", "success");
    } catch (err: any) {
      showToast(err?.message ?? "Error al archivar", "error");
    } finally {
      setArchiving(false);
    }
  };

  const onAcknowledge = async () => {
    if (!selectedDoc?.id || !currentEntity?.entity.id) return;
    setAcknowledging(true);
    try {
      await acknowledgeDocument(selectedDoc.id, currentEntity.entity.id, token, currentLocale);
      setOpenAck(false);
      setSelectedDoc(null);
      showToast("Acuse de recibo registrado", "success");
    } catch (err: any) {
      showToast(err?.message ?? "Error al acusar recibo", "error");
    } finally {
      setAcknowledging(false);
    }
  };

  useEffect(() => {
    if (currentEntity?.entity.id && employeeId) loadBranches();
  }, [currentEntity?.entity.id, employeeId]);

  useEffect(() => {
    if (currentEntity?.entity.id && employeeId) fetchData(contextBranchId);
  }, [currentEntity?.entity.id, employeeId, contextBranchId]);

  return (
    <Box sx={{ mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
        <Typography variant="h6">Documentos</Typography>
        <Box display="flex" gap={1} alignItems="center">
          {branches.length > 1 && (
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Contexto sucursal</InputLabel>
              <Select
                value={contextBranchId}
                label="Contexto sucursal"
                onChange={(e) => setContextBranchId(e.target.value)}
              >
                {branches.map((b) => (
                  <MenuItem key={(b as any).id} value={(b as any).id}>
                    {b.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button size="small" variant="outlined" startIcon={<Add />} onClick={() => setOpenUpload(true)}>
            Subir documento
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!loading && docs.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          Sin documentos para este empleado.
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
                    {doc.requiresAcknowledgement && (
                      <Chip label="Requiere acuse" size="small" color="info" variant="outlined" />
                    )}
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
                  {doc.requiresAcknowledgement && doc.status === "active" && (
                    <Tooltip title="Acusar recibo">
                      <IconButton
                        size="small"
                        onClick={() => { setSelectedDoc(doc); setOpenAck(true); }}
                      >
                        <CheckCircleOutline fontSize="small" color="success" />
                      </IconButton>
                    </Tooltip>
                  )}
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
        defaultScope="employee"
        defaultBranchId={contextBranchId}
        defaultEmployeeId={employeeId}
        onClose={() => setOpenUpload(false)}
        onSubmit={onUpload}
      />

      <DocumentArchiveDialog
        open={openArchive}
        loading={archiving}
        onClose={() => { setOpenArchive(false); setSelectedDoc(null); }}
        onConfirm={onArchive}
      />

      <DocumentAckDialog
        open={openAck}
        loading={acknowledging}
        documentTitle={selectedDoc?.title ?? ""}
        onClose={() => { setOpenAck(false); setSelectedDoc(null); }}
        onConfirm={onAcknowledge}
      />
    </Box>
  );
}
