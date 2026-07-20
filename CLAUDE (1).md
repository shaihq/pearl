````md
---
description:
alwaysApply: true
---

# CLAUDE.md

This file provides guidance for AI coding agents working in this repository.

## Stack

- Next.js 16 (Pages Router)
- React 19
- JavaScript (No TypeScript)
- Tailwind CSS v4
- shadcn/ui
- TanStack React Query v5
- Axios

## Git Rules

- **Never commit or push** unless explicitly requested.
- Leave changes in the working tree or staged.

## Commands

```bash
npm run dev
npm run dev:host
npm run build
npm run start
npm run lint
```

## Code Rules

- Use **JavaScript only** (`.js` / `.jsx`).
- **Never generate TypeScript**.
- This project uses the **Pages Router**. Never use the App Router.
- Reuse existing components, hooks, utilities, and patterns before creating new ones.
- Keep changes focused and minimal. Do not refactor unrelated code.
- Do not install new dependencies unless explicitly requested.
- Use the `@/` import alias whenever possible.

## UI Rules

- **Use shadcn/ui strictly. This is non-negotiable.**
- **NEVER use raw HTML form elements** (`<input>`, `<button>`, `<select>`, `<textarea>`) when a shadcn/ui equivalent exists. Always use `Input`, `Button`, `Select`, `Textarea`, etc. from `@/components/ui/`.
- Always check `src/components/ui/` for an existing shadcn component before writing any custom UI element.
- Use Tailwind CSS v4 utilities for styling.
- Match the existing design system, spacing, typography, and component patterns.
- Avoid custom CSS unless necessary.

---

# Architecture Overview

This is a **Next.js 16 SaaS portfolio builder** using the **Pages Router**. Users create and customize professional portfolio websites with multiple visual templates.

## Routing

- `src/pages/` — all routes via Pages Router
- `src/proxy.js` — subdomain + custom domain routing
- Protected pages use `loggedInServerSideProps.js` inside `getServerSideProps`

### Key Routes

- `/builder` — main editor/dashboard
- `/project/[id]/editor` — project editor
- `/portfolio-preview` — in-app preview
- `/preview/[id]` — public portfolio
- `/project/[id]/preview` — project preview
- `/project/[id]` — published public project
- `/ai-tools` — AI workspace
- `/jobs` — portfolio suggested jobs
- `/jobs/documents` — Documents generated for jobs

---

## State Management

### Global Context

Primary UI state lives in:

```
src/context/globalContext.jsx
```

Access via:

```jsx
useGlobalContext();
```

Manages:

- Authentication
- User data
- Portfolio content
- Editor state
- Unsaved changes
- Onboarding
- Premium state

### Server State

Use **TanStack React Query v5** for all server state.

Do not duplicate server state into Context unless following an existing pattern.

---

## API Layer

- Axios instance:
  - `src/network/axiosInstance.js`
- Request helpers:
  - `src/network/get-request.js`
  - `src/network/post-request.js`

Never call Axios directly from React components.

Always add new request functions to the network layer.

---

## Template System

Templates live in:

```
src/components/comp/
src/components/templates/
```

All templates share the same user data structure.

---

## Project Navigation Rules

| Route                   | Source            | Back Destination     |
| ----------------------- | ----------------- | -------------------- |
| `/portfolio-preview`    | Builder           | `/builder`           |
| `/project/[id]/preview` | Portfolio Preview | `/portfolio-preview` |
| `/project/[id]/editor`  | Builder           | `/builder`           |
| `/project/[id]`         | Public Portfolio  | Browser Back         |

### Template Props

Use the correct prop:

- `isEditing`
- `preview`
- `publicView`

Do not invent new navigation props.

---

## Preview Rules

### `/portfolio-preview`

Every template **must** include an **Exit Preview** button.

### `/project/[id]/preview`

Every template must include a **Back to Preview** button unless it already provides its own navigation.

---

## UI State

Modal and sidebar identifiers live in:

```
src/lib/constant.js
```

Register new identifiers there.

---

## Styling

- Tailwind CSS v4
- shadcn/ui
- SCSS only when necessary
- CSS variables for theming
- Dark mode via existing theme implementation

---

## Path Alias

```
@/* -> src/*
```

Always prefer the alias over long relative imports.

---

## Integrations

- PostHog
- Dodo Payments
- @dnd-kit
- Tiptap
- html2canvas
- jsPDF

Reuse existing integrations and components before introducing alternatives.
````
