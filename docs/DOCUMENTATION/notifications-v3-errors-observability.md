# Notifications v3 Errors and Observability

## Objetivo

Definir cómo `v3` comunica errores y cómo se opera en producción.

## Catálogo mínimo de errores

- `campaign_not_found`
- `campaign_invalid_state`
- `campaign_archived_not_editable`
- `campaign_sequence_invalid`
- `campaign_trigger_invalid`
- `notification_job_not_found`
- `notification_job_not_pending`
- `notification_job_locked_by_another_worker`
- `notification_job_expired`
- `message_not_found`
- `message_not_visible`
- `message_interaction_invalid`
- `delivery_provider_error`
- `delivery_provider_timeout`
- `repository_write_failed`
- `repository_read_failed`

## Logging

Cada operación relevante debe emitir logs estructurados con:

- `campaignId`
- `runId`
- `jobId`
- `userId`
- `action`
- `status`
- `errorCode`

## Métricas mínimas

- campañas activas
- runs creados
- jobs creados
- jobs pendientes
- jobs enviados
- jobs fallidos
- jobs cancelados
- mensajes `in_app` visibles
- aperturas
- clicks
- dismiss
- complete

## Alertas mínimas

- backlog de jobs por encima de umbral
- ratio de fallo por encima de umbral
- locks expirados acumulados
- caída de processor programado

## Runbook mínimo

Debe responder:

- cómo inspeccionar un job
- cómo localizar una campaña
- cómo saber por qué un usuario recibió algo
- cómo distinguir fallo lógico de fallo de provider
- cómo pausar campañas rápido

## Regla operativa

Si no puede observarse, no está listo para producción.
