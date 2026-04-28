# Notifications v3 Testing and Migration

## Objetivo

Definir cómo validar `v3` y cómo sustituir `v2` sin riesgo innecesario.

## Estrategia de testing

### Unit tests

Cubren:

- invariantes de dominio
- transitions de estado
- dedupe key
- validación de DTOs

### Application tests

Cubren:

- commands
- queries
- processors
- reglas de secuencia
- cancelación por eventos

### Integration tests

Cubren:

- repositorios Firestore
- locking
- delivery adapters
- schedulers

### End-to-end tests

Cubren:

- creación de campaña
- planificación de jobs
- delivery `in_app`
- delivery push
- interacción cliente

## Estrategia de rollout

- staging con campañas piloto
- feature flags por campaña
- audiencia limitada en producción
- revisión diaria de métricas al inicio

## Estrategia de migración

- no migrar código de `v2`
- migrar comportamiento, no archivos
- activar campañas nuevas solo en `v3`
- comparar resultados
- retirar gradualmente campañas de `v2`

## Estrategia de deprecación

- congelar nuevas reglas en `v2`
- mover campañas objetivo a `v3`
- desactivar writes nuevos de `v2`
- apagar triggers de `v2`
- archivar documentación operativa de `v2`

## Criterio de salida

`v3` sustituye a `v2` cuando:

- los flujos objetivo funcionan
- los contratos frontend están estables
- la operación es trazable
- no hay dependencia funcional de `v2`
