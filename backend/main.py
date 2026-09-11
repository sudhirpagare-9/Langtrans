from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from database import create_db_and_tables
from routers.translation import router as translation_router

app = FastAPI(
    title="AI Secure Translator & Lip-Sync API",
    version="1.0.0",
    docs_url=None,
    redoc_url=None
)

class SecureHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        return response

app.add_middleware(SecureHeadersMiddleware)

origins = [
    "https://sudhirpagare-9.github.io",
    "http://localhost:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(translation_router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/health")
def health_check():
    return {"status": "secure", "compliance": "NIST SP 800-53 / GDPR Article 25"}

@app.get("/")
def read_root():
    return {"message": "AI Secure Translator & Lip-Sync API is running"}
