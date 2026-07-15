# Buddyscript

Social feed app — Next.js 16 client + Express 5 API.

## Stack

| Layer | Tech |
|---|---|
| Client | Next.js 16 (App Router), React 19, Zustand, TanStack Query, Axios, Bootstrap 5 |
| Server | Express 5, Prisma 7 + PostgreSQL, JWT auth, Cloudinary, Redis (optional) |

## Setup

### 1. Prerequisites

- Node.js 20+
- PostgreSQL (local or [Prisma Accelerate](https://prisma.io/accelerate))
- [Cloudinary](https://cloudinary.com) account (image upload)
- Redis (optional — feed caching, falls back to DB)

### 2. Server

```bash
cd server
cp .env.example .env   # fill in your values
npm install
npx prisma migrate dev # or: npx prisma db push
npm run dev
```

**Required env vars:** `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

`JWT_ACCESS_EXPIRES_IN` and `JWT_REFRESH_EXPIRES_IN` default to `15m` / `7d` in dev (overridden in `.env`).

### 3. Client

```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

Opens at `http://localhost:3000`. API proxy to `http://localhost:5000`.

## Commands

### Client

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint (`--max-warnings=0`) |
| `npm run type-check` | `tsc --noEmit` |

### Server

| Command | Purpose |
|---|---|
| `npm run dev` | Hot-reload dev (port 5000) |
| `npm run build` | Prisma generate + TypeScript compile |
| `npm run start` | Run compiled output |
| `npx prisma migrate dev` | Run pending migrations |
| `npx prisma db push` | Push schema without migration |

No test suite exists.

## API

All routes under `/api/v1`. Auth via httpOnly cookies (JWT access/refresh).

| Module | Endpoints |
|---|---|
| Auth | `POST /auth/login`, `/register`, `/refresh`, `/logout` |
| Post | `POST /`, `GET /` (paginated feed), `PATCH /:id`, `DELETE /:id` |
| Like | `POST /toggle` (entityType: `post`|`comment`|`reply`) |
| Comment | `POST /` |
| Reply | `POST /` |

## Architecture notes

- **Server is ESM** — local imports use `.js` extension (e.g. `../../lib/prisma.js`). `tsx`/`tsc` handle `.ts`→`.js` at runtime.
- **Prisma v7** — config in `prisma.config.ts`, schema split across `prisma/schema/*.prisma`. Generated client at `generated/prisma/client.js`.
- **Auth** — access token in httpOnly cookie (15m), refresh token (7d). Session revocation via `tokenVersion` on User model.
- **Redis** — optional, caches feed queries for 30s. Graceful fallback to DB.

## Deployment

```
server/ → Render (or any Node host)
client/ → Vercel (or any Next.js host)
```

Set all env vars in the production environment. On Render, ensure `APP_URL` points to your client origin. Client `.env.production` sets `NEXT_PUBLIC_API_BASE_URL` to the deployed API URL.

**Gotcha:** API and client on different origins require `withCredentials: true` (already configured). The client uses client-side auth guards (no middleware) so feed protection works regardless of domain.
