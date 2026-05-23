# 🌐 PacketSense

**Interactive Networking Learning & Troubleshooting Platform**

PacketSense helps engineering students learn computer networks interactively through protocol visualizations, troubleshooting wizards, quizzes, and AI-powered explanations.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)

---

## ✨ Features

### 🔬 Protocol Visualizer
Interactive step-by-step animations for 8 core networking protocols:
- TCP 3-Way Handshake
- TCP Retransmission
- TCP Congestion Control / Slow Start
- UDP Communication
- DNS Lookup Process
- ARP Resolution
- DHCP IP Assignment (DORA)
- HTTP vs HTTPS

### 🔧 Troubleshoot Wizard
Adaptive diagnostic engine with 7 issue types:
- High Ping / Latency
- Packet Loss
- Websites Not Loading
- DNS Failure
- Slow Internet
- Gaming Lag
- Unstable WiFi

### 📝 Quiz Mode
50+ questions across 7 categories with scoring, progress tracking, and explanations:
- OSI Model, TCP/IP, Subnetting, Routing, Switching, DNS, DHCP

### 💡 AI Explain Mode
Student-friendly explanations with real-world analogies for 13+ networking concepts.

### 🔐 Authentication
Full JWT-based auth with signup, login, protected dashboard, and progress tracking.

---

## 🏗️ Architecture

```
packetsense/                  (Turborepo Monorepo)
├── apps/
│   ├── web/                  Next.js 15 → Vercel
│   └── api/                  FastAPI → Render
├── packages/
│   └── shared/               Shared types & constants
└── docs/                     Documentation
```

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v3, shadcn/ui, Framer Motion, Recharts |
| Backend | FastAPI, Python 3.11+, SQLAlchemy, Pydantic v2, JWT |
| Database | PostgreSQL (Neon) |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL (or Neon account)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/packetsense.git
cd packetsense
```

### 2. Backend Setup
```bash
cd apps/api

# Create virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your Neon DATABASE_URL and a JWT_SECRET_KEY

# Run migrations (or let auto-create on startup)
# alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd apps/web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

### 4. Open in browser
- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login, get JWT | ❌ |
| GET | `/api/auth/me` | Get profile | ✅ |
| PUT | `/api/auth/me` | Update profile | ✅ |
| GET | `/api/quiz/categories` | List quiz categories | ❌ |
| GET | `/api/quiz/questions/{id}` | Get questions | ❌ |
| POST | `/api/quiz/submit` | Submit quiz | ✅ |
| GET | `/api/quiz/history` | Quiz history | ✅ |
| GET | `/api/quiz/stats` | Quiz statistics | ✅ |
| GET | `/api/protocols` | List protocols | ❌ |
| GET | `/api/protocols/{slug}` | Protocol detail | ❌ |
| POST | `/api/protocols/{slug}/save` | Save simulation | ✅ |
| GET | `/api/troubleshoot/issues` | List issues | ❌ |
| GET | `/api/troubleshoot/questions/{type}` | Get questions | ❌ |
| POST | `/api/troubleshoot/analyze` | Get diagnosis | ✅ |
| GET | `/api/troubleshoot/history` | Session history | ✅ |
| GET | `/api/explain/topics` | List topics | ❌ |
| POST | `/api/explain` | Get explanation | ❌ |

---

## ☁️ Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step deployment instructions.

**TL;DR:**
1. Push to GitHub
2. **Neon**: Create PostgreSQL database → get connection string
3. **Render**: New Web Service → root directory `apps/api` → set env vars
4. **Vercel**: New Project → root directory `apps/web` → set `NEXT_PUBLIC_API_URL`

---

## 📁 Database Schema

| Table | Description |
|-------|------------|
| `users` | User accounts with email, username, hashed password |
| `quiz_categories` | Quiz topic categories (OSI, TCP/IP, etc.) |
| `quiz_questions` | Questions with JSONB options and explanations |
| `quiz_attempts` | User quiz scores and answer history |
| `user_progress` | Feature-level progress tracking |
| `troubleshoot_sessions` | Diagnostic session history |
| `saved_simulations` | Saved protocol simulation configs |

---

## 🛠️ Tech Stack Details

### Frontend
- **Next.js 15** with App Router and server/client components
- **Tailwind CSS v3** with CSS variables for theming
- **shadcn/ui** for consistent, accessible UI components
- **Framer Motion** for smooth animations and transitions
- **Recharts** for dashboard charts
- **React Flow** ready for advanced topology visualizations

### Backend
- **FastAPI** with async-ready architecture
- **SQLAlchemy 2.0** with declarative models
- **Pydantic v2** for request/response validation
- **python-jose** for JWT token handling
- **passlib + bcrypt** for password hashing
- **Alembic** for database migrations

---

## 📄 License

MIT License — Built for students, by students.
