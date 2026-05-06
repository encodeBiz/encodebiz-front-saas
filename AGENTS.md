# AGENTS.md

Guía de orientación para agentes (humanos o IA) que trabajen en este repositorio.
Esta primera versión se enfoca en el **módulo de Días Libres / Ausencias / Calendario** (`checkinbiz/calendar`) porque es donde más fricción y bugs se han detectado.

---

## 1. Estructura del repositorio (alto nivel)

- `src/app/main/[entityId]/checkinbiz/...` — rutas Next.js (App Router) del producto CheckinBiz
- `src/components/**` — componentes UI compartidos
- `src/services/**` — capa de servicios (Firebase + HTTP)
- `src/domain/**` — tipos / contratos
- `src/hooks/**` — hooks compartidos (`useEntity`, `useAuth`, `useAppLocale`, `useToast`, `useLayout`)
- `src/lib/firebase/**` — utilidades Firestore
- `locales/{es,en,fr,de}/common.json` — i18n (`next-intl`)

Branch principal: `main`. Branch de trabajo: `develop`.

---

## 2. Módulo de Días Libres / Calendario

### 2.1 Mapa de archivos

- Ruta principal: [src/app/main/[entityId]/checkinbiz/calendar/page.tsx](src/app/main/[entityId]/checkinbiz/calendar/page.tsx) — solo expone 2 tabs: `EntityCalendarTab` y `EmployeeHolidaysTab`.
- Componentes:
  - [CalendarSection.tsx](src/app/main/[entityId]/checkinbiz/calendar/components/CalendarSection.tsx) — componente "universal" para los 3 scopes (`entity`, `branch`, `employee`)
  - [HolidayModal.tsx](src/app/main/[entityId]/checkinbiz/calendar/components/HolidayModal.tsx) — modal para alta/edición de festivos y ausencias
  - [EntityCalendarTab.tsx](src/app/main/[entityId]/checkinbiz/calendar/components/EntityCalendarTab.tsx)
  - [EmployeeHolidaysTab.tsx](src/app/main/[entityId]/checkinbiz/calendar/components/EmployeeHolidaysTab.tsx)
  - [BranchCalendarTab.tsx](src/app/main/[entityId]/checkinbiz/calendar/components/BranchCalendarTab.tsx) — **código muerto, no se importa desde ninguna parte**
- Vistas de detalle (read-only):
  - [BranchCalendarDetail.tsx](src/app/main/[entityId]/checkinbiz/branch/[id]/detail/components/BranchCalendarDetail.tsx)
  - [EmployeeCalendarDetail.tsx](src/app/main/[entityId]/checkinbiz/employee/[id]/detail/components/EmployeeCalendarDetail.tsx)
- Embebido en formularios:
  - [branch/form/form.controller.tsx](src/app/main/[entityId]/checkinbiz/branch/form/form.controller.tsx#L338)
  - [employee/form/form.controller.tsx](src/app/main/[entityId]/checkinbiz/employee/form/form.controller.tsx#L482) y línea [659](src/app/main/[entityId]/checkinbiz/employee/form/form.controller.tsx#L659) (mismo bloque duplicado)
- Servicios: [calendar.service.ts](src/services/checkinbiz/calendar.service.ts)
- Tipos: [ICalendar.ts](src/domain/features/checkinbiz/ICalendar.ts)

### 2.2 Modelo de datos (Firestore)

Cada scope tiene su propio documento `config`:

- Entidad: `entities/{entityId}/calendar/config`
- Sucursal: `entities/{entityId}/branches/{branchId}/calendar/config`
- Empleado: `entities/{entityId}/employees/{employeeId}/calendar/config`

Presets se guardan en la subcolección `calendar` del scope correspondiente con `type === "preset"` (consultados vía `collectionGroup`).

### 2.3 Flujo backend

Toda mutación pasa por un único handler HTTP (`NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_CALENDAR_HANDLER`):

- `PATCH` → `upsertCalendar(payload)` (horario, holiday, advance, overridesDisabled…)
- `DELETE` → `deleteCalendarItem({ kind: 'holiday' | 'absence', id })`
- `POST?action=savePreset` → guardar preset
- `GET?<scope params>` → `fetchEffectiveCalendar` (calendario merged entidad → sucursal → empleado)
- `GET?id=<id>` → un preset

La lectura de `config` se hace **directo a Firestore** desde el frontend (`getRefByPathData`). La lectura "efectiva" (con merge) sí pasa por el handler.

---

## 3. Diagnóstico actual (bugs y comportamientos irregulares)

> Estado: **el módulo necesita una refactorización**. Aquí se concentran las fuentes conocidas de duplicación y bugs reportados.

### 3.1 BUGS CRÍTICOS

1. **`useEffect` dentro del render-prop de Formik**
   [CalendarSection.tsx:512-536](src/app/main/[entityId]/checkinbiz/calendar/components/CalendarSection.tsx#L512-L536) declara un `useEffect` **dentro** del callback `({ values, setFieldValue, ... }) => {…}` de `<Formik>`. Esto:
   - Viola las Rules of Hooks (el hook se monta sobre un render-prop, no un componente).
   - **Resetea el formulario** cada vez que cambian `baseSchedule`, `initialSchedule`, etc., **incluso si el usuario ya editó valores** (sobrescribe `overridesDisabled`, `schedule`, `enableDayTimeRange`, etc.).
   - Combinado con que estas props son objetos nuevos en cada render del padre, produce *sobrescritura de cambios del usuario en vivo* — uno de los síntomas del "comportamiento irregular".
   - **Solución**: extraer ese efecto a un componente hijo dentro del `<Formik>` (similar a `CalendarChangeReporter`) o usar `enableReinitialize` correctamente sin tocar `setFieldValue`.

2. **Generación de IDs inconsistente para ausencias por rango (employee)**
   [HolidayModal.tsx:73-86](src/app/main/[entityId]/checkinbiz/calendar/components/HolidayModal.tsx#L73-L86):
   - Al crear: `id = \`${values.name}-${date}\`` (sin slug → con espacios y caracteres especiales).
   - Al editar: `id = \`${values.id}-${i}\`` → si el usuario edita una ausencia que ya fue dividida en N días, **se generan IDs `oldId-0-0`, `oldId-0-1`, …** acumulativos, dejando **registros huérfanos** del rango original.
   - El fallback de slugificado en [CalendarSection.tsx:901](src/app/main/[entityId]/checkinbiz/calendar/components/CalendarSection.tsx#L901) **no se aplica** porque `data.id` viene siempre poblado desde el modal.
   - **Esta es la causa raíz directa de las "duplicaciones" reportadas para días libres de empleados.**

3. **El backend recibe N peticiones secuenciales por rango**
   En scope `employee`, una ausencia de 14 días genera 14 llamadas `PATCH` seriadas. Si una falla a mitad, queda **un rango parcial** sin rollback, y el modal sólo se cierra si todas tienen éxito. Hay que enviar el rango completo en una sola petición o usar la entidad `Absence` (ver punto 8).

4. **Estado local del padre se actualiza con datos del cliente, no con la respuesta del backend**
   [CalendarSection.tsx:391-410](src/app/main/[entityId]/checkinbiz/calendar/components/CalendarSection.tsx#L391-L410): tras `await upsertCalendar(...)` se ignora la respuesta y se llama `setHolidays` con el objeto local. Si el backend normaliza/cambia el `id`, el front diverge → al editar inmediatamente después se vuelve a crear (no a actualizar) → **duplicado**.

5. **`existingDates` no excluye los días del propio rango en edición**
   [HolidayModal.tsx:158](src/app/main/[entityId]/checkinbiz/calendar/components/HolidayModal.tsx#L158): la lógica `belongsToCurrent` sólo compara con `startDate/endDate` del *form value*, no con los días originales (almacenados como N entradas separadas). Resultado: al editar una ausencia previa se ven **sus propios días como "ocupados" y no se pueden seleccionar**.

6. **`useEffect` duplicado para cargar presets**
   [CalendarSection.tsx:289-302](src/app/main/[entityId]/checkinbiz/calendar/components/CalendarSection.tsx#L289-L302): hay dos efectos prácticamente idénticos disparando `loadPresetsIfNeeded`, con dependencias inconsistentes (`[loadPresetsIfNeeded]` vs `[loadPresetsIfNeeded, token, entityId]`). Más una invalidación manual de la `ref` cuando cambia `entityId`.

7. **Handler de búsqueda referencia función antes de declararla**
   [EmployeeHolidaysTab.tsx:112](src/app/main/[entityId]/checkinbiz/calendar/components/EmployeeHolidaysTab.tsx#L112): `fetchEmployees` (declarado con `useCallback`) llama a `handleLoadHolidays` que se declara más abajo (TDZ). Funciona porque las llamadas son asíncronas, pero ESLint debería marcarlo y es muy frágil ante refactors.

### 3.2 INCONSISTENCIAS DE MODELO

8. **El tipo `Absence` está definido pero nunca se usa**
   [ICalendar.ts:49-55](src/domain/features/checkinbiz/ICalendar.ts#L49-L55) define `Absence` con `startDate/endDate/status`, pero el frontend manda todo como `Holiday[]` (un día por entrada). El campo `absence` del payload de upsert nunca se popla. La consecuencia: una ausencia de vacaciones/baja de 10 días se guarda como **10 holidays sin tipo ni clasificación**, indistinguibles de festivos públicos.
   El campo `IEmployee.status` (`vacation`, `sick_leave`, `paternity_leave`, etc.) tampoco está conectado con las ausencias del calendario.

9. **Etiquetas hardcodeadas en español**
   `CalendarSection`, `HolidayModal`, `EmployeeCalendarDetail` y `BranchCalendarDetail` mezclan claves `t()` con strings literales en español: `"Ausencias"`, `"Días libres"`, `"Agregar ausencia"`, `"Selecciona inicio y fin en el calendario"`, etc. Rompe i18n para inglés/francés/alemán.

10. **Fallback schedule duplicado en 5+ ficheros**
    `buildDefaultSchedule()`/`fallbackSchedule` se redefinen casi idénticos en [EntityCalendarTab](src/app/main/[entityId]/checkinbiz/calendar/components/EntityCalendarTab.tsx#L29), [BranchCalendarTab](src/app/main/[entityId]/checkinbiz/calendar/components/BranchCalendarTab.tsx#L36), [BranchCalendarDetail](src/app/main/[entityId]/checkinbiz/branch/[id]/detail/components/BranchCalendarDetail.tsx#L90), [EmployeeCalendarDetail](src/app/main/[entityId]/checkinbiz/employee/[id]/detail/components/EmployeeCalendarDetail.tsx#L105) y dentro de los form controllers. Mismo trato para `mapStoredSchedule`/`mapScheduleWithEnabled`/`normalizeScheduleForForm`. Cualquier cambio (p. ej. agregar `breaks` por día) requiere editar **5 lugares**.

11. **Tres formas distintas de leer la configuración**
    - `getRefByPathData("entities/.../calendar/config")` directo (Entity, Branch tabs y detalles)
    - `fetchEffectiveCalendar()` (EmployeeHolidaysTab y EmployeeCalendarDetail)
    - Cada form controller hace su propia lectura mezclando entity + sub-scope a mano
    Resultado: distinta forma de manejar `holidays`/`holiday` (a veces array, a veces objeto único), distintos fallbacks (`timeBreak: 30` vs `60`), y *race conditions* si dos lecturas conviven.

### 3.3 DUPLICACIÓN DE CÓDIGO

12. **`employee/form/form.controller.tsx` define la sección Calendario dos veces**
    En `fetchData` ([línea 482](src/app/main/[entityId]/checkinbiz/employee/form/form.controller.tsx#L482)) y en `inicialize` ([línea 659](src/app/main/[entityId]/checkinbiz/employee/form/form.controller.tsx#L659)) hay ~35 líneas idénticas configurando `<CalendarSection>`. Cualquier cambio de prop hay que hacerlo dos veces (y se ha demostrado que se desincroniza).

13. **`BranchCalendarTab.tsx` es código muerto**
    Definido y exportado pero **no se importa desde ninguna parte** (la página `calendar/page.tsx` ya no lo monta). Son 218 líneas que confunden y pueden quedarse desincronizadas.

14. **`HolidayModal` tiene labels específicos por scope hardcodeados**
    `nameLabel`, `descLabel`, `dateLabel`, `saveLabel`, `dialogTitle` hacen `if (isEmployee) ... else if (isBranch) ... else t(...)`. Esto debería resolverse con claves i18n por scope.

### 3.4 DEUDA TÉCNICA Y RIESGOS MENORES

15. `BranchCalendarTab` calcula `mapStoredSchedule` mirando `storedDay.start`/`storedDay.end` (formato legacy) y descarta el día si no existen, **incluso si tiene `shifts` válidos** ([línea 51](src/app/main/[entityId]/checkinbiz/calendar/components/BranchCalendarTab.tsx#L51)). Si se llegara a montar de nuevo se rompería con la forma nueva.
16. En `CalendarSection` la callback `loadPresetsIfNeeded` lista `[entityId, token, locale, currentLocale]` como deps pero el cuerpo solo usa `entityId` y `currentLocale`. Eso re-genera la callback cada vez que `currentLocale` (objeto) cambia de referencia y dispara los efectos.
17. `deleteCalendarPreset` calcula la variable `scopeToDelete` y nunca la usa ([CalendarSection.tsx:624](src/app/main/[entityId]/checkinbiz/calendar/components/CalendarSection.tsx#L624)).
18. `EmployeeHolidaysTab.handleLoadHolidays` llama `fetchEffectiveCalendar({ scope: 'entity', employeeId })` — el `scope` debería ser `'employee'`. El backend probablemente lo tolera, pero el contrato es ambiguo.
19. Pagination en `EmployeeHolidaysTab`: `setHasMore(list.length === fp.params.limit && !!lastCursor)` depende de `list[last].last` siendo un cursor — patrón frágil acoplado al servicio `searchEmployees`.
20. En todos los calendarios se asume `timeZone` del `entity.legal.address`. Para empleados con `enableRemoteWork` y dirección propia ese timezone se ignora.

---

## 4. Recomendación de orden de ataque

1. **Eliminar el `useEffect` interno del render-prop de Formik** (bug 1) y borrar `BranchCalendarTab.tsx` (bug 13). Cambios pequeños, alto impacto en estabilidad.
2. **Unificar la generación de IDs en `HolidayModal`** y devolver siempre slug; manejar correctamente la edición de rangos (bug 2).
3. **Introducir `Absence` real**: un solo documento con `startDate/endDate/status`, una sola request, y eliminar la expansión a N holidays en el cliente (bug 3 + 8). Requiere coordinación con el backend handler.
4. **Centralizar fallbacks y mappers** (`buildDefaultSchedule`, `mapStoredSchedule`, `normalizeScheduleForForm`) en un único helper `src/lib/calendar/`. Resuelve bug 10.
5. **Sustituir lecturas directas a Firestore por `fetchEffectiveCalendar`** o un nuevo `fetchRawCalendar(scope)` (bug 11).
6. **Mover labels hardcodeados a `locales/*/common.json`** bajo `calendar.scope.{entity,branch,employee}.*` (bug 9 + 14).
7. **Deduplicar la sección de calendario en `employee/form/form.controller.tsx`** factorizando un helper `getCalendarFieldConfig(vals, holidays)` (bug 12).

---

## 5. Convenciones del proyecto

- React: hooks al tope del componente, **nunca** dentro de render-props o callbacks.
- Estilos: MUI v6 + `sx` props (ya hay convenciones en `template/`).
- i18n: **toda cadena visible** debe pasar por `useTranslations()`. No hay literales en español dentro de TSX.
- Servicios: una función por endpoint en `src/services/<modulo>/<feature>.service.ts`. Errores via `mapperErrorFromBack`.
- Firestore directo solo para lectura simple; mutaciones siempre por handler HTTP.
- Tipos: en `src/domain/features/<modulo>/I<Entidad>.ts`.

## 6. Comandos útiles

```bash
npm run dev          # Next.js dev server
npm run build        # build de producción
npm run lint         # ESLint
```

## 7. Notas para futuros agentes

- Antes de tocar `CalendarSection.tsx`, lee este AGENTS.md completo: el archivo concentra muchos efectos colaterales y un cambio aparentemente local puede romper otra vista.
- `BranchCalendarTab.tsx` parece útil pero **no se renderiza**; revisa antes de modificarlo.
- Cuando agregues claves i18n nuevas, hazlo en los **cuatro** locales (`es/en/fr/de`).
- Si dudas entre persistencia local vs HTTP handler, **siempre** pasa por el handler para mutaciones; mantiene auditoría y permisos.
