# Complete Project Directory Structure

```
digital-evidence-locker/
├── .gitignore                      # Root Git ignore rules
├── docker-compose.yml              # Local multi-container Docker compose definition
├── README.md                       # Main project overview & quickstart
├── PROJECT_ARCHITECTURE.md         # Architecture & system design specification
├── DATABASE_SCHEMA.md              # Database models, ERD & relations breakdown
├── FOLDER_STRUCTURE.md             # Folder breakdown documentation
├── TECH_STACK.md                   # Complete technology stack summary
│
├── client/                         # React Frontend Application
│   ├── src/
│   │   ├── components/             # Reusable UI Components
│   │   ├── pages/                  # Application Page Views
│   │   ├── hooks/                  # Custom React Hooks
│   │   ├── context/                # Global React Context state providers
│   │   ├── services/               # Axios / API Client abstractions
│   │   ├── types/                  # Shared TypeScript interfaces
│   │   ├── App.tsx                 # Root React component
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Tailwind & Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── README.md
│
├── server/                         # Express Node.js Backend API Service
│   ├── src/
│   │   ├── config/                 # Environment & Service Initializers
│   │   │   ├── env.config.ts       # Typed env variables
│   │   │   ├── logger.ts           # Logger setup (Morgan / Winston)
│   │   │   └── prisma.ts           # Prisma client singleton instance
│   │   │
│   │   ├── middlewares/            # Custom Express Middlewares
│   │   │   ├── auth.middleware.ts  # JWT & RBAC verification stub
│   │   │   ├── error.middleware.ts # Global exception handler
│   │   │   ├── rateLimiter.middleware.ts # Rate limit protection stub
│   │   │   └── validate.middleware.ts    # Request schema validator stub
│   │   │
│   │   ├── modules/                # Domain-Driven Modules (9 Core Domains)
│   │   │   ├── admin/              # System administration & user management
│   │   │   ├── ai/                 # Gateway to FastAPI AI processing
│   │   │   ├── analytics/          # Forensic & audit analytics queries
│   │   │   ├── auth/               # User authentication & token management
│   │   │   ├── cases/              # Legal case file management
│   │   │   ├── comments/           # Case & evidence discussion notes
│   │   │   ├── evidence/           # Evidence upload & chain-of-custody tracking
│   │   │   ├── notifications/      # User notification preferences & feeds
│   │   │   └── users/              # User profile & organization management
│   │   │       ├── [module].controller.ts
│   │   │       ├── [module].routes.ts
│   │   │       ├── [module].service.ts
│   │   │       ├── [module].repository.ts
│   │   │       ├── [module].validator.ts
│   │   │       ├── [module].interface.ts
│   │   │       └── [module].dto.ts
│   │   │
│   │   ├── utils/                  # Utility Helpers & Standards
│   │   │   ├── apiError.ts         # Custom HTTP Operational Error Class
│   │   │   ├── apiResponse.ts      # Standardized JSON API Response Wrappers
│   │   │   └── asyncHandler.ts     # Express Async Exception Handler Wrapper
│   │   │
│   │   ├── app.ts                  # Express App Setup (Middlewares & Route Mounts)
│   │   └── index.ts                # Server HTTP listener entrypoint
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── Dockerfile
│
├── ai-service/                     # Python FastAPI AI Processing Engine
│   ├── app/                        # FastAPI App Core
│   │   ├── api/                    # API Router Endpoints
│   │   ├── core/                   # Config & Settings
│   │   └── services/               # Whisper, EasyOCR & Gemini Integrations
│   ├── main.py                     # Uvicorn entry point
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example
│   ├── Dockerfile
│   └── README.md
│
├── database/                       # Prisma Schema & Database Utilities
│   └── prisma/
│       └── schema.prisma           # Complete database schema definition
│
└── docs/                           # Documentation & Specifications
    ├── API_DOCUMENTATION.md        # Comprehensive REST API Endpoint Reference
    └── TEAM_SETUP.md               # Team Onboarding & Multi-Developer Workflow Guide
```
