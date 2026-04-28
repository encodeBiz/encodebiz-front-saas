# In-App Backend Spec

## Objetivo

Definir el módulo backend de mensajes `in_app`.

## Responsabilidades

- crear mensajes visibles a partir de jobs
- listar mensajes visibles por usuario
- registrar interacción
- mantener estado de usuario respecto a mensaje

## Persistencia

Rutas:

- `notifications_v3/system/in_app_messages/{messageId}`
- `notifications_v3/system/user_message_state/{userId_messageId}`

## Modelo `in_app_messages`

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

## Modelo `user_message_state`

Campos mínimos:

- `userId`
- `messageId`
- `openedAt`
- `clickedAt`
- `dismissedAt`
- `completedAt`
- `mutedUntil`
- `updatedAt`

## Queries cliente

### GetVisibleInAppMessages

Entrada:

- `userId`
- `currentDate`
- `limit`

Salida:

- `UserVisibleMessagesOutputDto`

Reglas:

- solo mensajes `active`
- dentro de vigencia
- visibles para el usuario

## Commands cliente

### RegisterMessageInteraction

Entrada:

- `userId`
- `messageId`
- `action`
- `occurredAt`

Acciones permitidas:

- `open`
- `click`
- `dismiss`
- `complete`

## Reglas

- un mensaje expirado no debe devolverse como visible
- `dismiss` puede ocultar el mensaje en futuras lecturas según regla de negocio
- `complete` puede cancelar secuencias futuras

## Errores semánticos

- `message_not_found`
- `message_not_visible`
- `message_interaction_invalid`

## Criterios de aceptación

- frontend obtiene mensajes listos para render
- interacción queda persistida y auditada
- reglas de visibilidad viven en backend
