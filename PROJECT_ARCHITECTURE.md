# Project Architecture Specification

## 🏛️ High-Level System Architecture

The **Digital Evidence Locker & Legal Workflow Platform** follows a decoupled, micro-service architecture separating client presentation, core business orchestration, relational data persistence, and specialized AI processing.

```
+-----------------------------------------------------------------------+
|                                                                       |
|                          React Frontend Client                        |
|                     (Vite + TypeScript + Tailwind CSS)                 |
|                                                                       |
+-----------------------------------+-----------------------------------+
                                    |
                             HTTP / REST (JSON)
                                    |
                                    v
+-----------------------------------+-----------------------------------+
|                                                                       |
|                       Express Backend API Server                      |
|                  (Node.js + TypeScript + Middleware)                  |
|                                                                       |
+---------+-------------------------+-------------------------+---------+
          |                         |                         |
          | Database Queries        | Async / REST            | Media Storage
          v                         v                         v
+---------+----------+    +---------+----------+    +---------+----------+
|  PostgreSQL DB     |    | FastAPI AI Engine  |    | Cloudinary       |
|  (Prisma ORM)      |    | (Whisper, EasyOCR, |    | (Secure File     |
|                    |    |  Gemini API)       |    |  Storage)        |
+--------------------+    +--------------------+    +------------------+
```

---

## 🧩 Architectural Subsystems

### 1. Presentation Layer (`client/`)
- Built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Shadcn UI**.
- Communicates exclusively via RESTful APIs with the Express backend using typed API clients.
- Implements JWT cookie storage and state-driven RBAC view routing.

### 2. Core Business Engine (`server/`)
- Built on **Node.js** with **Express.js** and **TypeScript**.
- Modular domain-driven layer design:
  - **Controllers**: Handle HTTP request extraction & response serialization.
  - **Services**: Abstract domain workflow contracts.
  - **Repositories**: Execute Prisma ORM queries against PostgreSQL.
  - **Middlewares**: Enforce Security headers (Helmet), Rate Limiting, Authentication, Role Authorization, Request Validation, and Error Handling.
  - **Validators**: Schema validation for incoming request payloads.
  - **DTOs / Interfaces**: Strong typing contracts for data boundaries.

### 3. Persistence Layer (`database/`)
- **PostgreSQL 16**: Relational storage engine with enforced foreign key integrity and B-tree indexing.
- **Prisma ORM**: Provides type-safe database queries, schema migration management, and automated client generation.

### 4. AI & Forensic Processing Engine (`ai-service/`)
- Independent **FastAPI** service written in Python 3.10+.
- Provides specialized endpoints for:
  - **Speech-to-Text Transcription**: OpenAI Whisper model.
  - **Optical Character Recognition (OCR)**: EasyOCR engine for scanned evidence documents.
  - **Legal Entity Extraction & Case Summarization**: Google Gemini API integration.

### 5. Media & Evidence Storage
- Integrated via **Cloudinary API** for secure, encrypted cloud evidence storage.
- Backend stores media URL, original file metadata, and client-generated cryptographic SHA-256 hashes in `EvidenceHash`.

---

## 🔒 Security & Integrity Architecture

1. **Chain of Custody & Immutability**:
   - Every file uploaded calculates a SHA-256 hash stored separately in the `EvidenceHash` table.
   - Any attempt to tamper with evidence generates an automated audit log flag (`TAMPERED`).
2. **Non-Repudiable Audit Logging**:
   - The `AuditLog` table records actor ID, action type (`CREATE`, `READ`, `UPDATE`, `DELETE`, `EXPORT`, `VERIFY`), IP address, user agent, and timestamp.
3. **Defense-in-Depth Middleware Pipeline**:
   - Requests cross Rate Limiting -> Helmet Security Headers -> CORS Origin Validation -> Cookie JWT Verification -> Role Authorization -> Request Body Validation before touching domain services.
