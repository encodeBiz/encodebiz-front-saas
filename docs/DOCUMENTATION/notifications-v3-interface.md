# Notifications v3 Interface Layer

## Objetivo

Definir la capa de interfaz de backend de `Notifications v3`.

Este documento cubre:

- endpoints o handlers
- actores y auth
- request/response externos
- contratos consumidos por frontend y backoffice
- reglas de versionado

La interfaz de `v3` debe ser nueva y no compartir rutas operativas con `v2`.

## Principios

- `v3` debe exponerse con namespace propio
- los contratos externos no deben reflejar estructura interna de Firestore
- frontend no debe reconstruir lógica de backend
- responses estables y explícitas
- errores semánticos normalizados

## Namespace recomendado

Opciones válidas:

- HTTP bajo `/v3/notifications/*`
- handlers internos `notificationsV3.*`

Regla:

- no mezclar rutas o handlers `v2` y `v3`

## Actores y autenticación

### Admin / Backoffice

Operaciones:

- crear campañas
- editar campañas
- activar, pausar y archivar
- lanzar runs manuales
- consultar métricas de campaña

Auth recomendada:

- token administrativo o rol backend explícito

### App cliente

Operaciones:

- consultar mensajes `in_app`
- registrar interacción

Auth recomendada:

- Firebase Auth de usuario final

### Workers internos

Operaciones:

- delivery
- locking
- processors de schedule y eventos

Auth recomendada:

- invocación interna o contexto de ejecución controlado

## Endpoints o handlers administrativos

### `POST /v3/notifications/campaigns`

Objetivo:

- crear campaña

Input:

- `CampaignCreateInputDto`

Output:

- `CampaignOutputDto`

### `PATCH /v3/notifications/campaigns/{campaignId}`

Objetivo:

- actualizar campaña

Input:

- `CampaignUpdateInputDto`

Output:

- `CampaignOutputDto`

### `POST /v3/notifications/campaigns/{campaignId}/activate`

Output:

- `CampaignOutputDto`

### `POST /v3/notifications/campaigns/{campaignId}/pause`

Output:

- `CampaignOutputDto`

### `POST /v3/notifications/campaigns/{campaignId}/archive`

Output:

- `CampaignOutputDto`

### `POST /v3/notifications/campaigns/{campaignId}/runs`

Objetivo:

- lanzar ejecución manual

Input:

- `CreateCampaignRunInputDto`

Output:

- `CampaignRunOutputDto`

### `GET /v3/notifications/campaigns/{campaignId}`

Output:

- `CampaignOutputDto`

### `GET /v3/notifications/campaigns`

Output:

- `CampaignOutputDto[]`

### `GET /v3/notifications/campaigns/{campaignId}/runs`

Output:

- `CampaignRunOutputDto[]`

## Endpoints o handlers cliente

### `GET /v3/notifications/in-app`

Objetivo:

- listar mensajes visibles del usuario autenticado

Output:

- `UserVisibleMessagesOutputDto`

Regla:

- el backend filtra visibilidad, vigencia y estado

### `POST /v3/notifications/in-app/{messageId}/interactions`

Objetivo:

- registrar interacción de mensaje

Input:

- `RegisterMessageInteractionInputDto`

Output:

- `204 No Content` o response mínima uniforme

## DTOs externos mínimos

### CampaignOutputDto

Debe exponer:

- `id`
- `name`
- `description`
- `channel`
- `kind`
- `status`
- `trigger`
- `constraints`
- `scheduleWindow`
- `createdAt`
- `updatedAt`

### CampaignRunOutputDto

Debe exponer:

- `id`
- `campaignId`
- `runType`
- `status`
- `scheduledAt`
- `startedAt`
- `finishedAt`
- `summary`

### InAppMessageOutputDto

Debe exponer:

- `id`
- `title`
- `body`
- `cta`
- `priority`
- `startAt`
- `endAt`
- `status`

### UserVisibleMessagesOutputDto

Debe exponer:

- `messages: InAppMessageOutputDto[]`

## Reglas de contrato

- fechas en ISO-8601
- enums expuestos como strings estables
- payloads sin campos internos de locking o Firestore
- no exponer `dedupeKey`, paths o metadata de infraestructura salvo uso explícito admin

## Respuestas de error

Formato recomendado:

```json
{
  "error": {
    "code": "campaign_not_found",
    "message": "Campaign not found",
    "details": {}
  }
}
```

## Versionado

- `v3` debe estar identificado en ruta o handler
- breaking changes implican nueva revisión de contrato
- no extender `v2` con campos ambiguos intentando compatibilidad parcial

## Decisión recomendada

La interfaz debe ser lo bastante simple para frontend y lo bastante explícita para operación administrativa.

En una frase:

`El contrato externo de v3 debe describir comportamiento de negocio, no estructura de almacenamiento.`
