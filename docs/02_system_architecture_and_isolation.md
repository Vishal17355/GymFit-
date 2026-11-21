# GymFit - System Architecture & Multi-Gym Data Isolation

## 1. High-Level Architectural Pattern: Modular Monolith

### 1.1 Architectural Rationale
GymFit utilizes a **Modular Monolithic Architecture**. While microservices are popular for large enterprise organizations, for a new SaaS product like GymFit, microservices introduce premature network serialization overhead, distributed transactions complexity, high operational DevOps burdens, and consistency challenges.

The Modular Monolith provides:
1. **Single Deployment Unit**: Simplified CI/CD, single container runtime, reduced cloud infrastructure hosting costs.
2. **Strict Module Encapsulation**: Clear domain-driven boundaries (Bounded Contexts) with explicit API contracts between modules.
3. **In-Process Communication**: Zero network latency for inter-module calls, leveraging standard Java interfaces and Spring Application Events.
4. **Microservices Readiness**: Because boundaries and data access rules are strictly isolated per module, any individual module (e.g., Attendance/Check-in or Workout Engine) can be extracted into an independent microservice later without refactoring business logic.

### 1.2 Module Decomposition (Bounded Contexts)
The system is divided into well-defined modules:

```
gymfit-backend/
├── src/main/java/com/gymfit/
│   ├── core/                      # Cross-cutting infrastructure
│   │   ├── config/                # Spring & Security configuration
│   │   ├── security/              # JWT filters, UserDetails, SecurityUtils
│   │   ├── tenant/                # TenantContext, TenantFilter, Multi-tenancy interceptors
│   │   ├── exception/             # Global exception handlers, Error responses
│   │   └── common/                # Base entities (Auditable), pagination, DTO utilities
│   │
│   ├── modules/
│   │   ├── platform/              # Platform Admin module: Tenant provisioning, SaaS plans
│   │   ├── gym/                   # Gym profile, branch config, facility settings
│   │   ├── user/                  # User management, roles, authentication profiles
│   │   ├── membership/            # Gym membership plans, subscriptions, payment records
│   │   ├── attendance/            # QR check-in, visit logging, live headcount
│   │   ├── classschedule/         # Class timetables, bookings, capacity & waitlist
│   │   ├── workout/               # Exercises library, workout plans, logs, PRs
│   │   ├── nutrition/             # Diet plans, macro calculation, meal logs
│   │   └── analytics/             # Reporting engine for Gym Owners & Platform Admins
```

---

## 2. Multi-Gym Data Isolation Strategy

### 2.1 Multi-Tenancy Architecture Analysis
In a B2B2C SaaS system, selecting the correct tenancy model dictates scalability, operational cost, and security posture.

| Tenancy Model | Data Isolation Level | Cost & Resource Efficiency | Operational Complexity | Suitability for GymFit |
| :--- | :--- | :--- | :--- | :--- |
| **Separate Database per Gym** | Absolute physical isolation | Very High (hundreds of DB instances or connections) | High (migrations must run on every DB, complex pooling) | Overkill for initial/growth phase |
| **Separate Schema per Gym** | High logical isolation | Moderate (tables replicated per schema in single DB) | Moderate (schema DDL migration overhead on 1000s of schemas) | High operational overhead |
| **Shared Database, Shared Schema (Discriminator Column)** | Logical isolation via `gym_id` | Optimal (single database, shared pooling, low cost) | Low infrastructure complexity; requires strict architectural guardrails | **Selected Strategy (Optimal for GymFit)** |

### 2.2 Selected Strategy: Shared Database with Logical Tenant Isolation (`gym_id`)
Every tenant-scoped table contains a mandatory non-nullable foreign key column: `gym_id BIGINT NOT NULL`.

#### Multi-Tenant Security Enforcement Layers:
1. **Tenant Context Resolution**:
   - Every incoming authenticated request carries a signed JWT containing claims: `userId`, `gymId` (null for Platform Admins), and `roles`.
   - A Spring Web Filter (`TenantContextFilter`) extracts the `gymId` claim and sets it into a `ThreadLocal` (`TenantContext`).
   - The context is automatically cleared after the request lifecycle in a `finally` block to prevent thread pool pollution.

2. **Hibernate Automated Filter (`@FilterDef` & `@Filter`)**:
   - Entities implement a marker interface `TenantScoped` or inherit from `BaseTenantEntity`.
   - An active Hibernate filter:
     ```java
     @Filter(name = "tenantFilter", condition = "gym_id = :gymId")
     ```
     is automatically enabled on the JPA session via a JPA Entity Lifecycle Interceptor or Aspect (`@Aspect`) for all tenant-scoped requests.
   - For `PLATFORM_ADMIN` sessions, the filter is explicitly bypassed to allow global tenant oversight.

3. **Repository-Level Guardrails (Spring Data JPA)**:
   - All custom Spring Data JPA repository queries explicitly enforce the tenant discriminator:
     ```java
     Optional<Member> findByIdAndGymId(Long id, Long gymId);
     Page<Member> findAllByGymId(Long gymId, Pageable pageable);
     ```
   - Prevents accidental data leakages if filters are ever bypassed during raw JPQL/native queries.

4. **Service-Layer Tenant Verification**:
   - Before executing update, delete, or link operations, the service verifies that the entity's `gymId` strictly matches `TenantContext.getGymId()`. Mismatches throw an immutable `AccessDeniedException` / `TenantMismatchException`.

5. **Database Indexing for Tenancy**:
   - Composite indexes are defined with `gym_id` as the leading column: `INDEX idx_members_gym_status (gym_id, status)` to ensure query execution plans remain high-speed and partition-ready.

---

## 3. Backend Architecture Design (Spring Boot 3.x + Java 21)

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 HTTP Client (React Frontend)           │
                  └───────────────────────────┬────────────────────────────┘
                                              │ HTTPS / JSON
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │               Spring Security Filter Chain             │
                  │   ┌────────────────────────────────────────────────┐   │
                  │   │ JwtAuthenticationFilter                        │   │
                  │   │  - Validates Bearer Token                      │   │
                  │   │  - Populates SecurityContextHolder             │   │
                  │   └───────────────────────┬────────────────────────┘   │
                  │                           ▼                            │
                  │   ┌────────────────────────────────────────────────┐   │
                  │   │ TenantContextFilter                            │   │
                  │   │  - Extracts gymId from JWT Claims              │   │
                  │   │  - Populates ThreadLocal TenantContext         │   │
                  │   └───────────────────────┬────────────────────────┘   │
                  └───────────────────────────┼────────────────────────────┘
                                              │
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                   Controller Layer                     │
                  │  (REST Controllers, DTO Validation @Valid, OpenAPI)   │
                  └───────────────────────────┬────────────────────────────┘
                                              │ DTOs
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                    Service Layer                       │
                  │  (Business Logic, Transaction Management, RBAC Check)  │
                  └───────────────┬────────────────────────┬───────────────┘
                                  │                        │
               In-process Events  │                        │ Repositories
                                  ▼                        ▼
                  ┌────────────────────────┐  ┌────────────────────────────┐
                  │ ApplicationEventPublisher│ │   Spring Data JPA Repos    │
                  │ (Domain Events)        │  │ (Hibernate Tenant Filter)  │
                  └────────────────────────┘  └────────────┬───────────────┘
                                                           │
                                                           ▼
                                              ┌────────────────────────────┐
                                              │    MySQL 8.x Database      │
                                              │   (InnoDB, Foreign Keys)   │
                                              └────────────────────────────┘
```

### 3.1 Core Backend Components
1. **Security & JWT Architecture**:
   - `SecurityConfig`: Stateless session configuration (`SessionCreationPolicy.STATELESS`).
   - `JwtTokenProvider`: Token signing, validation, claims extraction (issuer, subject, role, gymId).
   - `MethodSecurity`: `@PreAuthorize("hasRole('GYM_OWNER')")` or custom expression evaluators `@PreAuthorize("@tenantGuard.isMemberOfCurrentGym(#memberId)")`.
2. **DTO & Validation Layer**:
   - Strict separation between persistence Entities and API DTOs (using Java 21 Records for immutable DTOs).
   - Jakarta Bean Validation (`@NotNull`, `@Size`, `@PositiveOrZero`, `@Pattern`, `@FutureOrPresent`).
3. **Exception Handling Layer**:
   - `GlobalExceptionHandler` with `@RestControllerAdvice`.
   - Unified RFC 7807 `ProblemDetail` or custom standardized JSON error envelope:
     ```json
     {
       "timestamp": "2026-11-02T14:22:10Z",
       "status": 403,
       "error": "Forbidden",
       "message": "Access to tenant resources denied",
       "path": "/api/v1/members/104"
     }
     ```
4. **Audit Infrastructure**:
   - Spring Data JPA Auditing (`@EnableJpaAuditing`) with `Auditable<T>` base class containing: `createdAt`, `updatedAt`, `createdBy`, `lastModifiedBy`.

---

## 4. Frontend Architecture Design (React + JavaScript + Tailwind CSS)

### 4.1 Architecture Principles
1. **Component-Driven Architecture**: Structured atomic design (atoms, molecules, organisms, layouts, pages).
2. **Role-Based Dynamic Routing**: Route guards filtering views based on user authentication status and assigned permissions.
3. **Normalized State Management**: Separation of Server Cache (via TanStack Query / React Query or custom data hooks with SWR pattern) and Global UI State (React Context API / Zustand for active user profile, theme, and notifications).
4. **Mobile-First Responsive Layout**: Tailwind CSS responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) catering to members checking in on mobile phones and gym staff on desktop front-desks.

### 4.2 Frontend Directory Structure
```
gymfit-frontend/
├── src/
│   ├── assets/                # Icons, logos, static illustrations
│   ├── components/            # Reusable UI component library
│   │   ├── common/            # Buttons, Inputs, Modals, Tables, Spinners, Badges
│   │   ├── layout/            # Navbar, Sidebar, PageContainer, Header, Footer
│   │   └── feedback/          # Toast notifications, Confirmation dialogs
│   ├── config/                # Environment variables, API constants
│   ├── context/               # AuthContext (JWT, user, gym profile), ThemeContext
│   ├── hooks/                 # Custom React hooks (useAuth, useTenant, useApi, usePagination)
│   ├── routes/                # Route definitions & Role Guards
│   │   ├── AppRoutes.jsx      # Master Router
│   │   ├── ProtectedRoute.jsx # Authentication Guard
│   │   └── RoleGuard.jsx      # Role authorization wrapper
│   ├── services/              # API Client (Axios instances, interceptors)
│   │   ├── api.js             # Base Axios instance with auth & error interceptors
│   │   ├── authService.js
│   │   ├── memberService.js
│   │   ├── trainerService.js
│   │   ├── gymService.js
│   │   ├── workoutService.js
│   │   └── attendanceService.js
│   ├── pages/                 # Role-Specific Page Views
│   │   ├── auth/              # Login, ForgotPassword, Register
│   │   ├── platform/          # Platform Admin: Tenants, Plan Subscriptions, System Metrics
│   │   ├── owner/             # Gym Owner: Dashboard, Members, Trainers, Plans, Finances
│   │   ├── trainer/           # Trainer: Assigned Clients, Routine Builder, Schedules
│   │   ├── member/            # Member: Workout Tracker, Diet Log, Class Booking, Pass
│   │   └── shared/            # 404, 403 Unauthorized, Server Error, Profile Settings
│   └── utils/                 # Date formatters, currency helpers, validation rules
```

### 4.3 Axios Interceptor Strategy
- **Request Interceptor**: Reads access token from secure storage (e.g., in-memory variable backed by HttpOnly refresh cookie or local storage) and injects `Authorization: Bearer <token>`.
- **Response Interceptor**:
  - Automatically catches `401 Unauthorized` responses and triggers a silent refresh call to `/api/v1/auth/refresh`.
  - If refresh fails, purges session state and redirects to `/login`.
  - Catches `403 Forbidden` and displays a tenant violation alert or redirects to an unauthorized notice.
