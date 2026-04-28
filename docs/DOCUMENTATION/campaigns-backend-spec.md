# Campaigns Backend Spec

## Objetivo

Definir el módulo backend de campañas en `Notifications v3`.

Este módulo es responsable de:

- crear campañas
- editarlas
- activarlas
- pausarlas
- archivarlas
- exponer su configuración a backoffice

No ejecuta delivery directamente.

## Alcance

Incluye:

- `Campaign`
- `CampaignCreateInputDto`
- `CampaignUpdateInputDto`
- `CampaignOutputDto`
- `CampaignRepository`
- commands administrativos
- queries administrativas

No incluye:

- ejecución de jobs
- delivery push
- tracking de interacción

## Responsabilidades

- validar estructura básica de la campaña
- persistir definición
- proteger transiciones de estado
- mantener contratos consistentes para backoffice

## Estados de campaña

- `draft`
- `active`
- `paused`
- `archived`

## Reglas de transición

- `draft -> active` permitido si configuración completa
- `active -> paused` permitido
- `paused -> active` permitido
- `active -> archived` permitido solo por acción explícita
- `archived` no debe mutar salvo proceso administrativo excepcional

## Persistencia

Ruta:

- `notifications_v3/system/campaign_definitions/{campaignId}`

## Campos mínimos

- `id`
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

## Commands

### CreateCampaign

Entrada:

- `CampaignCreateInputDto`

Salida:

- `CampaignOutputDto`

Validaciones:

- `name` obligatorio
- `channel` válido
- `kind` válido
- `trigger` válido
- si `kind=sequence`, debe existir `sequence.steps`

### UpdateCampaign

Entrada:

- `campaignId`
- `CampaignUpdateInputDto`

Salida:

- `CampaignOutputDto`

Validaciones:

- campaña existente
- campaña no archivada
- no romper coherencia entre `kind` y `sequence`

### ActivateCampaign

Validaciones:

- campaña existente
- estado distinto de `archived`
- trigger definido
- audience definida
- content definido

### PauseCampaign

Efecto:

- impide nuevas entradas
- no borra historial

### ArchiveCampaign

Efecto:

- retira la campaña del uso operativo
- no elimina runs ni jobs históricos

## Queries

- `GetCampaignById`
- `ListCampaigns`
- `ListActiveCampaigns`

## Errores semánticos

- `campaign_not_found`
- `campaign_invalid_state`
- `campaign_archived_not_editable`
- `campaign_sequence_invalid`
- `campaign_trigger_invalid`

## Reglas de diseño

- backoffice nunca escribe Firestore directamente
- todas las mutaciones pasan por commands
- frontend admin no conoce estructura interna de subcolecciones

## Criterios de aceptación

- campañas persistidas correctamente
- transiciones protegidas
- contratos admin estables
- cero dependencia a `v2`
