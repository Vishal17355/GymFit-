# GymFit - Backend Architecture Specification

## 1. Technology Baseline

- **Runtime**: Java 21 LTS (Records, Pattern Matching, Sealed Types, Virtual Threads ready)
- **Framework**: Spring Boot 3.3+
- **Security**: Spring Security 6+ with Stateless JWT
- **Persistence**: Spring Data JPA / Hibernate 6+
- **Database**: MySQL 8.x (InnoDB Storage Engine)
- **Database Migrations**: Flyway / Liquibase
- **Validation**: Jakarta Validation (`@Valid`, Bean Validation 3.0)
- **Documentation**: Springdoc OpenAPI 3.0 (Swagger UI)

---

## 2. Layered Architecture & Request Processing Pipeline

```
  HTTP Request (Bearer Token)
               │
               ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 1. Spring Security Filter Chain                             │
  │    ├── CorsFilter & CsrfFilter (disabled for stateless API) │
  │    ├── JwtAuthenticationFilter (validates signature & claims│
  │    └── TenantContextFilter (populates TenantContext)        │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 2. Web / Controller Layer                                   │
  │    ├── URL Pattern Routing (/api/v1/...)                    │
  │    ├── Method Security (@PreAuthorize checks)               │
  │    ├── Request Body DTO Deserialization & @Valid Validation │
  │    └── GlobalExceptionHandler (@RestControllerAdvice)       │
  └──────────────────────────────┬──────────────────────────────┘
                                 │ Validated DTO
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 3. Service Layer (Business Logic)                           │
  │    ├── Transaction Management (@Transactional)              │
  │    ├── Tenant Verification & Domain Invariant Checks        │
  │    ├── Event Publishing (ApplicationEventPublisher)         │
  │    └── Mapping between Entities and DTO Records             │
  └──────────────────────────────┬──────────────────────────────┘
                                 │ Domain Entities
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 4. Data Access Layer (Spring Data JPA)                      │
  │    ├── Hibernate Session Filter ("tenantFilter": gym_id)    │
  │    ├── Parameterized JpaRepository Methods                  │
  │    └── Compound Index Query Optimization                    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │ SQL (Prepared Statements)
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 5. Persistence Layer (MySQL 8.x)                            │
  └─────────────────────────────────────────────────────────────┘
```

---

## 3. Modular Monolith Package Structure

```
com.gymfit/
├── core/
│   ├── config/             # SecurityConfig, JpaConfig, WebMvcConfig
│   ├── security/           # JwtTokenProvider, UserDetailsServiceImpl, TenantGuard
│   ├── tenant/             # TenantContext, TenantFilterAspect, TenantScoped
│   ├── exception/          # GlobalExceptionHandler, ResourceNotFoundException, ProblemDetail
│   └── common/             # BaseEntity (Auditable), ApiResponse<T>, PageResponse<T>
│
└── modules/
    ├── platform/           # Platform Admin: Tenants, SaaS Subscriptions
    │   ├── controller/
    │   ├── service/
    │   ├── repository/
    │   └── dto/
    ├── gym/                # Gym profile, branch locations
    ├── user/               # Users, profiles, credentials
    ├── membership/         # Membership plans, member subscriptions, payments
    ├── attendance/         # Check-in, check-out, live headcount
    ├── classschedule/      # Group classes, bookings, waitlists
    ├── workout/            # Exercises, workout plans, session logs
    ├── nutrition/          # Diet plans, macros, meals
    └── analytics/          # Business reporting, financial KPIs
```

---

## 4. Key Architectural Patterns

1. **Immutable DTOs with Java 21 Records**:
   All request and response data carriers are modeled using Java 21 `record` constructs, ensuring thread-safety, zero boilerplate getters/equals/hashcode, and immutability.
2. **Defensive Multi-Tenant Data Layer**:
   A custom Spring AOP Aspect (`@Aspect`) ensures that any service call within a tenant context automatically enables Hibernate's `tenantFilter` on the active JPA session, dynamically setting `:gymId = TenantContext.getGymId()`.
3. **Decoupled Event-Driven Domain Changes**:
   Domain mutations emit Spring Application Events (e.g., `ClassBookedEvent`, `MemberExpiredEvent`). Subscribers handle secondary workflows such as audit logging, push notifications, and occupancy tracking asynchronously without blocking API request latency.
