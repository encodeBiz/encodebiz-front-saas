"use client";

import { SassButton } from "@/components/common/buttons/GenericButton";
import { Task, TaskPriority, TaskStatus, defaultTaskConfig } from "@/domain/features/checkinbiz/ITask";
import { fetchEmployee } from "@/services/checkinbiz/employee.service";
import { fetchSucursal } from "@/services/checkinbiz/sucursal.service";
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useEntity } from "@/hooks/useEntity";
import TaskSearchIndexMultiSelect, { TaskSearchOption } from "./TaskSearchIndexMultiSelect";
import { taskStatusOptions } from "./taskUi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

type TaskFormState = {
  title: string;
  description: string;
  branchId: string;
  branchLabel: string;
  branchTimezone: string;
  scheduledStartAt: string;
  dueAt: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedEmployees: TaskSearchOption[];
  allowSupervisorCreation: boolean;
  allowSupervisorValidation: boolean;
  allowSupervisorRating: boolean;
  requireEvidenceOnCompletion: boolean;
  notifyIfNotStarted: boolean;
};

const toInputDate = (value: any) => {
  if (!value) return "";
  const date = typeof value === "object" && value?.seconds ? new Date(value.seconds * 1000) : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000).toISOString().slice(0, 16);
};

const initialForm = (task?: Task): TaskFormState => ({
  title: task?.title ?? "",
  description: task?.description ?? "",
  branchId: task?.branchId ?? "",
  branchLabel: task?.branch?.name ?? task?.branchId ?? "",
  branchTimezone: task?.branch?.address?.timeZone ?? "",
  scheduledStartAt: toInputDate(task?.scheduledStartAt),
  dueAt: toInputDate(task?.dueAt),
  status: task?.status ?? "draft",
  priority: task?.priority ?? "medium",
  assignedEmployees: task?.assignedEmployeeIds?.map((id) => ({ id, label: id })) ?? [],
  allowSupervisorCreation: task?.config?.allowSupervisorCreation ?? defaultTaskConfig.allowSupervisorCreation,
  allowSupervisorValidation: task?.config?.allowSupervisorValidation ?? defaultTaskConfig.allowSupervisorValidation,
  allowSupervisorRating: task?.config?.allowSupervisorRating ?? defaultTaskConfig.allowSupervisorRating,
  requireEvidenceOnCompletion: task?.config?.requireEvidenceOnCompletion ?? defaultTaskConfig.requireEvidenceOnCompletion,
  notifyIfNotStarted: task?.config?.notifyIfNotStarted ?? defaultTaskConfig.notifyIfNotStarted,
});

export default function TaskFormDialog({
  open,
  task,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  task?: Task;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => void;
}) {
  const { currentEntity } = useEntity();
  const [form, setForm] = useState<TaskFormState>(initialForm(task));
  const readOnlyStatuses = new Set<TaskStatus>(["validated", "rejected", "cancelled"]);
  const fallbackTimezone = currentEntity?.entity?.legal?.address?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
  const operationalTimezone = form.branchTimezone || fallbackTimezone;

  useEffect(() => {
    if (open) setForm(initialForm(task));
  }, [open, task]);

  useEffect(() => {
    const hydrateAssignedEmployees = async () => {
      if (!open || !task?.assignedEmployeeIds?.length || !currentEntity?.entity?.id) return;
      try {
        const employees = await Promise.all(
          task.assignedEmployeeIds.map(async (id) => {
            try {
              const employee = await fetchEmployee(currentEntity.entity.id as string, id);
              return { id, label: employee?.fullName ?? id };
            } catch {
              return { id, label: id };
            }
          })
        );
        setForm((prev) => ({ ...prev, assignedEmployees: employees }));
      } catch {
        // keep fallback labels
      }
    };

    hydrateAssignedEmployees();
  }, [open, task?.assignedEmployeeIds, currentEntity?.entity?.id]);

  const change = (field: keyof TaskFormState, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const changeBranch = async (selected?: TaskSearchOption) => {
    const branchId = selected?.id ?? "";
    change("branchId", branchId);
    change("branchLabel", selected?.label ?? "");
    change("branchTimezone", "");
    if (!branchId || !currentEntity?.entity?.id) return;

    try {
      const branch = await fetchSucursal(currentEntity.entity.id as string, branchId);
      setForm((prev) => ({
        ...prev,
        branchTimezone: branch?.address?.timeZone ?? "",
        branchLabel: branch?.name ?? prev.branchLabel,
      }));
    } catch {
      setForm((prev) => ({ ...prev, branchTimezone: "" }));
    }
  };

  const toAbsoluteIso = (value: string) => {
    const zoned = dayjs.tz(value, "YYYY-MM-DDTHH:mm", operationalTimezone);
    return zoned.toDate().toISOString();
  };

  const submit = () => {
    const payload: Partial<Task> = {
      title: form.title.trim(),
      description: form.description.trim(),
      branchId: form.branchId.trim(),
      dueAt: toAbsoluteIso(form.dueAt),
      status: form.status,
      priority: form.priority,
      assignedEmployeeIds: form.assignedEmployees.map((employee) => employee.id),
      config: {
        ...defaultTaskConfig,
        allowSupervisorCreation: form.allowSupervisorCreation,
        allowSupervisorValidation: form.allowSupervisorValidation,
        allowSupervisorRating: form.allowSupervisorRating,
        requireEvidenceOnCompletion: form.requireEvidenceOnCompletion,
        notifyIfNotStarted: form.notifyIfNotStarted,
      },
    };

    if (form.scheduledStartAt) payload.scheduledStartAt = toAbsoluteIso(form.scheduledStartAt);
    else if (task) payload.scheduledStartAt = null as any;

    onSubmit(payload);
  };

  const disabled =
    loading ||
    !form.title.trim() ||
    !form.branchId.trim() ||
    !form.dueAt ||
    !dayjs.tz(form.dueAt, "YYYY-MM-DDTHH:mm", operationalTimezone).isValid() ||
    (!!form.scheduledStartAt && !dayjs.tz(form.scheduledStartAt, "YYYY-MM-DDTHH:mm", operationalTimezone).isValid());

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? "Editar tarea" : "Crear tarea"}</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          <TextField label="Título" value={form.title} onChange={(event) => change("title", event.target.value)} fullWidth required />
          <TextField
            label="Descripción"
            value={form.description}
            onChange={(event) => change("description", event.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
          <Box>
            <TaskSearchIndexMultiSelect
              type="branch"
              label="Buscar sucursal"
              value={form.branchId ? [{ id: form.branchId, label: form.branchLabel || form.branchId }] : []}
              onChange={(value) => {
                const selected = value[value.length - 1];
                changeBranch(selected);
              }}
            />
            <FormHelperText>Las fechas se enviarán usando la zona horaria operativa: {operationalTimezone}.</FormHelperText>
          </Box>
          <TextField
            label="Fecha prevista de inicio"
            type="datetime-local"
            value={form.scheduledStartAt}
            onChange={(event) => change("scheduledStartAt", event.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Fecha límite"
            type="datetime-local"
            value={form.dueAt}
            onChange={(event) => change("dueAt", event.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <Box>
            <FormControlLabel
              control={<Switch checked={form.notifyIfNotStarted} onChange={(event) => change("notifyIfNotStarted", event.target.checked)} />}
              label="Notificar si no inicia a tiempo"
            />
            <FormHelperText>
              {form.scheduledStartAt
                ? "Si la tarea sigue sin iniciar 15 minutos despues de la hora prevista, se enviara una notificacion automatica."
                : "Si la tarea sigue sin iniciar 15 minutos despues de la hora prevista, se enviara una notificacion automatica. Solo aplica si la tarea tiene hora prevista de inicio."}
            </FormHelperText>
          </Box>
          <TextField select label="Estado" value={form.status} onChange={(event) => change("status", event.target.value)} fullWidth>
            {taskStatusOptions
              .filter((option) => option.value !== "all")
              .map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  disabled={readOnlyStatuses.has(option.value as TaskStatus) && form.status !== option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
          </TextField>
          <TextField select label="Prioridad" value={form.priority} onChange={(event) => change("priority", event.target.value)} fullWidth>
            <MenuItem value="low">Baja</MenuItem>
            <MenuItem value="medium">Media</MenuItem>
            <MenuItem value="high">Alta</MenuItem>
            <MenuItem value="critical">Crítica</MenuItem>
          </TextField>
          <Box>
            <TaskSearchIndexMultiSelect
              type="employee"
              label="Buscar empleados asignados"
              value={form.assignedEmployees}
              onChange={(value) => change("assignedEmployees", value)}
            />
          </Box>
          <Box>
            <FormControlLabel
              control={<Checkbox checked={form.allowSupervisorCreation} onChange={(event) => change("allowSupervisorCreation", event.target.checked)} />}
              label="Permitir creación por supervisor"
            />
            <FormControlLabel
              control={<Checkbox checked={form.allowSupervisorValidation} onChange={(event) => change("allowSupervisorValidation", event.target.checked)} />}
              label="Permitir validación por supervisor"
            />
            <FormControlLabel
              control={<Checkbox checked={form.allowSupervisorRating} onChange={(event) => change("allowSupervisorRating", event.target.checked)} />}
              label="Permitir valoración por supervisor"
            />
            <FormControlLabel
              control={<Checkbox checked={form.requireEvidenceOnCompletion} onChange={(event) => change("requireEvidenceOnCompletion", event.target.checked)} />}
              label="Requerir evidencia al completar"
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SassButton variant="outlined" onClick={onClose} disabled={loading}>
          Cancelar
        </SassButton>
        <SassButton variant="contained" onClick={submit} disabled={disabled}>
          Guardar
        </SassButton>
      </DialogActions>
    </Dialog>
  );
}
