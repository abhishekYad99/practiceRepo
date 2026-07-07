# API Reference — Task & Document Workspace

Backend: **Node + Express + Prisma (PostgreSQL)**, JWT auth.

- **Base URL (local):** `http://localhost:4000/api`
- **Base URL (LAN — backend on host machine):** `http://192.168.0.131:4000/api`
- Set this as `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local`.

> **Demo login (seeded):** `demo@workspace.dev` / `password123`

---

## Conventions

- All requests and responses are **JSON**. Send `Content-Type: application/json`.
- **Auth:** every route **except** `POST /auth/signup` and `POST /auth/login`
  requires a header:
  ```
  Authorization: Bearer <token>
  ```
  You get `<token>` from signup/login. If it's missing/expired you get `401`.
- **Scope:** tasks and documents are **per-user**. You only ever see/modify your
  own data (tasks you own or are assigned; documents you uploaded).

### Status codes

| Code | Meaning                                             |
| ---- | --------------------------------------------------- |
| 200  | OK                                                  |
| 201  | Created                                             |
| 204  | No Content (successful delete)                      |
| 400  | Validation error (see `errors` array)               |
| 401  | Missing/invalid token, or wrong login credentials   |
| 404  | Resource not found (or not yours)                   |
| 409  | Conflict (e.g. email already registered)            |
| 500  | Server error                                        |

### Error shape

```json
{ "message": "Human readable message" }
```

Validation errors (400) also include a field list:

```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "A valid email is required" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}
```

---

## Data models

**User** (password is never returned)
```json
{
  "id": "cmraejc2g0000vkb0u4cv7gqs",
  "name": "Demo User",
  "email": "demo@workspace.dev",
  "createdAt": "2026-07-07T08:43:31.672Z",
  "updatedAt": "2026-07-07T08:43:31.672Z"
}
```

**Task** (`assignedTo` is the resolved user or `null`)
```json
{
  "id": "cmraejeqh0005vkb0v332n0lf",
  "title": "Add form validation",
  "description": null,
  "priority": "High",
  "status": "Pending",
  "dueDate": "2026-07-08T08:43:35.114Z",
  "createdAt": "2026-07-07T08:43:35.129Z",
  "updatedAt": "2026-07-07T08:43:35.129Z",
  "ownerId": "cmraejc2g0000vkb0u4cv7gqs",
  "assignedToId": null,
  "assignedTo": null
}
```
- `priority`: `"Low" | "Medium" | "High"`
- `status`: `"Pending" | "In Progress" | "Completed"`

**Document** (`uploadedBy` is the resolved user)
```json
{
  "id": "cmraej...",
  "name": "Project Brief",
  "category": "Report",
  "fileType": "PDF",
  "createdAt": "2026-07-07T08:43:35.200Z",
  "updatedAt": "2026-07-07T08:43:35.200Z",
  "uploadedById": "cmraejc2g0000vkb0u4cv7gqs",
  "uploadedBy": { "id": "cmraejc2g0000vkb0u4cv7gqs", "name": "Demo User", "email": "demo@workspace.dev" }
}
```

---

## Auth

### POST `/auth/signup`
Create an account. Public.

**Body**
```json
{ "name": "Jane Dev", "email": "jane@example.com", "password": "secret123" }
```
**201 Response**
```json
{ "token": "<jwt>", "user": { "id": "...", "name": "Jane Dev", "email": "jane@example.com", "createdAt": "...", "updatedAt": "..." } }
```
Errors: `400` validation, `409` email already registered.

**Example**
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Dev","email":"jane@example.com","password":"secret123"}'
```

### POST `/auth/login`
Public.

**Body**
```json
{ "email": "demo@workspace.dev", "password": "password123" }
```
**200 Response**
```json
{ "token": "<jwt>", "user": { "id": "...", "name": "Demo User", "email": "demo@workspace.dev", "createdAt": "...", "updatedAt": "..." } }
```
Errors: `401` invalid email or password.

### GET `/auth/me`
Returns the current user. **Auth required.**

**200 Response**
```json
{ "user": { "id": "...", "name": "Demo User", "email": "demo@workspace.dev", "createdAt": "...", "updatedAt": "..." } }
```

---

## Users

### GET `/users`
List all users (for the assignment dropdown / name lookups). **Auth required.**

**200 Response**
```json
[
  { "id": "cmraejc2g0000vkb0u4cv7gqs", "name": "Demo User", "email": "demo@workspace.dev", "createdAt": "..." },
  { "id": "cmraejdhm0001vkb0kbsfcgul", "name": "Sam Teammate", "email": "teammate@workspace.dev", "createdAt": "..." }
]
```

### PATCH `/users/me`
Update the logged-in user's name (used by the header "Edit name"). **Auth required.**

**Body**
```json
{ "name": "New Name" }
```
**200 Response**
```json
{ "user": { "id": "...", "name": "New Name", "email": "...", "createdAt": "...", "updatedAt": "..." } }
```

---

## Tasks  *(all require auth)*

### GET `/tasks`
List the current user's tasks (owned or assigned), newest first.

**Query params** (all optional)

| Param      | Example        | Notes                                          |
| ---------- | -------------- | ---------------------------------------------- |
| `status`   | `Pending`      | filter by status                               |
| `priority` | `High`         | filter by priority                             |
| `search`   | `report`       | case-insensitive match on title                |
| `page`     | `1`            | default 1                                      |
| `pageSize` | `20`           | default 20, max 100                            |

**200 Response**
```json
{
  "items": [ { "id": "...", "title": "Add form validation", "priority": "High", "status": "Pending", "assignedTo": null, "...": "..." } ],
  "total": 2,
  "page": 1,
  "pageSize": 20
}
```

**Example**
```bash
curl "http://localhost:4000/api/tasks?status=Pending&priority=High" \
  -H "Authorization: Bearer <token>"
```

### POST `/tasks`
Create a task (owned by you).

**Body** (only `title` is required)
```json
{
  "title": "Write docs",
  "description": "API reference",
  "priority": "Medium",
  "status": "Pending",
  "dueDate": "2026-07-20",
  "assignedToId": "cmraejdhm0001vkb0kbsfcgul"
}
```
- `priority` defaults to `"Medium"`, `status` to `"Pending"`.
- `dueDate` accepts an ISO date/datetime string; `assignedToId` is optional.

**201 Response:** the created task (with `assignedTo` resolved).

### GET `/tasks/:id`
Fetch one of your tasks. `404` if not found / not yours.

### PUT `/tasks/:id`
Update a task. **Owner only.** Send any subset of the create fields (e.g. just
`{ "status": "Completed" }` for an inline status change).

**200 Response:** the updated task. Errors: `404`.

**Example (inline status change)**
```bash
curl -X PUT http://localhost:4000/api/tasks/<id> \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"status":"Completed"}'
```

### DELETE `/tasks/:id`
Delete a task. **Owner only.** **204** on success (empty body). Errors: `404`.

---

## Documents  *(all require auth)*

### GET `/documents`
List the current user's documents, newest first.

**Query params** (optional): `search` (name, case-insensitive), `category`, `fileType`.

**200 Response:** array of documents (each with `uploadedBy` resolved).

### POST `/documents`
Add a document (metadata only — no real file upload).

**Body** (only `name` is required)
```json
{ "name": "Q3 Report", "category": "Report", "fileType": "PDF" }
```
**201 Response:** the created document (with `uploadedBy`).

---

## Dashboard  *(requires auth)*

### GET `/dashboard`
All the counts the dashboard cards need, in one call.

**200 Response**
```json
{
  "totalTasks": 4,
  "pending": 2,
  "inProgress": 1,
  "completed": 1,
  "pendingToday": 2,
  "totalDocuments": 2
}
```
- `pendingToday` = tasks due today that are not `Completed`.

---

## Quick start for the frontend

```js
// after login/signup, store token, then attach it to every request:
axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { Authorization: `Bearer ${token}` },
});
```

Typical flow: **signup/login → store token → GET `/dashboard` → GET `/tasks` /
`/documents` → create/update/delete.** On any `401`, clear the token and send the
user back to login.
