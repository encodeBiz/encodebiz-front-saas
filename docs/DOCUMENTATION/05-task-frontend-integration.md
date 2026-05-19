# CheckBiz Task - Documentacion para Frontend

## 1. Objetivo

Este documento define lo necesario para que el equipo de frontend pueda integrar el modulo de tareas de CheckBiz sin inferencias adicionales.

El objetivo del frontend es permitir:

- visualizar tareas por usuario, sucursal y estado
- crear tareas cuando el usuario tenga permisos
- asignar trabajadores
- iniciar y completar tareas
- validar o rechazar tareas
- agregar notas
- subir evidencias
- valorar trabajadores
- mostrar trazabilidad y actividad

## 2. Base del modulo

La Cloud Function expone una API HTTP basada en Express bajo el handler:

```txt
tasksHandler
```

Rutas internas:

```txt
/tasks
```

### 2.1 URL de desarrollo actual

Referencia dada para dev:

```txt
http://127.0.0.1:5001/encodebiz-services/us-central1/apiV100-firebaseEntryHttp-checkinbiz-calendarHandler
```

Siguiendo la misma convención, la base esperada del módulo task en desarrollo es:

```txt
http://127.0.0.1:5001/encodebiz-services/us-central1/apiV100-firebaseEntryHttp-checkinbiz-tasksHandler/tasks
```

Ejemplos:

```txt
GET  http://127.0.0.1:5001/encodebiz-services/us-central1/apiV100-firebaseEntryHttp-checkinbiz-tasksHandler/tasks?entityId=...
POST http://127.0.0.1:5001/encodebiz-services/us-central1/apiV100-firebaseEntryHttp-checkinbiz-tasksHandler/tasks
GET  http://127.0.0.1:5001/encodebiz-services/us-central1/apiV100-firebaseEntryHttp-checkinbiz-tasksHandler/tasks/:taskId?entityId=...
```

## 3. Modelo funcional que debe asumir frontend

### 3.1 La tarea pertenece a:

- una entidad `entityId`
- una sucursal `branchId`
- un conjunto de empleados asignados `assignedEmployeeIds`

### 3.2 Los roles no son independientes del modulo

El frontend no debe inventar roles propios de tareas.

La capacidad del usuario depende de la responsabilidad ya asignada al empleado en la sucursal:

```txt
worker
supervisor
manager
owner
```

Esto significa:

- un supervisor sigue siendo un empleado asignado a una sucursal
- un manager u owner tienen capacidades administrativas superiores
- el frontend debe presentar acciones según permisos efectivos, no según etiquetas visuales aisladas

### 3.3 Regla actual de notas

Puede crear nota:

- un empleado asignado a la tarea
- un `manager`
- un `owner`

No se debe asumir que cualquier supervisor no asignado puede crear notas.

### 3.4 Regla actual de completado

Cualquier trabajador asignado puede completar la tarea.

El sistema mantiene además el estado individual por asignación.

## 4. Estados que frontend debe representar

### 4.1 Estado principal de tarea

```txt
draft
assigned
in_progress
completed
validated
rejected
cancelled
```

### 4.2 Subestado temporal

```txt
not_started
on_time
at_risk
overdue
completed_on_time
completed_late
```

### 4.3 Estado por asignación

```txt
assigned
accepted
working
completed
blocked
removed
```

## 5. Contratos base que frontend recibira

## 5.1 Task

```ts
interface Task {
  id?: string;
  entityId: string;
  branchId: string;
  title: string;
  description?: string;
  status:
    | "draft"
    | "assigned"
    | "in_progress"
    | "completed"
    | "validated"
    | "rejected"
    | "cancelled";
  timeComplianceStatus:
    | "not_started"
    | "on_time"
    | "at_risk"
    | "overdue"
    | "completed_on_time"
    | "completed_late";
  priority?: "low" | "medium" | "high" | "critical";
  scheduledStartAt?: Date | string;
  dueAt: Date | string;
  startedAt?: Date | string;
  completedAt?: Date | string;
  validatedAt?: Date | string;
  rejectedAt?: Date | string;
  cancelledAt?: Date | string;
  createdBy: string;
  updatedBy?: string;
  completedBy?: string;
  validatedBy?: string;
  rejectedBy?: string;
  cancelledBy?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  assignedEmployeeIds: string[];
  config: {
    allowSupervisorValidation: boolean;
    allowSupervisorRating: boolean;
    completionPolicy: "any_assigned_worker" | "all_assigned_workers";
    requireEvidenceOnCompletion: boolean;
    notifyIfNotStarted: boolean;
    maxPhotoSizeMB: number;
    maxVideoSizeMB: number;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
  scheduledStartNotificationAt?: Date | string;
  scheduledStartNotifiedAt?: Date | string;
}
```

## 5.2 TaskAssignment

```ts
interface TaskAssignment {
  id?: string;
  taskId: string;
  entityId: string;
  branchId: string;
  employeeId: string;
  status: "assigned" | "accepted" | "working" | "completed" | "blocked" | "removed";
  assignedBy: string;
  assignedAt: Date | string;
  startedAt?: Date | string;
  completedAt?: Date | string;
  removedAt?: Date | string;
  notes?: string;
}
```

## 5.3 TaskNote

```ts
interface TaskNote {
  id?: string;
  taskId: string;
  entityId: string;
  branchId: string;
  content: string;
  type: "specification" | "operational_note" | "clarification" | "incident_note";
  createdBy: string;
  createdByRole: "worker" | "supervisor" | "manager" | "owner";
  createdAt: Date | string;
  updatedBy?: string;
  updatedAt?: Date | string;
}
```

## 5.4 TaskResource

```ts
interface TaskResource {
  id?: string;
  taskId: string;
  entityId: string;
  branchId: string;
  uploadedBy: string;
  employeeId?: string;
  description?: string;
  type: "photo" | "video";
  filename: string;
  mimeType: string;
  url: string;
  storagePath: string;
  sizeKB: number;
  createdAt: Date | string;
}
```

## 5.5 TaskRating

```ts
interface TaskRating {
  id?: string;
  taskId: string;
  entityId: string;
  branchId: string;
  employeeId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  ratedBy: string;
  ratedByRole: "supervisor" | "manager" | "owner";
  ratedAt: Date | string;
}
```

## 5.6 TaskActivity

```ts
interface TaskActivity {
  id?: string;
  taskId: string;
  entityId: string;
  branchId: string;
  type:
    | "created"
    | "updated"
    | "assigned"
    | "status_changed"
    | "started"
    | "completed"
    | "validated"
    | "rejected"
    | "cancelled"
    | "note_added"
    | "note_updated"
    | "resource_uploaded"
    | "rated"
    | "commented"
    | "start_delay_notified";
  actorId: string;
  actorRole: "worker" | "supervisor" | "manager" | "owner";
  employeeId?: string;
  fromStatus?: string;
  toStatus?: string;
  metadata?: Record<string, any>;
  createdAt: Date | string;
}
```

## 6. Endpoints que frontend debe consumir

## 6.1 Listar tareas

```txt
GET /tasks?entityId=...&branchId=...&status=...&employeeId=...&from=...&to=...
```

Uso recomendado:

- vista general de tareas por sucursal
- vista personal de tareas asignadas
- filtros por estado o rango temporal

### Query params

- `entityId` obligatorio
- `branchId` opcional
- `status` opcional
- `employeeId` opcional
- `timeComplianceStatus` opcional
- `from` opcional
- `to` opcional
- `limit` opcional

## 6.2 Obtener detalle

```txt
GET /tasks/:taskId?entityId=...
```

Respuesta esperada:

```ts
{
  task: Task;
  assignments: TaskAssignment[];
  notes: TaskNote[];
  resources: TaskResource[];
  ratings: TaskRating[];
  activity: TaskActivity[];
  validations: any[];
}
```

## 6.3 Obtener actividad

```txt
GET /tasks/:taskId/activity?entityId=...
```

Uso:

- timeline
- historial de auditoría
- panel de cambios

## 6.4 Crear tarea

```txt
POST /tasks
```

Body:

```json
{
  "entityId": "entity_123",
  "branchId": "branch_123",
  "title": "Limpieza de zona A",
  "description": "Completar limpieza y subir evidencia",
  "scheduledStartAt": "2026-04-24T08:00:00.000Z",
  "dueAt": "2026-04-24T16:00:00.000Z",
  "priority": "medium",
  "assignedEmployeeIds": ["emp_1", "emp_2"],
  "config": {
    "allowSupervisorValidation": true,
    "allowSupervisorRating": true,
    "completionPolicy": "any_assigned_worker",
    "requireEvidenceOnCompletion": true,
    "notifyIfNotStarted": true,
    "maxPhotoSizeMB": 5,
    "maxVideoSizeMB": 25
  }
}
```

## 6.5 Editar tarea

```txt
PATCH /tasks/:taskId
```

Campos actualmente previstos:

- `title`
- `description`
- `dueAt`
- `priority`
- `config`

## 6.6 Asignar trabajadores

```txt
POST /tasks/:taskId/assignments
```

Body:

```json
{
  "entityId": "entity_123",
  "employeeIds": ["emp_1", "emp_2"]
}
```

## 6.7 Desasignar trabajador

```txt
DELETE /tasks/:taskId/assignments/:employeeId?entityId=...
```

## 6.8 Cambiar estado

```txt
PATCH /tasks/:taskId/status
```

Body:

```json
{
  "entityId": "entity_123",
  "status": "in_progress"
}
```

Estados actualmente soportados en la primera implementación:

- `draft`
- `in_progress`
- `completed`
- `cancelled`

## 6.9 Agregar nota

```txt
POST /tasks/:taskId/notes
```

Body:

```json
{
  "entityId": "entity_123",
  "content": "La tarea debe ejecutarse fuera del horario de apertura.",
  "type": "specification"
}
```

## 6.10 Actualizar nota

```txt
PATCH /tasks/:taskId/notes/:noteId
```

Body:

```json
{
  "entityId": "entity_123",
  "content": "La tarea debe ejecutarse fuera del horario de apertura y antes de las 08:00."
}
```

## 6.11 Validar tarea

```txt
POST /tasks/:taskId/validation
```

Body:

```json
{
  "entityId": "entity_123",
  "comment": "Tarea validada correctamente"
}
```

## 6.12 Rechazar tarea

```txt
POST /tasks/:taskId/rejection
```

Body:

```json
{
  "entityId": "entity_123",
  "reason": "La evidencia no es suficiente"
}
```

## 6.13 Valorar trabajador

```txt
POST /tasks/:taskId/ratings
```

Body:

```json
{
  "entityId": "entity_123",
  "employeeId": "emp_1",
  "rating": 5,
  "comment": "Trabajo completado con calidad"
}
```

## 6.14 Subir recurso

```txt
POST /tasks/:taskId/resources
Content-Type: multipart/form-data
```

Fields:

```txt
entityId
branchId
employeeId
type=photo|video
description
file
```

## 7. Comportamiento UI recomendado

## 7.1 Listado de tareas

Cada card o fila debería mostrar como mínimo:

- título
- sucursal
- prioridad
- fecha prevista de inicio
- si esta activada la notificacion de inicio no realizado
- fecha límite
- estado principal
- subestado temporal
- número de asignados
- si requiere evidencia

## 7.2 Detalle de tarea

El detalle debería separarse en bloques:

- resumen
- equipo asignado
- notas
- evidencias
- valoraciones
- historial de actividad

## 7.3 Acciones contextuales

Frontend debe renderizar acciones según permisos y estado:

- `Crear tarea`
- `Editar tarea`
- `Asignar trabajadores`
- `Iniciar tarea`
- `Completar tarea`
- `Agregar nota`
- `Validar`
- `Rechazar`
- `Valorar`
- `Subir recurso`

No todas las acciones deben estar siempre visibles.

## 7.4 Evidencias

En UI debe quedar visible:

- tipo de recurso
- nombre de archivo
- descripción si existe
- tamaño o metadata útil
- autor de la subida si el diseño lo requiere

## 7.5 Notas

Las notas deben mostrarse como elementos con:

- contenido
- tipo
- autor
- fecha de creación
- fecha de actualización si existe

## 8. Permisos que frontend debe respetar visualmente

### 8.1 Crear tarea

Permitido para:

- `manager`
- `owner`
- `supervisor` solo si la configuración de la tarea o del flujo lo permite

### 8.2 Editar o reasignar

Permitido para:

- `manager`
- `owner`

### 8.3 Iniciar o completar

Permitido para:

- empleado asignado
- administradores con capacidad superior

### 8.4 Agregar nota

Permitido para:

- empleado asignado
- `manager`
- `owner`

### 8.5 Validar o rechazar

Permitido para:

- `manager`
- `owner`
- `supervisor` cuando la configuración de la tarea lo permita

### 8.6 Valorar

Permitido para:

- `manager`
- `owner`
- `supervisor` cuando la configuración de la tarea lo permita

## 8.7 Inicio previsto y notificacion tardia

Frontend debe soportar:

- `scheduledStartAt` como fecha/hora prevista de inicio
- `config.notifyIfNotStarted` como switch editable

Regla funcional:

- Si la tarea tiene `scheduledStartAt` y `notifyIfNotStarted = true`, backend programa automaticamente una notificacion 15 minutos despues si la tarea sigue sin iniciar.

Comportamiento recomendado en Backoffice Next.js:

- Mostrar selector de fecha/hora para `scheduledStartAt`
- Mostrar switch `Notificar si no inicia a tiempo`
- Helper text:
  - `Si la tarea sigue sin iniciar 15 minutos despues de la hora prevista, se enviara una notificacion automatica.`
- Si no existe `scheduledStartAt`, permitir el switch pero explicar que solo aplica cuando haya hora prevista
- Al editar, reenviar siempre el `config` completo

Recomendacion tecnica Next.js:

- Construir `scheduledStartAt` en la zona horaria operativa de la sucursal y enviarlo como ISO absoluto
- No enviar fecha local ambigua sin zona

Integracion Flutter:

- La app debe reconocer el nuevo tipo de notificacion `task_start_delay`
- Al pulsar la push o la notificacion in-app, navegar a detalle de tarea
- Si la pantalla de detalle ya esta abierta, refrescar la tarea y la actividad
- Etiqueta sugerida:
  - `Inicio no realizado`

## 9. Validaciones que frontend debe aplicar antes de enviar

Crear tarea:

- `title` obligatorio
- `entityId` obligatorio
- `branchId` obligatorio
- `scheduledStartAt` opcional
- `config.notifyIfNotStarted` obligatorio dentro de `config`
- `dueAt` obligatorio
- `assignedEmployeeIds` como array válido
- `config` obligatorio

Nota:

- `content` obligatorio

Rating:

- entero entre 1 y 5
- `employeeId` obligatorio

Rechazo:

- `reason` obligatorio

Recurso:

- `type` obligatorio
- `file` obligatorio
- `description` opcional
- respetar límite visual de tamaño antes de subir si el frontend puede conocerlo

## 10. Manejo de errores

Frontend debe esperar respuestas con estructura similar a:

```json
{
  "code": "task/bad_request",
  "error": "message"
}
```

Se recomienda:

- mapear `code` a mensajes de UI
- no depender del texto literal de `error`
- manejar `401`, `403`, `404` y `400` explícitamente

## 11. Notificaciones y actualización de UI

El backend ya dispara notificaciones en acciones principales.

Frontend debe asumir que:

- crear, asignar, iniciar, completar, validar, rechazar, valorar y subir recurso pueden generar push
- una tarea con inicio previsto puede generar push automatico `task_start_delay`
- el destinatario puede recibir cambios fuera de la vista actual

Por tanto, es recomendable:

- refrescar detalle tras acciones críticas
- invalidar caché de listado y detalle
- refrescar timeline/activity después de una mutación

## 12. Recomendaciones de integración

- usar una capa de cliente API específica para `task`
- tipar respuestas con los contratos de este documento
- separar componentes de:
  - listado
  - detalle
  - notas
  - recursos
  - actividad
  - formularios de creación/edición
- no deducir permisos solo por UI; el backend es la fuente final

## 13. Resumen para front

El frontend puede empezar a integrar desde ya:

- listado de tareas
- detalle de tarea
- creación
- edición
- asignación
- cambio de estado
- notas
- validación/rechazo
- rating
- subida de recursos
- actividad

La integración debe apoyarse en responsabilidades reales de sucursal, estados de tarea y contratos HTTP ya definidos.

## 14. Prompt recomendado para Frontend

```txt
Actúa como desarrollador senior de frontend dentro del proyecto CheckBiz.

Necesitas construir una nueva sección del backoffice para el módulo Task dentro de CheckBiz. No es una pantalla aislada ni una herramienta externa: es un módulo nuevo dentro del backoffice de CheckBiz.

Debes trabajar únicamente con lo ya definido, sin inventar reglas nuevas. Si algo no está definido, debes preguntarlo antes de implementarlo.

Contexto funcional:

- una tarea pertenece a una entidad (`entityId`) y una sucursal (`branchId`)
- una tarea puede estar asignada a uno o varios empleados
- cualquier trabajador asignado puede iniciar o completar la tarea
- `manager` y `owner` tienen capacidades administrativas del módulo
- un supervisor solo puede crear, validar o valorar si la configuración de la tarea lo permite
- una nota puede crearla un empleado asignado o un `manager`/`owner`
- un recurso puede tener descripción opcional
- la tarea tiene estados, subestados temporales, notas, evidencias, valoraciones y actividad

Estados principales:

- `draft`
- `assigned`
- `in_progress`
- `completed`
- `validated`
- `rejected`
- `cancelled`

Subestados temporales:

- `not_started`
- `on_time`
- `at_risk`
- `overdue`
- `completed_on_time`
- `completed_late`

Contratos que debes respetar:

- `Task`
- `TaskAssignment`
- `TaskNote`
- `TaskResource`
- `TaskRating`
- `TaskActivity`

Base API en desarrollo:

`http://127.0.0.1:5001/encodebiz-services/us-central1/apiV100-firebaseEntryHttp-checkinbiz-tasksHandler/tasks`

Endpoints disponibles:

- `GET /tasks`
- `GET /tasks/:taskId`
- `GET /tasks/:taskId/activity`
- `POST /tasks`
- `PATCH /tasks/:taskId`
- `POST /tasks/:taskId/assignments`
- `DELETE /tasks/:taskId/assignments/:employeeId`
- `PATCH /tasks/:taskId/status`
- `POST /tasks/:taskId/notes`
- `PATCH /tasks/:taskId/notes/:noteId`
- `POST /tasks/:taskId/validation`
- `POST /tasks/:taskId/rejection`
- `POST /tasks/:taskId/resources`
- `POST /tasks/:taskId/ratings`

Necesitas diseñar e implementar en frontend:

- listado de tareas
- detalle de tarea
- formulario de creación
- formulario de edición
- gestión de asignados incluyendo desasignación
- notas
- evidencias
- valoraciones
- historial de actividad

Reglas de implementación:

- no inventes permisos fuera del modelo existente
- no asumas que “supervisor” y “trabajador” son perfiles distintos fuera de la responsabilidad ya asignada en sucursal
- muestra acciones condicionales según permisos efectivos
- usa tipado fuerte
- separa la UI por componentes reutilizables
- refresca detalle y actividad tras mutaciones
- maneja estados de carga, vacío y error
- usa los `code` de backend para mapear errores de UI

Objetivo de salida:

- una propuesta o implementación del módulo frontend del backoffice Task, coherente con CheckBiz, lista para integrarse con los endpoints existentes
```
