# TrainBoard

A real-time train departure board with a **public display** and a **TOTP-protected admin CRUD interface**, built on FastAPI and Next.js

TrainBoard is a full-stack departure board system.

- A public React frontend polls a FastAPI REST API to render live train departures.
- The admin CRUD interface is gated behind **TOTP MFA (RFC 6238)** — **session** established via `httpOnly` cookie, **secret persisted locally**, **verification fully offline**.
- The backend follows a strict layered architecture (`routes` → `services` → `db`) with **Pydantic** for schema validation.
- The frontend separates concerns across **typed API clients**, **custom hooks**, and **stateless components** using **Next.js App Router**


## Project Layout

```
train-station/
│
├── backend/
│   ├── .env                                   # Runtime config (host, port, CORS, TOTP settings)
│   ├── requirements.txt                       # Python dependencies
│   └── app/
│       ├── main.py                            # FastAPI app factory: wires CORS middleware + routers
│       │
│       ├── core/
│       │   ├── config.py                      # Pydantic-settings: reads .env into a typed Settings object
│       │   └── security.py                    # TOTP secret lifecycle, QR generation, session store (dict), token helpers
│       │
│       ├── models/
│       │   └── departure.py                   # Pydantic schemas: Departure (read), DepartureCreate, DepartureUpdate
│       │
│       ├── db/
│       │   └── database.py                    # In-memory dict store + seed data (swap for SQLAlchemy)
│       │
│       ├── services/
│       │   ├── departure_service.py           # CRUD business logic: list/create/update/delete, decoupled from HTTP
│       │   └── auth_service.py                # Auth business logic: wraps security.py (login, logout, session check)
│       │
│       └── api/
│           ├── departures.py                  # APIRouter /api/departures — thin HTTP handlers, delegates to service
│           └── auth.py                        # APIRouter /api/auth — login, logout, /me, /setup endpoints; sets cookie
│
├── frontend/
│   ├── package.json                           # npm deps: next, react, react-dom, typescript
│   ├── tsconfig.json                          # TypeScript config: strict, bundler moduleResolution, @/* path alias
│   ├── next.config.js                         # Rewrites /api/* → http://localhost:8000/api/* (dev proxy)
│   │
│   └── src/
│       ├── types/
│       │   └── departure.ts                   # Shared TS interfaces: Departure, DepartureCreate, DepartureUpdate, AuthStatus
│       │
│       ├── lib/
│       │   ├── api.ts                         # Single fetch client: all API calls (departures + auth) in one typed object
│       │   └── utils.ts                       # Pure helpers: toAMPM(), toMins(), nowMins()
│       │
│       ├── hooks/
│       │   ├── useAuth.ts                     # Calls /api/auth/me, redirects to /auth/login if requireAuth=true
│       │   └── useDepartures.ts               # Fetches departure list, exposes reload(), optional 30s auto-refresh
│       │
│       ├── components/
│       │   ├── AdminLayout.tsx                # Sidebar (desktop) + bottom nav (mobile) + Sign Out; calls useAuth(true)
│       │   ├── DepartureModal.tsx             # Controlled form modal for add/edit departure; calls onSave callback
│       │   └── Toast.tsx                      # Toast + ToastContainer + module-level showToast() imperative helper
│       │
│       ├── styles/
│       │   └── globals.css                    # CSS variables, shared utility classes, board frame, table, modal, admin layout
│       │
│       └── app/                               # Next.js App Router
│           ├── layout.tsx                     # Root layout: imports globals.css, loads Google Fonts
│           ├── page.tsx                       # / → redirect to /board
│           │
│           ├── board/
│           │   └── page.tsx                   # Public departure board: green-framed table, live clock, next-train highlight
│           │
│           ├── auth/
│           │   ├── login/
│           │   │   └── page.tsx               # TOTP login: 6-digit input, auto-submit on completion, countdown timer
│           │   └── setup/
│           │       └── page.tsx               # First-time setup: fetches QR base64 + secret from backend, renders scan instructions
│           │
│           └── admin/
│               └── board/
│                   └── page.tsx               # Protected CRUD: table (desktop) + cards (mobile), DepartureModal, Toast
│
├── docker-compose.yml                         # Runs backend:8000 + frontend:3000 together
└── README.md
```

## Data flow

```
browser → Next.js /api/* (rewrite proxy) → FastAPI :8000
                                               ├── api/auth.py        → auth_service → security.py
                                               └── api/departures.py  → departure_service → database.py
```

## Auth flow

```
/auth/setup   → GET /api/auth/setup   → QR + secret (first time only)
/auth/login   → POST /api/auth/login  → verifies TOTP, sets httpOnly session_token cookie
/admin/board  → useAuth(true) calls GET /api/auth/me → 401 → redirect /auth/login
/auth/logout  → POST /api/auth/logout → deletes cookie
```

## Quick start

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python -m app.main          # http://localhost:8000  |  /docs for Swagger

# Frontend
cd frontend
npm install
npm run dev                 # http://localhost:3000
```

First run: visit `/auth/setup` → scan QR with Google Authenticator / Aegis / Raivo → `/auth/login` → `/admin/board`.
