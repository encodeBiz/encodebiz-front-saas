# AGENTS.md

## Mandatory Pre-Reading

Before any change, read and respect [AI-RULES.md](./AI-RULES.md). Those are the **unbreakable engineering rules** (security, architecture, code quality, git, response protocol). They apply to every agent (Codex, Claude, Cursor, Copilot, Aider, Jules, etc.) and every change in this repo.

If a user instruction conflicts with `AI-RULES.md`, **stop and ask** before acting.

## Purpose

This file is the project-specific entrypoint for AI agents. Read [AI-RULES.md](./AI-RULES.md) first for the global rules, then read this file for the repository map, then inspect the specific module you are changing. Keep changes scoped, preserve existing architecture, and update documentation when behavior changes.

## Workspace Boundary

This project is the Backoffice Next.js repository. Agents must stay inside this workspace:

```txt
/Users/joseacevedo/Documents/EncodeBiz-ALL/encodebiz-front-saas
```

Do not inspect, edit, format, test, or otherwise modify sibling repositories or external workspaces unless the user explicitly asks for that exact repository. In particular, do not make Flutter app changes from this project context unless the user explicitly switches the task to that app workspace.

If a task mentions another frontend or app but the user frames the work as Backoffice, treat it as documentation/context only and ask before leaving this repository.

## Project Context

- This repository is the CheckBiz/EncodeBiz Backoffice built with Next.js and TypeScript.
- Keep UI changes aligned with the existing Material UI patterns already used in `src/app/main/[entityId]/checkinbiz`.
- Domain contracts for CheckBiz live under `src/domain/features/checkinbiz`.
- CheckBiz services live under `src/services/checkinbiz`.
- Backoffice task screens live under `src/app/main/[entityId]/checkinbiz/tasks`.
- Do not call Firebase directly from UI components; use the service/domain layers already present.

## Repository Structure (high level)

- `src/app/main/[entityId]/checkinbiz/...` — Next.js App Router routes for CheckinBiz
- `src/components/**` — shared UI components
- `src/services/**` — service layer (Firebase + HTTP)
- `src/domain/**` — types / contracts
- `src/hooks/**` — shared hooks (`useEntity`, `useAuth`, `useAppLocale`, `useToast`, `useLayout`)
- `src/lib/firebase/**` — Firestore utilities
- `locales/{es,en,fr,de}/common.json` — i18n (`next-intl`)

## Task Module Source Of Truth

For CheckBiz task frontend integration, use this document as the local source of truth:

```txt
docs/DOCUMENTATION/05-task-frontend-integration.md
```

If a user references `DOCUMENTOS/task/05-task-frontend-integration.md`, verify whether that path exists in this repo. If it does not, state the discrepancy and use the existing `docs/DOCUMENTATION/05-task-frontend-integration.md` only after confirming it is the updated document in the workspace.

Do not invent task rules, notification types, payload fields, permissions, or backend behavior outside that document and the existing code.

## Before Editing

Before changing files:

1. Read `AI-RULES.md`.
2. Read this `AGENTS.md`.
3. Read the full file you intend to edit.
4. Check `git status --short` and preserve user changes.
5. Keep the change limited to the requested scope.

Before finishing:

1. Run the narrowest useful lint/typecheck/test command for the touched files or module.
2. Report any command that could not be run or failed.
3. Mention any contract/document/backend inconsistency explicitly.

---

## Calendar Module — Known Bugs & Architecture

> Before touching `CalendarSection.tsx` or any calendar component, read this section in full. The module concentrates many side-effects and an apparently local change can break another view.

### File Map

- Main route: [src/app/main/[entityId]/checkinbiz/calendar/page.tsx](src/app/main/[entityId]/checkinbiz/calendar/page.tsx) — exposes 2 tabs: `EntityCalendarTab` and `EmployeeHolidaysTab`.
- Components:
  - [CalendarSection.tsx](src/app/main/[entityId]/checkinbiz/calendar/components/CalendarSection.tsx) — universal component for the 3 scopes (`entity`, `branch`, `employee`)
  - [HolidayModal.tsx](src/app/main/[entityId]/checkinbiz/calendar/components/HolidayModal.tsx) — modal for creating/editing holidays and absences
  - [EntityCalendarTab.tsx](src/app/main/[entityId]/checkinbiz/calendar/components/EntityCalendarTab.tsx)
  - [EmployeeHolidaysTab.tsx](src/app/main/[entityId]/checkinbiz/calendar/components/EmployeeHolidaysTab.tsx)
  - [BranchCalendarTab.tsx](src/app/main/[entityId]/checkinbiz/calendar/components/BranchCalendarTab.tsx) — **dead code, not imported anywhere**
- Read-only detail views:
  - [BranchCalendarDetail.tsx](src/app/main/[entityId]/checkinbiz/branch/[id]/detail/components/BranchCalendarDetail.tsx)
  - [EmployeeCalendarDetail.tsx](src/app/main/[entityId]/checkinbiz/employee/[id]/detail/components/EmployeeCalendarDetail.tsx)
- Embedded in forms:
  - [branch/form/form.controller.tsx](src/app/main/[entityId]/checkinbiz/branch/form/form.controller.tsx#L338)
  - [employee/form/form.controller.tsx](src/app/main/[entityId]/checkinbiz/employee/form/form.controller.tsx#L482) and line [659](src/app/main/[entityId]/checkinbiz/employee/form/form.controller.tsx#L659) (same block duplicated)
- Services: [calendar.service.ts](src/services/checkinbiz/calendar.service.ts)
- Types: [ICalendar.ts](src/domain/features/checkinbiz/ICalendar.ts)

### Data Model (Firestore)

Each scope has its own `config` document:

- Entity: `entities/{entityId}/calendar/config`
- Branch: `entities/{entityId}/branches/{branchId}/calendar/config`
- Employee: `entities/{entityId}/employees/{employeeId}/calendar/config`

Presets are stored in the `calendar` subcollection of the corresponding scope with `type === "preset"` (queried via `collectionGroup`).

### Backend Flow

All mutations go through a single HTTP handler (`NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_CALENDAR_HANDLER`):

- `PATCH` → `upsertCalendar(payload)`
- `DELETE` → `deleteCalendarItem({ kind: 'holiday' | 'absence', id })`
- `POST?action=savePreset` → save preset
- `GET?<scope params>` → `fetchEffectiveCalendar` (merged entity → branch → employee)
- `GET?id=<id>` → single preset

Reading `config` is done **directly from Firestore** (`getRefByPathData`). The effective (merged) read goes through the handler.

### Critical Bugs

**1. `useEffect` inside a Formik render-prop**
[CalendarSection.tsx:512-536](src/app/main/[entityId]/checkinbiz/calendar/components/CalendarSection.tsx#L512-L536) declares a `useEffect` **inside** the `<Formik>` render-prop callback. This violates the Rules of Hooks and resets the form every time `baseSchedule`/`initialSchedule` change — overwriting user edits in live. Fix: extract to a child component inside `<Formik>` (like `CalendarChangeReporter`).

**2. Inconsistent ID generation for employee absence ranges**
[HolidayModal.tsx:73-86](src/app/main/[entityId]/checkinbiz/calendar/components/HolidayModal.tsx#L73-L86): on create uses `${values.name}-${date}` (spaces/special chars); on edit accumulates `${values.id}-${i}` → orphaned records. **Direct cause of reported holiday duplications for employees.**

**3. N sequential backend calls per range**
A 14-day absence generates 14 sequential `PATCH` calls. If one fails mid-range there is no rollback — partial range is persisted.

**4. Local state updated with client data, not backend response**
[CalendarSection.tsx:391-410](src/app/main/[entityId]/checkinbiz/calendar/components/CalendarSection.tsx#L391-L410): after `upsertCalendar` the response is ignored and `setHolidays` is called with the local object. If the backend normalizes the `id`, frontend diverges → immediate re-edit creates a duplicate instead of updating.

**5. `existingDates` does not exclude the range being edited**
[HolidayModal.tsx:158](src/app/main/[entityId]/checkinbiz/calendar/components/HolidayModal.tsx#L158): own days appear as "occupied" when editing a previously saved absence.

**6. Duplicate effect for loading presets**
[CalendarSection.tsx:289-302](src/app/main/[entityId]/checkinbiz/calendar/components/CalendarSection.tsx#L289-L302): two nearly identical effects firing `loadPresetsIfNeeded` with inconsistent dependencies.

**7. Forward reference in `EmployeeHolidaysTab`**
[EmployeeHolidaysTab.tsx:112](src/app/main/[entityId]/checkinbiz/calendar/components/EmployeeHolidaysTab.tsx#L112): `fetchEmployees` calls `handleLoadHolidays` before it is declared.

### Cascade Bugs (entity → branch → employee)

- **Editor only shows own-scope holidays** but the effective view accumulates inherited ones → admin re-adds them → visible duplicate.
- **`existingDates` only contains own-scope dates** — no warning when selecting a date already inherited from entity.
- **`BranchCalendarDetail` does not use `fetchEffectiveCalendar`** — shows only local branch holidays, omitting entity-inherited ones. Inconsistent with `EmployeeCalendarDetail`.
- **`EmployeeHolidaysTab` calls `fetchEffectiveCalendar({ scope: 'entity', employeeId })`** — scope should be `'employee'`.
- **No `source` field on `Holiday`** — impossible to distinguish entity/branch/employee holidays in a combined list.
- **No date deduplication across levels** — same date from entity and branch renders twice.
- **`overridesDisabled` only affects schedule, not holidays** — no per-scope holiday override control.

### Model Inconsistencies

- **`Absence` type defined but never used** ([ICalendar.ts:49-55](src/domain/features/checkinbiz/ICalendar.ts#L49-L55)). Everything is saved as N `Holiday` entries, indistinguishable from public holidays.
- **Hardcoded Spanish strings** in `CalendarSection`, `HolidayModal`, `EmployeeCalendarDetail`, `BranchCalendarDetail`. Breaks i18n for EN/FR/DE.
- **`buildDefaultSchedule`/`mapStoredSchedule`/`normalizeScheduleForForm` redefined in 5+ files.** Any change requires editing all of them.
- **Three different ways to read calendar config** (direct Firestore, `fetchEffectiveCalendar`, manual dual-read in form controllers) with inconsistent fallbacks.
- **`employee/form/form.controller.tsx` defines the Calendar section twice** (lines 482 and 659) — identical blocks that have already drifted apart.
- **`BranchCalendarTab.tsx` is dead code** — 218 lines not imported anywhere.

### Recommended Order of Attack

**Quick wins (low risk, high stability impact)**
1. Remove the `useEffect` from inside the Formik render-prop.
2. Delete `BranchCalendarTab.tsx` and its dead utilities.
3. Fix `scope: 'entity'` → `scope: 'employee'` in `EmployeeHolidaysTab.handleLoadHolidays`.
4. Unify ID generation in `HolidayModal` via `createSlug` and fix range edit handling.

**Model changes (require backend + migration)**
5. Add `source` (`'entity' | 'branch' | 'employee'`) to each `Holiday` from the client.
6. Define and document the merge policy (deduplication, winner, labeling) in `fetchEffectiveCalendar`.
7. Introduce `overridesHolidays` analogous to `overridesDisabled`.
8. Introduce real `Absence` (range with `startDate/endDate/status`) in a single request.

**Structural refactor**
9. Centralize fallbacks and mappers in `src/lib/calendar/`.
10. Replace all direct Firestore reads with `fetchEffectiveCalendar` (or `fetchRawCalendar(scope)`).
11. Render inherited holidays as read-only with origin badge in the lower-scope editor.
12. Move all hardcoded labels to `locales/*/common.json` under `calendar.scope.{entity,branch,employee}.*`.
13. Deduplicate the calendar section in `employee/form/form.controller.tsx`.

---

## Project Conventions

- React: hooks at the top of the component, **never** inside render-props or callbacks.
- Styles: MUI v6 + `sx` props.
- i18n: **every visible string** must go through `useTranslations()`. No Spanish literals inside TSX.
- Services: one function per endpoint in `src/services/<module>/<feature>.service.ts`. Errors via `mapperErrorFromBack`.
- Firestore direct reads only for simple lookups; mutations always through HTTP handler.
- Types: in `src/domain/features/<module>/I<Entity>.ts`.

## Useful Commands

```bash
npm run dev          # Next.js dev server
npm run build        # production build
npm run lint         # ESLint
```
