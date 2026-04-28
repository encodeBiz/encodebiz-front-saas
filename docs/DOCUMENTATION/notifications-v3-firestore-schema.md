# Notifications v3 Firestore Schema

## Objetivo

Definir el esquema de persistencia de `Notifications v3` bajo la raíz única:

- `notifications_v3/system`

## Árbol principal

```text
notifications_v3/
  system
    campaign_definitions/
    campaign_runs/
    notification_jobs/
    in_app_messages/
    user_message_state/
```

## Documento raíz

### `notifications_v3/system`

Uso:

- metadatos de sistema
- flags globales de `v3`
- versión interna
- timestamps de mantenimiento

Campos sugeridos:

- `version`
- `status`
- `maintenanceMode`
- `updatedAt`

## Subcolección `campaign_definitions`

Document id:

- `campaignId`

Campos mínimos:

- `name`
- `description`
- `channel`
- `kind`
- `status`
- `trigger`
- `audience`
- `content`
- `sequence`
- `constraints`
- `scheduleWindow`
- `createdAt`
- `updatedAt`

## Subcolección `campaign_runs`

Document id:

- `runId`

Campos mínimos:

- `campaignId`
- `triggeredBy`
- `runType`
- `status`
- `scheduledAt`
- `startedAt`
- `finishedAt`
- `summary`

## Subcolección `notification_jobs`

Document id:

- `jobId`

Campos mínimos:

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

## Subcolección `in_app_messages`

Document id:

- `messageId`

Campos mínimos:

- `campaignId`
- `jobId`
- `userId`
- `status`
- `title`
- `body`
- `cta`
- `priority`
- `startAt`
- `endAt`
- `metadata`
- `createdAt`
- `updatedAt`

## Subcolección `user_message_state`

Document id recomendado:

- `${userId}_${messageId}`

Campos mínimos:

- `userId`
- `messageId`
- `openedAt`
- `clickedAt`
- `dismissedAt`
- `completedAt`
- `mutedUntil`
- `updatedAt`

## Índices recomendados

- `notification_jobs`: `status + scheduledAt`
- `notification_jobs`: `campaignId + status`
- `notification_jobs`: `userId + campaignId + status`
- `in_app_messages`: `userId + status + startAt`
- `user_message_state`: `userId + messageId`

## Convenciones

- todas las fechas normalizadas
- todos los enums persistidos como string
- `createdAt` y `updatedAt` obligatorios en documentos operativos
- evitar documentos gigantes con snapshots innecesarios

## Regla de diseño

Firestore es almacenamiento y consulta operativa, no fuente de semántica de negocio por sí sola.
