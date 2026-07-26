# Database Schema & Entity Documentation

## 📊 Overview

The database schema is built using **Prisma ORM** targeting **PostgreSQL 16**. It enforces relational integrity, indexing on critical search paths, foreign key constraints, cascading rules, and enumerations for standardized statuses.

---

## 🔠 Enumerations

| Enum Name | Values | Description |
|---|---|---|
| `Role` | `ADMIN`, `INVESTIGATOR`, `LEGAL_COUNSEL`, `AUDITOR` | System user authorization levels |
| `CaseStatus` | `OPEN`, `UNDER_REVIEW`, `CLOSED`, `ARCHIVED` | Lifecycle stages of a legal case |
| `CasePriority` | `LOW`, `MEDIUM`, `HIGH`, `URGENT` | Legal case priority designation |
| `EvidenceType` | `DOCUMENT`, `AUDIO`, `VIDEO`, `IMAGE`, `FORENSIC_IMAGE`, `OTHER` | Classification of physical/digital evidence |
| `EvidenceStatus` | `PENDING`, `VERIFIED`, `TAMPERED`, `REJECTED` | Verification & integrity status |
| `AIAnalysisType` | `TRANSCRIPTION`, `OCR`, `SUMMARY`, `ENTITY_EXTRACTION` | Type of AI forensic processing performed |
| `AIAnalysisStatus` | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED` | State of AI processing jobs |
| `AuditAction` | `CREATE`, `READ`, `UPDATE`, `DELETE`, `EXPORT`, `VERIFY` | Types of system activity logged |

---

## 🗃️ Models & Entity Relationships

```
+----------------+        +-------------------+        +-----------------+
|      User      | 1----* |    CaseMember     | *----1 |      Case       |
+----------------+        +-------------------+        +-----------------+
        |                                                       |
        | 1                                                     | 1
        |                                                       |
        *                                                       *
+----------------+        +-------------------+        +-----------------+
|    AuditLog    |        |     Evidence      | 1----1 |  EvidenceHash   |
+----------------+        +-------------------+        +-----------------+
                                    |                           |
                                    | 1                         |
                                    |                           |
                                    *                           |
                          +-------------------+                 |
                          |    AIAnalysis     |                 |
                          +-------------------+                 |
                                                                |
                          +-------------------+                 |
                          |     Comment       | <---------------+ (Optional linkage)
                          +-------------------+
```

---

## 📋 Table Breakdown

### 1. `User`
Stores user profile information, authentication credentials, and system roles.
- **Fields**: `id`, `email`, `passwordHash`, `firstName`, `lastName`, `role`, `isActive`, `createdAt`, `updatedAt`
- **Indexes**: `email` (Unique), `role`

### 2. `Case`
Represents an active or archived legal investigation/case file.
- **Fields**: `id`, `caseNumber` (Unique), `title`, `description`, `status`, `priority`, `createdById`, `createdAt`, `updatedAt`
- **Indexes**: `caseNumber` (Unique), `status`, `priority`, `createdById`

### 3. `CaseMember`
Junction table managing multi-investigator access and roles within specific cases.
- **Fields**: `id`, `caseId`, `userId`, `assignedRole`, `assignedAt`
- **Constraints**: Unique combination of `(caseId, userId)`

### 4. `Evidence`
Digital asset record linked to a case, containing cloud URL and metadata.
- **Fields**: `id`, `caseId`, `uploadedById`, `title`, `description`, `fileUrl`, `fileSize`, `mimeType`, `type`, `status`, `createdAt`, `updatedAt`
- **Indexes**: `caseId`, `uploadedById`, `status`, `type`

### 5. `EvidenceHash`
Cryptographic integrity record storing SHA-256 verification hashes for evidence.
- **Fields**: `id`, `evidenceId` (Unique), `sha256Hash`, `calculatedAt`, `verifiedById`
- **Indexes**: `evidenceId` (Unique), `sha256Hash`

### 6. `AuditLog`
Immutable system activity record tracking user access and changes.
- **Fields**: `id`, `userId`, `action`, `entityName`, `entityId`, `details` (JSON), `ipAddress`, `userAgent`, `timestamp`
- **Indexes**: `userId`, `action`, `timestamp`, `(entityName, entityId)`

### 7. `Notification`
User alert records for case updates, evidence processing, and system announcements.
- **Fields**: `id`, `userId`, `title`, `message`, `isRead`, `createdAt`
- **Indexes**: `userId`, `isRead`

### 8. `Comment`
Discussion posts on cases or evidence items by authorized case members.
- **Fields**: `id`, `caseId`, `evidenceId` (Optional), `authorId`, `content`, `createdAt`, `updatedAt`
- **Indexes**: `caseId`, `evidenceId`, `authorId`

### 9. `AIAnalysis`
Results from Whisper transcription, EasyOCR, or Gemini legal entity extraction.
- **Fields**: `id`, `evidenceId`, `type`, `status`, `result` (JSON), `errorMessage`, `createdAt`, `updatedAt`
- **Indexes**: `evidenceId`, `status`, `type`
