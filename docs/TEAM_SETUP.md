# Team Integration & Developer Onboarding Guide

Welcome to the **Digital Evidence Locker & Legal Workflow Platform** project! This document establishes the guidelines, ownership boundaries, and operational workflows for our 4-developer engineering team.

---

## 👥 1. Role-Based Onboarding Guides

### 🎨 Frontend Developer Guide
- **Target Folder**: `client/`
- **Primary Tech Stack**: React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI.
- **Getting Started**:
  1. Open terminal in `client/`.
  2. Install dependencies: `npm install`.
  3. Start dev server: `npm run dev` (Runs at `http://localhost:5173` or `3000`).
  4. Ensure your environment variables in `.env` point `VITE_API_BASE_URL` to `http://localhost:5000/api/v1`.
- **First Tasks**:
  - Build layout shell (Header, Sidebar, Navigation).
  - Implement Case Dashboard grid using Shadcn components.
  - Construct Evidence Upload UI with client-side SHA-256 hash calculation (Web Crypto API `crypto.subtle.digest`).

---

### 🤖 AI Developer Guide
- **Target Folder**: `ai-service/`
- **Primary Tech Stack**: Python 3.10+, FastAPI, Whisper, EasyOCR, Google Gemini API.
- **Getting Started**:
  1. Open terminal in `ai-service/`.
  2. Create Python virtual environment: `python -m venv venv` and activate it (`source venv/bin/activate` or `venv\Scripts\activate`).
  3. Install dependencies: `pip install -r requirements.txt`.
  4. Set `GEMINI_API_KEY` in `ai-service/.env`.
  5. Run server: `uvicorn main:app --reload --port 8000`.
- **First Tasks**:
  - Implement `/transcribe` endpoint wrapping Whisper speech-to-text.
  - Implement `/ocr` endpoint using EasyOCR for image text extraction.
  - Implement `/summarize` endpoint integrating Google Gemini 1.5 API.

---

### 🗄️ Database & Integration Developer Guide
- **Target Folder**: `database/` & `server/src/config/prisma.ts`
- **Primary Tech Stack**: PostgreSQL 16, Prisma ORM, Node.js integration.
- **Getting Started**:
  1. Ensure local PostgreSQL is running or start via Docker: `docker-compose up postgres -d`.
  2. Open terminal in root directory or `server/`.
  3. Set `DATABASE_URL` in `server/.env`.
  4. Run Prisma schema validation: `npx prisma validate --schema=database/prisma/schema.prisma`.
  5. Generate Prisma Client: `npx prisma generate --schema=database/prisma/schema.prisma`.
  6. Apply migrations: `npx prisma migrate dev --name init --schema=database/prisma/schema.prisma`.
- **First Tasks**:
  - Add initial database seed script (`database/prisma/seed.ts`).
  - Optimize composite B-tree indexes for `AuditLog` queries.

---

### ⚙️ Backend Lead (Me)
- **Target Folder**: `server/`
- **Responsibilities**:
  - Core Express server routing, Helmet/CORS security middleware, and global error handlers.
  - Authentication (JWT + HTTP-Only Cookies) and RBAC authorization middlewares.
  - Cloudinary storage integration for file metadata registration.
  - Integration gateway connecting Express backend to FastAPI AI engine (`/api/v1/ai`).

---

## 📂 2. Folder Ownership Boundaries

To minimize merge conflicts, each developer maintains primary ownership over specific directories:

| Developer Role | Primary Owned Paths | Secondary Paths |
|---|---|---|
| **Frontend Developer** | `client/` | `docs/` |
| **AI Developer** | `ai-service/` | `docs/` |
| **Database Developer** | `database/`, `server/src/modules/*/repository.ts` | `server/src/config/prisma.ts` |
| **Backend Lead** | `server/` (App, Config, Controllers, Services, Routes, Middlewares) | `docker-compose.yml`, `docs/` |

---

## 📜 3. Strict API Contract Discipline

- **Contract Document**: All developers **must** adhere strictly to [docs/API_DOCUMENTATION.md](API_DOCUMENTATION.md).
- **JSON Structure**: All API responses **must** follow the standardized envelope:
  ```json
  {
    "success": true,
    "message": "Optional human-readable status message",
    "data": {},
    "pagination": {}
  }
  ```
- **Error Response Envelope**:
  ```json
  {
    "success": false,
    "error": {
      "code": "RESOURCE_NOT_FOUND",
      "message": "Case with specified ID does not exist"
    }
  }
  ```

---

## 🌿 4. Git Branching & PR Workflow

### Branch Naming Conventions
- `feature/fe-case-dashboard` (Frontend features)
- `feature/be-evidence-hashing` (Backend features)
- `feature/ai-whisper-transcription` (AI features)
- `feature/db-auditlog-indexes` (Database features)
- `bugfix/issue-description` (Bug fixes)

### Workflow Steps
1. **Branch Off `main`**: Always ensure your local `main` branch is up to date before branching:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```
2. **Commit Messages**: Write clear, descriptive commits:
   ```bash
   git commit -m "feat(evidence): add sha256 hash verification method signature"
   ```
3. **Pull Request Rules**:
   - Every PR requires **at least 1 peer approval** (Backend Lead approval required for backend/DB changes).
   - TypeScript build checks (`npm run build` inside `server/` and `client/`) must pass cleanly before merge.
   - Never force-push to `main`.
