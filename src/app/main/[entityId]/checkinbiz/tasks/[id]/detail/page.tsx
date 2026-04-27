"use client";

import { useState } from "react";
import { SassButton } from "@/components/common/buttons/GenericButton";
import { DetailText } from "@/components/common/table/DetailText";
import { TaskRating } from "@/domain/features/checkinbiz/ITask";
import { format_date_with_locale } from "@/lib/common/Date";
import { ArrowBackOutlined, CancelOutlined, CheckCircleOutline, DeleteOutline, Edit, NoteAdd, PlayArrow, StarBorder, UploadFile, GroupAdd, DoneAll, VisibilityOutlined } from "@mui/icons-material";
import { Box, Card, CardContent, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Link, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { useAppLocale } from "@/hooks/useAppLocale";
import TaskFormDialog from "../../components/TaskFormDialog";
import { statusLabel, TaskChip } from "../../components/taskUi";
import TaskActionDialog from "./components/TaskActionDialog";
import useTaskDetailController from "./page.controller";

const Section = ({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2.5,
      height: "100%",
      borderRadius: 2,
      bgcolor: "background.paper",
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ mb: 2 }}>
      <Typography
        variant="h6"
        textTransform="uppercase"
        sx={{
          fontWeight: 700,
          letterSpacing: ".04em",
          color: "text.primary",
        }}
      >
        {title}
      </Typography>
      {action}
    </Box>
    {children}
  </Paper>
);

export default function TaskDetailPage() {
  const { currentLocale } = useAppLocale();
  const [selectedRating, setSelectedRating] = useState<TaskRating | null>(null);
  const [selectedNote, setSelectedNote] = useState<{ content: string; type: string; createdAt: any; createdBy: string; createdByName?: string } | null>(null);
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
    onRemoveAssignment,
    onActionSubmit,
    currentEmployeeId,
    canManageAssignments,
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
        <Card elevation={3} sx={{ width: "100%", margin: "auto" }}>
          <Box sx={{ p: 3, bgcolor: (theme) => theme.palette.secondary.main }}>
            <SassButton startIcon={<ArrowBackOutlined />} onClick={back}>Volver</SassButton>
          </Box>
          <CardContent>
          <Typography>No se encontró la tarea.</Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const { task, assignments, notes, resources, ratings, validations } = detail;
  const photoResources = resources.filter((resource) => resource.type === "photo");

  return (
    <Container maxWidth="lg">
      <Card elevation={3} sx={{ width: "100%", margin: "auto" }}>
        <Box sx={{ p: 3, bgcolor: (theme) => theme.palette.secondary.main }}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" gap={2}>
              <ArrowBackOutlined color="primary" style={{ fontSize: 45, cursor: "pointer" }} onClick={back} />
              <Box display="flex" flexDirection="column">
                <Typography variant="h4">{task.title}</Typography>
                <Box display="flex" flexDirection="row" gap={1} flexWrap="wrap">
                  <TaskChip value={task.status} />
                  <TaskChip value={task.timeComplianceStatus} />
                  <TaskChip value={task.priority ?? "medium"} />
                </Box>
              </Box>
            </Grid>
            <Stack direction="row" gap={2} flexWrap="wrap">
              <SassButton color="primary" variant="contained" startIcon={<Edit />} onClick={() => setOpenForm(true)}>
                Editar
              </SassButton>
              {task.status === "assigned" && <SassButton color="primary" variant="contained" startIcon={<PlayArrow />} onClick={() => onStatus("in_progress")} disabled={saving}>Iniciar</SassButton>}
              {["assigned", "in_progress", "rejected"].includes(task.status) && (
                <SassButton color="primary" variant="contained" startIcon={<DoneAll />} onClick={() => onStatus("completed")} disabled={saving}>Completar</SassButton>
              )}
              {task.status === "completed" && <SassButton color="primary" variant="contained" startIcon={<CheckCircleOutline />} onClick={onValidate} disabled={saving}>Validar</SassButton>}
              {task.status === "completed" && <SassButton color="error" variant="contained" startIcon={<CancelOutlined />} onClick={() => setAction("reject")} disabled={saving}>Rechazar</SassButton>}
            </Stack>
          </Grid>
        </Box>

        <CardContent sx={{ p: 0 }}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom textTransform="uppercase">
              Resumen de tarea
            </Typography>
            <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="flex-start" gap={6} alignItems="flex-start">
              <DetailText label="Sucursal" value={task.branch?.name ?? task.branchId} />
              <DetailText label="Fecha límite" value={format_date_with_locale(task.dueAt, currentLocale as "en" | "es")} />
              <DetailText label="Asignados" value={task.assignedEmployeeIds?.length ?? 0} />
              <DetailText label="Evidencia requerida" value={task.config?.requireEvidenceOnCompletion ? "Sí" : "No"} />
            </Box>
            {task.description && (
              <Paper sx={{ mt: 4 }} elevation={0}>
                <Typography variant="subtitle1" gutterBottom textTransform="uppercase">
                  Descripción
                </Typography>
                <Typography color="text.secondary">{task.description}</Typography>
              </Paper>
            )}
            {!["validated", "cancelled"].includes(task.status) && (
              <Box display="flex" justifyContent="flex-end" sx={{ mt: 4 }}>
                <SassButton variant="outlined" startIcon={<CancelOutlined />} onClick={() => setAction("cancel")} disabled={saving}>
                  Cancelar
                </SassButton>
              </Box>
            )}
          </Paper>
          <Divider />

          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "minmax(0, 1.2fr) minmax(0, .8fr)" }}
              gap={2}
              alignItems="stretch"
            >
              <Section
                title="Equipo asignado"
                action={canManageAssignments ? (
                  <SassButton
                    variant="outlined"
                    startIcon={<GroupAdd />}
                    onClick={() => setAction("assign")}
                    disabled={saving}
                    size="small"
                  >
                    Asignar
                  </SassButton>
                ) : null}
              >
                <Stack gap={1}>
                  {assignments.length === 0 && <Typography color="text.secondary">No hay trabajadores asignados.</Typography>}
                  {assignments.map((assignment, index) => (
                    <Box key={assignment.id ?? assignment.employeeId}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                        <Typography>{assignment.employee?.fullName ?? assignment.employeeId}</Typography>
                        {canManageAssignments && (
                          <Tooltip title="Quitar del equipo">
                            <span>
                              <IconButton
                                color="error"
                                disabled={saving}
                                onClick={() => onRemoveAssignment(assignment.employeeId)}
                                sx={{
                                  border: "1px solid",
                                  borderColor: "error.main",
                                  width: 36,
                                  height: 36,
                                }}
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                          </span>
                        </Tooltip>
                      )}
                      </Box>
                      {index < assignments.length - 1 && <Divider sx={{ my: 1.5 }} />}
                    </Box>
                  ))}
                </Stack>
              </Section>

              <Section
                title="Valoraciones"
                action={
                  <SassButton variant="outlined" startIcon={<StarBorder />} onClick={() => setAction("rate")} disabled={saving} size="small">
                    Valorar
                  </SassButton>
                }
              >
                <Stack gap={1}>
                  {ratings.length === 0 && <Typography color="text.secondary">No hay valoraciones.</Typography>}
                  {ratings.map((rating, index) => (
                    <Box key={rating.id}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                        <Box>
                          <Typography>{rating.employee?.fullName ?? rating.employeeId}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format_date_with_locale(rating.ratedAt, currentLocale as "en" | "es")}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography fontWeight={700}>{rating.rating}/5</Typography>
                          <Tooltip title="Ver valoración">
                            <IconButton
                              color="primary"
                              onClick={() => setSelectedRating(rating)}
                              sx={{
                                border: "1px solid",
                                borderColor: "primary.main",
                                width: 36,
                                height: 36,
                              }}
                            >
                              <VisibilityOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      {index < ratings.length - 1 && <Divider sx={{ my: 1.5 }} />}
                    </Box>
                  ))}
                </Stack>
              </Section>
            </Box>

            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "minmax(0, .9fr) minmax(0, 1.1fr)" }}
              gap={2}
              sx={{ mt: 2 }}
              alignItems="stretch"
            >
              <Section
                title="Notas"
                action={
                  <SassButton variant="outlined" startIcon={<NoteAdd />} onClick={() => setAction("note")} disabled={saving} size="small">
                    Nota
                  </SassButton>
                }
              >
                <Stack gap={2}>
                  {notes.length === 0 && <Typography color="text.secondary">No hay notas.</Typography>}
                  {notes.map((note, index) => (
                    <Box key={note.id}>
                      <Typography variant="caption" color="text.secondary">{statusLabel(note.type)} · {format_date_with_locale(note.createdAt, currentLocale as "en" | "es")}</Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
                        <Typography
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            flex: 1,
                          }}
                        >
                          {note.content}
                        </Typography>
                        <Tooltip title="Ver nota completa">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              setSelectedNote({
                                content: note.content,
                                type: note.type,
                                createdAt: note.createdAt,
                                createdBy: note.createdBy,
                                createdByName: note.createdByName,
                              })
                            }
                            sx={{
                              border: "1px solid",
                              borderColor: "primary.main",
                              width: 36,
                              height: 36,
                            }}
                          >
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      {index < notes.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                    </Box>
                  ))}
                </Stack>
              </Section>

              <Section
                title="Evidencias"
                action={
                  <SassButton variant="outlined" startIcon={<UploadFile />} onClick={() => setAction("resource")} disabled={saving} size="small">
                    Evidencia
                  </SassButton>
                }
              >
                <Stack gap={2}>
                  {photoResources.length === 0 && <Typography color="text.secondary">No hay evidencias.</Typography>}
                  {photoResources.map((resource, index) => (
                    <Box key={resource.id}>
                      <Link href={resource.url} target="_blank" rel="noreferrer" underline="hover" sx={{ fontWeight: 700 }}>
                        {`${index + 1}. ${resource.filename}`}
                      </Link>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        {statusLabel(resource.type)} · {Math.round(resource.sizeKB)} KB
                      </Typography>
                      {resource.description && <Typography color="text.secondary">{resource.description}</Typography>}
                      {index < photoResources.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                    </Box>
                  ))}
                </Stack>
              </Section>
            </Box>

            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr" }}
              gap={2}
              sx={{ mt: 2 }}
              alignItems="stretch"
            >
              <Section title="Validaciones">
                <Stack gap={1}>
                  {validations.length === 0 && <Typography color="text.secondary">No hay validaciones.</Typography>}
                  {validations.map((validation, index) => (
                    <Box key={validation.id}>
                      <TaskChip value={validation.result} />
                      {validation.reason && <Typography sx={{ mt: 1 }}>{validation.reason}</Typography>}
                      {index < validations.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                    </Box>
                  ))}
                </Stack>
              </Section>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <TaskFormDialog open={openForm} task={task} loading={saving} onClose={() => setOpenForm(false)} onSubmit={onUpdate} />
      {action && (
        <TaskActionDialog
          open={!!action}
          type={action}
          loading={saving}
          assignments={assignments}
          currentEmployeeId={currentEmployeeId}
          onClose={() => setAction(null)}
          onSubmit={onActionSubmit}
        />
      )}

      <Dialog open={!!selectedRating} onClose={() => setSelectedRating(null)} fullWidth maxWidth="sm">
        <DialogTitle>Detalle de valoración</DialogTitle>
        <DialogContent>
          {selectedRating && (
            <Stack gap={2} sx={{ mt: 1 }}>
              <DetailText label="Trabajador" value={selectedRating.employee?.fullName ?? selectedRating.employeeId} />
              <DetailText label="Puntuación" value={`${selectedRating.rating}/5`} />
              <DetailText label="Valorado por" value={selectedRating.ratedByName ?? selectedRating.ratedBy} valueFontSize={16} />
              <DetailText label="Rol del valorador" value={statusLabel(selectedRating.ratedByRole)} valueFontSize={16} />
              <DetailText label="Fecha" value={format_date_with_locale(selectedRating.ratedAt, currentLocale as "en" | "es")} />
              <DetailText label="Comentario" value={selectedRating.comment ?? "Sin comentario"} valueFontSize={16} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SassButton variant="contained" onClick={() => setSelectedRating(null)}>
            Cerrar
          </SassButton>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selectedNote} onClose={() => setSelectedNote(null)} fullWidth maxWidth="sm">
        <DialogTitle>Detalle de nota</DialogTitle>
        <DialogContent>
          {selectedNote && (
            <Stack gap={2} sx={{ mt: 1 }}>
              <DetailText label="Tipo" value={statusLabel(selectedNote.type)} valueFontSize={16} />
              <DetailText label="Creado por" value={selectedNote.createdByName ?? selectedNote.createdBy} valueFontSize={16} />
              <DetailText label="Fecha" value={format_date_with_locale(selectedNote.createdAt, currentLocale as "en" | "es")} valueFontSize={16} />
              <DetailText label="Contenido" value={selectedNote.content} valueFontSize={16} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SassButton variant="contained" onClick={() => setSelectedNote(null)}>
            Cerrar
          </SassButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
