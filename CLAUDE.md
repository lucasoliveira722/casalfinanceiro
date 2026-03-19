# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Casal Financeiro** is a financial management platform for couples. It has three parts:
- `backend/` — Java 21 + Spring Boot REST API on port 9095
- `frontend/` — React Native mobile app (Expo)
- `frontend - web/` — Next.js web app (early stage)

## Commands

### Backend
```bash
cd backend
./mvnw spring-boot:run          # Start API (Windows: mvnw.cmd spring-boot:run)
./mvnw clean package            # Build JAR
./mvnw test                     # Run all tests
./mvnw test -Dtest=ClassName    # Run a single test class
```
Requires PostgreSQL on `localhost:5432`, database `casalfinanceiro`, user `postgres` / password `postgres123`.

### Frontend Mobile
```bash
cd frontend
npm install
npx expo start                  # Start dev server
npm run android                 # Android emulator
npm run ios                     # iOS simulator
npm run lint                    # ESLint check
```

### Frontend Web
```bash
cd "frontend - web"
npm install
npm run dev                     # Dev server on localhost:3000
npm run build                   # Production build
npm run lint                    # ESLint check
```

## Architecture

### Backend — Layered Architecture
The backend follows a strict four-layer pattern under `com.casalfinanceiro`:

- **Controller** (`controller/`) — REST endpoints. Extracts `userId` and `coupleId` from the JWT (AWS Cognito `custom:couple_id` claim) and passes them to the service.
- **Service** (`service/`) — Business logic including installment amount calculation and temporal filtering.
- **Repository** (`repository/`) — Spring Data JPA. The key custom query `findExpensesForCouple()` filters by `coupleId`, `userId`, `visibility`, and date range.
- **Domain** (`domain/`) — `Expense` JPA entity with UUID PK. Key enums: `Visibility` (PERSONAL, SHARED) and `ExpenseType` (SINGLE, INSTALLMENT, RECURRING). Installment expenses carry `installments` (count), `installmentAmount`, and `endMonthYear`.
- **DTO** (`dto/`) — `ExpenseRequestDTO` for validated incoming requests.
- **Config** (`config/`) — `SecurityConfig` wires Spring Security as an OAuth2 Resource Server validating JWTs from the Cognito issuer. CORS is open for development; CSRF is disabled.

### Frontend Mobile — Expo Router (file-based routing)
Authentication flows through AWS Amplify/Cognito. After login, the JWT Bearer token is attached to all API calls. Key screens:
- `app/index.tsx` — Dashboard, fetches expenses for current month
- `app/add.tsx` — Create/edit expense (handles all three expense types)
- `app/history.tsx` — Calendar/history view
- `app/login.tsx` — Amplify auth UI
- `app/settings.tsx` — User settings

The backend URL is hardcoded as `http://192.168.0.52:9095/api/expenses` — update this when the backend host changes.

### Data Flow
1. Cognito issues JWT → mobile app stores token via Amplify
2. Mobile sends requests with `Authorization: Bearer <token>`
3. Backend validates JWT signature against Cognito JWKS endpoint
4. Controller extracts `sub` (userId) and `custom:couple_id` (coupleId) claims
5. Repository filters data by couple, enforcing PERSONAL/SHARED visibility rules
