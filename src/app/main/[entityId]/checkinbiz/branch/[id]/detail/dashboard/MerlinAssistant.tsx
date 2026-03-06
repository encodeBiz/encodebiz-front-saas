/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useState, useCallback, useContext } from "react";
import {
  Paper,
  Stack,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import { SmartToyOutlined, RefreshOutlined, Close, ExpandMoreOutlined, CachedOutlined } from "@mui/icons-material";
import { SassButton } from "@/components/common/buttons/GenericButton";
import { useEntity } from "@/hooks/useEntity";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations, useLocale } from "next-intl";
import { DashboardBranchContext } from "./DashboardBranchContext";
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

type Quadrant = "ANCHOR" | "MAVERICK" | "GHOST" | "AT-RISK" | "NEUTRAL";

type CleanEmployeeProfile = {
  id: string | null;
  quadrant: Quadrant;
  headline: string;
  operational_metrics: {
    efficiency_index: number | null;
    cost_gap: number | null;
    predictability_score: number | null;
    cost_trend: "up" | "down" | "-" | null;
  };
  analysis: {
    summary: string;
    behavior_body: string;
    experience_context: string;
  };
  actions: { type: "audit" | "coaching" | "monitoring" | "action"; text: string }[];
  disclaimer: string;
};

type Props = {
  scope?: "branch" | "employee";
  branchId?: string;
  employeeId?: string;
  audience?: "admin" | "employee";
};

const quadrantColor: Record<Quadrant, "success" | "warning" | "error" | "default" | "info"> = {
  ANCHOR: "success",
  MAVERICK: "info",
  GHOST: "warning",
  "AT-RISK": "error",
  NEUTRAL: "default",
};

const MerlinAssistant = ({ scope = "branch", branchId: branchIdProp, employeeId: employeeIdProp, audience = "admin" }: Props) => {
  const t = useTranslations("sucursal");
  const { currentEntity } = useEntity();
  const branchCtx = useContext(DashboardBranchContext);
  const branchIdCtx = branchCtx?.branchId;
  const { token } = useAuth();
  const { status, result, path, run, reset, setResult, setStatus } = useMerlin();
  const locale = useLocale();
  const [collapsed, setCollapsed] = useState(false);
  const [message, setMessage] = useState<{ text: string; severity: "error" | "warning" | "info" } | null>(null);
  const [clean, setClean] = useState<CleanEmployeeProfile | null>(null);
  const [cached, setCached] = useState(false);

  const entityId = currentEntity?.entity?.id;
  const branchId = branchIdProp ?? branchIdCtx;
  const employeeId = employeeIdProp;
  const canRun =
    scope === "branch"
      ? useMemo(() => Boolean(entityId && branchId), [entityId, branchId])
      : useMemo(() => Boolean(entityId && employeeId), [entityId, employeeId]);

  useEffect(() => {
    // Reset cuando cambia sucursal/empleado o entidad
    reset();
    setMessage(null);
    setClean(null);
    setCached(false);
  }, [branchId, employeeId, entityId, reset]);

  useEffect(() => {
    if (!path) return;
    const unsub = merlinSubscribe(path, (snap) => {
      if (snap.code === "ai/cache_hit" && (snap as any).result) {
        setResult((snap as any).result);
        setCached(Boolean((snap as any).cached));
        setClean((snap as any).result?.clean ?? null);
        setStatus("ready");
      } else if (snap.code === "ai/error") {
        setStatus("error");
        setMessage({ text: t("merlin.error"), severity: "error" });
      } else if (snap.code === "pattern/not_found") {
        setStatus("error");
        setResult(null);
        setClean(null);
        setMessage({ text: t("merlin.noPattern"), severity: "info" });
      } else if (snap.code === "analyze/insufficient_data") {
        setStatus("error");
        setResult(null);
        setClean(null);
        setMessage({ text: t("merlin.insufficientData"), severity: "warning" });
      } else {
        setStatus("pending");
      }
    });
    return () => unsub();
  }, [path, setResult, setStatus, t]);

  const handleRun = useCallback(async () => {
    if (!canRun) return;
    reset();
    setMessage(null);
    setCached(false);
    setClean(null);
    const resp = await run({
      entityId: entityId as string,
      branchIds: scope === "branch" ? [branchId as string] : [],
      branchId: branchId as string,
      employeeId: scope === "employee" ? (employeeId as string) : undefined,
      scope: scope,
      audience,
      authToken: token ?? "",
      locale,
    });
    if (resp?.code === "ai/cache_hit" && (resp as any).result) {
      setResult((resp as any).result);
      setClean((resp as any).result?.clean ?? null);
      setCached(Boolean((resp as any).cached));
      setStatus("ready");
      return;
    }
    if (resp?.code === "analyze/insufficient_data") {
      setStatus("error");
      setResult(null);
      setClean(null);
      setMessage({ text: t("merlin.insufficientData"), severity: "warning" });
    } else if (resp?.code === "pattern/not_found") {
      setStatus("error");
      setResult(null);
      setClean(null);
      setMessage({ text: t("merlin.noPattern"), severity: "info" });
    } else if (resp?.code === "ai/error") {
      setStatus("error");
      setMessage({ text: t("merlin.error"), severity: "error" });
    }
  }, [canRun, reset, run, entityId, branchId, employeeId, scope, audience, token, locale, t]);

  const loading = status === "pending";
  const subtitle =
    status === "pending"
      ? t("merlin.subtitleAnalysing")
      : (scope === "employee" ? clean : result)
      ? t("merlin.subtitleReady")
      : t("merlin.subtitleIdle");

  // Auto-run al entrar si no hay resultado ni path
  useEffect(() => {
    if (canRun && status === "idle" && !path && !(scope === "employee" ? clean : result)) {
      handleRun();
    }
  }, [canRun, status, path, result, clean, scope, handleRun]);

  const handleToggleCollapse = () => {
    setCollapsed((c) => !c);
    if (!collapsed && status === "error") {
      reset();
      setMessage(null);
    }
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
          : (scope === "employee" ? clean : result) && status === "ready"
          ? { xs: "calc(100% - 32px)", sm: 520 }
          : { xs: "calc(100% - 32px)", sm: 360 },
        maxWidth: (scope === "employee" ? clean : result) && status === "ready" ? 560 : 420,
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
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="subtitle1" fontWeight={700}>
                {t("merlin.title")}
              </Typography>
              {cached && (
                <Tooltip title={t("merlin.cacheHint")} placement="top">
                  <CachedOutlined fontSize="small" color="action" />
                </Tooltip>
              )}
            </Stack>
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

      {!collapsed && scope === "branch" && result && status === "ready" && (
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

      {!collapsed && scope === "employee" && clean && status === "ready" && (
        <Stack spacing={1} sx={{ maxHeight: 420, overflow: "auto", pr: 0.5 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight={700}>
              {clean.headline}
            </Typography>
            <Chip label={clean.quadrant} color={quadrantColor[clean.quadrant]} size="small" />
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`${t("merlin.metricEfficiency", { value: clean.operational_metrics.efficiency_index ?? "–" })}`} size="small" variant="outlined" />
            <Chip label={`${t("merlin.metricCostGap", { value: clean.operational_metrics.cost_gap ?? "–" })}`} size="small" variant="outlined" />
            <Chip label={`${t("merlin.metricPredictability", { value: clean.operational_metrics.predictability_score ?? "–" })}`} size="small" variant="outlined" />
            <Chip label={`${t("merlin.metricCostTrend", { value: clean.operational_metrics.cost_trend ?? "-" })}`} size="small" variant="outlined" />
          </Stack>
          <Typography variant="body2">{clean.analysis.summary}</Typography>
          <Typography variant="body2" color="text.secondary">
            {clean.analysis.behavior_body}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {clean.analysis.experience_context}
          </Typography>
          <Stack spacing={0.5}>
            {clean.actions.map((action, i) => (
              <Chip key={i} label={action.text} size="small" variant="outlined" />
            ))}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {clean.disclaimer}
          </Typography>
        </Stack>
      )}

      {!collapsed && !((scope === "employee" ? clean : result)) && (
        <Stack spacing={1} alignItems="flex-start">
          <Typography variant="body2" color="text.secondary">
            {loading ? t("merlin.subtitleAnalysing") : t("merlin.description")}
          </Typography>
          {status === "error" && message && (
            <Alert severity={message.severity} sx={{ width: "100%" }}>
              {message.text}
            </Alert>
          )}
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
