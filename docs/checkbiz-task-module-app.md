# CheckBiz Task Module For App

## Purpose

This document defines how the `Gestión de tareas` module must be implemented in the mobile app, using Flutter, while preserving the business rules already integrated in CheckBiz backoffice.

It is not a UI copy of the web module. It is the functional and technical contract the app team must follow.

---

## Scope

This document covers:

- business model
- Firestore structure
- API contract
- permissions
- task lifecycle
- assignments
- notes
- evidence
- ratings
- final validation flow
- error handling
- recommended Flutter architecture

This document does not prescribe exact mobile UI layout. It defines the functional behavior the app must implement.

---

## Core Architectural Decision

The module uses a hybrid integration model:

- **Reads** must go directly to Firebase Firestore
- **Writes** must go through the backend HTTP handler

This is intentional and already validated in the backoffice.

### Why

Firestore reads are faster for:

- task listing
- task detail
- subcollections
- operational refreshes

Backend writes are required for:

- permission enforcement
- status transitions
- assignment consistency
- audit/activity generation
- validation rules
- evidence rules

The app should not try to move write logic into Firestore client updates.

---

## Business Model

A task belongs to:

- `entityId`
- `branchId`

A task may have:

- one or many assigned employees
- notes
- evidence
- ratings
- final validations

---

## Task Lifecycle

### Task Status

```txt
draft
assigned
in_progress
completed
validated
rejected
cancelled
```

### Time Compliance Status

```txt
not_started
on_time
at_risk
overdue
completed_on_time
completed_late
```

### Priority

```txt
low
medium
high
critical
```

---

## Data Model

The app should define at least these domain entities.

### Task

```dart
class Task {
  final String id;
  final String entityId;
  final String branchId;
  final String title;
  final String? description;
  final TaskStatus status;
  final TaskTimeComplianceStatus timeComplianceStatus;
  final TaskPriority? priority;
  final DateTime dueAt;
  final DateTime? startedAt;
  final DateTime? completedAt;
  final DateTime? validatedAt;
  final DateTime? rejectedAt;
  final DateTime? cancelledAt;
  final String createdBy;
  final String? updatedBy;
  final String? completedBy;
  final String? validatedBy;
  final String? rejectedBy;
  final String? cancelledBy;
  final String? rejectionReason;
  final String? cancellationReason;
  final List<String> assignedEmployeeIds;
  final TaskConfig config;
  final DateTime createdAt;
  final DateTime updatedAt;
}
```

### TaskConfig

```dart
class TaskConfig {
  final bool allowSupervisorCreation;
  final bool allowSupervisorValidation;
  final bool allowSupervisorRating;
  final TaskCompletionPolicy completionPolicy;
  final bool requireEvidenceOnCompletion;
  final int maxPhotoSizeMB;
  final int maxVideoSizeMB;
}
```

### TaskAssignment

```dart
class TaskAssignment {
  final String id;
  final String taskId;
  final String entityId;
  final String branchId;
  final String employeeId;
  final TaskAssignmentStatus status;
  final String assignedBy;
  final DateTime assignedAt;
  final DateTime? startedAt;
  final DateTime? completedAt;
  final DateTime? removedAt;
  final String? notes;
}
```

### TaskNote

```dart
class TaskNote {
  final String id;
  final String taskId;
  final String entityId;
  final String branchId;
  final String content;
  final TaskNoteType type;
  final String createdBy;
  final String createdByRole;
  final DateTime createdAt;
  final String? updatedBy;
  final DateTime? updatedAt;
}
```

### TaskResource

```dart
class TaskResource {
  final String id;
  final String taskId;
  final String entityId;
  final String branchId;
  final String uploadedBy;
  final String? employeeId;
  final TaskResourceType type;
  final String filename;
  final String mimeType;
  final String url;
  final String storagePath;
  final num sizeKB;
  final String? description;
  final DateTime createdAt;
}
```

### TaskRating

```dart
class TaskRating {
  final String id;
  final String taskId;
  final String entityId;
  final String branchId;
  final String employeeId;
  final int rating;
  final String? comment;
  final String ratedBy;
  final String ratedByRole;
  final DateTime ratedAt;
}
```

### TaskValidation

```dart
class TaskValidation {
  final String id;
  final String taskId;
  final String entityId;
  final String branchId;
  final TaskValidationResult result;
  final String? reason;
  final String validatedBy;
  final String validatedByRole;
  final DateTime validatedAt;
}
```

### TaskDetail

```dart
class TaskDetail {
  final Task task;
  final List<TaskAssignment> assignments;
  final List<TaskNote> notes;
  final List<TaskResource> resources;
  final List<TaskRating> ratings;
  final List<TaskValidation> validations;
}
```

---

## Firestore Structure

### Main Collection

```txt
entities/{entityId}/tasks/{taskId}
```

### Subcollections

```txt
entities/{entityId}/tasks/{taskId}/assignments/{assignmentId}
entities/{entityId}/tasks/{taskId}/notes/{noteId}
entities/{entityId}/tasks/{taskId}/resources/{resourceId}
entities/{entityId}/tasks/{taskId}/ratings/{ratingId}
entities/{entityId}/tasks/{taskId}/validations/{validationId}
entities/{entityId}/tasks/{taskId}/activity/{activityId}
```

The app currently needs:

- `task`
- `assignments`
- `notes`
- `resources`
- `ratings`
- `validations`

The `activity` subcollection exists but is not currently required in the product UI.

---

## Firestore Read Rules For App

### Task List

Read from:

```txt
entities/{entityId}/tasks
```

Typical filters:

- `branchId`
- `status`
- `timeComplianceStatus`
- `priority`
- `assignedEmployeeIds array-contains employeeId`
- `dueAt`
- `createdAt`

### Task Detail

Read:

- task document
- assignments
- notes
- resources
- ratings
- validations

### Important Assignment Rule

The backend keeps removed assignments as historical records.

That means:

- assignments are **not physically deleted**
- removed assignments remain stored with `status: "removed"`

For the app operational UI:

- the main assigned team block must show **only active assignments**
- removed assignments must not appear in the standard active team section
- if product later wants assignment history, it should be a separate explicit view

This is critical. Do not treat removed assignments as active members of the task team.

---

## HTTP Write Contract

### Development Base URL

```txt
http://127.0.0.1:5001/encodebiz-services/us-central1/apiV100-firebaseEntryHttp-checkinbiz-tasksHandler/tasks
```

### Endpoints

```txt
POST   /tasks
PATCH  /tasks/:taskId
POST   /tasks/:taskId/assignments
DELETE /tasks/:taskId/assignments/:employeeId?entityId=...
PATCH  /tasks/:taskId/status
POST   /tasks/:taskId/notes
PATCH  /tasks/:taskId/notes/:noteId
POST   /tasks/:taskId/validation
POST   /tasks/:taskId/rejection
POST   /tasks/:taskId/ratings
POST   /tasks/:taskId/resources
```

### Rule

All mutations must use the backend handler.  
The app must not perform direct write-side business logic in Firestore for this module.

---

## Functional Flows

### 1. Create Task

The app must support:

- title
- description
- branch
- due date
- priority
- config flags
- initial assigned employees

Important UI rule:

- branch and employee selection must use searchable selectors by name
- never expose raw ids as the primary selection mechanism

### 2. Edit Task

The app must support editing:

- title
- description
- branch
- due date
- priority
- config
- assigned employees according to allowed actions

### 3. Assign Employees

Use:

```txt
POST /tasks/:taskId/assignments
```

Behavior:

- one or more employees can be assigned
- use employee name search
- the local detail state must refresh after completion

### 4. Unassign Employee

Use:

```txt
DELETE /tasks/:taskId/assignments/:employeeId?entityId=...
```

Behavior:

- this is an administrative action
- the assignment record is not removed from persistence
- it changes to `status: "removed"`
- the employee must disappear from `assignedEmployeeIds`
- if the task was in `assigned` and no assigned employees remain, backend may move it back to `draft`

App responsibilities after delete:

- show loading state
- handle backend success and errors
- refresh detail
- refresh active assignments
- refresh any local cache or view state based on `assignedEmployeeIds`

### 5. Start Task

Use:

```txt
PATCH /tasks/:taskId/status
```

with:

```json
{
  "entityId": "...",
  "status": "in_progress"
}
```

### 6. Complete Task

Use:

```txt
PATCH /tasks/:taskId/status
```

with:

```json
{
  "entityId": "...",
  "status": "completed"
}
```

If evidence is required and missing, backend may reject completion with:

```txt
task/evidence_required
```

### 7. Cancel Task

Use:

```txt
PATCH /tasks/:taskId/status
```

with cancellation reason.

### 8. Add Note

Use:

```txt
POST /tasks/:taskId/notes
```

Supported note types:

```txt
specification
operational_note
clarification
incident_note
```

### 9. Upload Evidence

Use:

```txt
POST /tasks/:taskId/resources
```

Current product decision for app:

- support **photos only** for now

Accepted formats:

- `image/jpeg`
- `image/png`
- `image/webp`

Max size:

- `5 MB`

Even though the general task model supports videos, the current implementation path is intentionally limited to photos.

### 10. Rate Worker

Use:

```txt
POST /tasks/:taskId/ratings
```

Rules:

- user can rate an assigned worker
- user cannot rate themself
- rating should expose employee name, score, comment, ratedBy and ratedByRole

### 11. Validate Task

Use:

```txt
POST /tasks/:taskId/validation
```

### 12. Reject Task

Use:

```txt
POST /tasks/:taskId/rejection
```

with reason.

---

## Permissions

Do not invent a separate permission model for mobile.

The app must reuse the same operational principles as CheckBiz.

### Administrative Actors

- `owner`
- `manager`

Additionally, platform-level `owner` or `admin` may have administrative control.

### Assignment Management

Actions like assign/unassign must only be visible when the user has administrative permission for:

- the entity
- or the task branch

### Source Of Truth

Operational permission should be resolved from the employee responsibility model already used in CheckBiz.

That means checking active responsibilities scoped to:

- entity
- branch

Do not hardcode visual permission logic disconnected from those records.

---

## Final Validation Meaning

In product terms, `Validaciones` represents the final review outcome of a completed task.

It is generated through:

- validate
- reject

It is not a standalone business object users create manually from scratch.

Each validation record contains:

- result
- reason if applicable
- who performed the review
- role of the reviewer
- date

For user-facing copy in app, a label like `Revisión final` is usually clearer than `Validaciones`.

---

## Ratings

### Rules

- rating targets an assigned employee
- self-rating must not be allowed
- `ratedBy` must be shown as a resolved name, not as a raw id

### Name Resolution Order

When an id must be shown as a person:

1. resolve as CheckBiz employee
2. if not found, resolve as platform user
3. fallback to raw id only if there is no better data

This rule also applies to:

- note creator
- rating author
- branch name
- assigned employees

---

## Notes

Each note should expose:

- type
- date
- creator name
- content

Recommended mobile behavior:

- compact preview in list
- full content in detail screen or modal

The app must not show `createdBy` as a raw id when a name can be resolved.

---

## Evidence

### Current Product Rule

Only photos are required in the current implementation.

### Display Recommendation

Each evidence item should show:

```txt
1. filename.jpg
Foto · 22 KB
```

The filename should act as the open action.

Metadata such as type and size should appear below the filename.

### Do Not Do This

- do not expose video upload in the current app flow
- do not show raw storage paths
- do not present ids instead of readable file information

---

## Error Handling

The app must not display raw backend JSON like:

```txt
{"message":{},"code":"task/evidence_required"}
```

The backend `code` must be mapped to readable UI messages.

### Known Error Codes

```txt
task/evidence_required
task/not_found
task/forbidden
task/bad_request
```

### Recommended Message Mapping

```txt
task/evidence_required
Debes subir al menos una evidencia antes de completar esta tarea
```

All write-side errors should pass through a mapper layer before reaching the UI.

---

## Name Enrichment Strategy

The task module stores many references as ids:

- `branchId`
- `employeeId`
- `createdBy`
- `ratedBy`

The mobile app should enrich those references before rendering.

### Minimum Resolutions Required

- branch id -> branch name
- employee id -> employee full name
- note createdBy -> display name
- rating ratedBy -> display name

Never force the final user to interpret raw ids if the name can be resolved.

---

## Recommended Flutter Module Structure

```txt
lib/modules/tasks/
  domain/
    entities/
    enums/
    repositories/
    usecases/
  data/
    models/
    mappers/
    datasources/
      task_firestore_datasource.dart
      task_api_datasource.dart
    repositories/
  presentation/
    list/
    detail/
    create_edit/
    widgets/
```

### Suggested Responsibilities

#### Firestore datasource

- fetch task list
- fetch task detail
- fetch assignments
- fetch notes
- fetch resources
- fetch ratings
- fetch validations

#### API datasource

- create task
- update task
- assign employees
- unassign employee
- update task status
- add note
- validate
- reject
- rate
- upload evidence

#### Repository

- orchestrates read/write sources
- applies name enrichment
- filters operational assignments to active ones
- normalizes backend errors

---

## Minimum Screens For App

### Task List

- task cards or rows
- status
- due date
- branch
- assigned count
- priority
- compliance indicator
- filter support

### Task Detail

- summary
- branch
- due date
- description
- active assigned team
- notes
- evidence
- ratings
- final review records

### Action Surfaces

- create/edit
- assign
- unassign
- start
- complete
- cancel
- add note
- upload photo evidence
- rate worker
- validate
- reject

---

## Product Rules Already Stabilized

These rules are already settled and should be carried into app:

1. Reads from Firestore, writes through backend.
2. Employee and branch selectors must use search by name.
3. Raw ids should not be the normal user-facing display.
4. Self-rating is not allowed.
5. Active team should show only active assignments.
6. Unassignment is administrative.
7. Evidence is currently photo-only.
8. Backend error codes must be mapped to readable copy.
9. Final validation is a review outcome, not a separate manual domain flow.

---

## Implementation Checklist For Flutter Team

### Domain

- [ ] Define task enums
- [ ] Define task entities
- [ ] Define task config
- [ ] Define detail aggregate

### Data

- [ ] Firestore read datasource
- [ ] API write datasource
- [ ] Error mapper by backend code
- [ ] Name enrichment for branch, employee, createdBy, ratedBy
- [ ] Filter active assignments in operational detail view

### Presentation

- [ ] Task list
- [ ] Task detail
- [ ] Create/edit task flow
- [ ] Assign employees
- [ ] Unassign employees
- [ ] Start/complete/cancel
- [ ] Notes
- [ ] Photo evidence upload
- [ ] Ratings
- [ ] Final validation/rejection

### Validation

- [ ] Self-rating blocked
- [ ] Removed assignments excluded from active team UI
- [ ] Evidence required error handled
- [ ] Success/error/loading states wired in all mutations

---

## Final Directive

If the app team needs a single implementation principle, it is this:

> Build Task as a hybrid operational module: Firestore for reads, backend for writes, active assignments only in operational UI, and human-readable enriched data everywhere possible.

