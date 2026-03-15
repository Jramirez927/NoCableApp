# NoCableApp

A full-stack social travel journaling app. Users pin journal entries on an interactive map, add friends, and browse friends' entries on a shared map feed.

## Features

- **Map-based journaling** — pin entries to locations with a title, body, and date visited
- **Friends system** — send/accept friend requests and view friends' entries on your map feed
- **Secure auth** — cookie-based authentication with email confirmation and account lockout
- **Location search** — search for places using Nominatim/Photon geocoding

## Stack

- **Backend:** .NET 8 / ASP.NET Core, Entity Framework Core 8, SQLite, ASP.NET Identity
- **Frontend:** React 19 + TypeScript 5, Vite 7, Bootstrap 5, OpenLayers 10, React Router 7

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (LTS recommended)
- EF Core CLI tools:
  ```bash
  dotnet tool install --global dotnet-ef
  ```

### 1. Set up a local HTTPS certificate (mkcert)

The Vite dev server runs over HTTPS and requires a trusted local certificate.

```bash
# Install mkcert (macOS: brew install mkcert, Windows: choco install mkcert)
mkcert -install
mkdir -p nocableapp.client/certs
mkcert -cert-file nocableapp.client/certs/localhost.pem \
       -key-file nocableapp.client/certs/localhost-key.pem \
       localhost 127.0.0.1 ::1
```

> The `certs/` folder is already in `.gitignore` — do not commit private keys.

### 2. Apply database migrations

```bash
cd NoCableApp.Server
dotnet ef database update
```

This creates `NoCableApp.db` and applies all migrations.

### 3. Run the app

**Terminal 1 — Backend** (must use the `https` profile):
```bash
cd NoCableApp.Server
dotnet run --launch-profile https
```
Backend runs at `https://localhost:7054`.

**Terminal 2 — Frontend:**
```bash
cd nocableapp.client
npm install   # first time only
npm run dev
```
Frontend runs at `https://localhost:5173`. All `/api` requests are proxied to the backend.

> Running `dotnet run` without `--launch-profile https` starts on HTTP only and the Vite proxy will fail.

## Development Notes

- **Email confirmation** — dev emails (registration, confirmation) are written to `NoCableApp.Server/Emails/` instead of being sent via SMTP.
- **Auth** — sessions are cookie-based (HttpOnly, SameSite=Strict). No tokens. The frontend uses `AuthProvider` → `useAuth()` → `ProtectedRoute`.
- **API calls** — all frontend API calls go through `safeFetch` in `src/api/SafeFetch.ts`, which returns `{ data, error }`. Always check `data` before using it.
- **Map** — the OpenLayers map instance is shared via `MapProvider` → `useMap()`. Use helpers in `src/utils/MapUtils.ts` rather than calling OpenLayers directly.

### Adding a database migration

```bash
cd NoCableApp.Server
dotnet ef migrations add <MigrationName>
dotnet ef database update
```
