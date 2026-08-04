from fastapi import APIRouter, UploadFile, File
import os
import shutil

from app.services.ocr_service import extract_text

router = APIRouter(
    prefix="/ocr",
    tags=["OCR"]
)

UPLOAD_FOLDER = "uploads"


@router.post("/extract")
async def extract(file: UploadFile = File(...)):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text(file_path)

    return {
        "success": True,
        "filename": file.filename,
        "text": text
    }