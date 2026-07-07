# Task & Document Workspace — Requirements & Design Brief

> **This is the common, living spec.** It is kept up to date as requirements are
> added. See the [Changelog](#changelog) for what changed and when.
>
> **Two audiences for this document**
>
> 1. **Developers (Jagriti & Rohit)** — this is your complete spec. Build the
>    **frontend**. The **backend is already built** (see `/backend`); you consume it.
> 2. **Design generation** — the [Design & Screens](#5-design--screens) and
>    [Design System](#6-design-system) sections describe every screen visually so a
>    Figma layout can be generated from them.

---

## Changelog

- **v2 (current)** — Project is now **full-stack** and a **monorepo**
  (`frontend/` + `backend/`). Added: **auth** (login / signup), a real
  **Node/Express/Prisma backend** (replaces mockapi.io), a **common app header**
  with the logged-in user's initials + "edit name", **per-user tasks**, a
  **dashboard summary endpoint** (incl. "pending today"), and defined
  **sidebar behavior**.
- **v1** — Initial spec: dashboard, tasks, documents, users; reusable component
  kit; originally against mockapi.io.

---

## 1. Objective

A small internal "workspace" web app to manage **tasks** and **documents**, with
**user accounts**. A user signs up / logs in, lands on a dashboard summarizing
their tasks, and manages tasks (and documents) from a persistent left navigation.

The evaluation is about **how you think, plan, build, debug, and improve** — not
just finishing screens.

---

## 2. Architecture & tech constraints

**Monorepo layout**

```
/
├── frontend/     # Next.js app (App Router, JavaScript) — YOU build this
├── backend/      # Node + Express + Prisma API — already built, you consume it
├── REQUIREMENTS.md   # this file (common spec)
├── WORK_SPLIT.md     # who builds what
└── README.md         # setup for the whole monorepo
```

**Frontend (your work)**
- **Next.js** (App Router) with **JavaScript** (not TypeScript).
- **Axios** for all API calls, kept inside `src/services/` — never call the API
  directly from a component.
- **Zustand** for shared state (auth/session, users, etc.).
- Proper **loading**, **error**, and **empty** states everywhere.
- **Form validation** on every form (login, signup, task, document, edit name).
- **Reusable components** — build the UI kit once, reuse everywhere.
- Store the **auth token** (e.g. in the auth store / localStorage) and attach it as
  `Authorization: Bearer <token>` on every request via an Axios interceptor.

**Backend (already provided — see [§11 API reference](#11-backend-api-reference))**
- Node + Express + Prisma + PostgreSQL, JWT auth. You do **not** need to modify it.

---

## 3. Auth & session

- **Signup** — name, email, password. On success the API returns a **token** and
  the **user**; store both and go to the Dashboard.
- **Login** — email, password. If the user is **not registered**, the signup path
  is available (link between the two screens).
- **Protected app** — everything except login/signup requires a valid token.
  If there is no token (or it's expired → 401), redirect to **login**.
- **Logout** — clear the token/session and return to login.

---

## 4. Modules & functional requirements

### 4.1 Dashboard (default screen after login)

- On load, fetch the user's data and show **summary cards** (numbers only — **no
  charts**):
  - **Total Tasks**
  - **Pending** tasks
  - **In Progress** tasks
  - **Completed** tasks
  - **Pending Today** (tasks due today and not completed)
  - **Total Documents**
- Use the backend's `GET /dashboard` endpoint (returns all counts in one call), or
  derive from `GET /tasks`.
- Loading → card skeletons/loader; failure → error state with retry.

### 4.2 Tasks

- **Task list** (table) of the logged-in user's tasks.
- **Add task** — button shown at the **top of the Tasks screen** (only when Tasks is
  the active screen); opens a modal form.
- **Delete task** — from the list, with a confirmation dialog.
- **Edit task** and **change status** (inline) — supported by the API; include them.
- **Search** by title, **filter by status**, **filter by priority** (combine).
- Show the **assigned user's name** (not the id) where a task is assigned.
- Task fields: Title, Description, Assigned User (optional), Priority
  (Low/Medium/High), Status (Pending/In Progress/Completed), Due Date.

### 4.3 Documents

- **Document list** (table), **Add document** (modal, details only — no real file
  upload), **search** by name, **filter** by category and file type.
- Show the "uploaded by" user's name.
- Fields: Document Name, Category, File Type, Uploaded By, Uploaded Date.

### 4.4 Users

- **User dropdown** for task assignment (from `GET /users`).
- Resolve user id → **name** in lists.

---

## 5. Design & Screens

> Desktop-first (~1440px), responsive. This section is the design brief for Figma
> generation — each screen lists its regions and components.

### Global shell (every screen except login/signup)

- **Left sidebar** (~240px, fixed):
  - App name/logo at top.
  - Nav items, top to bottom: **Dashboard** (active by default), **Tasks**,
    **Documents**. The active item is highlighted.
- **Header / top bar** (~64px, common to all screens):
  - Screen title on the left.
  - On the **Tasks** screen, an **"Add Task"** primary button.
  - On the far right, a **user avatar = the logged-in user's initials** in a circle.
    Clicking it opens a small menu with **"Edit name"** (opens a modal to update the
    name via `PATCH /users/me`) and **"Logout"**.
- **Content area**: padded (24–32px), light neutral background, white cards.

### Login / Signup

- Centered card on a plain background (no sidebar/header).
- **Login**: email, password, "Log in" button, and a "Don't have an account? Sign
  up" link.
- **Signup**: name, email, password, "Create account" button, and a "Already have
  an account? Log in" link.
- Inline validation; submit shows a spinner; API errors shown as a banner.

### Dashboard

- Title "Dashboard".
- Responsive **row of metric cards** (Total, Pending, In Progress, Completed,
  Pending Today, Total Documents). Each card: label, large number, small icon,
  subtle status-colored accent. **No charts.**
- Loading skeletons; error banner on failure.

### Tasks

- Header with title "Tasks" + **"Add Task"** button (right).
- **Toolbar**: search box ("Search tasks…"), status filter, priority filter.
- **Table** columns:
  `Title | Assigned To (name) | Priority (badge) | Status (badge) | Due Date | Actions`
  - Priority badge: Low = slate/blue, Medium = amber, High = red.
  - Status badge: Pending = gray, In Progress = blue, Completed = green.
  - Actions: Edit, **Delete** (with confirm), and an inline status control.
- Pagination below. States: loader, empty ("No tasks yet — add one"), error+retry.

### Create / Edit Task (modal)

- Title "New Task" / "Edit Task". Fields stacked: Title (required), Description
  (textarea), Assigned User (select), Priority (select), Status (select), Due Date
  (date). Footer: Cancel + Save (validation + submitting state).

### Delete confirmation (dialog)

- "Delete task?" + task name + Cancel / destructive Delete.

### Documents

- Header "Documents" + **"Add Document"** button. Toolbar: search, category filter,
  file-type filter. Table: `Name | Category | File Type | Uploaded By | Uploaded Date`.
  Pagination; loader/empty/error states.

### Add Document (modal)

- Document Name (required), Category (select), File Type (select), Uploaded By
  (defaults to current user), Uploaded Date (defaults today). Cancel + Save.

### Edit Name (modal, from header menu)

- Single "Name" input pre-filled with current name; Cancel + Save
  (`PATCH /users/me`); updates the header initials on success.

---

## 6. Design System

- **Spacing**: 8px scale; card radius 12–16px; soft shadows; content max-width.
- **Typography**: one sans-serif; H1 24–28px, H2 18–20px, body 14px, caption 12px.
- **Neutrals**: white surfaces on light gray (`#F7F8FA`); near-black text, gray-600
  secondary.
- **Primary accent**: one brand color (e.g. indigo/blue) for primary buttons,
  active nav, links.
- **Status colors**: Pending = gray, In Progress = blue, Completed = green.
  Priority: Low = slate/blue, Medium = amber, High = red.
- **Avatar**: circle with the user's initials on a brand-tinted background.
- **Interactive states**: hover, focus ring, disabled on every clickable element.

---

## 7. Required reusable components

Build as generic primitives in `src/components/ui/` and compose screens from them.

| Component               | Key props / notes                                                      |
| ----------------------- | ---------------------------------------------------------------------- |
| **Button**              | `variant` (primary/secondary/destructive/ghost), `loading`, `disabled` |
| **Input**               | label, value, `onChange`, `error`, placeholder, type                   |
| **Select**              | label, options, value, `onChange`, `error`                             |
| **Modal**               | `isOpen`, `onClose`, title, footer, children; overlay + Esc/close      |
| **Table**               | columns config + rows; header, body, empty slot                        |
| **Search Box**          | debounced text input with icon                                         |
| **Status Badge**        | maps status/priority value → colored pill                              |
| **Confirmation Dialog** | title, message, confirm/cancel, destructive styling                    |
| **Loader**              | spinner / skeleton                                                     |
| **Empty State**         | icon + message + optional action                                       |
| **Error State**         | message + retry                                                        |
| **Pagination**          | page, total, `onPageChange`                                            |
| **Avatar / User menu**  | initials circle + dropdown (Edit name, Logout)                         |

---

## 8. State, loading & error handling

- Auth store (Zustand): token, current user, `login/signup/logout`, `isAuthenticated`.
- Axios interceptor attaches the token; on 401, clear session and redirect to login.
- Fetch on mount; loader while pending; error state with retry; empty state when no
  results (including filtered-to-empty).
- After create/edit/delete, refresh the list (or update the store optimistically).
- Debounce search; combine filters (status AND priority AND search).

---

## 9. Suggested build order

1. Axios `apiClient` + auth store + token interceptor; wire `.env.local`.
2. Login & Signup screens (against `/auth/*`); protected-route redirect.
3. UI kit primitives (Button, Input, Select, Modal, Table, Badge, Loader,
   Empty/Error, Pagination, Avatar/User menu).
4. App shell (sidebar + header with user menu + routing).
5. Dashboard cards (from `GET /dashboard`).
6. Tasks module (list → filters/search → add/edit → delete → inline status).
7. Documents module (list → filters/search → add).
8. Polish: states, validation, responsiveness.

---

## 10. Acceptance criteria (definition of done)

- [ ] Signup and login work; token stored; protected routes redirect when logged out.
- [ ] Header shows the user's initials; "Edit name" updates it; logout works.
- [ ] Sidebar: Dashboard active by default; Tasks and Documents navigate correctly.
- [ ] Dashboard shows the six count cards (incl. Pending Today) — numbers, no charts.
- [ ] Tasks: list, add (button at top of Tasks screen), edit, delete (with confirm),
      search, status filter, priority filter, inline status change.
- [ ] Documents: list, add, search, category + file-type filters.
- [ ] User ids resolve to names; user dropdown populated from `GET /users`.
- [ ] All API calls go through `src/services/*` with the shared Axios client.
- [ ] Every data view has loading, empty, and error states; forms validate.
- [ ] The reusable components in §7 exist and are reused.
- [ ] Meaningful Git commits; README accurate; app runs from a clean install.

---

## 11. Backend API reference

> Full request/response examples with curl are in the standalone
> [`API.md`](./API.md) — share that with the team. Summary below.

Base URL: `http://localhost:4000/api` (set as `NEXT_PUBLIC_API_BASE_URL`).
All routes except `/auth/signup` and `/auth/login` require
`Authorization: Bearer <token>`.

### Auth

| Method | Path            | Body                          | Returns                         |
| ------ | --------------- | ----------------------------- | ------------------------------- |
| POST   | `/auth/signup`  | `{ name, email, password }`   | `{ token, user }`               |
| POST   | `/auth/login`   | `{ email, password }`         | `{ token, user }`               |
| GET    | `/auth/me`      | —                             | `{ user }`                      |

### Users

| Method | Path         | Body         | Returns                       |
| ------ | ------------ | ------------ | ----------------------------- |
| GET    | `/users`     | —            | `[{ id, name, email }]`       |
| PATCH  | `/users/me`  | `{ name }`   | `{ user }`                    |

### Tasks (scoped to the logged-in user: owned or assigned)

| Method | Path          | Body / query                                                       | Returns                                  |
| ------ | ------------- | ------------------------------------------------------------------ | ---------------------------------------- |
| GET    | `/tasks`      | query: `status`, `priority`, `search`, `page`, `pageSize`          | `{ items, total, page, pageSize }`       |
| POST   | `/tasks`      | `{ title, description?, priority?, status?, dueDate?, assignedToId? }` | created task (with `assignedTo`)     |
| GET    | `/tasks/:id`  | —                                                                  | task                                     |
| PUT    | `/tasks/:id`  | any task fields (owner only)                                       | updated task                             |
| DELETE | `/tasks/:id`  | — (owner only)                                                     | `204 No Content`                         |

- `priority`: `"Low" | "Medium" | "High"`  ·  `status`: `"Pending" | "In Progress" | "Completed"`
- Each task includes `assignedTo: { id, name, email } | null`.

### Documents (scoped to the logged-in user)

| Method | Path          | Body / query                          | Returns                    |
| ------ | ------------- | ------------------------------------- | -------------------------- |
| GET    | `/documents`  | query: `search`, `category`, `fileType` | `[document]`             |
| POST   | `/documents`  | `{ name, category?, fileType? }`      | created document           |

- Each document includes `uploadedBy: { id, name, email }`.

### Dashboard

| Method | Path          | Returns                                                                              |
| ------ | ------------- | ------------------------------------------------------------------------------------ |
| GET    | `/dashboard`  | `{ totalTasks, pending, inProgress, completed, pendingToday, totalDocuments }`       |

### Errors

JSON `{ message }` (validation errors also include `errors: [{ field, message }]`).
Status codes: 400 validation, 401 auth, 404 not found, 409 conflict (e.g. duplicate
email), 500 server.

---

## 12. Deliverables

- Working frontend app (backend is provided).
- Updated README; screenshots if possible.
- Short write-up each: **learnings**, **challenges faced**, **future improvements**.

---

## 13. How you'll be evaluated

Requirement understanding · API integration · code structure · reusable-component
thinking · form handling · error handling · debugging approach · UI consistency ·
ownership · communication · **improvement after feedback**.
