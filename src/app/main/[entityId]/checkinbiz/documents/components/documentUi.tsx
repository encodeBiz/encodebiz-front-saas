"use client";

import { Chip } from "@mui/material";
import {
  DocumentScope,
  DocumentStatus,
  DocumentType,
  DocumentVisibilityRole,
  ManagedDocument,
} from "@/domain/features/checkinbiz/IDocument";

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  payroll: "Nómina",
  contract: "Contrato",
  warning: "Amonestación",
  attention_call: "Llamada de atención",
  justification: "Justificante",
  certificate: "Certificado",
  policy: "Política interna",
  procedure: "Procedimiento",
  risk_prevention: "Prevención de riesgos",
  branch_protocol: "Protocolo de sucursal/proyecto",
  project_document: "Documento de proyecto",
  other: "Otro",
};

export const DOCUMENT_SCOPE_LABELS: Record<DocumentScope, string> = {
  entity: "Entidad",
  branch: "Sucursal/Proyecto",
  employee: "Empleado",
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  active: "Activo",
  archived: "Archivado",
};

export const DOCUMENT_ROLE_LABELS: Record<DocumentVisibilityRole, string> = {
  worker: "Trabajador",
  supervisor: "Supervisor",
  manager: "Manager",
};

export const DOCUMENT_TYPE_OPTIONS = (Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map((key) => ({
  value: key,
  label: DOCUMENT_TYPE_LABELS[key],
}));

export const DOCUMENT_SCOPE_OPTIONS = (Object.keys(DOCUMENT_SCOPE_LABELS) as DocumentScope[]).map((key) => ({
  value: key,
  label: DOCUMENT_SCOPE_LABELS[key],
}));

export const DOCUMENT_STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "archived", label: "Archivados" },
];

export const DOCUMENT_VISIBILITY_ROLES: DocumentVisibilityRole[] = ["worker", "supervisor", "manager"];

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const ALLOWED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx";

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const SENSITIVE_TYPES: DocumentType[] = ["payroll", "contract", "warning", "attention_call"];

export function isSensitiveDocument(doc: ManagedDocument): boolean {
  return SENSITIVE_TYPES.includes(doc.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentTypeChip({ type }: { type: DocumentType }) {
  const isSensitive = SENSITIVE_TYPES.includes(type);
  return (
    <Chip
      label={DOCUMENT_TYPE_LABELS[type] ?? type}
      size="small"
      color={isSensitive ? "warning" : "default"}
      variant={isSensitive ? "filled" : "outlined"}
    />
  );
}

export function DocumentStatusChip({ status }: { status: DocumentStatus }) {
  return (
    <Chip
      label={DOCUMENT_STATUS_LABELS[status] ?? status}
      size="small"
      color={status === "active" ? "success" : "default"}
      variant="filled"
    />
  );
}

export function DocumentScopeChip({ scope }: { scope: DocumentScope }) {
  const colorMap: Record<DocumentScope, "primary" | "secondary" | "info"> = {
    entity: "primary",
    branch: "secondary",
    employee: "info",
  };
  return (
    <Chip
      label={DOCUMENT_SCOPE_LABELS[scope] ?? scope}
      size="small"
      color={colorMap[scope]}
      variant="outlined"
    />
  );
}
