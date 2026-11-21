# GymFit - Phased Development Roadmap & Milestones

## 1. Roadmap Overview & Timeline

The GymFit platform development lifecycle is divided into 5 structured phases, balancing risk mitigation, core infrastructure establishment, operational capability delivery, and progressive user experience refinement.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Planning & Architecture (Current Phase)                            │
│  - Requirements Analysis, System & DB Architecture, API Specs, RBAC Design  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 2: Core Foundation & Tenant Multi-Tenancy Engine                      │
│  - Project Initialization, Security & JWT, Database Migrations, RBAC Core   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 3: Gym Operations & Administration (MVP)                              │
│  - Gym Profiles, Branches, Memberships, Attendance (QR), Billing Records     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 4: Fitness Tracking, Coaching & Scheduling Engine                     │
│  - Workout Routines, Exercise Library, Class Scheduling, Diet & Metrics     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 5: Platform Analytics, Optimization & Production Launch               │
│  - Business Dashboards, Performance Tuning, Security Audit, E2E Testing     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Phase Breakdown

### Phase 1: Project Planning & Architecture (Completed Milestone)
- [x] Project vision analysis and B2B2C value proposition definition.
- [x] Comprehensive Functional (FR) and Non-Functional (NFR) requirements specification.
- [x] Role module scope definition across 4 user roles.
- [x] Frontend architecture and component layout design.
- [x] Backend modular monolithic architecture and packaging design.
- [x] Relational database modeling with MySQL 8.x and complete Mermaid ER diagram.
- [x] RESTful API endpoints specification with HTTP verbs, request/response models.
- [x] Role-Based Access Control (RBAC) matrix and JWT security scheme.
- [x] Multi-gym data isolation strategy with Hibernate tenant filtering.
- [x] Architectural trade-off analysis (ADRs) and mitigation plan for architectural risks.

---

### Phase 2: Core Foundation & Multi-Tenancy Engine
**Objective**: Build the foundational infrastructure, database schema, security layer, and multi-tenant isolation mechanisms.

#### Backend Deliverables:
- Initialize Spring Boot 3.x project with Java 21, Spring Data JPA, Spring Security, Flyway/Liquibase, and MySQL connector.
- Configure database migrations for initial core tables: `saas_plans`, `gyms`, `gym_branches`, `users`.
- Implement `TenantContext` (ThreadLocal), `TenantContextFilter`, and Hibernate `@Filter` for dynamic `gym_id` scoping.
- Implement stateless JWT authentication: login, token issuance, refresh token rotation, and password hashing (`BCrypt`).
- Configure global exception handling (`@RestControllerAdvice`), standard response envelope, and validation filters.
- Setup `ArchUnit` tests to enforce modular monolith boundaries.

#### Frontend Deliverables:
- Initialize React project with Tailwind CSS, React Router v6, and Axios.
- Implement design system tokens (colors, typography, responsive breakpoints).
- Implement `AuthContext`, persistent token handling, and Axios interceptor for authorization headers and 401 token refresh.
- Build route protection guards (`ProtectedRoute`, `RoleGuard`).
- Implement basic auth pages: Login, Forgot Password, and Profile view.

---

### Phase 3: Gym Operations & Administration (MVP Launchpad)
**Objective**: Deliver operational gym management capabilities for Platform Admins and Gym Owners.

#### Backend Deliverables:
- **Platform Admin Module**: APIs to onboard gyms, set subscription plans, and toggle tenant statuses.
- **Gym & Branch Module**: CRUD APIs for gym profiles, operational hours, and branch locations.
- **Membership & Member Module**: CRUD APIs for membership plans, member onboarding, and subscription assignments.
- **Attendance Engine**: Digital pass generation with QR tokens, check-in/check-out endpoints with low-latency verification, and live headcount query.
- **Payment Logging**: APIs to record manual and gateway cash/card transactions.

#### Frontend Deliverables:
- **Platform Admin Portal**: Tenant list table, gym onboarding modal, SaaS plan management screen.
- **Gym Owner Dashboard**:
  - Live facility attendance widget (current occupants counter).
  - Member directory with search, filter, and onboarding modal.
  - Membership plan builder and renewal tracker.
  - Front-desk QR check-in scanner / manual search interface.
- **Member Self-Service**:
  - Digital member card view displaying active QR code pass and membership expiration timer.

---

### Phase 4: Fitness Tracking, Coaching & Scheduling Engine
**Objective**: Enable interactive fitness tracking for Trainers and Members.

#### Backend Deliverables:
- **Exercise Catalog**: Seed default global exercise database; APIs for gym-specific custom exercises.
- **Workout Plan Builder**: APIs to create workout routines (days, exercise sets, reps, target RPE, rest times) and assign to members.
- **Workout Execution & Logging**: APIs for members to log completed sets, weights, reps, and detect Personal Records (PRs).
- **Nutrition Planner**: APIs to assign target calories and macronutrient ratios (protein/carbs/fat).
- **Body Metric Tracker**: APIs to log weight and measurements with chronological history.
- **Class Scheduling**: Group class scheduling with concurrency-safe booking logic (pessimistic/optimistic locking) and waitlist automation.

#### Frontend Deliverables:
- **Trainer Dashboard**:
  - Client roster view with individual client profile cards.
  - Interactive Workout Routine Builder (drag-and-drop or structured day/set builder).
  - Client progress visualizer (workout adherence, volume graphs).
- **Member Fitness Portal**:
  - Daily workout logger (active session mode with timer and set check-offs).
  - Body metric visualizer using interactive charts (Chart.js / Recharts).
  - Class timetable grid with 1-click slot booking and cancellation.

---

### Phase 5: Platform Analytics, Optimization & Production Launch
**Objective**: Polish, optimize, test, and prepare for production deployment.

#### Deliverables:
- **Reporting & Business Analytics**:
  - Gym Owner revenue dashboards: MRR, monthly cash flow, member churn rate, retention curves.
  - Platform Admin global SaaS metric dashboards.
- **Security & Quality Assurance**:
  - Penetration testing & multi-tenant isolation verification (IDOR test suite).
  - Load testing (JMeter / k6) on QR check-in and class booking endpoints (target: 500+ concurrent requests, < 100ms response).
  - Frontend responsiveness verification across iOS/Android mobile viewports and desktop resolutions.
- **Production CI/CD & Infrastructure Setup**:
  - Docker containerization for frontend (Nginx) and backend (Temurin JDK 21).
  - GitHub Actions CI/CD pipeline for automated testing, linting, and container builds.
  - Production deployment architecture with automated MySQL backups and health check probes (`/actuator/health`).

---

## 3. Success Metrics & Verification Gateways

| Milestone | Gate Criteria | Verification Method |
| :--- | :--- | :--- |
| **Foundation Gate** | Zero cross-tenant leakage; JWT auth working with refresh rotation. | Automated integration tests simulating multi-tenant queries with spoofed `gym_id`. |
| **MVP Operations Gate** | Gym owner can register member, issue QR pass, and execute check-in in under 100ms. | End-to-end user scenario testing on staging environment. |
| **Fitness Engine Gate** | Member logs full workout routine; sets, reps, and PRs record accurately with zero data anomalies. | Functional test coverage > 80% on workout & booking services. |
| **Production Ready Gate** | Pass security audit, zero high/critical vulnerabilities, p95 API response < 200ms under load. | OWASP ZAP security scan + k6 load testing execution report. |
