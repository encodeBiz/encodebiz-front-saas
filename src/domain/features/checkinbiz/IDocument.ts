export type DocumentScope = "entity" | "branch" | "employee";

export type DocumentType =
  | "payroll"
  | "contract"
  | "warning"
  | "attention_call"
  | "justification"
  | "certificate"
  | "policy"
  | "procedure"
  | "risk_prevention"
  | "branch_protocol"
  | "project_document"
  | "other";

export type DocumentVisibilityRole = "worker" | "supervisor" | "manager";

export type DocumentStatus = "active" | "archived";

export type AcknowledgementMode =
  | "single_employee"
  | "branch_employees"
  | "entity_employees";

export interface DocumentMetadata {
  externalRef?: string;
  tags?: string[];
}

export interface ManagedDocument {
  id?: string;
  entityId: string;
  scope: DocumentScope;
  branchId?: string;
  employeeId?: string;
  type: DocumentType;
  title: string;
  description?: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  visibleToRoles: DocumentVisibilityRole[];
  status: DocumentStatus;
  version: number;
  requiresAcknowledgement: boolean;
  acknowledgementMode?: AcknowledgementMode;
  uploadedBy: string;
  archivedBy?: string;
  archivedAt?: Date | string | any;
  archiveReason?: string;
  expiresAt?: Date | string | any;
  createdAt: Date | string | any;
  updatedAt: Date | string | any;
  metadata?: DocumentMetadata;
}

export interface DocumentListResponse {
  ok: boolean;
  documents: ManagedDocument[];
  nextCursor: string | null;
}

export interface DocumentDetailResponse {
  ok: boolean;
  document: ManagedDocument;
}

export interface DocumentDownloadResponse {
  ok: boolean;
  url: string;
  expiresAt: string;
}

export interface DocumentUploadPayload {
  entityId: string;
  scope: DocumentScope;
  branchId?: string;
  employeeId?: string;
  type: DocumentType;
  title: string;
  description?: string;
  visibleToRoles: DocumentVisibilityRole[];
  requiresAcknowledgement?: boolean;
  acknowledgementMode?: Exclude<AcknowledgementMode, "entity_employees">;
  expiresAt?: string;
  metadata?: string;
  file: File;
}

export interface DocumentUpdatePayload {
  entityId: string;
  title?: string;
  description?: string;
  visibleToRoles?: DocumentVisibilityRole[];
  requiresAcknowledgement?: boolean;
  acknowledgementMode?: AcknowledgementMode;
  expiresAt?: string | null;
  metadata?: DocumentMetadata;
}

export interface DocumentListParams {
  entityId: string;
  scope?: DocumentScope;
  branchId?: string;
  employeeId?: string;
  type?: DocumentType;
  status?: DocumentStatus;
  createdFrom?: string;
  createdTo?: string;
  q?: string;
  limit?: number;
  cursor?: string;
}
