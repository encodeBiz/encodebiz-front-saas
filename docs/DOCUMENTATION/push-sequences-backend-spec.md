# Push Sequences Backend Spec

## Objetivo

Definir el módulo backend de secuencias push por reglas.

## Responsabilidades

- iniciar secuencias
- planificar pasos
- ejecutar push por orden
- cortar secuencias por eventos de salida
- evitar duplicados y solapes

## Alcance

Incluye:

- campañas `kind=sequence`
- `SequenceAdvanceProcessor`
- reglas de cancelación
- planificación diferida de pasos

## Persistencia usada

- `notifications_v3/system/campaign_definitions`
- `notifications_v3/system/campaign_runs`
- `notifications_v3/system/notification_jobs`

## Flujo base

1. evento o schedule activa campaña
2. se crea `campaign_run`
3. se planifica `step 1`
4. delivery ejecuta `step 1`
5. processor evalúa si crear `step 2`
6. si hay condición de salida, se cancelan jobs pendientes

## Reglas de secuencia

- cada paso debe tener `index`
- cada paso debe tener `delay`
- cada paso puede tener condiciones propias
- la secuencia debe declarar reglas de salida

## Reglas de cancelación

Ejemplos:

- usuario volvió a sesión
- usuario completó objetivo
- usuario cambió de estado de suscripción
- campaña fue pausada o archivada

## Commands

- `LaunchCampaignRun`
- `PlanNotificationJobs`
- `DeliverNotificationJob`
- `CancelCampaignSequence`

## Processor principal

### SequenceAdvanceProcessor

Responsable de:

- inspeccionar resultado del paso actual
- comprobar reglas de salida
- programar siguiente paso si corresponde

## Riesgos específicos

- crear varios pasos simultáneamente por reintento
- no cancelar pasos tras evento de retorno
- dedupe insuficiente por step

## Errores semánticos

- `campaign_sequence_invalid`
- `notification_job_not_pending`
- `sequence_step_invalid`
- `sequence_cancelation_failed`

## Criterios de aceptación

- secuencia avanza en orden
- no se crean pasos duplicados
- secuencia se corta correctamente
- métricas por step son trazables
