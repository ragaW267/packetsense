# PacketSense — Architecture

## System Architecture

```
┌─────────────────┐     HTTPS     ┌──────────────────┐     SQL      ┌──────────────┐
│                 │ ◄───────────► │                  │ ◄──────────► │              │
│   Next.js 15    │               │    FastAPI        │              │  Neon        │
│   (Vercel)      │               │    (Render)       │              │  PostgreSQL  │
│                 │               │                  │              │              │
│  - React 18     │               │  - SQLAlchemy    │              │  - 7 tables  │
│  - Tailwind v3  │               │  - Pydantic v2   │              │  - UUID PKs  │
│  - Framer Motion│               │  - JWT Auth      │              │  - JSONB     │
│  - Recharts     │               │  - Bcrypt        │              │              │
│                 │               │                  │              │              │
└─────────────────┘               └──────────────────┘              └──────────────┘
     Vercel                            Render                          Neon
```

## Frontend Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (AuthProvider, dark mode)
│   ├── page.tsx            # Landing page
│   ├── (auth)/             # Route group for auth pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/          # Protected area
│   │   ├── layout.tsx      # Auth guard + sidebar
│   │   └── page.tsx        # Stats + charts
│   ├── protocols/          # Protocol visualizer
│   │   ├── page.tsx        # Category grid
│   │   └── [slug]/page.tsx # Animated visualizer
│   ├── troubleshoot/       # Diagnostic wizard
│   ├── quiz/               # Quiz system
│   │   ├── page.tsx        # Category list
│   │   └── [id]/page.tsx   # Quiz taking
│   └── explain/            # AI explanations
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Navbar, Sidebar, Footer
│   └── auth/               # Login/Signup forms
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, API client, constants
├── providers/              # React context providers
└── types/                  # TypeScript type definitions
```

### Key Design Decisions

1. **App Router**: Using Next.js 15 App Router for file-based routing and layouts
2. **Client Components**: Most pages use `"use client"` for interactivity
3. **Auth Context**: React Context with localStorage for JWT token persistence
4. **API Client**: Fetch-based client with automatic Bearer token injection
5. **CSS Variables**: shadcn/ui theming via CSS custom properties for dark mode

## Backend Architecture

```
app/
├── main.py                 # FastAPI entrypoint, CORS, router mounting
├── config.py               # Pydantic Settings (env vars)
├── database.py             # SQLAlchemy engine, session, Base
├── models/                 # SQLAlchemy ORM models
│   ├── user.py
│   ├── quiz.py
│   ├── progress.py
│   └── troubleshoot.py
├── schemas/                # Pydantic request/response schemas
├── routers/                # API route handlers
│   ├── auth.py
│   ├── quiz.py
│   ├── protocols.py
│   ├── troubleshoot.py
│   └── explain.py
├── services/               # Business logic
│   ├── auth_service.py
│   ├── quiz_service.py
│   ├── troubleshoot_engine.py
│   └── explain_engine.py
├── middleware/
│   └── auth.py             # JWT verification dependency
└── utils/
    ├── jwt.py              # Token creation/verification
    └── security.py         # Password hashing
```

### Key Design Decisions

1. **Sync SQLAlchemy**: Using synchronous sessions for simplicity (beginner-friendly)
2. **JWT Stateless Auth**: No session storage needed, works across distributed deploys
3. **JSON Seed Data**: Quiz questions and troubleshoot rules loaded from JSON files
4. **Decision Tree Engine**: Weighted scoring system for troubleshoot diagnosis
5. **Rule-Based Explain**: Template-based explanations (no paid AI API dependency)
6. **Auto-Seeding**: Quiz data is automatically loaded into the database on first access

## Data Flow

### Authentication Flow
```
Client                    API                     Database
  │                        │                        │
  ├─ POST /auth/signup ───►│                        │
  │    {email, password}   ├─ hash(password) ──────►│
  │                        │◄── User created ───────┤
  │◄── {user, JWT token} ──┤                        │
  │                        │                        │
  ├─ GET /auth/me ────────►│                        │
  │  (Authorization: Bearer)├─ verify(JWT) ────────►│
  │                        │◄── User data ──────────┤
  │◄── {user} ─────────────┤                        │
```

### Quiz Flow
```
Client                    API                     Database
  │                        │                        │
  ├─ GET /quiz/categories ►│                        │
  │                        ├─ seed_if_empty() ─────►│
  │◄── [{categories}] ────┤◄── quiz data ──────────┤
  │                        │                        │
  ├─ GET /quiz/questions ─►│                        │
  │◄── [{questions}] ─────┤  (no answers!)          │
  │                        │                        │
  ├─ POST /quiz/submit ──►│                        │
  │  {answers}             ├─ grade(answers) ──────►│
  │                        │◄── scored ─────────────┤
  │◄── {score, details} ──┤  (with explanations)    │
```

### Troubleshoot Flow
```
Client                    API                  Engine
  │                        │                     │
  ├─ GET /issues ─────────►│                     │
  │◄── [{issues}] ────────┤◄── rules.json ──────┤
  │                        │                     │
  ├─ GET /questions/{type}►│                     │
  │◄── [{questions}] ─────┤◄── adaptive Qs ─────┤
  │                        │                     │
  ├─ POST /analyze ───────►│                     │
  │  {issue_type, answers} ├─ score(answers) ───►│
  │                        │◄── diagnosis ───────┤
  │◄── {diagnosis} ───────┤                     │
```

## Database Schema (ERD)

```
┌───────────────┐
│    users       │
├───────────────┤      ┌──────────────────┐
│ id (PK)       │◄─┬──┤  quiz_attempts    │
│ email         │  │  ├──────────────────┤
│ username      │  │  │ id (PK)          │
│ hashed_pass   │  │  │ user_id (FK)     │
│ full_name     │  │  │ category_id (FK) │──►┌──────────────────┐
│ is_active     │  │  │ score            │   │ quiz_categories   │
│ created_at    │  │  │ answers (JSONB)  │   ├──────────────────┤
└───────────────┘  │  └──────────────────┘   │ id (PK)          │
                   │                         │ name             │◄──┌──────────────┐
                   │                         └──────────────────┘   │quiz_questions │
                   │                                                ├──────────────┤
                   ├──┌──────────────────┐                          │ id (PK)      │
                   │  │ user_progress     │                          │ category_id  │
                   │  ├──────────────────┤                          │ question     │
                   │  │ user_id (FK)     │                          │ options JSONB│
                   │  │ feature          │                          │ correct_ans  │
                   │  │ item_key         │                          └──────────────┘
                   │  │ status           │
                   │  └──────────────────┘
                   │
                   ├──┌──────────────────────┐
                   │  │ troubleshoot_sessions  │
                   │  ├──────────────────────┤
                   │  │ user_id (FK)         │
                   │  │ issue_type           │
                   │  │ answers (JSONB)      │
                   │  │ diagnosis (JSONB)    │
                   │  └──────────────────────┘
                   │
                   └──┌──────────────────┐
                      │ saved_simulations │
                      ├──────────────────┤
                      │ user_id (FK)     │
                      │ protocol         │
                      │ config (JSONB)   │
                      └──────────────────┘
```
