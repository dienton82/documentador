from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.documentar import router as documentar_router

app = FastAPI(title="Documentador API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

app.include_router(documentar_router)


@app.get("/health")
def health():
    return {"status": "ok"}
