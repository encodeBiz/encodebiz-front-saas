/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { ExpandMore, FactCheck, School, Visibility, Bolt, SmartToyOutlined, RefreshOutlined } from "@mui/icons-material";
import { SassButton } from "@/components/common/buttons/GenericButton";
import { useEntity } from "@/hooks/useEntity";
import { useAuth } from "@/hooks/useAuth";
import { useLocale, useTranslations } from "next-intl";
import { useMerlin } from "@/contexts/merlinContext";
import { merlinSubscribe } from "@/services/merlin.service";
import { useDashboardEmployee } from "./DashboardEmployeeContext";

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

const actionIcons: Record<CleanEmployeeProfile["actions"][number]["type"], JSX.Element> = {
  audit: <FactCheck fontSize="small" />,
  coaching: <School fontSize="small" />,
  monitoring: <Visibility fontSize="small" />,
  action: <Bolt fontSize="small" />,
};

const quadrantColor: Record<Quadrant, "success" | "warning" | "error" | "default" | "info"> = {
  ANCHOR: "success",
  MAVERICK: "info",
  GHOST: "warning",
  "AT-RISK": "error",
  NEUTRAL: "default",
};

const EmployeeMerlinAssistant = () => {
  const t = useTranslations("sucursal");
  const { currentEntity } = useEntity();
  const { employeeId } = useDashboardEmployee();
  const { token } = useAuth();
  const locale = useLocale();
  const { status, path, run, reset, setResult, setStatus } = useMerlin();
  const [clean, setClean] = useState<CleanEmployeeProfile | null>(null);
  const [message, setMessage] = useState<{ text: string; severity: "info" | "warning" | "error" } | null>(null);

  const canRun = useMemo(() => Boolean(currentEntity?.entity?.id && employeeId), [currentEntity?.entity?.id, employeeId]);

  useEffect(() => {
    reset();
    setClean(null);
    setMessage(null);
  }, [employeeId, currentEntity?.entity?.id, reset]);

  useEffect(() => {
    if (!path) return;
    const unsub = merlinSubscribe(path, (snap) => {
      if (snap.code === "ai/cache_hit" && (snap as any).result) {
        const cleanResult = (snap as any).result?.clean as CleanEmployeeProfile | undefined;
        setResult((snap as any).result as any);
        setClean(cleanResult ?? null);
        setStatus("ready");
        setMessage(null);
      } else if (snap.code === "ai/error") {
        setStatus("error");
        setMessage({ text: t("merlin.error"), severity: "error" });
      } else if (snap.code === "pattern/not_found") {
        setStatus("error");
        setClean(null);
        setMessage({ text: t("merlin.noPattern"), severity: "info" });
      } else {
        setStatus("pending");
      }
    });
    return () => unsub();
  }, [path, setStatus, t]);

  const handleRun = useCallback(async () => {
    if (!canRun) return;
    reset();
    setClean(null);
    setMessage(null);
    const resp = await run({
      scope: "employee",
      entityId: currentEntity?.entity?.id as string,
      employeeId: employeeId as string,
      authToken: token ?? "",
      locale,
    });

    if (resp?.code === "ai/cache_hit" && (resp as any).result?.clean) {
      setResult((resp as any).result as any);
      setClean((resp as any).result.clean as CleanEmployeeProfile);
      setStatus("ready");
      return;
    }

    if (resp?.code === "pattern/not_found") {
      setStatus("error");
      setMessage({ text: t("merlin.noPattern"), severity: "info" });
    } else if (resp?.code === "ai/error") {
      setStatus("error");
      setMessage({ text: t("merlin.error"), severity: "error" });
    }
  }, [canRun, currentEntity?.entity?.id, employeeId, locale, reset, run, t, token]);

  useEffect(() => {
    if (canRun && status === "idle" && !path && !clean) {
      handleRun();
    }
  }, [canRun, status, path, clean, handleRun]);

  const loading = status === "pending";
  const subtitle = loading ? t("merlin.subtitleAnalysing") : clean ? t("merlin.subtitleReady") : t("merlin.subtitleIdle");

  return (
    <Paper elevation={4} sx={{ p: 2, borderRadius: 3 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src="/assets/images/Merili_IA_blue.png" sx={{ bgcolor: "primary.main" }}>
            <SmartToyOutlined fontSize="small" />
          </Avatar>
          <Stack>
            <Typography variant="subtitle1" fontWeight={700}>
              {t("merlin.title")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Stack>
        </Stack>
        <SassButton
          variant="outlined"
          size="small"
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <RefreshOutlined fontSize="small" />}
          onClick={handleRun}
          disabled={!canRun || loading}
        >
          {loading ? t("merlin.buttonRunning") : t("merlin.buttonRun")}
        </SassButton>
      </Stack>

      {loading && (
        <Stack spacing={1} sx={{ mt: 1 }}>
          <Skeleton variant="rounded" height={18} />
          <Skeleton variant="rounded" height={18} width="80%" />
          {path && (
            <Typography variant="caption" color="text.secondary">
              Analizando… (path: {path})
            </Typography>
          )}
        </Stack>
      )}

      {!loading && message && (
        <Alert severity={message.severity} sx={{ mt: 1 }}>
          {message.text}
        </Alert>
      )}

      {!loading && clean && (
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>
              {clean.headline}
            </Typography>
            <Chip label={clean.quadrant} color={quadrantColor[clean.quadrant]} size="small" />
          </Stack>

          <Grid container spacing={1}>
            <Grid item xs={6} sm={3}>
              <MetricCard label="Efficiency" value={clean.operational_metrics.efficiency_index} suffix="%" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <MetricCard label="Cost gap" value={clean.operational_metrics.cost_gap} suffix="" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <MetricCard label="Predictability" value={clean.operational_metrics.predictability_score} suffix="%" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <MetricCard label="Cost trend" value={clean.operational_metrics.cost_trend ?? "-"} />
            </Grid>
          </Grid>

          <Typography variant="body2">{clean.analysis.summary}</Typography>

          <Accordion disableGutters>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2">{t("merlin.behaviorTitle")}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {clean.analysis.behavior_body}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Typography variant="caption" color="text.secondary">
            {clean.analysis.experience_context}
          </Typography>

          <Stack spacing={0.5}>
            {clean.actions.map((action, idx) => (
              <Stack key={idx} direction="row" spacing={1} alignItems="center">
                {actionIcons[action.type]}
                <Typography variant="body2">{action.text}</Typography>
              </Stack>
            ))}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            {clean.disclaimer}
          </Typography>
        </Stack>
      )}
    </Paper>
  );
};

const MetricCard = ({ label, value, suffix }: { label: string; value: string | number | null; suffix?: string }) => (
  <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle1" fontWeight={700}>
      {value ?? "–"} {value != null && suffix ? suffix : ""}
    </Typography>
  </Paper>
);

export default EmployeeMerlinAssistant;
