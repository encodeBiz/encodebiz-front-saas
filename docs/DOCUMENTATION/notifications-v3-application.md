# Notifications v3 Application Layer

## Objetivo

Definir la capa de aplicación de `Notifications v3` como puente entre:

- interfaces de entrada
- capa de dominio
- persistencia
- delivery

Este documento describe:

- casos de uso
- commands
- queries
- actores
- entradas y salidas
- reglas de orquestación
- flujos end-to-end

No define código. Define comportamiento aplicacional.

## Restricción estructural

La capa de aplicación de `v3` debe ser autónoma respecto a `v2`.

Reglas obligatorias:

- no reutilizar use cases de `v2`
- no importar controllers ni services operativos de `v2`
- no compartir handlers de triggers entre `v2` y `v3`
- no mezclar contratos de request/response entre versiones

Si `v3` necesita comportamiento equivalente, se reimplementa dentro de `3.0`.

## Rol de la capa de aplicación

La capa de aplicación es responsable de:

- recibir una intención de negocio
- validar precondiciones de aplicación
- invocar entidades y servicios de dominio
- coordinar repositorios
- disparar planificación o ejecución
- devolver DTOs claros a frontend, backoffice o procesos internos

No debe contener:

- reglas profundas de negocio que pertenecen al dominio
- detalles de SDKs externos
- lógica de transporte HTTP o Firestore trigger específica

## Audiencia del documento

Este documento está orientado a:

- backend para implementar los casos de uso
- frontend para entender qué operaciones existen y qué estados observar
- producto para validar flujos
- IA para usarlo como prompt base de diseño e implementación

## Actores del sistema

### 1. Admin o backoffice

Puede:

- crear campañas
- editar campañas
- activarlas
- pausarlas
- archivarlas
- lanzar ejecuciones manuales

### 2. Scheduler del sistema

Puede:

- detectar campañas temporales
- generar runs programados
- avanzar secuencias
- generar jobs vencidos o pendientes

### 3. Trigger de dominio

Puede:

- reaccionar a eventos de usuario
- evaluar reglas de entrada
- crear runs o jobs

### 4. App cliente

Puede:

- consultar mensajes `in_app`
- informar apertura, click, dismiss y complete

### 5. Worker de delivery

Puede:

- bloquear jobs
- ejecutar entrega
- registrar resultado
- programar siguiente paso

## Clasificación de operaciones

La capa de aplicación debe separarse en:

- `commands`: alteran estado
- `queries`: consultan estado
- `processors`: orquestan trabajo interno asíncrono

## Commands principales

### CreateCampaignCommand

Objetivo:

- crear una campaña nueva en estado inicial

Entrada:

- `CampaignCreateInputDto`

Salida:

- `CampaignOutputDto`

Precondiciones:

- nombre obligatorio
- canal válido
- trigger válido
- reglas de secuencia coherentes con `kind`

Postcondiciones:

- campaña persistida
- estado inicial definido
- auditoría mínima registrada si aplica

### UpdateCampaignCommand

Objetivo:

- modificar una campaña editable

Entrada:

- `campaignId`
- `CampaignUpdateInputDto`

Salida:

- `CampaignOutputDto`

Precondiciones:

- la campaña existe
- la campaña no está archivada
- las reglas siguen siendo coherentes

### ActivateCampaignCommand

Objetivo:

- pasar una campaña a estado `active`

Entrada:

- `campaignId`

Salida:

- `CampaignOutputDto`

Precondiciones:

- la campaña existe
- la configuración está completa
- si es secuencial, tiene al menos un paso

### PauseCampaignCommand

Objetivo:

- detener nuevas entradas y nuevas entregas planificables

Entrada:

- `campaignId`

Salida:

- `CampaignOutputDto`

Consideración:

- pausar no implica borrar historial
- debe afectar evaluación futura y planificación futura

### ArchiveCampaignCommand

Objetivo:

- retirar la campaña de uso operativo

Entrada:

- `campaignId`

Salida:

- `CampaignOutputDto`

Consideración:

- las campañas archivadas no deben admitir activación implícita

### LaunchCampaignRunCommand

Objetivo:

- disparar manualmente una ejecución de campaña

Entrada:

- `campaignId`
- `triggerContext`
- `runType`

Salida:

- `CampaignRunOutputDto`

Postcondiciones:

- `campaign_run` creado
- evaluación de audiencia iniciada o encolada

### PlanNotificationJobsCommand

Objetivo:

- convertir una campaña y una audiencia en jobs concretos

Entrada:

- `campaignId`
- `runId`
- `users: string[]`
- `triggerContext`

Salida:

- `PlanNotificationJobsOutputDto`

Postcondiciones:

- jobs creados con `dedupeKey`
- duplicados descartados
- resumen de planificación disponible

### LockNotificationJobCommand

Objetivo:

- tomar un job pendiente para ejecución exclusiva

Entrada:

- `jobId`
- `workerId`

Salida:

- `NotificationJobOutputDto | null`

Regla:

- si el job ya no está `pending`, no se toma

### DeliverNotificationJobCommand

Objetivo:

- ejecutar un job concreto

Entrada:

- `jobId`

Salida:

- `DeliveryAttemptResultDto`

Postcondiciones:

- job actualizado a `sent`, `failed`, `cancelled` o `expired`
- si corresponde, creación de `in_app_message`
- si corresponde, programación de siguiente paso

### RegisterMessageInteractionCommand

Objetivo:

- registrar una acción del usuario sobre un mensaje

Entrada:

- `RegisterMessageInteractionInputDto`

Salida:

- `void`

Postcondiciones:

- `user_message_state` actualizado
- si aplica, secuencia cancelada o completada

### CancelCampaignSequenceCommand

Objetivo:

- cancelar pasos futuros de una secuencia para un usuario

Entrada:

- `campaignId`
- `userId`
- `reason`

Salida:

- `CancelCampaignSequenceOutputDto`

## Queries principales

### GetCampaignByIdQuery

Entrada:

- `campaignId`

Salida:

- `CampaignOutputDto | null`

### ListActiveCampaignsQuery

Entrada:

- filtros opcionales por canal, trigger o estado

Salida:

- `CampaignOutputDto[]`

### GetCampaignRunByIdQuery

Entrada:

- `runId`

Salida:

- `CampaignRunOutputDto | null`

### ListCampaignRunsQuery

Entrada:

- `campaignId`
- paginación opcional

Salida:

- `CampaignRunOutputDto[]`

### GetNotificationJobByIdQuery

Entrada:

- `jobId`

Salida:

- `NotificationJobOutputDto | null`

### ListPendingNotificationJobsQuery

Entrada:

- `dueBefore`
- `limit`

Salida:

- `NotificationJobOutputDto[]`

### GetVisibleInAppMessagesQuery

Objetivo:

- devolver los mensajes activos y visibles para un usuario

Entrada:

- `UserVisibleMessagesInputDto`

Salida:

- `UserVisibleMessagesOutputDto`

Consideración frontend:

- esta query debe ser estable y simple
- el frontend no debe reconstruir reglas de negocio

### GetMessageInteractionStateQuery

Entrada:

- `userId`
- `messageId`

Salida:

- `UserMessageStateOutputDto | null`

## Processors internos

Los `processors` no son API pública funcional. Son orquestadores internos.

### EvaluateAudienceProcessor

Responsabilidad:

- evaluar audiencia de una campaña activa
- producir usuarios candidatos

Input:

- `campaignId`
- `triggerContext`
- `cursor?`
- `limit?`

Output:

- `EvaluateAudienceOutputDto`

### ScheduledCampaignProcessor

Responsabilidad:

- revisar campañas con trigger temporal
- crear `campaign_runs`

### DomainEventCampaignProcessor

Responsabilidad:

- recibir un evento de dominio
- resolver campañas afectadas
- disparar evaluación

### NotificationJobDeliveryProcessor

Responsabilidad:

- recoger jobs vencidos y pendientes
- bloquearlos
- entregarlos
- registrar resultado

### SequenceAdvanceProcessor

Responsabilidad:

- decidir si corresponde el siguiente paso
- crear el siguiente `notification_job`
- cancelar secuencia si se cumple regla de salida

## Flujos end-to-end

### Flujo 1: Crear y activar campaña

1. Admin ejecuta `CreateCampaignCommand`.
2. El sistema persiste campaña en `draft`.
3. Admin ejecuta `ActivateCampaignCommand`.
4. La campaña pasa a `active`.
5. Queda disponible para triggers temporales o de evento.

### Flujo 2: Campaña in-app basada en filtro

1. `ScheduledCampaignProcessor` detecta una campaña activa con trigger temporal.
2. Se ejecuta `LaunchCampaignRunCommand`.
3. `EvaluateAudienceProcessor` obtiene usuarios candidatos.
4. `PlanNotificationJobsCommand` crea jobs de canal `in_app`.
5. `NotificationJobDeliveryProcessor` procesa cada job.
6. `DeliverNotificationJobCommand` crea `in_app_messages`.
7. La app consume `GetVisibleInAppMessagesQuery`.
8. La app reporta interacciones con `RegisterMessageInteractionCommand`.

### Flujo 3: Push secuencial por evento

1. Un trigger de dominio genera un `TriggerContext`.
2. `DomainEventCampaignProcessor` identifica campañas elegibles.
3. Se crea `campaign_run`.
4. Se planifica el paso `1`.
5. `NotificationJobDeliveryProcessor` entrega el push.
6. `SequenceAdvanceProcessor` decide si corresponde crear el siguiente paso.
7. Si el usuario cumple condición de salida, `CancelCampaignSequenceCommand` cancela pendientes.

### Flujo 4: Reintento de job fallido

1. `DeliverNotificationJobCommand` falla.
2. El job se marca `failed` con error y número de intento.
3. Si el error es recuperable, un processor interno puede replanificar o reencolar.
4. Si supera el máximo permitido, queda definitivamente fallido.

## Reglas de orquestación

### Regla 1. El frontend no decide negocio

La app cliente:

- consulta mensajes
- reporta interacción

La app no:

- calcula segmentos
- decide elegibilidad
- reconstruye secuencias
- determina deduplicación

### Regla 2. Cada command tiene un resultado claro

Los commands deben devolver:

- entidad creada o actualizada
- resumen de operación
- error semántico si la transición no es válida

### Regla 3. Cada processor debe ser idempotente

Si el mismo processor corre dos veces:

- no debe duplicar jobs
- no debe duplicar mensajes activos
- no debe reactivar secuencias canceladas

### Regla 4. Las transiciones de estado deben ser explícitas

La capa de aplicación nunca debe mutar estados de forma implícita o silenciosa.

Cada transición debe responder a:

- un command
- una regla del dominio
- un resultado de processor documentado

### Regla 5. Toda escritura de `v3` vive bajo `notifications_v3`

Los commands y processors de `v3` no deben escribir en colecciones top-level dispersas.

La persistencia operativa debe concentrarse en subcolecciones de:

- `notifications_v3/system`

## Contratos de salida recomendados para frontend

### CampaignOutputDto

Debe permitir al frontend administrativo entender:

- estado actual
- canal
- trigger
- vigencia
- secuencia
- restricciones configuradas

### InAppMessageOutputDto

Debe permitir a la app renderizar sin reconstrucción adicional:

- `id`
- `title`
- `body`
- `cta`
- `priority`
- `startAt`
- `endAt`
- `status`

### UserMessageStateOutputDto

Debe exponer:

- `messageId`
- `openedAt`
- `clickedAt`
- `dismissedAt`
- `completedAt`

## Errores semánticos de aplicación

Se recomienda un catálogo explícito.

Ejemplos:

- `campaign_not_found`
- `campaign_already_active`
- `campaign_archived_not_editable`
- `campaign_sequence_invalid`
- `notification_job_not_pending`
- `notification_job_locked_by_another_worker`
- `message_not_visible`
- `message_interaction_invalid`

## Propuesta de organización documental para IA

Cada caso de uso debe poder derivarse después a un prompt técnico con:

- objetivo
- input
- output
- invariantes
- dependencias
- errores esperados

Formato recomendado:

```md
## Use Case: ActivateCampaign
- Goal
- Input DTO
- Output DTO
- Preconditions
- Steps
- State transitions
- Failure cases
```

## Propuesta de mapeo a archivos TypeScript

```text
functions/src/3.0/application/notification/
  commands/
  queries/
  processors/
  dto/
  contracts/
```

Ejemplos:

- `functions/src/3.0/application/notification/commands/create-campaign.command.ts`
- `functions/src/3.0/application/notification/commands/deliver-notification-job.command.ts`
- `functions/src/3.0/application/notification/queries/get-visible-in-app-messages.query.ts`
- `functions/src/3.0/application/notification/processors/evaluate-audience.processor.ts`

## Relación con frontend

El frontend debe poder trabajar con este documento para responder:

- qué endpoints o handlers se necesitarán
- qué DTOs deberá consumir
- qué eventos deberá emitir
- qué estados debe representar en UI
- qué mensajes pueden cambiar por configuración sin cambio de app

## Mapeo de persistencia esperado

Los casos de uso de aplicación deben operar sobre repositorios que apunten a:

- `notifications_v3/system/campaign_definitions`
- `notifications_v3/system/campaign_runs`
- `notifications_v3/system/notification_jobs`
- `notifications_v3/system/in_app_messages`
- `notifications_v3/system/user_message_state`

## Decisión recomendada

La capa de aplicación de `v3` debe organizarse en torno a:

- commands para mutaciones
- queries para lectura
- processors para orquestación interna

Y debe mantener una frontera nítida entre:

- interfaz
- aplicación
- dominio
- infraestructura

En una frase:

`La capa de aplicación de v3 no envía notificaciones por sí sola; coordina decisiones, persistencia y ejecución sin mezclar responsabilidades.`
