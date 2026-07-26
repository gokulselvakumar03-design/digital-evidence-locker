# AI Microservice Engine (`ai-service`)

FastAPI microservice handling AI-driven forensic processing, speech-to-text transcription, optical character recognition (OCR), and legal case summarization.

## Tech Stack
- **FastAPI**: Asynchronous web API framework
- **OpenAI Whisper**: Speech recognition & transcription
- **EasyOCR**: Text extraction from images and scanned PDF documents
- **Google Gemini API**: Generative legal analysis & entity extraction

## Local Setup
1. Create virtual environment: `python -m venv venv`
2. Activate environment: `source venv/bin/activate` (Linux/macOS) or `venv\Scripts\activate` (Windows)
3. Install dependencies: `pip install -r requirements.txt`
4. Run server: `uvicorn main:app --reload --port 8000`
5. OpenAPI documentation available at `http://localhost:8000/docs`
