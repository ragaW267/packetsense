"""
PacketSense API — FastAPI Application Entrypoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import get_settings
from app.database import engine, Base
from app.routers import auth, quiz, protocols, troubleshoot, explain

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup (development convenience)."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="PacketSense API",
    description="Interactive networking learning and troubleshooting platform API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# --- CORS ---
origins = [
    settings.frontend_url,
    "http://localhost:3000",
    "http://localhost:3001",
]

if settings.app_env == "production":
    # In production, only allow the configured frontend URL
    origins = [settings.frontend_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(protocols.router, prefix="/api/protocols", tags=["Protocols"])
app.include_router(troubleshoot.router, prefix="/api/troubleshoot", tags=["Troubleshoot"])
app.include_router(explain.router, prefix="/api/explain", tags=["Explain"])


@app.get("/", tags=["Health"])
def health_check():
    """Root health check endpoint."""
    return {
        "status": "healthy",
        "service": "PacketSense API",
        "version": "1.0.0",
    }


@app.get("/api/health", tags=["Health"])
def api_health():
    """API health check with database connectivity test."""
    from app.database import SessionLocal

    try:
        db = SessionLocal()
        db.execute(
            __import__("sqlalchemy").text("SELECT 1")
        )
        db.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy",
        "database": db_status,
        "environment": settings.app_env,
    }
