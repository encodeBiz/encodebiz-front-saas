# Notifications v3 Events

## Objetivo

Definir los eventos que pueden activar `Notifications v3`.

## Eventos de entrada backend

### Tipos

- `user_created`
- `user_updated`
- `subscription_changed`
- `plan_changed`
- `program_completed`
- `user_became_inactive`
- `manual_campaign_run_requested`
- `sequence_step_due`

## Eventos emitidos por frontend

### Relevantes para secuencias y tracking

- `in_app_opened`
- `in_app_clicked`
- `in_app_dismissed`
- `in_app_completed`
- `session_started`
- `program_opened`
- `workout_started`
- `workout_completed`

## Reglas

- frontend emite eventos observables, no decisiones de negocio
- backend interpreta eventos y decide campañas
- eventos deben incluir `userId` o contexto resoluble

## TriggerContext mínimo

- `type`
- `eventName`
- `triggeredAt`
- `sourceId?`
- `sourceCollection?`
- `metadata?`

## Casos de activación

- evento directo crea `campaign_run`
- evento directo crea jobs inmediatos
- evento programa siguiente paso
- evento cancela secuencia activa

## Regla crítica

Un evento nunca debe crear duplicados si se reentrega. La capa de aplicación debe usar deduplicación e idempotencia.
