"use client";

import { SassButton } from "@/components/common/buttons/GenericButton";
import { TaskAssignment, TaskNoteType } from "@/domain/features/checkinbiz/ITask";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import TaskSearchIndexMultiSelect, { TaskSearchOption } from "../../../components/TaskSearchIndexMultiSelect";

export type TaskActionType = "assign" | "note" | "reject" | "rate" | "resource" | "cancel";

export default function TaskActionDialog({
  open,
  type,
  loading,
  assignments,
  currentEmployeeId,
  onClose,
  onSubmit,
}: {
  open: boolean;
  type: TaskActionType;
  loading?: boolean;
  assignments?: TaskAssignment[];
  currentEmployeeId?: string | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [text, setText] = useState("");
  const [noteType, setNoteType] = useState<TaskNoteType>("operational_note");
  const [selectedEmployees, setSelectedEmployees] = useState<TaskSearchOption[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [rating, setRating] = useState(5);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (open) {
      setText("");
      setNoteType("operational_note");
      setSelectedEmployees([]);
      setEmployeeId(assignments?.find((assignment) => assignment.employeeId !== currentEmployeeId)?.employeeId ?? "");
      setRating(5);
      setFile(null);
      setFileError("");
    }
  }, [open, assignments, currentEmployeeId]);

  const currentRule = useMemo(
    () => ({
      accept: "image/jpeg,image/png,image/webp",
      maxBytes: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      helper: "Formatos permitidos: JPG, PNG, WEBP. Tamaño máximo: 5 MB.",
    }),
    []
  );

  const handleFileChange = (nextFile: File | null) => {
    setFileError("");
    setFile(null);
    if (!nextFile) return;

    if (!(currentRule.allowedMimeTypes as readonly string[]).includes(nextFile.type)) {
      setFileError(`Tipo no permitido. ${currentRule.helper}`);
      return;
    }

    if (nextFile.size > currentRule.maxBytes) {
      setFileError(`Archivo demasiado grande. ${currentRule.helper}`);
      return;
    }

    setFile(nextFile);
  };

  const titles: Record<TaskActionType, string> = {
    assign: "Asignar trabajadores",
    note: "Agregar nota",
    reject: "Rechazar tarea",
    rate: "Valorar trabajador",
    resource: "Subir evidencia",
    cancel: "Cancelar tarea",
  };

  const submit = () => {
    if (type === "assign") onSubmit({ employeeIds: selectedEmployees.map((employee) => employee.id) });
    if (type === "note") onSubmit({ content: text.trim(), type: noteType });
    if (type === "reject") onSubmit({ reason: text.trim() });
    if (type === "cancel") onSubmit({ cancellationReason: text.trim() });
    if (type === "rate") onSubmit({ employeeId, rating, comment: text.trim() });
    if (type === "resource") onSubmit({ type: "photo", description: text.trim(), employeeId, file });
  };

  const disabled =
    loading ||
    (type === "assign" && selectedEmployees.length === 0) ||
    (["note", "reject", "cancel"].includes(type) && !text.trim()) ||
    (type === "rate" && !employeeId) ||
    (type === "resource" && (!file || !!fileError));

  const rateableAssignments = (assignments ?? []).filter((assignment) => assignment.employeeId !== currentEmployeeId);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{titles[type]}</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          {type === "assign" && (
            <Box>
              <TaskSearchIndexMultiSelect
                type="employee"
                label="Buscar empleados"
                value={selectedEmployees}
                onChange={setSelectedEmployees}
              />
            </Box>
          )}

          {type === "note" && (
            <>
              <TextField select label="Tipo" value={noteType} onChange={(event) => setNoteType(event.target.value as TaskNoteType)} fullWidth>
                <MenuItem value="specification">Especificación</MenuItem>
                <MenuItem value="operational_note">Nota operativa</MenuItem>
                <MenuItem value="clarification">Aclaración</MenuItem>
                <MenuItem value="incident_note">Incidencia</MenuItem>
              </TextField>
              <TextField label="Contenido" value={text} onChange={(event) => setText(event.target.value)} fullWidth multiline minRows={3} />
            </>
          )}

          {(type === "reject" || type === "cancel") && (
            <TextField label="Motivo" value={text} onChange={(event) => setText(event.target.value)} fullWidth multiline minRows={3} />
          )}

          {type === "rate" && (
            <>
              <TextField select label="Trabajador" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} fullWidth>
                {rateableAssignments.map((assignment) => (
                  <MenuItem key={assignment.employeeId} value={assignment.employeeId}>
                    {assignment.employee?.fullName ?? assignment.employeeId}
                  </MenuItem>
                ))}
              </TextField>
              {rateableAssignments.length === 0 && (
                <TextField
                  value="No hay trabajadores disponibles para valorar. No puedes valorarte a ti mismo."
                  fullWidth
                  disabled
                />
              )}
              <TextField select label="Valoración" value={rating} onChange={(event) => setRating(Number(event.target.value))} fullWidth>
                {[1, 2, 3, 4, 5].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Comentario" value={text} onChange={(event) => setText(event.target.value)} fullWidth multiline minRows={3} />
            </>
          )}

          {type === "resource" && (
            <>
              <TextField select label="Empleado" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} fullWidth>
                {(assignments ?? []).map((assignment) => (
                  <MenuItem key={assignment.employeeId} value={assignment.employeeId}>
                    {assignment.employee?.fullName ?? assignment.employeeId}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="file"
                onChange={(event: any) => handleFileChange(event.target.files?.[0] ?? null)}
                fullWidth
                slotProps={{ htmlInput: { accept: currentRule.accept } }}
                helperText={currentRule.helper}
              />
              {fileError && <Alert severity="error">{fileError}</Alert>}
              <TextField label="Descripción" value={text} onChange={(event) => setText(event.target.value)} fullWidth multiline minRows={2} />
            </>
          )}
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
