# Notifications v3

## Contexto

Actualmente el sistema ya dispone de un patrón válido para notificaciones:

- Se persiste una intención de notificación en Firestore.
- Un trigger escucha la colección y ejecuta el envío.
- Existen además procesos temporales disparados por `schedule`.

Referencias actuales del repositorio:

- Listener de ejecución: [functions/src/2.0/triggers/database/user-notification.func.ts](/Users/joseacevedo/Documents/SBT/sbt_functions/functions/src/2.0/triggers/database/user-notification.func.ts:8)
- Lógica de envío: [functions/src/domain/notifications/controller/notification.controller.ts](/Users/joseacevedo/Documents/SBT/sbt_functions/functions/src/domain/notifications/controller/notification.controller.ts:109)
- Regla programada existente: [functions/src/2.0/triggers/pubsub/send.notification.last.login.3.days.ts](/Users/joseacevedo/Documents/SBT/sbt_functions/functions/src/2.0/triggers/pubsub/send.notification.last.login.3.days.ts:36)

La `v3` no debe reemplazar esta idea base. Debe formalizarla y escalarla.

## Restricción de versionado

La `v3` debe construirse como una capa completamente nueva.

Esta restricción es estructural, no opcional.

### Reglas obligatorias

- `v3` no debe reutilizar código operativo de `v2`
- `v3` no debe compartir triggers de ejecución con `v2`
- `v3` no debe escribir en colecciones operativas de `v2`
- `v3` no debe exponer contratos mezclados con `v2`
- `v3` debe poder activarse, probarse y deprecar `v2` sin acoplamiento interno

### Implicación práctica

Si una pieza existe en `v2` y se necesita en `v3`, debe reimplementarse en la nueva capa.

No se toma como base el código actual. Se toma como referencia funcional y de negocio, pero no como dependencia interna.

### Objetivo de transición

- construir `v3`
- validar `v3`
- migrar tráfico o uso funcional hacia `v3`
- deprecar `v2`

Nunca operar ambas versiones mezclando internals.

## Objetivos de negocio

### 1. Notificaciones in-app basadas en filtros

Permitir mostrar comunicaciones dentro de la app a segmentos concretos de usuarios en función de datos disponibles en la plataforma.

Ejemplos:

- Usuarios activos con plan premium.
- Usuarios inactivos desde hace `N` días.
- Usuarios asociados a un programa concreto.
- Usuarios que no completaron una acción relevante.

### 2. Push secuenciales por reglas

Permitir automatizar flujos de notificaciones push que se ejecutan por pasos, con tiempos de espera, reglas de salida y exclusiones.

Ejemplos:

- Secuencia de bienvenida.
- Reactivación por inactividad.
- Recordatorio de renovación.
- Recuperación tras abandono de un flujo clave.

## Decisión de arquitectura

La `v3` debe ser híbrida:

- Los `eventos de dominio` y los `schedules` generan trabajo.
- Firestore actúa como capa durable de planificación y trazabilidad.
- Un pipeline único ejecuta la entrega final.

Pero ese pipeline debe existir dentro de `v3`, no como extensión de `v2`.

### Qué no se recomienda

- No centralizar toda la lógica en cron jobs aislados.
- No disparar reglas complejas directamente desde un listener con efectos secundarios no auditables.
- No enviar push o in-app directamente desde cada caso de uso sin persistencia previa.

### Qué sí se recomienda

- Persistir primero la intención o el job.
- Procesar la entrega en una segunda etapa desacoplada.
- Mantener idempotencia, estado y trazabilidad por documento.

## Principios de diseño

- Un mismo patrón para `push` e `in-app`.
- Idempotencia por campaña, usuario y paso.
- Reintentos controlados.
- Trazabilidad completa.
- Capacidad de pausar campañas.
- Capacidad de auditar por qué un usuario recibió un mensaje.
- Separación entre definición de reglas, planificación y envío.
- Aislamiento total entre `v2` y `v3`.
- Preparación explícita para deprecación de `v2`.
- Documentación entendible por frontend sin depender de conocimiento interno de Firebase.
- Documentación redactada como contexto reutilizable para IA.

## Orientación para frontend

La documentación de `v3` debe permitir al equipo frontend entender:

- qué entidades existen
- qué estados puede devolver el sistema
- qué mensajes pueden mostrarse al usuario
- qué eventos de interacción debe reportar la app
- qué datos son configurables y cuáles son calculados por backend

Por tanto, la documentación no debe quedar limitada a infraestructura o triggers. Debe describir contratos y comportamiento observable.

## Orientación para IA

La documentación de `v3` debe servir también como base de prompt y contexto técnico para IA.

Eso implica:

- lenguaje explícito
- términos de dominio consistentes
- estados y transiciones bien nombrados
- reglas sin ambigüedad
- separación clara entre dominio, aplicación, infraestructura y contratos

## Componentes de v3

### 1. Motor de reglas

Responsable de decidir cuándo un usuario o segmento entra en una campaña.

Fuentes posibles:

- Cambios en documentos de usuario.
- Cambios de suscripción.
- Eventos analíticos o de comportamiento.
- Schedules periódicos.

Salidas:

- Creación de un `campaign_run`.
- Creación directa de uno o varios `notification_job`.

### 2. Capa de planificación

Responsable de materializar la intención de comunicación en documentos persistidos.

Funciones:

- Definir audiencia.
- Resolver canal.
- Resolver contenido.
- Calcular `scheduledAt`.
- Generar claves de deduplicación.

### 3. Capa de entrega

Responsable de escuchar trabajos pendientes y ejecutar:

- Persistencia de `in-app`.
- Envío de `push`.
- Actualización de estado.
- Registro de errores y reintentos.

### 4. Capa de tracking

Responsable de guardar:

- Estado del trabajo.
- Resultado de entrega.
- Aperturas o interacción.
- Exclusiones por usuario.
- Historial por campaña.

## Propuesta de persistencia Firestore

La persistencia de `v3` debe vivir bajo una raíz única:

- `notifications_v3`

Dentro de esa raíz deben existir subcolecciones separadas por responsabilidad.

### Documento raíz recomendado

Ruta:

- `notifications_v3/system`

Este documento puede servir para:

- metadatos de versión
- flags operativas
- configuración global no sensible
- timestamps de mantenimiento

### Subcolección `campaign_definitions`

Ruta recomendada:

- `notifications_v3/system/campaign_definitions`

Define una campaña reusable.

Campos propuestos:

- `id`
- `name`
- `description`
- `channel`: `in_app | push`
- `status`: `draft | active | paused | archived`
- `triggerType`: `event | schedule | manual`
- `entryRule`
- `filters`
- `sequence`
- `priority`
- `startAt`
- `endAt`
- `createdAt`
- `updatedAt`

### Subcolección `campaign_runs`

Ruta recomendada:

- `notifications_v3/system/campaign_runs`

Representa una ejecución concreta de una campaña.

Campos propuestos:

- `campaignId`
- `triggeredBy`
- `runType`: `segment_snapshot | per_user | scheduled_batch`
- `status`: `pending | processing | completed | failed | cancelled`
- `scheduledAt`
- `startedAt`
- `finishedAt`
- `summary`

### Subcolección `notification_jobs`

Ruta recomendada:

- `notifications_v3/system/notification_jobs`

Unidad atómica de trabajo para entrega.

Campos propuestos:

- `campaignId`
- `runId`
- `userId`
- `channel`
- `type`
- `step`
- `status`: `pending | locked | sent | failed | cancelled | expired`
- `scheduledAt`
- `processedAt`
- `dedupeKey`
- `payload`
- `filterSnapshot`
- `attempts`
- `lastError`

### Subcolección `in_app_messages`

Ruta recomendada:

- `notifications_v3/system/in_app_messages`

Mensajes visibles dentro de la app.

Campos propuestos:

- `campaignId`
- `jobId`
- `userId`
- `status`: `active | hidden | expired`
- `title`
- `body`
- `cta`
- `priority`
- `startAt`
- `endAt`
- `metadata`

### Subcolección `user_message_state`

Ruta recomendada:

- `notifications_v3/system/user_message_state`

Estado de interacción por usuario y mensaje.

Campos propuestos:

- `userId`
- `messageId`
- `openedAt`
- `clickedAt`
- `dismissedAt`
- `completedAt`
- `mutedUntil`

## Canales soportados

### In-app

No requiere envío push. Requiere:

- Evaluar si el usuario pertenece al segmento.
- Crear o activar el mensaje para ese usuario.
- Permitir al cliente consultar mensajes activos.
- Registrar visualización e interacción.

### Push

Requiere:

- Resolver token o topic.
- Aplicar exclusiones y ventanas horarias.
- Ejecutar envío.
- Registrar resultado.

## Patrones de activación

### Activación por evento

Útil para:

- Alta de usuario.
- Cambio de suscripción.
- Cambio de plan.
- Finalización de programa.
- Abandono de flujo.

Patrón:

1. Un trigger detecta el evento.
2. El motor evalúa reglas.
3. Se crea uno o varios documentos en `notifications_v3/system/notification_jobs`.
4. El pipeline de entrega procesa los jobs.

### Activación por schedule

Útil para:

- Inactividad.
- Renovación próxima.
- Recordatorios temporales.
- Avance de una secuencia.

Patrón:

1. Un `schedule` busca candidatos.
2. Se generan documentos en `notifications_v3/system/campaign_runs` o `notifications_v3/system/notification_jobs`.
3. El pipeline de entrega procesa los jobs pendientes.

## Flujos de referencia

### Flujo A: In-app por filtro

Caso:
Usuarios premium que no entrenan desde hace `7` días.

Flujo:

1. Un proceso programado identifica usuarios candidatos.
2. Se valida que no hayan recibido ya ese mensaje dentro de la ventana definida.
3. Se crea un documento en `notifications_v3/system/notification_jobs` de canal `in_app`.
4. La ejecución crea el documento en `notifications_v3/system/in_app_messages`.
5. La app consulta los mensajes activos y los presenta.
6. La interacción se guarda en `notifications_v3/system/user_message_state`.

### Flujo B: Push secuencial

Caso:
Secuencia de reactivación por inactividad.

Flujo:

1. El usuario entra en la campaña al cumplir `3` días sin acceso.
2. Se crea el paso `1`.
3. Si no hay reactivación, se programa el paso `2`.
4. Si sigue inactivo, se programa el paso `3`.
5. Si el usuario vuelve a la app, se cancela la secuencia restante.

## Estado y ciclo de vida de un job

Estados recomendados:

- `pending`
- `locked`
- `sent`
- `failed`
- `cancelled`
- `expired`

Reglas:

- Solo los jobs `pending` pueden ser tomados para ejecución.
- Un job debe pasar por un estado de bloqueo antes del envío si existe concurrencia.
- Un job fallido debe registrar error y número de intentos.
- Un job cancelado no debe reactivarse automáticamente.

## Idempotencia

La `v3` debe definir una `dedupeKey` para evitar duplicados.

Propuesta base:

`campaignId:userId:channel:step:timeWindow`

Ejemplos:

- Misma campaña no debe reenviarse dos veces al mismo usuario para el mismo paso.
- Un `schedule` repetido no debe volver a crear trabajos equivalentes.
- Un mismo evento de dominio no debe duplicar entradas por reintento del trigger.

## Exclusiones y límites

La capa de reglas debe permitir al menos:

- Frecuencia máxima por usuario.
- Prioridad entre campañas.
- Exclusión por campaña activa.
- Exclusión si el usuario ya completó el objetivo.
- Exclusión por ventana horaria.
- Exclusión por falta de consentimiento o token.

## Observabilidad

La `v3` debe permitir responder:

- Qué campaña generó el mensaje.
- Qué regla disparó el envío.
- Cuándo se planificó.
- Cuándo se envió.
- Qué resultado tuvo.
- Si el usuario abrió o ignoró el mensaje.

Métricas mínimas:

- Jobs creados.
- Jobs enviados.
- Jobs fallidos.
- Tasa de apertura.
- Tasa de click.
- Conversión por campaña.

## Recomendación concreta para este proyecto

### Mantener

- El patrón conceptual de persistir y luego ejecutar.
- El uso de Firestore como capa intermedia.
- Los schedules para reglas temporales.

### Evolucionar

- La colección simple de `notifications` hacia una raíz `notifications_v3` con subcolecciones tipadas y jobs con estado.
- La lógica de reglas dispersa hacia campañas definidas.
- La trazabilidad por envío hacia trazabilidad por campaña, usuario y paso.
- La solución actual hacia una implementación paralela totalmente nueva.

### Evitar

- Crear una función por cada regla de negocio sin un modelo común.
- Mezclar decisión de audiencia y envío en la misma función.
- Depender solo de triggers de escritura sin control de deduplicación.
- Reutilizar internals de `v2` dentro de `v3`.
- Compartir contratos frontend ambiguos entre versiones.
- Migraciones parciales con componentes mixtos.

## Sesión de definición previa

Antes de desarrollo debe cerrarse una sesión conjunta para definir:

- Segmentos reales disponibles.
- Eventos reales disponibles.
- Reglas prioritarias de negocio.
- Secuencias iniciales.
- Límites de frecuencia.
- Jerarquía entre campañas.
- Necesidades de reporting.

## Primer backlog documental

- Definir catálogo de filtros disponibles.
- Definir eventos de entrada soportados.
- Definir modelo final de campaña.
- Definir esquema final de `notification_job`.
- Definir reglas de cancelación de secuencias.
- Definir contratos de lectura para la app en `in_app`.
- Definir métricas y panel mínimo de seguimiento.

## Decisión recomendada

Para `v3`, la arquitectura recomendada es:

- `eventos + schedules` para detectar oportunidades
- `Firestore jobs` para persistir y auditar
- `listener único de entrega` para ejecutar

En una sola frase:

`La colección no debe ser el motor de negocio; debe ser la cola auditable de ejecución del negocio.`

Y una segunda regla igual de importante:

`La v3 debe nacer aislada para poder retirar la v2 sin arrastrar deuda estructural.`
