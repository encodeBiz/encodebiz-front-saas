/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ManagedDocument } from "@/domain/features/checkinbiz/IDocument";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { useToast } from "@/hooks/useToast";
import {
  acknowledgeDocument,
  archiveDocument,
  downloadDocument,
  fetchDocumentById,
  updateDocument,
} from "@/services/checkinbiz/document.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DocumentUpdatePayload, DocumentVisibilityRole } from "@/domain/features/checkinbiz/IDocument";

export default function useDocumentDetailController() {
  const { token } = useAuth();
  const { currentEntity } = useEntity();
  const { currentLocale } = useAppLocale();
  const { showToast } = useToast();
  const { navivateTo } = useLayout();
  const goBack = () => navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/documents`, true);
  const { id } = useParams<{ id: string }>();

  const [document, setDocument] = useState<ManagedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [archiving, setArchiving] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openArchive, setOpenArchive] = useState(false);
  const [openAck, setOpenAck] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const fetchData = async () => {
    if (!currentEntity?.entity.id || !id) return;
    setLoading(true);
    try {
      const res = await fetchDocumentById(id, currentEntity.entity.id, token, currentLocale);
      setDocument(res.document);
    } catch (err: any) {
      const msg = err?.message ?? "Documento no disponible";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const onDownload = async () => {
    if (!document?.id || !currentEntity?.entity.id) return;
    setDownloading(true);
    try {
      const res = await downloadDocument(document.id, currentEntity.entity.id, token, currentLocale);
      window.open(res.url, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      showToast(err?.message ?? "Error al descargar", "error");
    } finally {
      setDownloading(false);
    }
  };

  const onArchive = async (reason?: string) => {
    if (!document?.id || !currentEntity?.entity.id) return;
    setArchiving(true);
    try {
      await archiveDocument(document.id, currentEntity.entity.id, reason, token, currentLocale);
      setOpenArchive(false);
      await fetchData();
      showToast("Documento archivado correctamente", "success");
    } catch (err: any) {
      showToast(err?.message ?? "Error al archivar", "error");
    } finally {
      setArchiving(false);
    }
  };

  const onAcknowledge = async () => {
    if (!document?.id || !currentEntity?.entity.id) return;
    setAcknowledging(true);
    try {
      await acknowledgeDocument(document.id, currentEntity.entity.id, token, currentLocale);
      setOpenAck(false);
      showToast("Acuse de recibo registrado", "success");
    } catch (err: any) {
      showToast(err?.message ?? "Error al acusar recibo", "error");
    } finally {
      setAcknowledging(false);
    }
  };

  const onSaveEdit = async (data: {
    title: string;
    description: string;
    visibleToRoles: DocumentVisibilityRole[];
    expiresAt: string;
  }) => {
    if (!document?.id || !currentEntity?.entity.id) return;
    setSaving(true);
    try {
      const payload: DocumentUpdatePayload = {
        entityId: currentEntity.entity.id,
        title: data.title,
        description: data.description || undefined,
        visibleToRoles: data.visibleToRoles,
        expiresAt: data.expiresAt || null,
      };
      const res = await updateDocument(document.id, payload, token, currentLocale);
      setDocument(res.document);
      setOpenEdit(false);
      showToast("Documento actualizado", "success");
    } catch (err: any) {
      showToast(err?.message ?? "Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (currentEntity?.entity.id && id) fetchData();
  }, [currentEntity?.entity.id, id]);

  return {
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
  };
}
