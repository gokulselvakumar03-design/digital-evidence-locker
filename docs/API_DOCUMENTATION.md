# Comprehensive API Documentation Specification

Base API URL: `http://localhost:5000/api/v1`

---

## 🔐 1. Authentication Module (`/auth`)

### 1.1 Register User
- **Method**: `POST`
- **URL**: `/auth/register`
- **Description**: Registers a new user in the platform.
- **Authentication**: None
- **Allowed Roles**: Public
- **Request Body**:
```json
{
  "email": "investigator@legal.gov",
  "password": "SecurePassword123!",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "INVESTIGATOR"
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-v4",
      "email": "investigator@legal.gov",
      "firstName": "Jane",
      "lastName": "Doe",
      "role": "INVESTIGATOR"
    }
  }
}
```

### 1.2 Login User
- **Method**: `POST`
- **URL**: `/auth/login`
- **Description**: Authenticates user credentials and sets HTTP-only JWT cookie.
- **Authentication**: None
- **Allowed Roles**: Public
- **Request Body**:
```json
{
  "email": "investigator@legal.gov",
  "password": "SecurePassword123!"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "token": "jwt.bearer.token",
    "user": { "id": "uuid-v4", "email": "investigator@legal.gov", "role": "INVESTIGATOR" }
  }
}
```

### 1.3 Logout User
- **Method**: `POST`
- **URL**: `/auth/logout`
- **Description**: Clears authentication JWT cookie.
- **Authentication**: Required (`Bearer JWT` / Cookie)
- **Allowed Roles**: All Roles
- **Request Body**: None
- **Response** (`200 OK`):
```json
{ "success": true, "message": "Logged out successfully" }
```

### 1.4 Get Current Profile
- **Method**: `GET`
- **URL**: `/auth/me`
- **Description**: Returns authenticated user profile details.
- **Authentication**: Required
- **Allowed Roles**: All Roles
- **Request Body**: None
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": { "id": "uuid-v4", "email": "investigator@legal.gov", "firstName": "Jane", "lastName": "Doe", "role": "INVESTIGATOR" }
}
```

---

## 👤 2. User Management Module (`/users`)

### 2.1 List All Users
- **Method**: `GET`
- **URL**: `/users`
- **Description**: Retrieve paginated list of system users.
- **Authentication**: Required
- **Allowed Roles**: `ADMIN`, `AUDITOR`
- **Request Body**: None (Query params: `page`, `limit`, `role`)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    { "id": "uuid-1", "email": "admin@legal.gov", "role": "ADMIN" }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 1 }
}
```

### 2.2 Get User By ID
- **Method**: `GET`
- **URL**: `/users/:id`
- **Description**: Retrieve user details by unique ID.
- **Authentication**: Required
- **Allowed Roles**: `ADMIN`, `AUDITOR`, Self
- **Request Body**: None
- **Response** (`200 OK`):
```json
{ "success": true, "data": { "id": "uuid-1", "email": "admin@legal.gov", "role": "ADMIN" } }
```

### 2.3 Update User Profile
- **Method**: `PATCH`
- **URL**: `/users/:id`
- **Description**: Update user attributes (first name, last name, active status).
- **Authentication**: Required
- **Allowed Roles**: `ADMIN`, Self
- **Request Body**:
```json
{ "firstName": "Jane", "lastName": "Smith" }
```
- **Response** (`200 OK`):
```json
{ "success": true, "message": "User updated successfully" }
```

---

## 📁 3. Case Management Module (`/cases`)

### 3.1 Create Case
- **Method**: `POST`
- **URL**: `/cases`
- **Description**: Opens a new legal investigation case.
- **Authentication**: Required
- **Allowed Roles**: `ADMIN`, `INVESTIGATOR`
- **Request Body**:
```json
{
  "caseNumber": "CASE-2026-001",
  "title": "State v. Corporate Entity",
  "description": "Financial fraud investigation",
  "priority": "HIGH"
}
```
- **Response** (`201 Created`):
```json
{ "success": true, "data": { "id": "case-uuid", "caseNumber": "CASE-2026-001", "status": "OPEN" } }
```

### 3.2 List Cases
- **Method**: `GET`
- **URL**: `/cases`
- **Description**: Get all accessible cases with status and priority filtering.
- **Authentication**: Required
- **Allowed Roles**: All Roles
- **Request Body**: None
- **Response** (`200 OK`):
```json
{ "success": true, "data": [{ "id": "case-uuid", "title": "State v. Corporate Entity" }] }
```

### 3.3 Get Case Details
- **Method**: `GET`
- **URL**: `/cases/:id`
- **Description**: Retrieve case detail including members and evidence count.
- **Authentication**: Required
- **Allowed Roles**: Assigned Case Members, `ADMIN`, `AUDITOR`
- **Request Body**: None
- **Response** (`200 OK`):
```json
{ "success": true, "data": { "id": "case-uuid", "title": "State v. Corporate Entity", "evidence": [] } }
```

### 3.4 Add Member to Case
- **Method**: `POST`
- **URL**: `/cases/:id/members`
- **Description**: Assigns an investigator or counsel to a case.
- **Authentication**: Required
- **Allowed Roles**: `ADMIN`, Case Creator
- **Request Body**:
```json
{ "userId": "user-uuid", "assignedRole": "LEAD_INVESTIGATOR" }
```
- **Response** (`200 OK`):
```json
{ "success": true, "message": "Member assigned to case" }
```

---

## 🔍 4. Evidence Management Module (`/evidence`)

### 4.1 Upload Evidence Metadata
- **Method**: `POST`
- **URL**: `/evidence`
- **Description**: Registers uploaded evidence file metadata, Cloudinary URL, and SHA-256 hash.
- **Authentication**: Required
- **Allowed Roles**: `INVESTIGATOR`, `ADMIN`
- **Request Body**:
```json
{
  "caseId": "case-uuid",
  "title": "CCTV Footage Entrance",
  "fileUrl": "https://cloudinary.com/v1/video.mp4",
  "fileSize": 10485760,
  "mimeType": "video/mp4",
  "type": "VIDEO",
  "sha256Hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```
- **Response** (`201 Created`):
```json
{ "success": true, "data": { "id": "evidence-uuid", "status": "VERIFIED" } }
```

### 4.2 List Evidence for Case
- **Method**: `GET`
- **URL**: `/evidence/case/:caseId`
- **Description**: Fetches all evidence items associated with a specific case.
- **Authentication**: Required
- **Allowed Roles**: Assigned Case Members, `ADMIN`, `AUDITOR`
- **Request Body**: None
- **Response** (`200 OK`):
```json
{ "success": true, "data": [{ "id": "evidence-uuid", "title": "CCTV Footage Entrance" }] }
```

### 4.3 Verify Evidence Cryptographic Hash
- **Method**: `POST`
- **URL**: `/evidence/:id/verify`
- **Description**: Triggers cryptographic integrity verification comparing client hash with registered hash.
- **Authentication**: Required
- **Allowed Roles**: `AUDITOR`, `INVESTIGATOR`, `LEGAL_COUNSEL`, `ADMIN`
- **Request Body**:
```json
{ "providedSha256Hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" }
```
- **Response** (`200 OK`):
```json
{ "success": true, "data": { "isMatch": true, "status": "VERIFIED" } }
```

---

## 💬 5. Comments Module (`/comments`)

### 5.1 Add Comment
- **Method**: `POST`
- **URL**: `/comments`
- **Description**: Posts a discussion note on a case or specific evidence item.
- **Authentication**: Required
- **Allowed Roles**: Case Members, `ADMIN`
- **Request Body**:
```json
{ "caseId": "case-uuid", "evidenceId": "evidence-uuid", "content": "Timestamp 02:14 shows clear subject entry." }
```
- **Response** (`201 Created`):
```json
{ "success": true, "data": { "id": "comment-uuid", "content": "..." } }
```

### 5.2 List Comments for Case
- **Method**: `GET`
- **URL**: `/comments/case/:caseId`
- **Description**: Retrieves all comments attached to a case.
- **Authentication**: Required
- **Allowed Roles**: Case Members, `ADMIN`, `AUDITOR`
- **Request Body**: None
- **Response** (`200 OK`):
```json
{ "success": true, "data": [] }
```

---

## 🔔 6. Notifications Module (`/notifications`)

### 6.1 Get User Notifications
- **Method**: `GET`
- **URL**: `/notifications`
- **Description**: Retrieves active alerts and notifications for the user.
- **Authentication**: Required
- **Allowed Roles**: All Roles
- **Request Body**: None
- **Response** (`200 OK`):
```json
{ "success": true, "data": [{ "id": "notif-uuid", "title": "New Case Assigned", "isRead": false }] }
```

### 6.2 Mark Notification Read
- **Method**: `PATCH`
- **URL**: `/notifications/:id/read`
- **Description**: Marks a specific notification as read.
- **Authentication**: Required
- **Allowed Roles**: All Roles
- **Request Body**: None
- **Response** (`200 OK`):
```json
{ "success": true, "message": "Notification marked as read" }
```

---

## 📊 7. Analytics Module (`/analytics`)

### 7.1 System Dashboard Stats
- **Method**: `GET`
- **URL**: `/analytics/dashboard`
- **Description**: Aggregates evidence counts, active cases, and integrity verification statistics.
- **Authentication**: Required
- **Allowed Roles**: `ADMIN`, `AUDITOR`, `INVESTIGATOR`
- **Request Body**: None
- **Response** (`200 OK`):
```json
{ "success": true, "data": { "totalCases": 42, "totalEvidence": 128, "tamperAttempts": 0 } }
```

---

## 🛡️ 8. System Administration Module (`/admin`)

### 8.1 Fetch System Audit Logs
- **Method**: `GET`
- **URL**: `/admin/audit-logs`
- **Description**: Retrieves full system-wide immutable audit trail logs.
- **Authentication**: Required
- **Allowed Roles**: `ADMIN`, `AUDITOR`
- **Request Body**: None
- **Response** (`200 OK`):
```json
{ "success": true, "data": [{ "id": "audit-uuid", "action": "VERIFY", "ipAddress": "192.168.1.1" }] }
```

---

## 🤖 9. AI Service Integration Gateway (`/ai`)

### 9.1 Request Speech-to-Text Transcription
- **Method**: `POST`
- **URL**: `/ai/transcribe`
- **Description**: Dispatches audio evidence item to FastAPI AI service for Whisper transcription.
- **Authentication**: Required
- **Allowed Roles**: `INVESTIGATOR`, `LEGAL_COUNSEL`, `ADMIN`
- **Request Body**:
```json
{ "evidenceId": "evidence-uuid" }
```
- **Response** (`202 Accepted`):
```json
{ "success": true, "data": { "jobId": "ai-job-uuid", "status": "PROCESSING" } }
```

### 9.2 Request OCR Document Extraction
- **Method**: `POST`
- **URL**: `/ai/ocr`
- **Description**: Dispatches scanned image/PDF to FastAPI AI service for EasyOCR extraction.
- **Authentication**: Required
- **Allowed Roles**: `INVESTIGATOR`, `LEGAL_COUNSEL`, `ADMIN`
- **Request Body**:
```json
{ "evidenceId": "evidence-uuid" }
```
- **Response** (`202 Accepted`):
```json
{ "success": true, "data": { "jobId": "ai-job-uuid", "status": "PROCESSING" } }
```

### 9.3 Request Gemini Case Legal Summary
- **Method**: `POST`
- **URL**: `/ai/summarize`
- **Description**: Dispatches case transcripts and OCR text to Google Gemini for legal summary generation.
- **Authentication**: Required
- **Allowed Roles**: `LEGAL_COUNSEL`, `ADMIN`
- **Request Body**:
```json
{ "caseId": "case-uuid" }
```
- **Response** (`200 OK`):
```json
{ "success": true, "data": { "summary": "Key findings...", "entities": ["John Doe", "Corp X"] } }
```
