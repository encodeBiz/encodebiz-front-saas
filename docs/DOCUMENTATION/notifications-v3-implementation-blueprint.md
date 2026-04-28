# Notifications v3 Implementation Blueprint

## Objetivo

Definir la primera versión de implementación de `Notifications v3` a nivel de:

- carpetas
- archivos
- responsabilidades
- dependencias entre módulos
- orden de construcción

Este documento sirve como blueprint directo para el equipo backend.

## Restricción principal

Toda la implementación debe vivir en:

```text
functions/src/3.0/
```

Y no debe importar implementaciones operativas de:

```text
functions/src/2.0/
functions/src/domain/notifications/
```

## Estructura de carpetas recomendada

```text
functions/src/3.0/
  notification/
    domain/
      campaign/
      campaign-run/
      notification-job/
      in-app-message/
      user-message-state/
      shared/
    application/
      commands/
      queries/
      processors/
      dto/
      mappers/
      contracts/
    infrastructure/
      repositories/
      providers/
      schedulers/
      triggers/
      firestore/
      observability/
      config/
    interfaces/
      http/
      admin/
      client/
      internal/
    index.ts
```

## Regla de segmentación interna

El bounded context recomendado es `notification`.

No separar todavía por múltiples contextos más pequeños porque:

- aumentaría la fricción inicial
- duplicaría wiring
- complica una primera versión

## Dominio

### Carpeta

```text
functions/src/3.0/notification/domain/
```

### Objetivo

Contener el lenguaje del negocio sin dependencia de Firebase ni HTTP.

### Archivos mínimos recomendados

```text
domain/
  campaign/
    campaign.d.ts
    campaign.zod.ts
    campaign.errors.ts
    campaign.constants.ts
  campaign-run/
    campaign-run.d.ts
    campaign-run.zod.ts
    campaign-run.constants.ts
  notification-job/
    notification-job.d.ts
    notification-job.zod.ts
    notification-job.errors.ts
    notification-job.constants.ts
  in-app-message/
    in-app-message.d.ts
    in-app-message.zod.ts
    in-app-message.constants.ts
  user-message-state/
    user-message-state.d.ts
    user-message-state.zod.ts
  shared/
    notification-types.d.ts
    notification-errors.d.ts
    notification-enums.ts
    notification-value-objects.zod.ts
```

### Responsabilidades por archivo

#### `campaign.d.ts`

- tipo `Campaign`
- tipos relacionados a trigger, constraints, content y sequence

#### `campaign.zod.ts`

- validación estructural de campañas

#### `campaign.errors.ts`

- errores semánticos de campaña

#### `campaign-run.d.ts`

- tipo `CampaignRun`
- tipo `CampaignRunSummary`

#### `notification-job.d.ts`

- tipo `NotificationJob`
- tipos `JobError`, `DedupeKeyParts`, `NotificationPayload`

#### `notification-job.zod.ts`

- validación de jobs

#### `in-app-message.d.ts`

- tipo `InAppMessage`
- tipo `InAppCallToAction`

#### `user-message-state.d.ts`

- tipo `UserMessageState`

#### `notification-enums.ts`

- todos los enums persistidos como string

## Aplicación

### Carpeta

```text
functions/src/3.0/notification/application/
```

### Objetivo

Orquestar casos de uso y coordinar dominio con infraestructura.

### Archivos mínimos recomendados

```text
application/
  dto/
    campaign.dto.ts
    campaign-run.dto.ts
    notification-job.dto.ts
    in-app-message.dto.ts
    interaction.dto.ts
  contracts/
    repositories.contracts.ts
    providers.contracts.ts
    processors.contracts.ts
    services.contracts.ts
  mappers/
    campaign.mapper.ts
    campaign-run.mapper.ts
    notification-job.mapper.ts
    in-app-message.mapper.ts
  commands/
    create-campaign.command.ts
    update-campaign.command.ts
    activate-campaign.command.ts
    pause-campaign.command.ts
    archive-campaign.command.ts
    launch-campaign-run.command.ts
    plan-notification-jobs.command.ts
    lock-notification-job.command.ts
    deliver-notification-job.command.ts
    register-message-interaction.command.ts
    cancel-campaign-sequence.command.ts
  queries/
    get-campaign-by-id.query.ts
    list-campaigns.query.ts
    list-active-campaigns.query.ts
    get-campaign-run-by-id.query.ts
    list-campaign-runs.query.ts
    get-notification-job-by-id.query.ts
    list-pending-notification-jobs.query.ts
    get-visible-in-app-messages.query.ts
    get-message-interaction-state.query.ts
  processors/
    evaluate-audience.processor.ts
    scheduled-campaign.processor.ts
    domain-event-campaign.processor.ts
    notification-job-delivery.processor.ts
    sequence-advance.processor.ts
```

### Orden recomendado de implementación

1. `dto/`
2. `contracts/`
3. `mappers/`
4. commands de campañas
5. queries de campañas
6. command de planificación de jobs
7. command de locking
8. command de delivery
9. query de `in_app`
10. command de interacción
11. processors

### Reglas

- commands no dependen de HTTP
- queries no mutan estado
- processors deben ser idempotentes

## Infraestructura

### Carpeta

```text
functions/src/3.0/notification/infrastructure/
```

### Objetivo

Implementar persistencia, providers y scheduling.

### Archivos mínimos recomendados

```text
infrastructure/
  config/
    notification.config.ts
  firestore/
    firestore-paths.ts
    firestore-client.ts
    firestore-transaction.helpers.ts
  repositories/
    firestore-campaign.repository.ts
    firestore-campaign-run.repository.ts
    firestore-notification-job.repository.ts
    firestore-in-app-message.repository.ts
    firestore-user-message-state.repository.ts
  providers/
    firebase-push.provider.ts
    in-app-message.provider.ts
    clock.provider.ts
    dedupe-key.factory.ts
  schedulers/
    scheduled-campaign.scheduler.ts
    sequence-advance.scheduler.ts
    stale-lock-recovery.scheduler.ts
  triggers/
    user-events.trigger.ts
    subscription-events.trigger.ts
    manual-run.trigger.ts
  observability/
    notification.logger.ts
    notification.metrics.ts
```

### Responsabilidades clave

#### `firestore-paths.ts`

- centralizar rutas de `notifications_v3/system/*`

#### `firestore-notification-job.repository.ts`

- save
- saveMany
- findPendingDue
- lockJob
- updateStatus
- appendError

#### `firebase-push.provider.ts`

- delivery push desacoplado del dominio

#### `dedupe-key.factory.ts`

- creación consistente de `dedupeKey`

#### `scheduled-campaign.scheduler.ts`

- detectar campañas temporales
- disparar runs

#### `stale-lock-recovery.scheduler.ts`

- recuperar jobs `locked` expirados si se adopta esa estrategia

## Interfaces

### Carpeta

```text
functions/src/3.0/notification/interfaces/
```

### Objetivo

Exponer entrada HTTP o interna sin contaminar aplicación.

### Archivos mínimos recomendados

```text
interfaces/
  http/
    notification.routes.ts
    notification.middlewares.ts
    notification.responses.ts
  admin/
    campaign-admin.controller.ts
    campaign-run-admin.controller.ts
  client/
    in-app-message.controller.ts
    message-interaction.controller.ts
  internal/
    notification-internal.controller.ts
```

### Reglas

- controller adapta request a DTO
- controller invoca command o query
- controller mapea errores a response HTTP

## Archivo `index.ts`

### Ruta

```text
functions/src/3.0/notification/index.ts
```

### Objetivo

- exportar wiring principal del módulo
- exponer handlers públicos e internos
- centralizar bootstrap del bounded context

## Secuencia de construcción recomendada

### Sprint técnico 1

- estructura de carpetas
- dominio completo
- DTOs
- contracts
- paths Firestore

### Sprint técnico 2

- repositorios de campañas y runs
- commands y queries de campañas
- endpoints admin mínimos

### Sprint técnico 3

- repositorio de jobs
- dedupe factory
- locking
- planning command

### Sprint técnico 4

- `in_app` provider
- queries cliente
- interacción de mensajes

### Sprint técnico 5

- push provider
- delivery command
- processor de jobs

### Sprint técnico 6

- secuencias push
- sequence advance
- cancelación por eventos

### Sprint técnico 7

- observabilidad
- hardening
- rollout controlado

## Prioridad de implementación real

Si hay que recortar alcance, construir en este orden:

1. campañas
2. jobs
3. `in_app`
4. push simple
5. secuencias push
6. métricas avanzadas

## Definition of Done por módulo

### Campaigns

- commands operativos
- queries operativas
- persistencia correcta
- validación completa

### Jobs

- dedupe funcionando
- locking funcionando
- estados trazables

### In-app

- listado visible por usuario
- interacción persistida

### Push sequences

- step 1 y step 2 operativos
- cancelación fiable

## Checklist antes de empezar código

- nombres de carpetas aprobados
- naming de DTOs aprobado
- naming de enums aprobado
- paths Firestore aprobados
- owners por módulo asignados

## Decisión recomendada

No abrir todos los archivos a la vez.

Construir verticalmente, pero respetando esta base:

- primero estructura
- luego dominio
- luego aplicación
- luego persistencia
- luego interfaces

En una frase:

`La primera versión debe ser pequeña, aislada y coherente; no una migración disimulada de v2.`
