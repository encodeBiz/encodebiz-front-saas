"use client";

import { SassButton } from "@/components/common/buttons/GenericButton";
import { TaskAssignment, TaskNoteType } from "@/domain/features/checkinbiz/ITask";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

export type TaskActionType = "assign" | "note" | "reject" | "rate" | "resource" | "cancel";

export default function TaskActionDialog({
  open,
  type,
  loading,
  assignments,
  onClose,
  onSubmit,
}: {
  open: boolean;
  type: TaskActionType;
  loading?: boolean;
  assignments?: TaskAssignment[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [text, setText] = useState("");
  const [noteType, setNoteType] = useState<TaskNoteType>("operational_note");
  const [employeeId, setEmployeeId] = useState("");
  const [rating, setRating] = useState(5);
  const [resourceType, setResourceType] = useState<"photo" | "video">("photo");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setText("");
      setNoteType("operational_note");
      setEmployeeId(assignments?.[0]?.employeeId ?? "");
      setRating(5);
      setResourceType("photo");
      setFile(null);
    }
  }, [open, assignments]);

  const titles: Record<TaskActionType, string> = {
    assign: "Asignar trabajadores",
    note: "Agregar nota",
    reject: "Rechazar tarea",
    rate: "Valorar trabajador",
    resource: "Subir evidencia",
    cancel: "Cancelar tarea",
  };

  const submit = () => {
    if (type === "assign") onSubmit({ employeeIds: text.split(",").map((item) => item.trim()).filter(Boolean) });
    if (type === "note") onSubmit({ content: text.trim(), type: noteType });
    if (type === "reject") onSubmit({ reason: text.trim() });
    if (type === "cancel") onSubmit({ cancellationReason: text.trim() });
    if (type === "rate") onSubmit({ employeeId, rating, comment: text.trim() });
    if (type === "resource") onSubmit({ type: resourceType, description: text.trim(), employeeId, file });
  };

  const disabled =
    loading ||
    (["assign", "note", "reject", "cancel"].includes(type) && !text.trim()) ||
    (type === "rate" && !employeeId) ||
    (type === "resource" && !file);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{titles[type]}</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          {type === "assign" && <TextField label="IDs de empleados" helperText="Separados por coma" value={text} onChange={(event) => setText(event.target.value)} fullWidth />}

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
                {(assignments ?? []).map((assignment) => (
                  <MenuItem key={assignment.employeeId} value={assignment.employeeId}>
                    {assignment.employee?.fullName ?? assignment.employeeId}
                  </MenuItem>
                ))}
              </TextField>
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
              <TextField select label="Tipo" value={resourceType} onChange={(event) => setResourceType(event.target.value as "photo" | "video")} fullWidth>
                <MenuItem value="photo">Foto</MenuItem>
                <MenuItem value="video">Video</MenuItem>
              </TextField>
              <TextField select label="Empleado" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} fullWidth>
                {(assignments ?? []).map((assignment) => (
                  <MenuItem key={assignment.employeeId} value={assignment.employeeId}>
                    {assignment.employee?.fullName ?? assignment.employeeId}
                  </MenuItem>
                ))}
              </TextField>
              <TextField type="file" onChange={(event: any) => setFile(event.target.files?.[0] ?? null)} fullWidth />
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
