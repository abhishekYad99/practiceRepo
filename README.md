# Task & Document Workspace (Monorepo)

Full-stack app to manage **tasks** and **documents** with **user accounts**.

```
/
├── frontend/   # Next.js app (App Router, JS) — built by Jagriti & Rohit
├── backend/    # Node + Express + Prisma API (PostgreSQL, JWT auth) — provided
├── REQUIREMENTS.md   # the common spec (read this first)
└── WORK_SPLIT.md     # who builds what on the frontend
```

- **Full spec:** [`REQUIREMENTS.md`](./REQUIREMENTS.md)
- **Frontend work split:** [`WORK_SPLIT.md`](./WORK_SPLIT.md)
- **API reference:** [`API.md`](./API.md)

This repo uses **npm workspaces**, so a single `npm install` at the root installs
both apps.

## Prerequisites

- Node.js 20.19+ (or 22.13+)
- A **PostgreSQL** database (a connection string / "DB link")

## 1. Install

```bash
npm install        # from the repo root — installs frontend + backend
```

## 2. Configure & run the backend

```bash
cp backend/.env.example backend/.env
# edit backend/.env: set DATABASE_URL (your Postgres link) and JWT_SECRET
```

Then create the tables and (optionally) seed demo data:

```bash
npm run prisma:push        # syncs DB tables to the Prisma schema (no shadow DB)
npm run db:seed            # optional: seeds a demo user + sample data
```

> `prisma:push` is used here because it works with pooled hosts like Neon without a
> shadow database. `npm run prisma:migrate` is available if you want versioned
> migration files instead.

Run the API:

```bash
npm run dev:backend        # http://localhost:4000  (health: /health)
```

> Seeded login: `demo@workspace.dev` / `password123`

### Letting teammates reach your local backend (LAN)

Since the backend runs on your machine (not hosted), teammates on the **same
network** point their frontend at your LAN IP (currently `192.168.0.131`):

```
NEXT_PUBLIC_API_BASE_URL=http://192.168.0.131:4000/api
```

For this to work, **allow inbound port 4000 through Windows Firewall** on the host
machine (one-time). The backend already listens on all interfaces and CORS already
allows `http://localhost:3000` and `http://192.168.0.131:3000`. If your IP changes,
update `CORS_ORIGIN` in `backend/.env` and the teammates' `.env.local`.

## 3. Configure & run the frontend

```bash
cp frontend/.env.example frontend/.env.local
# NEXT_PUBLIC_API_BASE_URL is already set to http://localhost:4000/api
npm run dev:frontend       # http://localhost:3000
```

## Root scripts

| Command                    | What it does                          |
| -------------------------- | ------------------------------------- |
| `npm run dev:backend`      | Start the API (nodemon)               |
| `npm run dev:frontend`     | Start the Next.js dev server          |
| `npm run build:frontend`   | Build the frontend                    |
| `npm run prisma:generate`  | Generate the Prisma client            |
| `npm run prisma:migrate`   | Run Prisma migrations (needs DB)      |
| `npm run db:seed`          | Seed demo data (needs DB)             |

## Backend at a glance

- **Auth:** `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`
- **Users:** `GET /api/users`, `PATCH /api/users/me`
- **Tasks:** `GET/POST /api/tasks`, `GET/PUT/DELETE /api/tasks/:id`
- **Documents:** `GET/POST /api/documents`
- **Dashboard:** `GET /api/dashboard`

Full request/response shapes are in [`REQUIREMENTS.md §11`](./REQUIREMENTS.md#11-backend-api-reference).

## Deliverables (frontend)

- [ ] Working frontend app
- [ ] Accurate setup steps
- [ ] Screenshots
- [ ] **Learnings**, **challenges faced**, **future improvements** (each developer)
