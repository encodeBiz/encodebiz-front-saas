# Notifications v3 Infrastructure Layer

## Objetivo

Definir la capa de infraestructura backend de `Notifications v3`.

Incluye:

- repositorios
- adapters
- locking
- schedulers
- triggers de entrada
- delivery providers

## Principios

- infraestructura aislada de `v2`
- adapters reemplazables
- dominio y aplicación sin dependencia de SDK concreto
- writes solo bajo `notifications_v3`

## Estructura recomendada

```text
functions/src/3.0/infrastructure/notification/
  repositories/
  providers/
  schedulers/
  triggers/
  firestore/
  logging/
  observability/
```

## Repositorios requeridos

- `CampaignRepository`
- `CampaignRunRepository`
- `NotificationJobRepository`
- `InAppMessageRepository`
- `UserMessageStateRepository`

## Locking de jobs

### Objetivo

Evitar doble ejecución concurrente del mismo job.

### Estrategia recomendada

- transición `pending -> locked` en operación transaccional
- lock con `workerId`
- `lockedAt`
- timeout de lock recuperable

### Campos mínimos de lock

- `status`
- `lockedBy`
- `lockedAt`
- `lockExpiresAt`

## Delivery provider

Debe existir detrás de un puerto explícito.

Implementaciones posibles:

- Firebase Messaging para push
- persistencia `in_app` para mensajes internos

Regla:

- el dominio no conoce Firebase Messaging

## Schedulers requeridos

- processor de campañas programadas
- processor de avance de secuencias
- processor de limpieza o expiración
- processor de recuperación de locks vencidos si aplica

## Triggers de entrada

### Tipos

- eventos de dominio
- schedulers
- acciones admin
- acciones cliente

### Regla

- los triggers solo adaptan entrada
- no contienen negocio profundo

## Logging técnico

Cada adapter debe loggear con contexto:

- `campaignId`
- `runId`
- `jobId`
- `userId`
- `processor`
- `workerId`

## Timeouts y reintentos

- reintentos solo si error es recuperable
- límite máximo de intentos configurable
- no reintentar jobs cancelados o expirados

## Índices e impacto Firestore

- diseñar queries sobre jobs `pending` por `scheduledAt`
- diseñar queries por `campaignId` y `status`
- diseñar lecturas de `in_app_messages` por `userId` y vigencia

## Decisión recomendada

La infraestructura de `v3` debe ser un conjunto de adapters pequeños y especializados, no un bloque monolítico de helpers compartidos.
