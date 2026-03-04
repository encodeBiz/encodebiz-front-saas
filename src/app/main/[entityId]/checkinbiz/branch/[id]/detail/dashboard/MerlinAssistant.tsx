/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Paper, Stack, Typography, Divider, IconButton, Avatar, Chip, CircularProgress } from "@mui/material";
import { SmartToyOutlined, RefreshOutlined, Close, ExpandMoreOutlined } from "@mui/icons-material";
import { SassButton } from "@/components/common/buttons/GenericButton";
import { useEntity } from "@/hooks/useEntity";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations, useLocale } from "next-intl";
import { useDashboardBranch } from "./DashboardBranchContext";
import { useToast } from "@/hooks/useToast";
import { useMerlin } from "@/contexts/merlinContext";
import { merlinSubscribe } from "@/services/merlin.service";

type MerlinStatus = "idle" | "pending" | "ready" | "error";

type MerlinResult = {
  headline?: string;
  summary?: string;
  body?: string;
  actions?: string[];
  confidenceNote?: string;
};

const MerlinAssistant = () => {
  const t = useTranslations("sucursal");
  const { currentEntity } = useEntity();
  const { branchId } = useDashboardBranch();
  const { showToast } = useToast();
  const { token } = useAuth();
  const { status, result, path, run, reset, setResult, setStatus } = useMerlin();
  const locale = useLocale();
  const [collapsed, setCollapsed] = useState(false);

  const entityId = currentEntity?.entity?.id;
  const canRun = useMemo(() => Boolean(entityId && branchId), [entityId, branchId]);

  useEffect(() => {
    // Reset cuando cambia sucursal o entidad
    reset();
  }, [branchId, entityId, reset]);

  useEffect(() => {
    if (!path) return;
    if (status === "pending") {
      const unsub = merlinSubscribe(path, (snap) => {
        if (snap.code === "ai/cache_hit" && (snap as any).result) {
          setResult((snap as any).result);
          setStatus("ready");
        } else if (snap.code === "ai/error") {
          setStatus("error");
          showToast("Merlin no pudo completar el análisis.", "error");
        } else {
          setStatus("pending");
        }
      });
      return () => unsub();
    }
  }, [status, path, setResult, setStatus, showToast]);

  const handleRun = useCallback(async () => {
    if (!canRun) return;
    reset();
    await run({
      entityId: entityId as string,
      branchIds: [branchId as string],
      scope: "branch",
      authToken: token ?? "",
      locale,
    });
  }, [canRun, reset, run, entityId, branchId, token, locale]);

  const loading = status === "pending";
  const subtitle =
    status === "pending"
      ? t("merlin.subtitleAnalysing")
      : result
      ? t("merlin.subtitleReady")
      : t("merlin.subtitleIdle");

  // Auto-run al entrar si no hay resultado ni path
  useEffect(() => {
    if (canRun && status === "idle" && !path && !result) {
      handleRun();
    }
  }, [canRun, status, path, result, handleRun]);

  const handleToggleCollapse = () => {
    setCollapsed((c) => !c);
    if (!collapsed && status === "error") reset();
  };

  return (
    <Paper
      elevation={6}
      sx={{
        position: "fixed",
        right: { xs: 16, md: 32 },
        bottom: { xs: 16, md: 24 },
        zIndex: 1300,
        p: collapsed ? 1.5 : 3,
        width: collapsed
          ? { xs: 320, sm: 340 }
          : result && status === "ready"
          ? { xs: "calc(100% - 32px)", sm: 520 }
          : { xs: "calc(100% - 32px)", sm: 360 },
        maxWidth: result && status === "ready" ? 560 : 420,
        backdropFilter: "blur(8px)",
        cursor: collapsed ? "pointer" : "default",
      }}
      onClick={() => {
        if (collapsed) setCollapsed(false);
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            src="/assets/images/Merili_IA_blue.png"
            sx={{ bgcolor: "primary.main", width: 55, height: 55, cursor: "pointer" }}
            onClick={() => {
              if (collapsed) setCollapsed(false);
            }}
          >
            <SmartToyOutlined fontSize="small" />
          </Avatar>
          <Stack>
            <Typography variant="subtitle1" fontWeight={700}>
              {t("merlin.title")}
            </Typography>
            {!collapsed && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Stack>
        </Stack>
        <IconButton size="small" onClick={handleToggleCollapse} aria-label={collapsed ? "expandir" : "colapsar"}>
          {collapsed ? <ExpandMoreOutlined fontSize="small" /> : <Close fontSize="small" />}
        </IconButton>
      </Stack>

      {!collapsed && <Divider sx={{ my: 1 }} />}

      {!collapsed && result && status === "ready" && (
        <Stack spacing={1} sx={{ maxHeight: 420, overflow: "auto", pr: 0.5 }}>
          {result.headline && <Typography variant="subtitle2">{result.headline}</Typography>}
          {result.summary && <Typography variant="body2">{result.summary}</Typography>}
          {result.body && (
            <Typography variant="body2" color="text.secondary">
              {result.body}
            </Typography>
          )}
          {Array.isArray(result.actions) && result.actions.length > 0 && (
            <Stack spacing={0.5}>
              {result.actions.map((a, i) => (
                <Chip key={i} label={a} size="small" />
              ))}
            </Stack>
          )}
          {result.confidenceNote && (
            <Typography variant="caption" color="text.secondary">
              {result.confidenceNote}
            </Typography>
          )}
        </Stack>
      )}

      {!collapsed && !result && (
        <Stack spacing={1} alignItems="flex-start">
          <Typography variant="body2" color="text.secondary">
            {loading ? t("merlin.subtitleAnalysing") : t("merlin.description")}
          </Typography>
          <SassButton
            variant="contained"
            color="primary"
            size="small"
            startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <RefreshOutlined fontSize="small" />}
            onClick={handleRun}
            disabled={!canRun || loading}
          >
            {loading ? t("merlin.buttonRunning") : t("merlin.buttonRun")}
          </SassButton>
        </Stack>
      )}
    </Paper>
  );
};

export default MerlinAssistant;
