"use client";

import { SassButton } from "@/components/common/buttons/GenericButton";
import { Task, TaskPriority, TaskStatus, defaultTaskConfig } from "@/domain/features/checkinbiz/ITask";
import { fetchEmployee } from "@/services/checkinbiz/employee.service";
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useEntity } from "@/hooks/useEntity";
import TaskSearchIndexMultiSelect, { TaskSearchOption } from "./TaskSearchIndexMultiSelect";
import { taskStatusOptions } from "./taskUi";

type TaskFormState = {
  title: string;
  description: string;
  branchId: string;
  branchLabel: string;
  scheduledStartAt: string;
  dueAt: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedEmployees: TaskSearchOption[];
  allowSupervisorCreation: boolean;
  allowSupervisorValidation: boolean;
  allowSupervisorRating: boolean;
  requireEvidenceOnCompletion: boolean;
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
  scheduledStartAt: toInputDate(task?.scheduledStartAt),
  dueAt: toInputDate(task?.dueAt),
  status: task?.status ?? "draft",
  priority: task?.priority ?? "medium",
  assignedEmployees: task?.assignedEmployeeIds?.map((id) => ({ id, label: id })) ?? [],
  allowSupervisorCreation: task?.config?.allowSupervisorCreation ?? defaultTaskConfig.allowSupervisorCreation,
  allowSupervisorValidation: task?.config?.allowSupervisorValidation ?? defaultTaskConfig.allowSupervisorValidation,
  allowSupervisorRating: task?.config?.allowSupervisorRating ?? defaultTaskConfig.allowSupervisorRating,
  requireEvidenceOnCompletion: task?.config?.requireEvidenceOnCompletion ?? defaultTaskConfig.requireEvidenceOnCompletion,
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

  const submit = () => {
    const payload: Partial<Task> = {
      title: form.title.trim(),
      description: form.description.trim(),
      branchId: form.branchId.trim(),
      dueAt: new Date(form.dueAt).toISOString(),
      status: form.status,
      priority: form.priority,
      assignedEmployeeIds: form.assignedEmployees.map((employee) => employee.id),
      config: {
        ...defaultTaskConfig,
        allowSupervisorCreation: form.allowSupervisorCreation,
        allowSupervisorValidation: form.allowSupervisorValidation,
        allowSupervisorRating: form.allowSupervisorRating,
        requireEvidenceOnCompletion: form.requireEvidenceOnCompletion,
      },
    };

    if (form.scheduledStartAt) payload.scheduledStartAt = new Date(form.scheduledStartAt).toISOString();
    else if (task) payload.scheduledStartAt = null as any;

    onSubmit(payload);
  };

  const disabled =
    loading ||
    !form.title.trim() ||
    !form.branchId.trim() ||
    !form.dueAt ||
    (!!form.scheduledStartAt && Number.isNaN(new Date(form.scheduledStartAt).getTime()));

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
                change("branchId", selected?.id ?? "");
                change("branchLabel", selected?.label ?? "");
              }}
            />
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
