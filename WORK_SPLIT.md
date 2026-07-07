# Work Split — Jagriti & Rohit

This project is built **collaboratively by two developers, Jagriti and Rohit**.
This doc defines who owns what, how to avoid stepping on each other, and the shared
"contracts" you must agree on **before** splitting off to work in parallel.

Read [`REQUIREMENTS.md`](./REQUIREMENTS.md) first — that's the full spec. This doc
is only about *dividing* that work.

> **Scope note:** the **backend is already built** (`/backend`, Node/Express/Prisma)
> — you only build the **frontend** (`/frontend`) against the API in
> `REQUIREMENTS.md §11`. You do not touch backend code.

---

## 1. Guiding principle

The two of you depend on each other's components (Jagriti's form inputs are used in
Rohit's document form; Rohit's Table is used in Jagriti's task list). So the
**first thing you do together** is agree on the component APIs in §4. Once those
"contracts" are fixed, you can build in parallel against them without blocking each
other.

---

## 2. Phase 0 — Do this together (pair, ~first sitting)

Before splitting up, agree on and commit these as a pair (or one drives, one
reviews). This is the shared foundation both of you build on:

- [ ] Backend running locally (see root README) and `.env.local` in `frontend/`
      pointing at `http://localhost:4000/api`.
- [ ] Shared **Axios `apiClient`** + **auth store** (Zustand) + **token
      interceptor** (attaches `Authorization: Bearer`, redirects to login on 401).
      This is shared infra — build it together; both features depend on it.
- [ ] Confirm you can **sign up / log in** and that `GET /users` returns data.
- [ ] Agree on the **component prop contracts** in §4 (write them down as JSDoc
      or empty component files with the agreed props). This is the key step.
- [ ] Agree on the **data shapes / API contract** (`REQUIREMENTS.md §11`).
- [ ] Agree on branch/PR workflow (§5).

Commit this foundation to `main` so you both branch from the same base.

---

## 3. Ownership split

### Jagriti — Tasks + form primitives

**Reusable components (`src/components/ui/`)**
- Button
- Input
- Select
- Modal
- Confirmation Dialog
- Status Badge

**Feature work**
- **Auth screens**: **Login** and **Signup** pages + forms, calling `/auth/*`
  through an `authService.js` (wired into the shared auth store from Phase 0).
- **Edit Name modal** (opened from Rohit's header menu) → `PATCH /users/me`.
- Full **Tasks module** (`/tasks`):
  - Task table (uses Rohit's `Table`), with Assigned-To resolved to user name.
  - **Add Task** button at the top of the Tasks screen; Create/Edit **TaskForm**
    (in `src/components/forms/`).
  - Delete with Confirmation Dialog.
  - Search by title + filter by status + filter by priority (combined).
  - Inline "change status" control in the list.
- `taskService.js` implementation.

### Rohit — Documents + Dashboard + shell + data primitives

**Reusable components (`src/components/ui/`)**
- Table
- Search Box
- Loader (spinner + skeleton)
- Empty State
- Error State
- Pagination

**Feature work**
- **Global shell**: left sidebar (Dashboard active by default, then Tasks,
  Documents) + **common header** with the **user-initials avatar + menu**
  (Edit name → opens Jagriti's modal; Logout) + routing + the **protected-route
  guard** (redirect to login when unauthenticated).
- **Documents module** (`/documents`): document table, **DocumentForm** (uses
  Jagriti's Input/Select/Button/Modal), search by name, filter by category +
  file type.
- **Dashboard**: the **6 metric cards** (Total, Pending, In Progress, Completed,
  Pending Today, Total Documents) from `GET /dashboard` — numbers only, no charts.
- **Users**: the shared Zustand `userStore` (fetch once, reuse for name lookups
  and dropdown options) + `userService.js` + `documentService.js`.

### Why this split

- Roughly equal effort: Jagriti owns the heaviest single module (Tasks CRUD +
  filters + inline status); Rohit owns two lighter modules (Documents + Dashboard)
  plus the shell and the shared user store.
- Component ownership is grouped so each person builds a coherent set: Jagriti owns
  the **form/input** family, Rohit owns the **data-display** family
  (table/loader/states).

---

## 4. Shared contracts — agree BEFORE coding

You use each other's components, so lock these props first. (Adjust the exact
names together — just write them down and don't change them unilaterally.)

```
// Owned by Jagriti — used by both
Button({ variant, loading, disabled, onClick, children })
Input({ label, value, onChange, error, placeholder, type })
Select({ label, options, value, onChange, error })   // options: [{ value, label }]
Modal({ isOpen, onClose, title, footer, children })
ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, loading })
StatusBadge({ value })   // maps status/priority string -> colored pill

// Owned by Rohit — used by both
Table({ columns, rows, isLoading, emptyState })   // columns: [{ key, header, render }]
SearchBox({ value, onChange, placeholder })        // debounced
Loader({ variant })                                 // "spinner" | "skeleton"
EmptyState({ title, message, action })
ErrorState({ message, onRetry })
Pagination({ page, pageSize, total, onPageChange })
UserMenu({ user, onEditName, onLogout })   // initials avatar + dropdown (header)
```

**Users are shared data.** Rohit builds the `userStore`; Jagriti consumes it for the
Assigned-To dropdown and to resolve ids → names. Agree on its shape:

```
useUserStore(): { users, loading, error, fetchUsers(), getUserName(id) }
```

**Auth is shared infra (built together in Phase 0).** Agree on the auth store so
both of you build against the same thing:

```
useAuthStore(): { token, user, isAuthenticated,
                  login(email,password), signup(name,email,password),
                  logout(), updateName(name) }
```

### Working in parallel before the other's component exists

If you need a component the other owns and it isn't ready, create a tiny local
**stub** that matches the agreed props (e.g. a plain `<table>` or a `<button>`),
and swap in the real one once it lands. The contract is what lets you do this.

---

## 5. Collaboration workflow (avoid merge conflicts)

- Work on **feature branches**, never directly on `main`
  (e.g. `feat/tasks-list`, `feat/ui-table`).
- Open a **PR** for each meaningful chunk; the other person reviews before merge.
- Keep PRs small and focused — easier to review, fewer conflicts.
- **File ownership minimizes conflicts**: you rarely touch the same files because
  your components and pages live in separate files. Shared touch-points:
  - `src/services/apiClient.js` — set up once in Phase 0, then leave it alone.
  - `src/constants/index.js` — add constants under your own section.
  - `src/app/layout.js` / routing / sidebar — **Rohit owns**; Jagriti requests
    changes via Rohit.
- Pull/rebase from `main` often so branches don't drift.
- Write **meaningful commit messages** (`feat: task filters`, not `update`).

---

## 6. Integration checkpoints

Sync at these points so the pieces fit:

1. **After Phase 0** — contracts + foundation on `main`.
2. **After UI kit** — both component sets merged; do a quick demo to each other.
3. **After shell + one module** — Rohit's shell hosts Jagriti's Tasks page
   end-to-end.
4. **Before final** — full walkthrough of every acceptance-criteria item in
   `REQUIREMENTS.md §10`, plus loading/empty/error states on every view.

---

## 7. Shared deliverables (both contribute)

- README kept accurate (whoever changes setup updates it).
- Each of you writes your own **learnings / challenges / improvements** section.
- Screenshots of your areas.

---

## 8. Quick ownership table

| Area                                    | Owner   |
| --------------------------------------- | ------- |
| Button, Input, Select                   | Jagriti |
| Modal, Confirm Dialog                   | Jagriti |
| Status Badge                            | Jagriti |
| **Login + Signup pages** + `authService`| Jagriti |
| **Edit Name modal**                     | Jagriti |
| Tasks module + TaskForm                 | Jagriti |
| `taskService.js`                        | Jagriti |
| Table, Search Box                       | Rohit   |
| Loader, Empty, Error states             | Rohit   |
| Pagination                              | Rohit   |
| Global shell + routing + route guard    | Rohit   |
| **Header + user-initials menu (`UserMenu`)** | Rohit |
| Documents module + form                 | Rohit   |
| Dashboard (6 cards)                     | Rohit   |
| User store + dropdown                   | Rohit   |
| `userService`, `documentService`        | Rohit   |
| `apiClient` + **auth store + token interceptor** | Both (Phase 0) |
| README, write-ups                       | Both    |
