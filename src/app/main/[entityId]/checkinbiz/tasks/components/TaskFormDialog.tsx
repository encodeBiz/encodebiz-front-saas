"use client";

import { SassButton } from "@/components/common/buttons/GenericButton";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { Task, TaskPriority, defaultTaskConfig } from "@/domain/features/checkinbiz/ITask";
import {
  Box,
  Checkbox,
  Chip,
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
  branchLabel: string;
  dueAt: string;
  priority: TaskPriority;
  assignedEmployees: Array<{ id: string; label: string }>;
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
  dueAt: toInputDate(task?.dueAt),
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
  const [form, setForm] = useState<TaskFormState>(initialForm(task));

  useEffect(() => {
    if (open) setForm(initialForm(task));
  }, [open, task]);

  const change = (field: keyof TaskFormState, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const getIndexId = (value: ISearchIndex | null) => value?.index?.split("/").pop() ?? value?.id ?? "";
  const getIndexLabel = (value: ISearchIndex | null, fallback: string) => {
    if (!value) return "";
    return String(value.fields?.[fallback] ?? value.fields?.fullName ?? value.fields?.name ?? getIndexId(value));
  };

  const addEmployee = (value: ISearchIndex | null) => {
    const id = getIndexId(value);
    if (!id) return;
    const label = getIndexLabel(value, "fullName");
    setForm((prev) => {
      if (prev.assignedEmployees.some((employee) => employee.id === id)) return prev;
      return { ...prev, assignedEmployees: [...prev.assignedEmployees, { id, label }] };
    });
  };

  const removeEmployee = (id: string) => {
    setForm((prev) => ({ ...prev, assignedEmployees: prev.assignedEmployees.filter((employee) => employee.id !== id) }));
  };

  const submit = () => {
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      branchId: form.branchId.trim(),
      dueAt: new Date(form.dueAt).toISOString(),
      priority: form.priority,
      assignedEmployeeIds: form.assignedEmployees.map((employee) => employee.id),
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
          <Box>
            <SearchIndexFilter
              type="branch"
              label="Buscar sucursal"
              placeholder="Buscar sucursal"
              onChange={(value: ISearchIndex | null) => {
                change("branchId", getIndexId(value));
                change("branchLabel", getIndexLabel(value, "name"));
              }}
            />
            {form.branchId && (
              <Box sx={{ mt: 1 }}>
                <Chip label={form.branchLabel || form.branchId} onDelete={() => {
                  change("branchId", "");
                  change("branchLabel", "");
                }} />
              </Box>
            )}
          </Box>
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
          <Box>
            <SearchIndexFilter type="employee" label="Buscar empleado" placeholder="Buscar empleado" onChange={addEmployee} />
            {form.assignedEmployees.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {form.assignedEmployees.map((employee) => (
                  <Chip key={employee.id} label={employee.label || employee.id} onDelete={() => removeEmployee(employee.id)} />
                ))}
              </Box>
            )}
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
