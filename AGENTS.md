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
