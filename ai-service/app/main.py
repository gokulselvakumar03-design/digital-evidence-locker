from fastapi import FastAPI

from app.routes.health import router as health_router
from app.routes.ocr import router as ocr_router

app = FastAPI(
    title="Digital Evidence Locker AI Service",
    description="AI Microservice for OCR, Speech-to-Text, Summarization and Evidence Analysis",
    version="1.0.0"
)

app.include_router(health_router)
app.include_router(ocr_router)


@app.get("/")
def root():
    return {
        "message": "AI Service is running successfully 🚀"
    }