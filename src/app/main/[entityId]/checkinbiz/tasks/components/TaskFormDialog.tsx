"use client";

import { SassButton } from "@/components/common/buttons/GenericButton";
import { Task, TaskPriority, defaultTaskConfig } from "@/domain/features/checkinbiz/ITask";
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

type TaskFormState = {
  title: string;
  description: string;
  branchId: string;
  dueAt: string;
  priority: TaskPriority;
  assignedEmployeeIds: string;
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
  dueAt: toInputDate(task?.dueAt),
  priority: task?.priority ?? "medium",
  assignedEmployeeIds: task?.assignedEmployeeIds?.join(", ") ?? "",
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
  const [form, setForm] = useState<TaskFormState>(initialForm(task));

  useEffect(() => {
    if (open) setForm(initialForm(task));
  }, [open, task]);

  const change = (field: keyof TaskFormState, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = () => {
    const assignedEmployeeIds = form.assignedEmployeeIds
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      branchId: form.branchId.trim(),
      dueAt: new Date(form.dueAt).toISOString(),
      priority: form.priority,
      assignedEmployeeIds,
      config: {
        ...defaultTaskConfig,
        allowSupervisorCreation: form.allowSupervisorCreation,
        allowSupervisorValidation: form.allowSupervisorValidation,
        allowSupervisorRating: form.allowSupervisorRating,
        requireEvidenceOnCompletion: form.requireEvidenceOnCompletion,
      },
    });
  };

  const disabled = loading || !form.title.trim() || !form.branchId.trim() || !form.dueAt;

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
          <TextField label="Sucursal ID" value={form.branchId} onChange={(event) => change("branchId", event.target.value)} fullWidth required />
          <TextField
            label="Fecha límite"
            type="datetime-local"
            value={form.dueAt}
            onChange={(event) => change("dueAt", event.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField select label="Prioridad" value={form.priority} onChange={(event) => change("priority", event.target.value)} fullWidth>
            <MenuItem value="low">Baja</MenuItem>
            <MenuItem value="medium">Media</MenuItem>
            <MenuItem value="high">Alta</MenuItem>
            <MenuItem value="critical">Crítica</MenuItem>
          </TextField>
          <TextField
            label="IDs de empleados asignados"
            helperText="Separados por coma"
            value={form.assignedEmployeeIds}
            onChange={(event) => change("assignedEmployeeIds", event.target.value)}
            fullWidth
          />
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
