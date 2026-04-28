# Jobs Backend Spec

## Objetivo

Definir el módulo backend de `notification_jobs` y del pipeline de ejecución.

Es el núcleo operativo de `v3`.

## Responsabilidades

- planificar jobs
- deduplicar
- bloquear para ejecución
- entregar
- registrar estado y errores
- programar siguiente paso cuando aplique

## Persistencia

Ruta:

- `notifications_v3/system/notification_jobs/{jobId}`

## Estados de job

- `pending`
- `locked`
- `sent`
- `failed`
- `cancelled`
- `expired`

## Campos mínimos

- `campaignId`
- `runId`
- `userId`
- `channel`
- `step`
- `status`
- `dedupeKey`
- `scheduledAt`
- `processedAt`
- `payload`
- `attempts`
- `lastError`
- `lockedBy`
- `lockedAt`
- `lockExpiresAt`
- `createdAt`
- `updatedAt`

## Submódulos

### Planning

Responsable de:

- convertir audiencia en jobs concretos
- construir `dedupeKey`
- evitar duplicados

### Locking

Responsable de:

- transición transaccional a `locked`
- evitar doble procesamiento

### Delivery

Responsable de:

- ejecutar push o materializar `in_app`
- actualizar estado final

### Retry

Responsable de:

- decidir si un error es recuperable
- reintentar dentro de límites

## Commands

### PlanNotificationJobs

Entrada:

- campaña
- users
- trigger context

Salida:

- resumen de jobs creados y descartados

### LockNotificationJob

Entrada:

- `jobId`
- `workerId`

Salida:

- job bloqueado o `null`

### DeliverNotificationJob

Entrada:

- `jobId`

Salida:

- `DeliveryAttemptResultDto`

### CancelNotificationJob

Entrada:

- `jobId`
- `reason`

## Queries

- `GetNotificationJobById`
- `ListPendingNotificationJobs`
- `ListJobsByCampaign`
- `ListJobsByRun`

## Dedupe

Formato base recomendado:

- `campaignId:userId:channel:step:window`

Reglas:

- mismo job lógico no puede crearse dos veces
- reintento no crea nuevo job si sigue siendo el mismo intento lógico

## Locking

Reglas:

- solo `pending` puede pasar a `locked`
- lock debe tener expiración
- locks expirados pueden recuperarse por processor dedicado

## Errores semánticos

- `notification_job_not_found`
- `notification_job_not_pending`
- `notification_job_locked_by_another_worker`
- `notification_job_expired`
- `delivery_provider_error`

## Criterios de aceptación

- no hay doble delivery del mismo job
- errores quedan trazados
- jobs fallidos son auditables
- scheduling y locking son idempotentes
