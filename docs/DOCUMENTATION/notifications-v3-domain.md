# Notifications v3 Domain Layer

## Objetivo

Definir la capa de dominio de `Notifications v3` para soportar:

- campañas `in_app`
- campañas `push`
- secuencias por reglas
- segmentación por filtros
- planificación y ejecución desacopladas

Este documento describe:

- modelos de dominio
- value objects
- enums y estados
- DTOs de entrada y salida
- contratos de servicios y repositorios

No define implementación ni estructura final de carpetas. Define el lenguaje del dominio.

## Restricción estructural

La capa de dominio de `v3` no debe reutilizar el dominio operativo de `v2`.

Esto implica:

- no importar modelos de `v2`
- no extender DTOs de `v2`
- no compartir contratos de repositorio con `v2`
- no reaprovechar servicios de entrega de `v2`

La relación con `v2` debe ser solo de referencia funcional y apoyo a migración, nunca de dependencia interna.

## Restricción de persistencia

Aunque el dominio no debe depender de Firestore, la documentación de `v3` asume una estructura de persistencia agrupada bajo una raíz única:

- `notifications_v3`

Las entidades del dominio deben mapearse a subcolecciones de esa raíz, no a colecciones top-level independientes.

## Principios de modelado

- El dominio no debe depender de Firebase Functions.
- Firestore es persistencia, no modelo de negocio.
- Los DTOs viven en el borde de entrada/salida.
- Las entidades expresan reglas y estados.
- Los contratos deben permitir cambiar detalles de infraestructura sin romper el dominio.
- El dominio de `v3` debe ser autónomo respecto a `v2`.
- El vocabulario del dominio debe ser estable para frontend y para IA.

## Orientación de consumo

Este documento no está escrito solo para backend.

También debe poder ser leído por:

- frontend para entender estados, payloads y flujos observables
- producto para validar comportamiento
- IA para usarlo como base de análisis, generación de contratos y scaffolding de código

Por ello:

- los nombres deben ser explícitos
- los estados deben ser cerrados
- las transiciones deben ser predecibles
- los DTOs deben describir contratos observables por cliente

## Agregados principales

### 1. Campaign

Representa una definición reusable de comunicación.

Responsabilidades:

- identificar el canal
- contener la regla de entrada
- contener filtros y exclusiones
- definir prioridad
- definir vigencia
- definir secuencia si aplica

Campos de dominio propuestos:

- `id: string`
- `name: string`
- `description?: string`
- `channel: CampaignChannel`
- `kind: CampaignKind`
- `status: CampaignStatus`
- `trigger: CampaignTrigger`
- `audience: AudienceFilterGroup`
- `content: CampaignContentDefinition`
- `sequence?: CampaignSequence`
- `constraints: CampaignConstraints`
- `scheduleWindow?: CampaignScheduleWindow`
- `createdAt: Date`
- `updatedAt: Date`

### 2. CampaignRun

Representa una ejecución concreta de una campaña.

Responsabilidades:

- registrar el contexto de activación
- mantener el estado de la ejecución
- resumir cuántos jobs fueron generados

Campos de dominio propuestos:

- `id: string`
- `campaignId: string`
- `triggeredBy: TriggerContext`
- `runType: CampaignRunType`
- `status: CampaignRunStatus`
- `scheduledAt?: Date`
- `startedAt?: Date`
- `finishedAt?: Date`
- `summary: CampaignRunSummary`

### 3. NotificationJob

Unidad atómica de trabajo para un usuario y un paso concreto.

Responsabilidades:

- representar una intención ejecutable
- proteger la idempotencia
- gestionar transición de estados
- registrar intentos y errores

Campos de dominio propuestos:

- `id: string`
- `campaignId: string`
- `runId?: string`
- `userId: string`
- `channel: DeliveryChannel`
- `step: NotificationStep`
- `payload: NotificationPayload`
- `scheduledAt: Date`
- `status: NotificationJobStatus`
- `dedupeKey: string`
- `attempts: number`
- `lastError?: JobError`
- `metadata?: NotificationJobMetadata`

### 4. InAppMessage

Representa un mensaje visible por el usuario dentro de la app.

Responsabilidades:

- exponer contenido renderizable
- controlar vigencia
- mantener prioridad visual

Campos de dominio propuestos:

- `id: string`
- `campaignId: string`
- `jobId: string`
- `userId: string`
- `status: InAppMessageStatus`
- `title: string`
- `body: string`
- `cta?: InAppCallToAction`
- `priority: MessagePriority`
- `startAt: Date`
- `endAt?: Date`
- `metadata?: Record<string, unknown>`

### 5. UserMessageState

Representa el estado de interacción de un usuario sobre un mensaje.

Responsabilidades:

- registrar apertura
- registrar click
- registrar dismiss
- registrar completion
- soportar silencios temporales

Campos de dominio propuestos:

- `id: string`
- `userId: string`
- `messageId: string`
- `openedAt?: Date`
- `clickedAt?: Date`
- `dismissedAt?: Date`
- `completedAt?: Date`
- `mutedUntil?: Date`

## Value Objects

### AudienceFilter

Representa una condición simple.

Campos:

- `field: string`
- `operator: FilterOperator`
- `value: Primitive | Primitive[]`

### AudienceFilterGroup

Representa una composición de filtros.

Campos:

- `operator: LogicalOperator`
- `filters: AudienceFilter[]`
- `groups?: AudienceFilterGroup[]`

### CampaignTrigger

Describe cómo entra una campaña.

Campos:

- `type: TriggerType`
- `eventName?: string`
- `schedule?: CronExpression`
- `source?: string`

### CampaignSequence

Define pasos secuenciales.

Campos:

- `steps: SequenceStep[]`
- `cancelOn: ExitRule[]`
- `maxSteps?: number`

### SequenceStep

Campos:

- `index: number`
- `delay: DelayDefinition`
- `content: CampaignContentDefinition`
- `conditions?: AudienceFilterGroup`

### CampaignContentDefinition

Describe el contenido abstracto de la campaña.

Campos:

- `title: string`
- `body: string`
- `cta?: InAppCallToAction`
- `deeplink?: string`
- `templateId?: string`
- `variables?: Record<string, Primitive>`

### CampaignConstraints

Agrupa restricciones de ejecución.

Campos:

- `maxPerUser?: number`
- `cooldownHours?: number`
- `respectQuietHours: boolean`
- `requirePushToken?: boolean`
- `cancelIfGoalCompleted?: boolean`
- `allowReentry?: boolean`

### NotificationStep

Campos:

- `index: number`
- `name: string`
- `kind: NotificationStepKind`

### NotificationPayload

Representa la carga lista para ejecutar.

Campos:

- `title: string`
- `body: string`
- `data?: Record<string, string>`
- `deeplink?: string`
- `imageUrl?: string`

### JobError

Campos:

- `code: string`
- `message: string`
- `retryable: boolean`
- `happenedAt: Date`

### InAppCallToAction

Campos:

- `label: string`
- `action: 'deeplink' | 'route' | 'external_url' | 'dismiss'`
- `value?: string`

### CampaignScheduleWindow

Campos:

- `startAt?: Date`
- `endAt?: Date`
- `timezone?: string`
- `quietHours?: QuietHours`

### QuietHours

Campos:

- `enabled: boolean`
- `start: string`
- `end: string`
- `timezone: string`

### TriggerContext

Describe el contexto real que disparó una campaña o job.

Campos:

- `type: TriggerType`
- `eventName?: string`
- `sourceId?: string`
- `sourceCollection?: string`
- `triggeredAt: Date`
- `metadata?: Record<string, Primitive>`

### CampaignRunSummary

Campos:

- `scannedUsers: number`
- `matchedUsers: number`
- `createdJobs: number`
- `sentJobs?: number`
- `failedJobs?: number`
- `cancelledJobs?: number`

### NotificationJobMetadata

Campos:

- `campaignName?: string`
- `entryEvent?: string`
- `stepName?: string`
- `tags?: string[]`
- `custom?: Record<string, Primitive>`

### CronExpression

Representa una expresión cron persistida como texto.

```ts
type CronExpression = string;
```

### ExitRule

Campos:

- `type: 'event' | 'state_change' | 'time_limit' | 'manual'`
- `eventName?: string`
- `field?: string`
- `operator?: FilterOperator`
- `value?: Primitive | Primitive[]`
- `timeoutHours?: number`

### DelayDefinition

Campos:

- `amount: number`
- `unit: 'minutes' | 'hours' | 'days'`

## Tipos base recomendados

```ts
type Primitive = string | number | boolean | null;
```

## Enums de dominio

### CampaignChannel

```ts
type CampaignChannel = 'in_app' | 'push';
```

### CampaignKind

```ts
type CampaignKind = 'single' | 'sequence';
```

### CampaignStatus

```ts
type CampaignStatus = 'draft' | 'active' | 'paused' | 'archived';
```

### TriggerType

```ts
type TriggerType = 'event' | 'schedule' | 'manual';
```

### CampaignRunType

```ts
type CampaignRunType = 'segment_snapshot' | 'per_user' | 'scheduled_batch';
```

### CampaignRunStatus

```ts
type CampaignRunStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';
```

### DeliveryChannel

```ts
type DeliveryChannel = 'in_app' | 'push';
```

### NotificationJobStatus

```ts
type NotificationJobStatus =
  | 'pending'
  | 'locked'
  | 'sent'
  | 'failed'
  | 'cancelled'
  | 'expired';
```

### InAppMessageStatus

```ts
type InAppMessageStatus = 'active' | 'hidden' | 'expired';
```

### MessagePriority

```ts
type MessagePriority = 'low' | 'normal' | 'high' | 'critical';
```

### NotificationStepKind

```ts
type NotificationStepKind = 'entry' | 'reminder' | 'followup' | 'final';
```

### FilterOperator

```ts
type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'not_in'
  | 'contains'
  | 'exists';
```

### LogicalOperator

```ts
type LogicalOperator = 'and' | 'or';
```

## Contratos de entrada y salida

Estos DTOs deben considerarse la base de conversación entre:

- backend
- frontend
- herramientas IA

No son solo artefactos técnicos internos. Son contratos semánticos.

### CampaignCreateInputDto

DTO de creación de campaña desde panel interno o API administrativa.

Campos:

- `name`
- `description`
- `channel`
- `kind`
- `trigger`
- `audience`
- `content`
- `sequence?`
- `constraints`
- `scheduleWindow?`

### CampaignUpdateInputDto

DTO parcial para edición.

Campos:

- todos los de `CampaignCreateInputDto` como opcionales
- `status?`

### CampaignOutputDto

Representación de salida para lectura.

Campos:

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

### EvaluateAudienceInputDto

Entrada para evaluar audiencia de una campaña.

Campos:

- `campaignId`
- `triggerContext`
- `cursor?`
- `limit?`

### EvaluateAudienceOutputDto

Salida de evaluación de audiencia.

Campos:

- `campaignId`
- `matchedUsers: string[]`
- `scannedUsers: number`
- `matchedCount: number`
- `nextCursor?: string`

### CreateCampaignRunInputDto

Campos:

- `campaignId`
- `triggeredBy`
- `runType`
- `scheduledAt?`

### CreateNotificationJobInputDto

Campos:

- `campaignId`
- `runId?`
- `userId`
- `channel`
- `step`
- `payload`
- `scheduledAt`
- `metadata?`

### NotificationJobOutputDto

Campos:

- `id`
- `campaignId`
- `runId`
- `userId`
- `channel`
- `step`
- `status`
- `scheduledAt`
- `attempts`
- `lastError`

### InAppMessageOutputDto

Campos:

- `id`
- `campaignId`
- `userId`
- `status`
- `title`
- `body`
- `cta`
- `priority`
- `startAt`
- `endAt`

### UserVisibleMessagesInputDto

Campos:

- `userId`
- `currentDate`
- `limit?`

### UserVisibleMessagesOutputDto

Campos:

- `messages: InAppMessageOutputDto[]`

### RegisterMessageInteractionInputDto

Campos:

- `userId`
- `messageId`
- `action: 'open' | 'click' | 'dismiss' | 'complete'`
- `occurredAt`

### DeliveryAttemptResultDto

Campos:

- `jobId`
- `status`
- `providerMessageId?`
- `errorCode?`
- `errorMessage?`
- `processedAt`

## Contratos de servicios de dominio

### CampaignService

Responsabilidad:

- crear
- actualizar
- activar
- pausar
- archivar campañas

Contrato propuesto:

```ts
interface CampaignService {
  create(input: CampaignCreateInputDto): Promise<Campaign>;
  update(id: string, input: CampaignUpdateInputDto): Promise<Campaign>;
  activate(id: string): Promise<Campaign>;
  pause(id: string): Promise<Campaign>;
  archive(id: string): Promise<Campaign>;
  getById(id: string): Promise<Campaign | null>;
}
```

### AudienceEvaluationService

Responsabilidad:

- evaluar reglas y filtros
- devolver usuarios candidatos

```ts
interface AudienceEvaluationService {
  evaluate(input: EvaluateAudienceInputDto): Promise<EvaluateAudienceOutputDto>;
}
```

### CampaignRunService

Responsabilidad:

- abrir y cerrar ejecuciones
- registrar métricas resumidas

```ts
interface CampaignRunService {
  create(input: CreateCampaignRunInputDto): Promise<CampaignRun>;
  start(id: string): Promise<CampaignRun>;
  complete(id: string, summary: CampaignRunSummary): Promise<CampaignRun>;
  fail(id: string, reason: string): Promise<CampaignRun>;
}
```

### NotificationPlanningService

Responsabilidad:

- convertir campañas y usuarios en jobs concretos
- aplicar deduplicación y restricciones

```ts
interface NotificationPlanningService {
  planJobs(
    campaign: Campaign,
    users: string[],
    context: TriggerContext
  ): Promise<NotificationJob[]>;
}
```

### NotificationDeliveryService

Responsabilidad:

- ejecutar jobs pendientes
- enviar push o materializar in-app

```ts
interface NotificationDeliveryService {
  deliver(job: NotificationJob): Promise<DeliveryAttemptResultDto>;
}
```

### InAppMessageService

Responsabilidad:

- crear mensajes visibles
- listar mensajes activos
- registrar interacción

```ts
interface InAppMessageService {
  createFromJob(job: NotificationJob): Promise<InAppMessage>;
  getVisibleMessages(input: UserVisibleMessagesInputDto): Promise<UserVisibleMessagesOutputDto>;
  registerInteraction(input: RegisterMessageInteractionInputDto): Promise<void>;
}
```

### SequenceOrchestratorService

Responsabilidad:

- avanzar pasos de campañas secuenciales
- cancelar secuencias por reglas de salida

```ts
interface SequenceOrchestratorService {
  scheduleNextStep(job: NotificationJob): Promise<NotificationJob | null>;
  cancelPendingSteps(campaignId: string, userId: string, reason: string): Promise<number>;
}
```

## Contratos de repositorio

### CampaignRepository

```ts
interface CampaignRepository {
  save(campaign: Campaign): Promise<Campaign>;
  findById(id: string): Promise<Campaign | null>;
  findActive(): Promise<Campaign[]>;
}
```

### CampaignRunRepository

```ts
interface CampaignRunRepository {
  save(run: CampaignRun): Promise<CampaignRun>;
  findById(id: string): Promise<CampaignRun | null>;
  updateStatus(id: string, status: CampaignRunStatus): Promise<void>;
}
```

### NotificationJobRepository

```ts
interface NotificationJobRepository {
  save(job: NotificationJob): Promise<NotificationJob>;
  saveMany(jobs: NotificationJob[]): Promise<NotificationJob[]>;
  findPendingDue(now: Date, limit: number): Promise<NotificationJob[]>;
  findByDedupeKey(dedupeKey: string): Promise<NotificationJob | null>;
  updateStatus(id: string, status: NotificationJobStatus): Promise<void>;
  appendError(id: string, error: JobError): Promise<void>;
}
```

### InAppMessageRepository

```ts
interface InAppMessageRepository {
  save(message: InAppMessage): Promise<InAppMessage>;
  findVisibleByUser(userId: string, now: Date, limit: number): Promise<InAppMessage[]>;
}
```

### UserMessageStateRepository

```ts
interface UserMessageStateRepository {
  save(state: UserMessageState): Promise<UserMessageState>;
  findByUserAndMessage(userId: string, messageId: string): Promise<UserMessageState | null>;
}
```

## Contrato de proveedor externo

El dominio no debe depender del SDK concreto de Firebase Messaging.

Se recomienda un puerto explícito:

```ts
interface PushProvider {
  sendToUser(userId: string, payload: NotificationPayload): Promise<DeliveryAttemptResultDto>;
  sendToToken(token: string, payload: NotificationPayload): Promise<DeliveryAttemptResultDto>;
  sendToTopic(topic: string, payload: NotificationPayload): Promise<DeliveryAttemptResultDto>;
}
```

## Contrato de reloj

Para soportar testabilidad:

```ts
interface Clock {
  now(): Date;
}
```

## Contrato de deduplicación

```ts
interface DedupeKeyFactory {
  build(input: {
    campaignId: string;
    userId: string;
    channel: DeliveryChannel;
    stepIndex: number;
    windowKey?: string;
  }): string;
}
```

## Reglas de dominio mínimas

### Campaign

- una campaña `archived` no puede reactivarse sin proceso explícito
- una campaña `sequence` debe tener al menos un paso
- una campaña `single` no debe tener secuencia con más de un paso

### NotificationJob

- un job `sent` no puede volver a `pending`
- un job `cancelled` no puede ejecutarse
- un job debe tener `dedupeKey`
- un job `push` puede requerir token o topic resoluble

### InAppMessage

- un mensaje expirado no debe listarse como visible
- un mensaje oculto no debe volver a activo sin acción explícita

### UserMessageState

- `clickedAt` no debería existir sin `openedAt`, salvo decisión explícita de negocio
- `completedAt` implica que futuras secuencias relacionadas pueden cancelarse

## Mapeo sugerido con archivos TypeScript

Patrón alineado al repositorio actual:

- `notifications.d.ts`
- `notifications.zod.ts`
- `application/...`
- `services/...`

Propuesta orientativa:

- `functions/src/3.0/domain/notification/notification.d.ts`
- `functions/src/3.0/domain/notification/notification.zod.ts`
- `functions/src/3.0/domain/notification/notification.dto.ts`
- `functions/src/3.0/domain/notification/notification.contracts.ts`

### Regla de aislamiento

La carpeta `3.0` debe ser autónoma.

No debe importar implementaciones de:

- `functions/src/2.0/...`
- `functions/src/domain/notifications/...`

Si se requiere funcionalidad equivalente, debe duplicarse o rediseñarse dentro del namespace `3.0`.

### Regla de persistencia

La infraestructura de `3.0` debe mapear estas entidades bajo:

- `notifications_v3/system/campaign_definitions`
- `notifications_v3/system/campaign_runs`
- `notifications_v3/system/notification_jobs`
- `notifications_v3/system/in_app_messages`
- `notifications_v3/system/user_message_state`

## Decisión recomendada

La capa de dominio de `v3` debe modelar primero:

- `Campaign`
- `CampaignRun`
- `NotificationJob`
- `InAppMessage`
- `UserMessageState`

Y debe separar claramente:

- entidades de negocio
- DTOs de entrada/salida
- contratos de repositorios
- contratos de servicios

En una frase:

`La unidad central del dominio no es el push; es el job de comunicación gobernado por una campaña.`

Y a nivel estructural:

`La unidad de evolución no es la reutilización de v2; es una nueva capa de dominio preparada para reemplazarla.`
