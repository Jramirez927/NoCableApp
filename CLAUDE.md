# NoCableApp — Claude Context

A full-stack social travel journaling app. Users pin journal entries on a map, add friends, and see friends' entries on their map feed.

## Stack

### Backend — `NoCableApp.Server/`
- **.NET 8** / ASP.NET Core
- **Entity Framework Core 8** with **SQLite** (`NoCableApp.db`)
- **ASP.NET Identity** (`NoCableUser` extends `IdentityUser`) — cookie-based auth, no tokens
- Runs on **https://localhost:7054**

### Frontend — `nocableapp.client/`
- **React 19** + **TypeScript 5** (strict mode)
- **Vite 7** (dev server on **https://localhost:5173**, proxies `/api` → backend)
- **Bootstrap 5** for UI — used directly via utility classes and via **React Bootstrap 2** (React component wrappers built on Bootstrap 5)
- **OpenLayers 10** for the interactive map
- **React Router 7** for routing

## Running the App

```bash
# Terminal 1 — backend
cd NoCableApp.Server && dotnet run --launch-profile https

# Terminal 2 — frontend
cd nocableapp.client && npm run dev

# Apply migrations (first time or after schema changes)
cd NoCableApp.Server && dotnet ef database update
```

Dev emails (e.g. email confirmation) are written to `NoCableApp.Server/Emails/` — not sent via SMTP.

## Project Structure

```
NoCableApp.Server/
  Controllers/       # API controllers
  Models/            # EF entities + request DTOs
  Data/              # DbContext + Migrations
  Services/          # Business logic (e.g. FileEmailSender)

nocableapp.client/src/
  api/               # API client functions (one file per domain)
  contexts/          # React contexts (AuthProvider, MapProvider)
  components/        # Reusable components (AppNavbar, LocationSearch, ProtectedRoute)
  pages/             # Page-level components (one folder per route)
    storymap/        # Main map page and all its sub-components
  utils/             # MapUtils.ts (OpenLayers helpers)
```

## API Patterns

### Backend conventions
- All controllers: `[ApiController]`, `[Authorize]`, `[Route("api/[controller]")]`
- Return shapes are anonymous objects projected in `.Select()` — no dedicated response DTOs
- DTOs for incoming requests live in `Models/` with a `Request` suffix (e.g. `CreateJournalEntryRequest`)
- Get current user id via `_userManager.GetUserId(User)` — never trust client-provided user ids
- Status codes: 200 OK, 201 Created, 400 Bad Request, 401, 403, 404, 409 Conflict

### Frontend `safeFetch` wrapper
Every API call goes through `safeFetch` in `src/api/safeFetch.ts`. It returns a `Result<T>`:
- Success: `{ data: T, error: null }`
- Error: `{ data: null, error: string }`

Always check `data` before using it:
```ts
const { data } = await getSomething();
if (data) doSomethingWith(data);
```

All `fetch` calls include `credentials: "include"` for cookie auth.

### Adding a new API endpoint
1. Add controller action (C#)
2. Add interface + async function in the matching `src/api/*.ts` file
3. Call it from a component via the function — never `fetch` directly from components

## Data Models

**JournalEntry** — `id`, `title`, `body`, `placeName`, `latitude`, `longitude`, `dateVisited`, `createdAt`, `userId`

**Friendship** — `id`, `requesterId`, `addresseeId`, `status` (enum: `Pending | Accepted | Declined`), `createdAt`

**NoCableUser** — extends `IdentityUser` (no custom properties yet)

DbContext: `NoCableDbContext` → `DbSet<JournalEntry>`, `DbSet<Friendship>`; inherits `IdentityDbContext<NoCableUser>`

## Auth

- Cookie-based, HttpOnly, SameSite=Strict, HTTPS only
- 1-hour sliding session
- Email confirmation required before first login
- Frontend: `AuthProvider` context → `useAuth()` hook → `ProtectedRoute` component
- All authenticated requests automatically send the cookie via `credentials: "include"`

## Naming Conventions

| What | Convention | Example |
|---|---|---|
| C# classes, methods, properties | PascalCase | `GetAll()`, `UserId`, `JournalEntry` |
| C# request DTOs | PascalCase + `Request` suffix | `CreateJournalEntryRequest` |
| TS/TSX component files | PascalCase | `StorymapFeedPanel.tsx` |
| TS API/util files | PascalCase | `JournalEntries.ts`, `SafeFetch.ts` |
| TS interfaces | PascalCase | `JournalEntry`, `FeedEntry`, `AuthContextType` |
| TS API functions | camelCase verb + noun | `getJournalEntries()`, `sendFriendRequest()` |
| React context hooks | `use[Name]` | `useAuth()`, `useMap()` |
| CSS modules | `ComponentName.module.css` | `Storymap.module.css` |

## Map (OpenLayers)

All OL helpers live in `src/utils/MapUtils.ts` (static class). Use them instead of calling OL directly:
- `MapUtils.createEntryStyle(color, scale)` — journal entry SVG marker
- `MapUtils.createPinIconStyle(color, scale)` — search/drop pin
- `MapUtils.navigateToCoords(map, coords, options, onComplete)` — animated pan/zoom
- `MapUtils.createVectorLayer(style)` — returns `{ source, layer }`

The map instance is shared via `MapProvider` context → `useMap()` returns `{ map, mapDivRef }`.

Coordinate system: store and transmit as `[longitude, latitude]` (EPSG:4326); convert to EPSG:3857 via `fromLonLat` before adding to map features.

## Key Files to Know

| File | Purpose |
|---|---|
| `NoCableApp.Server/Program.cs` | App startup, auth config, middleware |
| `NoCableApp.Server/Data/NoCableDbContext.cs` | EF schema |
| `nocableapp.client/src/api/safeFetch.ts` | Result wrapper for all API calls |
| `nocableapp.client/src/contexts/AuthProvider.tsx` | Auth state + methods |
| `nocableapp.client/src/contexts/MapProvider.tsx` | OL map instance |
| `nocableapp.client/src/utils/MapUtils.ts` | OL utilities |
| `nocableapp.client/src/App.tsx` | Route definitions |
| `nocableapp.client/vite.config.js` | Dev server + API proxy config |
