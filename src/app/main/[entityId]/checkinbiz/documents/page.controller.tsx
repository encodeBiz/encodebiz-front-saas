/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Column, IRowAction } from "@/components/common/table/GenericTable";
import SearchFilter from "@/components/common/table/filters/SearchFilter";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import {
  DocumentScope,
  DocumentStatus,
  DocumentType,
  ManagedDocument,
} from "@/domain/features/checkinbiz/IDocument";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { useToast } from "@/hooks/useToast";
import { format_date_with_locale } from "@/lib/common/Date";
import {
  fetchDocuments,
  uploadDocument,
} from "@/services/checkinbiz/document.service";
import { VisibilityOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  DOCUMENT_SCOPE_OPTIONS,
  DOCUMENT_STATUS_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
  DocumentScopeChip,
  DocumentStatusChip,
  DocumentTypeChip,
  formatFileSize,
} from "./components/documentUi";
import { DocumentUploadFormValues } from "./components/DocumentUploadModal";

interface IFilterState {
  q: string;
  scope: DocumentScope | "all";
  branchId: string;
  employeeId: string;
  type: DocumentType | "all";
  status: DocumentStatus | "all";
  createdFrom: string;
  createdTo: string;
}

interface IPageState {
  cursor: string | null;
  currentPage: number;
  limit: number;
}

export default function useDocumentsListController() {
  const { token } = useAuth();
  const { currentEntity, watchServiceAccess } = useEntity();
  const { currentLocale } = useAppLocale();
  const { navivateTo } = useLayout();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<ManagedDocument[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [openUpload, setOpenUpload] = useState(false);

  const [filter, setFilter] = useState<IFilterState>({
    q: "",
    scope: "all",
    branchId: "",
    employeeId: "",
    type: "all",
    status: "active",
    createdFrom: "",
    createdTo: "",
  });

  const [page, setPage] = useState<IPageState>({
    cursor: null,
    currentPage: 0,
    limit: 20,
  });

  const buildParams = (f: IFilterState, p: IPageState) => {
    const params: Record<string, any> = {
      entityId: currentEntity?.entity.id,
      limit: p.limit,
    };
    if (f.scope !== "all") params.scope = f.scope;
    if (f.branchId) params.branchId = f.branchId;
    if (f.employeeId) params.employeeId = f.employeeId;
    if (f.type !== "all") params.type = f.type;
    if (f.status !== "all") params.status = f.status;
    if (f.createdFrom) params.createdFrom = f.createdFrom;
    if (f.createdTo) params.createdTo = f.createdTo;
    if (f.q.trim()) params.q = f.q.trim();
    if (p.cursor) params.cursor = p.cursor;
    return params;
  };

  const fetchData = async (f: IFilterState, p: IPageState) => {
    if (!currentEntity?.entity.id) return;
    setLoading(true);
    try {
      const res = await fetchDocuments(buildParams(f, p) as any, token, currentLocale);
      setItems(res.documents ?? []);
      setNextCursor(res.nextCursor ?? null);
    } catch (err: any) {
      showToast(err?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const onFilter = (partial: Partial<IFilterState>) => {
    const next = { ...filter, ...partial };
    setFilter(next);
    const nextPage = { ...page, cursor: null, currentPage: 0 };
    setPage(nextPage);
    fetchData(next, nextPage);
  };

  const onLoadMore = () => {
    if (!nextCursor) return;
    const nextPage = { ...page, cursor: nextCursor, currentPage: page.currentPage + 1 };
    setPage(nextPage);
    fetchData(filter, nextPage);
  };

  const onDetail = (doc: ManagedDocument) => {
    navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/documents/${doc.id}/detail`);
  };

  const onUploadSubmit = async (values: DocumentUploadFormValues) => {
    if (!currentEntity?.entity.id) return;
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("entityId", currentEntity.entity.id);
      formData.append("scope", values.scope);
      formData.append("type", values.type);
      formData.append("title", values.title.trim());
      if (values.description.trim()) formData.append("description", values.description.trim());
      if (values.branchId) formData.append("branchId", values.branchId);
      if (values.employeeId) formData.append("employeeId", values.employeeId);
      formData.append("visibleToRoles", JSON.stringify(values.visibleToRoles));
      if (values.scope !== "entity") {
        formData.append("requiresAcknowledgement", String(values.requiresAcknowledgement));
        if (values.requiresAcknowledgement) {
          const mode = values.scope === "employee" ? "single_employee" : "branch_employees";
          formData.append("acknowledgementMode", mode);
        }
      } else {
        formData.append("requiresAcknowledgement", "false");
      }
      if (values.expiresAt) formData.append("expiresAt", values.expiresAt);
      const meta: Record<string, any> = {};
      if (values.externalRef.trim()) meta.externalRef = values.externalRef.trim();
      if (values.tags.trim()) meta.tags = values.tags.split(",").map((t) => t.trim()).filter(Boolean);
      if (Object.keys(meta).length > 0) formData.append("metadata", JSON.stringify(meta));
      formData.append("file", values.file as File);

      await uploadDocument(formData, token, currentLocale);
      setOpenUpload(false);
      const resetPage = { ...page, cursor: null, currentPage: 0 };
      setPage(resetPage);
      await fetchData(filter, resetPage);
      showToast("Documento subido correctamente", "success");
    } catch (err: any) {
      showToast(err?.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const rowAction: IRowAction[] = [
    {
      actionBtn: true,
      iconOnly: true,
      color: "primary",
      icon: <VisibilityOutlined color="primary" />,
      label: "Ver detalle",
      bulk: false,
      allowItem: () => true,
      onPress: (item: ManagedDocument) => onDetail(item),
    },
  ];

  const columns: Column<ManagedDocument>[] = [
    {
      id: "title",
      label: "Título",
      minWidth: 200,
      onClick: (item) => onDetail(item),
    },
    {
      id: "type",
      label: "Tipo",
      minWidth: 160,
      format: (_v, row) => <DocumentTypeChip type={row.type} />,
    },
    {
      id: "scope",
      label: "Ámbito",
      minWidth: 130,
      format: (_v, row) => <DocumentScopeChip scope={row.scope} />,
    },
    {
      id: "status",
      label: "Estado",
      minWidth: 100,
      format: (_v, row) => <DocumentStatusChip status={row.status} />,
    },
    {
      id: "filename",
      label: "Archivo",
      minWidth: 160,
      format: (_v, row) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
          {row.filename}
        </Typography>
      ),
    },
    {
      id: "sizeBytes",
      label: "Tamaño",
      minWidth: 90,
      format: (_v, row) => formatFileSize(row.sizeBytes),
    },
    {
      id: "createdAt",
      label: "Fecha",
      minWidth: 140,
      format: (_v, row) => (
        <Typography variant="body2">
          {format_date_with_locale(row.createdAt, currentLocale as "en" | "es")}
        </Typography>
      ),
    },
  ];

  const topFilter = useMemo(
    () => (
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, flexWrap: "wrap", width: "100%", justifyContent: "flex-end" }}>
        <SearchFilter
          label="Estado"
          value={filter.status}
          onChange={(v: any) => onFilter({ status: v })}
          options={DOCUMENT_STATUS_OPTIONS}
        />
        <SearchFilter
          label="Tipo"
          value={filter.type}
          onChange={(v: any) => onFilter({ type: v })}
          options={[{ value: "all", label: "Todos los tipos" }, ...DOCUMENT_TYPE_OPTIONS]}
        />
        <SearchFilter
          label="Ámbito"
          value={filter.scope}
          onChange={(v: any) => onFilter({ scope: v })}
          options={[{ value: "all", label: "Todos" }, ...DOCUMENT_SCOPE_OPTIONS]}
        />
        <SearchIndexFilter
          width="auto"
          type="branch"
          label="Sucursal"
          onChange={(item: ISearchIndex) => {
            const branchId = item?.index?.split("/").pop() ?? "";
            onFilter({ branchId });
          }}
        />
        <SearchIndexFilter
          width="auto"
          type="employee"
          label="Empleado"
          onChange={(item: ISearchIndex) => {
            const employeeId = item?.index?.split("/").pop() ?? "";
            onFilter({ employeeId });
          }}
        />
      </Box>
    ),
    [filter]
  );

  useEffect(() => {
    if (currentEntity?.entity?.id) watchServiceAccess("checkinbiz");
  }, [currentEntity?.entity?.id]);

  useEffect(() => {
    if (currentEntity?.entity?.id) fetchData(filter, page);
  }, [currentEntity?.entity?.id]);

  return {
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
    page,
  };
}
