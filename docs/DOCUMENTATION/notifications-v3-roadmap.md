# Notifications v3 Roadmap

## Objetivo

Definir el plan de ejecución completo para construir `Notifications v3` como una plataforma nueva, aislada de `v2`, con una transición ordenada y una deprecación controlada de la versión actual.

Este roadmap está redactado como documento operativo para:

- arquitectura
- backend
- frontend
- producto
- QA
- asistentes IA usados como soporte de diseño e implementación

## Decisión ejecutiva

`Notifications v3` no será una evolución incremental de `v2`.

Será una nueva capa funcional y técnica bajo un namespace propio, con:

- dominio nuevo
- aplicación nueva
- infraestructura nueva
- persistencia nueva
- contratos nuevos

La única relación con `v2` será:

- referencia funcional
- soporte para migración
- comparación de comportamiento

Nunca dependencia interna.

## Restricciones no negociables

- `v3` no reutiliza código operativo de `v2`
- `v3` no comparte writes operativos con `v2`
- `v3` no comparte triggers, handlers ni jobs con `v2`
- `v3` debe vivir bajo la raíz `notifications_v3`
- `v3` debe poder activarse y validarse sin modificar internals de `v2`
- `v2` debe quedar preparada para deprecación una vez validado el reemplazo

## Alcance del roadmap

Este roadmap cubre:

- notificaciones `in_app` basadas en filtros
- notificaciones `push` simples
- secuencias `push` por reglas
- tracking de interacción
- observabilidad mínima operativa
- estrategia de migración y deprecación

No cubre todavía:

- editor visual avanzado de campañas
- motor de experimentación A/B
- analítica avanzada multi-touch
- personalización por IA en tiempo real

## Resultado esperado

Al cerrar este roadmap, el equipo debe tener:

- una `v3` aislada y operativa
- contratos claros para frontend
- reglas trazables por campaña, usuario y job
- delivery idempotente
- métricas y logs suficientes para operar
- una vía segura para apagar `v2`

## Estructura técnica objetivo

### Código

Propuesta:

```text
functions/src/3.0/
  domain/
  application/
  infrastructure/
  interfaces/
```

### Persistencia

Toda la operación de `v3` debe vivir bajo:

- `notifications_v3/system`

Subcolecciones:

- `notifications_v3/system/campaign_definitions`
- `notifications_v3/system/campaign_runs`
- `notifications_v3/system/notification_jobs`
- `notifications_v3/system/in_app_messages`
- `notifications_v3/system/user_message_state`

## Fase 0. Definición funcional cerrada

### Objetivo

Congelar el alcance funcional antes de construir.

### Tareas

- definir campañas iniciales de negocio
- definir filtros realmente disponibles en plataforma
- definir eventos de entrada soportados
- definir reglas de secuencia
- definir reglas de salida y cancelación
- definir quiet hours, cooldowns y frequency caps
- definir reporting mínimo esperado por negocio

### Entregables

- documento funcional aprobado
- lista priorizada de campañas MVP
- catálogo de filtros y eventos
- reglas de exclusión y prioridad

### Dependencias

- validación de producto
- validación de backend sobre datos reales
- validación de frontend sobre eventos que puede emitir

### Riesgos

- asumir datos que no existen
- definir campañas sin fuente de verdad clara
- no cerrar cómo se corta una secuencia

### Criterio de aceptación

- no quedan ambigüedades funcionales abiertas para MVP

## Fase 1. Arquitectura y contratos

### Objetivo

Cerrar el diseño técnico base de `v3`.

### Tareas

- cerrar estructura `3.0`
- cerrar entidades y DTOs
- cerrar commands, queries y processors
- cerrar estrategia de persistencia en `notifications_v3`
- cerrar estrategia de idempotencia
- cerrar estrategia de locking de jobs
- cerrar estrategia de errores semánticos
- cerrar estrategia de observabilidad

### Entregables

- documentación de arquitectura
- documentación de dominio
- documentación de aplicación
- borrador de interfaz/API
- roadmap aprobado

### Dependencias

- fase 0 cerrada

### Riesgos

- definir contratos demasiado acoplados a implementación
- no documentar bien estados observables por frontend

### Criterio de aceptación

- backend y frontend aceptan el vocabulario y los contratos base

## Fase 2. Dominio

### Objetivo

Construir el lenguaje del negocio de `v3`.

### Tareas

- implementar `Campaign`
- implementar `CampaignRun`
- implementar `NotificationJob`
- implementar `InAppMessage`
- implementar `UserMessageState`
- implementar enums, value objects e invariantes
- implementar errores semánticos del dominio
- implementar schemas de validación de entrada

### Entregables

- tipos de dominio
- DTOs
- contracts de repositorio y servicios
- tests unitarios de dominio

### Dependencias

- fase 1 cerrada

### Riesgos

- sobrecargar dominio con detalles de infraestructura
- no definir invariantes de transición desde el principio

### Criterio de aceptación

- dominio aislado, testeable y sin imports de `v2`

## Fase 3. Aplicación

### Objetivo

Orquestar los casos de uso de negocio.

### Tareas

- implementar `CreateCampaignCommand`
- implementar `UpdateCampaignCommand`
- implementar `ActivateCampaignCommand`
- implementar `PauseCampaignCommand`
- implementar `ArchiveCampaignCommand`
- implementar `LaunchCampaignRunCommand`
- implementar `PlanNotificationJobsCommand`
- implementar `LockNotificationJobCommand`
- implementar `DeliverNotificationJobCommand`
- implementar `RegisterMessageInteractionCommand`
- implementar `CancelCampaignSequenceCommand`
- implementar queries de lectura
- implementar processors de evaluación, scheduling, delivery y secuencia

### Entregables

- capa de aplicación operativa
- tests de aplicación
- catálogo de flujos felices y de fallo

### Dependencias

- fase 2 cerrada

### Riesgos

- mezclar lógica de dominio en commands
- procesadores no idempotentes
- transiciones silenciosas de estado

### Criterio de aceptación

- casos de uso ejecutables con mocks o adapters controlados

## Fase 4. Infraestructura

### Objetivo

Construir los adapters de `v3` sin contaminar dominio ni aplicación.

### Tareas

- implementar repositorios Firestore sobre `notifications_v3/system/*`
- implementar locking transaccional de jobs
- implementar provider de push
- implementar lectura de mensajes `in_app`
- implementar writer de `user_message_state`
- implementar scheduler adapters
- implementar trigger adapters para eventos de entrada
- implementar factories de dedupe y reloj

### Entregables

- adapters de infraestructura
- tests de integración
- configuración de entorno y colecciones

### Dependencias

- fase 3 cerrada

### Riesgos

- locking débil
- duplicación de jobs por reintentos
- payloads mal normalizados

### Criterio de aceptación

- jobs y mensajes persisten correctamente bajo `notifications_v3`

## Fase 5. Interfaz/API

### Objetivo

Definir y construir la interfaz consumible por frontend y backoffice.

### Tareas

- definir endpoints o handlers admin de campañas
- definir endpoint de lectura de `in_app`
- definir endpoint de interacción de mensajes
- definir auth por actor
- definir responses estables
- definir catálogo de errores de aplicación
- documentar ejemplos request/response

### Entregables

- contratos de interfaz
- ejemplos de integración para frontend
- documentación de errores y auth

### Dependencias

- fase 3 estable
- criterios de frontend cerrados

### Riesgos

- contratos ambiguos
- respuestas demasiado acopladas a Firestore
- frontend obligado a reconstruir negocio

### Criterio de aceptación

- frontend puede integrar sin consultar internals de backend

## Fase 6. MVP vertical

### Objetivo

Sacar valor real en staging y luego en producción controlada.

### MVP recomendado

#### Flujo A

- campaña `in_app` por inactividad simple
- consulta de mensajes visibles
- tracking de apertura y dismiss

#### Flujo B

- push de reactivación paso 1
- push de reactivación paso 2
- cancelación de secuencia por retorno del usuario

### Tareas

- habilitar campaña de prueba
- validar audiencia
- validar dedupe
- validar estados de job
- validar experiencia frontend

### Entregables

- primer flujo `in_app` completo
- primer flujo `push sequence` completo
- dashboard mínimo operativo

### Dependencias

- fases 4 y 5 cerradas

### Riesgos

- ruido en datos de usuario
- exceso de notificaciones
- mal corte de secuencia

### Criterio de aceptación

- staging funcional y producción piloto con audiencia limitada

## Fase 7. Observabilidad y operación

### Objetivo

Hacer operable `v3` sin depender de debugging manual.

### Tareas

- logs estructurados por `campaignId`, `runId`, `jobId`, `userId`
- métricas de jobs creados, pendientes, enviados, fallidos y cancelados
- métricas de `open`, `click`, `dismiss`, `complete`
- alertas de backlog
- alertas de ratio de fallo
- alertas de locks atascados

### Entregables

- panel mínimo de operación
- runbook de incidencias
- convenciones de logging

### Dependencias

- MVP vertical funcionando

### Riesgos

- ceguera operativa
- imposibilidad de auditar por qué un usuario recibió algo

### Criterio de aceptación

- se puede investigar un incidente sin revisar el sistema a ciegas

## Fase 8. Validación en producción controlada

### Objetivo

Introducir `v3` de forma segura.

### Tareas

- activar campañas piloto
- limitar audiencia
- validar métricas
- comparar comportamiento con expectativas de negocio
- revisar errores reales y edge cases

### Entregables

- informe de piloto
- ajustes de reglas
- lista de hardening

### Dependencias

- observabilidad operativa

### Riesgos

- lanzar demasiado tráfico demasiado pronto
- falta de gating por feature flag

### Criterio de aceptación

- piloto estable con métricas aceptables

## Fase 9. Migración funcional y deprecación de v2

### Objetivo

Retirar `v2` sin dejar deuda estructural.

### Tareas

- congelar nuevas reglas en `v2`
- migrar campañas priorizadas a `v3`
- validar equivalencia funcional donde aplique
- desactivar writes nuevos de `v2`
- desactivar triggers operativos de `v2`
- archivar documentación y runbooks de `v2`

### Entregables

- plan de apagado
- checklist de deprecación
- inventario de piezas retiradas

### Dependencias

- `v3` estable en producción

### Riesgos

- convivir indefinidamente con dos motores
- dejar integraciones colgando

### Criterio de aceptación

- `v2` deja de ser parte del flujo operativo

## Ownership recomendado

### Arquitectura

Responsable de:

- contratos
- ADRs
- decisiones de frontera entre capas
- control de no solape con `v2`

### Backend dominio/aplicación

Responsable de:

- entidades
- commands
- queries
- processors
- reglas de estado

### Backend infraestructura

Responsable de:

- Firestore
- locking
- schedulers
- delivery adapters
- observabilidad

### Frontend

Responsable de:

- consumo de `in_app`
- reporting de interacción
- representación de estados
- validación de contratos cliente

### Producto

Responsable de:

- priorización de campañas
- validación funcional
- criterios de negocio

### QA

Responsable de:

- secuencias
- exclusiones
- duplicados
- errores semánticos
- pruebas end-to-end

## Dependencias cruzadas clave

- frontend debe cerrar pronto los eventos que puede emitir
- backend debe cerrar pronto el catálogo real de filtros disponibles
- producto debe priorizar primero campañas simples, no edge cases complejos
- observabilidad debe salir en paralelo al MVP, no al final

## Riesgos estratégicos

### Riesgo 1. Reutilización encubierta de `v2`

Impacto:

- deuda estructural inmediata

Mitigación:

- revisión de imports
- revisión de boundaries
- namespace `3.0` obligatorio

### Riesgo 2. Dedupe insuficiente

Impacto:

- duplicados de mensajes
- pérdida de confianza del usuario

Mitigación:

- `dedupeKey` definida desde fase 1
- tests de concurrencia y reintento

### Riesgo 3. Falta de eventos fiables del cliente

Impacto:

- secuencias mal cortadas
- métricas poco fiables

Mitigación:

- contrato explícito de eventos frontend
- validación en staging

### Riesgo 4. Observabilidad tardía

Impacto:

- sistema difícil de operar

Mitigación:

- logs y métricas desde MVP

## Métricas de éxito

- tiempo medio de entrega de job
- ratio de jobs duplicados igual a cero funcional
- ratio de jobs fallidos dentro de umbral aceptable
- porcentaje de campañas trazables end-to-end
- tiempo de diagnóstico de incidente reducido
- migración completa de campañas objetivo a `v3`

## Checkpoints ejecutivos

### Checkpoint A

- definición cerrada
- arquitectura aprobada

### Checkpoint B

- dominio y aplicación completos
- infraestructura base lista

### Checkpoint C

- MVP vertical funcional
- frontend integrado

### Checkpoint D

- piloto en producción controlada

### Checkpoint E

- deprecación efectiva de `v2`

## Recomendación de ejecución

Orden recomendado:

1. cerrar interfaz/API antes de abrir desarrollo masivo
2. construir primero el flujo `in_app`
3. construir después el `push` simple
4. construir luego secuencias
5. migrar por campañas, no por bloques técnicos

## Criterio final de cierre

El roadmap se considera cumplido cuando:

- `v3` es la única plataforma operativa de notificaciones objetivo
- `v2` está deprecada
- frontend consume contratos `v3`
- las campañas principales están migradas
- el sistema es trazable, operable e idempotente

En una frase:

`La misión no es añadir otra versión; es sustituir v2 por una plataforma nueva, limpia y gobernable.`
