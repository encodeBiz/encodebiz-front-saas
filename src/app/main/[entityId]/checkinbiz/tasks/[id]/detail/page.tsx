"use client";

import { SassButton } from "@/components/common/buttons/GenericButton";
import HeaderPage from "@/components/features/dashboard/HeaderPage/HeaderPage";
import { format_date_with_locale } from "@/lib/common/Date";
import { ArrowBack, CancelOutlined, CheckCircleOutline, Edit, NoteAdd, PlayArrow, StarBorder, UploadFile, GroupAdd, DoneAll } from "@mui/icons-material";
import { Box, CircularProgress, Container, Divider, Link, Paper, Stack, Typography } from "@mui/material";
import { useAppLocale } from "@/hooks/useAppLocale";
import TaskFormDialog from "../../components/TaskFormDialog";
import { statusLabel, TaskChip } from "../../components/taskUi";
import TaskActionDialog from "./components/TaskActionDialog";
import useTaskDetailController from "./page.controller";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

export default function TaskDetailPage() {
  const { currentLocale } = useAppLocale();
  const {
    detail,
    loading,
    saving,
    openForm,
    setOpenForm,
    action,
    setAction,
    back,
    onUpdate,
    onStatus,
    onValidate,
    onActionSubmit,
  } = useTaskDetailController();

  if (loading && !detail) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!detail) {
    return (
      <Container maxWidth="lg">
        <HeaderPage title="Detalle de tarea" actions={<SassButton startIcon={<ArrowBack />} onClick={back}>Volver</SassButton>}>
          <Typography>No se encontró la tarea.</Typography>
        </HeaderPage>
      </Container>
    );
  }

  const { task, assignments, notes, resources, ratings, activity, validations } = detail;

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title="Detalle de tarea"
        actions={
          <Box display="flex" gap={1} flexWrap="wrap" justifyContent="flex-end">
            <SassButton variant="outlined" startIcon={<ArrowBack />} onClick={back}>
              Volver
            </SassButton>
            <SassButton variant="outlined" startIcon={<Edit />} onClick={() => setOpenForm(true)}>
              Editar
            </SassButton>
          </Box>
        }
      >
        <Stack gap={2}>
          <Section title={task.title}>
            <Stack gap={2}>
              <Box display="flex" gap={1} flexWrap="wrap">
                <TaskChip value={task.status} size="medium" />
                <TaskChip value={task.timeComplianceStatus} size="medium" />
                <TaskChip value={task.priority ?? "medium"} size="medium" />
              </Box>
              {task.description && <Typography color="text.secondary">{task.description}</Typography>}
              <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }} gap={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Sucursal</Typography>
                  <Typography>{task.branchId}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Fecha límite</Typography>
                  <Typography textTransform="capitalize">{format_date_with_locale(task.dueAt, currentLocale as "en" | "es")}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Requiere evidencia</Typography>
                  <Typography>{task.config?.requireEvidenceOnCompletion ? "Sí" : "No"}</Typography>
                </Box>
              </Box>
              <Divider />
              <Box display="flex" gap={1} flexWrap="wrap">
                {task.status === "assigned" && <SassButton startIcon={<PlayArrow />} onClick={() => onStatus("in_progress")} disabled={saving}>Iniciar</SassButton>}
                {["assigned", "in_progress", "rejected"].includes(task.status) && (
                  <SassButton startIcon={<DoneAll />} onClick={() => onStatus("completed")} disabled={saving}>Completar</SassButton>
                )}
                {task.status === "completed" && <SassButton startIcon={<CheckCircleOutline />} onClick={onValidate} disabled={saving}>Validar</SassButton>}
                {task.status === "completed" && <SassButton variant="outlined" startIcon={<CancelOutlined />} onClick={() => setAction("reject")} disabled={saving}>Rechazar</SassButton>}
                {!["validated", "cancelled"].includes(task.status) && <SassButton variant="outlined" startIcon={<CancelOutlined />} onClick={() => setAction("cancel")} disabled={saving}>Cancelar</SassButton>}
                <SassButton variant="outlined" startIcon={<GroupAdd />} onClick={() => setAction("assign")} disabled={saving}>Asignar</SassButton>
                <SassButton variant="outlined" startIcon={<NoteAdd />} onClick={() => setAction("note")} disabled={saving}>Nota</SassButton>
                <SassButton variant="outlined" startIcon={<UploadFile />} onClick={() => setAction("resource")} disabled={saving}>Evidencia</SassButton>
                <SassButton variant="outlined" startIcon={<StarBorder />} onClick={() => setAction("rate")} disabled={saving}>Valorar</SassButton>
              </Box>
            </Stack>
          </Section>

          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2}>
            <Section title="Equipo asignado">
              <Stack gap={1}>
                {assignments.length === 0 && <Typography color="text.secondary">No hay trabajadores asignados.</Typography>}
                {assignments.map((assignment) => (
                  <Box key={assignment.id ?? assignment.employeeId} display="flex" justifyContent="space-between" gap={2}>
                    <Typography>{assignment.employee?.fullName ?? assignment.employeeId}</Typography>
                    <TaskChip value={assignment.status} />
                  </Box>
                ))}
              </Stack>
            </Section>

            <Section title="Valoraciones">
              <Stack gap={1}>
                {ratings.length === 0 && <Typography color="text.secondary">No hay valoraciones.</Typography>}
                {ratings.map((rating) => (
                  <Box key={rating.id} display="flex" justifyContent="space-between" gap={2}>
                    <Typography>{rating.employee?.fullName ?? rating.employeeId}</Typography>
                    <Typography fontWeight={700}>{rating.rating}/5</Typography>
                  </Box>
                ))}
              </Stack>
            </Section>
          </Box>

          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2}>
            <Section title="Notas">
              <Stack gap={2}>
                {notes.length === 0 && <Typography color="text.secondary">No hay notas.</Typography>}
                {notes.map((note) => (
                  <Box key={note.id}>
                    <Typography variant="caption" color="text.secondary">{statusLabel(note.type)} · {format_date_with_locale(note.createdAt, currentLocale as "en" | "es")}</Typography>
                    <Typography>{note.content}</Typography>
                  </Box>
                ))}
              </Stack>
            </Section>

            <Section title="Evidencias">
              <Stack gap={2}>
                {resources.length === 0 && <Typography color="text.secondary">No hay evidencias.</Typography>}
                {resources.map((resource) => (
                  <Box key={resource.id}>
                    <Typography fontWeight={700}>{resource.filename}</Typography>
                    {resource.description && <Typography color="text.secondary">{resource.description}</Typography>}
                    <Link href={resource.url} target="_blank" rel="noreferrer">Abrir archivo</Link>
                  </Box>
                ))}
              </Stack>
            </Section>
          </Box>

          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2}>
            <Section title="Validaciones">
              <Stack gap={1}>
                {validations.length === 0 && <Typography color="text.secondary">No hay validaciones.</Typography>}
                {validations.map((validation) => (
                  <Box key={validation.id}>
                    <TaskChip value={validation.result} />
                    {validation.reason && <Typography sx={{ mt: 1 }}>{validation.reason}</Typography>}
                  </Box>
                ))}
              </Stack>
            </Section>

            <Section title="Actividad">
              <Stack gap={1}>
                {activity.length === 0 && <Typography color="text.secondary">No hay actividad registrada.</Typography>}
                {activity.map((item) => (
                  <Box key={item.id}>
                    <Typography fontWeight={600}>{statusLabel(item.type) || item.type}</Typography>
                    <Typography variant="caption" color="text.secondary">{format_date_with_locale(item.createdAt, currentLocale as "en" | "es")}</Typography>
                  </Box>
                ))}
              </Stack>
            </Section>
          </Box>
        </Stack>
      </HeaderPage>

      <TaskFormDialog open={openForm} task={task} loading={saving} onClose={() => setOpenForm(false)} onSubmit={onUpdate} />
      {action && (
        <TaskActionDialog
          open={!!action}
          type={action}
          loading={saving}
          assignments={assignments}
          onClose={() => setAction(null)}
          onSubmit={onActionSubmit}
        />
      )}
    </Container>
  );
}
