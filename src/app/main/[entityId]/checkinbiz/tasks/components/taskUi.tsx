"use client";

import { CustomChip } from "@/components/common/table/CustomChip";
import { Task, TaskPriority, TaskStatus, TaskTimeComplianceStatus } from "@/domain/features/checkinbiz/ITask";

export const taskStatusOptions: Array<{ label: string; value: TaskStatus | "all" }> = [
  { label: "Todas", value: "all" },
  { label: "Borrador", value: "draft" },
  { label: "Asignada", value: "assigned" },
  { label: "En progreso", value: "in_progress" },
  { label: "Completada", value: "completed" },
  { label: "Validada", value: "validated" },
  { label: "Rechazada", value: "rejected" },
  { label: "Cancelada", value: "cancelled" },
];

export const taskPriorityOptions: Array<{ label: string; value: TaskPriority | "all" }> = [
  { label: "Todas", value: "all" },
  { label: "Baja", value: "low" },
  { label: "Media", value: "medium" },
  { label: "Alta", value: "high" },
  { label: "Crítica", value: "critical" },
];

export const taskNoteTypeOptions = [
  { label: "Especificación", value: "specification" },
  { label: "Nota operativa", value: "operational_note" },
  { label: "Aclaración", value: "clarification" },
  { label: "Incidencia", value: "incident_note" },
];

export const statusLabel = (status?: TaskStatus | TaskTimeComplianceStatus | TaskPriority | string) => {
  const labels: Record<string, string> = {
    draft: "Borrador",
    assigned: "Asignada",
    in_progress: "En progreso",
    completed: "Completada",
    validated: "Validada",
    rejected: "Rechazada",
    cancelled: "Cancelada",
    not_started: "Sin iniciar",
    on_time: "A tiempo",
    at_risk: "En riesgo",
    overdue: "Vencida",
    completed_on_time: "Completada a tiempo",
    completed_late: "Completada tarde",
    low: "Baja",
    medium: "Media",
    high: "Alta",
    critical: "Crítica",
    specification: "Especificación",
    operational_note: "Nota operativa",
    clarification: "Aclaración",
    incident_note: "Nota de incidencia",
    photo: "Foto",
    video: "Video",
    created: "Creada",
    updated: "Actualizada",
    status_changed: "Estado actualizado",
    started: "Iniciada",
    note_added: "Nota agregada",
    note_updated: "Nota actualizada",
    resource_uploaded: "Recurso adjuntado",
    rated: "Valorada",
    commented: "Comentada",
  };
  return labels[status ?? ""] ?? status ?? "";
};

export const taskStatusLabel = (task: Pick<Task, "status">) => {
  if (task.status === "rejected") return statusLabel("rejected");
  return statusLabel(task.status);
};

export const taskTimeComplianceLabel = (
  task: Pick<Task, "status" | "timeComplianceStatus">
) => {
  if (task.status === "rejected" || task.timeComplianceStatus === "rejected") {
    return statusLabel("rejected");
  }

  return statusLabel(task.timeComplianceStatus);
};

const chipColor = (value?: string) => {
  const colors: Record<string, string> = {
    draft: "neutral",
    assigned: "info",
    in_progress: "warning",
    completed: "info",
    validated: "success",
    rejected: "error",
    cancelled: "neutral",
    not_started: "neutral",
    on_time: "success",
    at_risk: "warning",
    overdue: "error",
    completed_on_time: "success",
    completed_late: "warning",
    critical: "error",
    high: "warning",
    medium: "info",
    low: "success",
    blocked: "error",
    removed: "neutral",
    working: "warning",
    accepted: "info",
  };
  return colors[value ?? ""] ?? "default";
};

export const TaskChip = ({ value, size = "small" }: { value?: string; size?: "small" | "medium" }) => (
  <CustomChip role="text" background={chipColor(value)} label={statusLabel(value)} size={size} />
);

export const TaskStatusChip = ({ task, size = "small" }: { task: Pick<Task, "status">; size?: "small" | "medium" }) => (
  <CustomChip role="text" background={chipColor(task.status)} label={taskStatusLabel(task)} size={size} />
);

export const TaskTimeComplianceChip = ({
  task,
  size = "small",
}: {
  task: Pick<Task, "status" | "timeComplianceStatus">;
  size?: "small" | "medium";
}) => {
  const effectiveStatus = task.status === "rejected" ? "rejected" : task.timeComplianceStatus;
  return <CustomChip role="text" background={chipColor(effectiveStatus)} label={taskTimeComplianceLabel(task)} size={size} />;
};
