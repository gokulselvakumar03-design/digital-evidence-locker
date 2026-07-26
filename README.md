# Digital Evidence Locker & Legal Workflow Platform

An enterprise-grade, tamper-proof Digital Evidence Locker & Legal Workflow Platform designed to ensure strict chain-of-custody, cryptographic evidence integrity, AI-powered forensic processing, and role-based legal collaboration.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18+` or `v20+`
- **npm** or **pnpm**
- **Docker & Docker Compose** (optional but recommended)
- **PostgreSQL**: `v16+` (if running locally without Docker)
- **Python**: `v3.10+` (for AI Service local execution)

---

## 🛠️ Project Structure Overview

The repository is structured as a multi-service monorepo:

```
.
├── client/          # React + Vite + TypeScript + Tailwind CSS Frontend
├── server/          # Express.js + Node.js + TypeScript Backend Service
├── ai-service/      # FastAPI + Whisper + EasyOCR + Gemini API AI Engine
├── database/        # Prisma ORM Schema, Migrations & Seeds
└── docs/            # Architecture, API Specifications & Team Onboarding Guides
```

---

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/digital-evidence-locker.git
cd digital-evidence-locker
```

### 2. Environment Configuration
Copy environment variable templates in each service directory:

```bash
cp server/.env.example server/.env
cp ai-service/.env.example ai-service/.env
```

### 3. Run with Docker Compose (Recommended)
To spin up all services (PostgreSQL, Express Server, FastAPI AI Engine, React Web Client):

```bash
docker-compose up --build
```

- **Frontend Client**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api/v1`
- **API Health Check**: `http://localhost:5000/health`
- **AI Service API**: `http://localhost:8000`
- **PostgreSQL Database**: `localhost:5432`

---

## 📚 Team Documentation

- 📐 **[Project Architecture](PROJECT_ARCHITECTURE.md)**: System design & component interaction overview.
- 🗄️ **[Database Schema](DATABASE_SCHEMA.md)**: Detailed ERD breakdown & model explanations.
- 📁 **[Folder Structure](FOLDER_STRUCTURE.md)**: Directory breakdown & file organization rules.
- 💻 **[Tech Stack](TECH_STACK.md)**: Technologies, libraries, and framework choices.
- 📖 **[API Documentation](docs/API_DOCUMENTATION.md)**: Complete endpoint reference for all 9 modules.
- 🤝 **[Team Setup & Workflow Guide](docs/TEAM_SETUP.md)**: Onboarding & role-based integration guide for team members.

---

## 🔐 Security & Compliance Features
- **Cryptographic Hash Verification**: SHA-256 evidence hashing for tamper detection.
- **Immutable Audit Logging**: Non-repudiable audit logs tracking every read/write action.
- **Role-Based Access Control (RBAC)**: Fine-grained access permissions for Admins, Investigators, Legal Counsel, and Auditors.
- **Secure Transport & Storage**: Enforced HTTPS, Helmet HTTP headers, CORS policies, and HTTP-only cookie JWT delivery.

---

## 👥 Team Roles & Responsibilities
- **Backend Lead**: Express API Core, Security, Middleware & Controller/Service Architecture.
- **Frontend Developer**: React UI, State Management, Shadcn Components & Evidence Previewers.
- **AI Developer**: FastAPI service, Speech-to-Text (Whisper), OCR (EasyOCR), and Gemini Legal Summaries.
- **Database & Integration Developer**: Prisma Schemas, Database Migrations, Index Optimization & Audit Log Pipeline.

---

## 📜 License
Privately managed for internal legal & digital forensic operations.
