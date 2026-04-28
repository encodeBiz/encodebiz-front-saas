# API v3 Documentation

## Objetivo

Este directorio centraliza la documentación funcional y técnica de la `API v3` para el sistema de notificaciones.

El alcance inicial cubre:

- Notificaciones `in-app` basadas en filtros.
- Notificaciones `push` secuenciales por reglas.
- Construcción de una `v3` completamente aislada de `v2`.
- Deprecación progresiva de `v2` sin solape estructural ni operativo.

## Documentos

- [`notifications-v3.md`](./notifications-v3.md): definición inicial de arquitectura, flujos, colecciones y decisiones de diseño.
- [`notifications-v3-domain.md`](./notifications-v3-domain.md): capa de dominio propuesta, modelos, DTOs y contratos.
- [`notifications-v3-application.md`](./notifications-v3-application.md): capa de aplicación, casos de uso, commands, queries y flujos operativos.
- [`notifications-v3-roadmap.md`](./notifications-v3-roadmap.md): roadmap formal de ejecución, fases, dependencias, owners, riesgos y criterios de aceptación.
- [`notifications-v3-interface.md`](./notifications-v3-interface.md): interfaz/backend API, handlers, auth, DTOs externos y contratos consumibles por frontend.
- [`notifications-v3-infrastructure.md`](./notifications-v3-infrastructure.md): infraestructura backend, adapters, repositorios, locking, schedulers y delivery.
- [`notifications-v3-firestore-schema.md`](./notifications-v3-firestore-schema.md): árbol de persistencia `notifications_v3`, documentos, subcolecciones, índices y convenciones.
- [`notifications-v3-events.md`](./notifications-v3-events.md): eventos de entrada, eventos cliente y reglas de activación.
- [`notifications-v3-errors-observability.md`](./notifications-v3-errors-observability.md): catálogo de errores, logging, métricas, alertas y operación.
- [`notifications-v3-testing-migration.md`](./notifications-v3-testing-migration.md): estrategia de testing, rollout, migración y deprecación operativa de `v2`.
- [`campaigns-backend-spec.md`](./campaigns-backend-spec.md): especificación backend del módulo de campañas.
- [`jobs-backend-spec.md`](./jobs-backend-spec.md): especificación backend del módulo de jobs y delivery pipeline.
- [`in-app-backend-spec.md`](./in-app-backend-spec.md): especificación backend del módulo `in_app`.
- [`push-sequences-backend-spec.md`](./push-sequences-backend-spec.md): especificación backend del módulo de secuencias push.
- [`notifications-v3-implementation-blueprint.md`](./notifications-v3-implementation-blueprint.md): blueprint de implementación por carpetas, archivos, responsabilidades y orden de construcción.

## Audiencia del material

Esta documentación está escrita para:

- equipo backend
- equipo frontend
- producto
- base de contexto para asistentes IA usados en análisis, diseño e implementación

## Restricción principal

La `v3` no puede solaparse con `v2`.

Esto implica:

- no reutilizar servicios, triggers ni modelos de `v2` dentro de `v3`
- no compartir colecciones operativas entre `v2` y `v3` salvo en lectura controlada si se documenta explícitamente
- no mezclar rutas, contratos ni procesos de entrega entre ambas versiones
- construir una capa nueva y aislada, preparada para sustituir a la anterior
- deprecar `v2` una vez `v3` esté validada

En persistencia, `v3` debe vivir bajo una raíz única `notifications_v3` con subcolecciones propias.

## Estado

Versión inicial de trabajo. Este material debe cerrarse en una sesión conjunta de definición funcional antes de arrancar desarrollo.
