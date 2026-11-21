# GymFit - Technical Architecture Specification

## 1. Architectural Style & Paradigms

GymFit is engineered using the **Modular Monolithic** architectural paradigm. It combines the operational and deployment simplicity of a monolithic application with the strict boundary isolation, maintainability, and domain encapsulation typical of microservices.

```
                              ┌────────────────────────────────────────┐
                              │             Client Layer               │
                              │    React 18+ SPA (Tailwind CSS)        │
                              └───────────────────┬────────────────────┘
                                                  │ HTTPS / JSON / JWT
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │         API & Gateway Layer            │
                              │     Spring Security Filter Chain       │
                              │     - JwtAuthenticationFilter          │
                              │     - TenantContextFilter              │
                              └───────────────────┬────────────────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────┴─────────────────────────────────────────────────┐
│                                 Modular Monolith Application Core                                 │
│                                                                                                   │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐                  │
│  │    Platform Module    │  │   Tenant Gym Module   │  │   User & Auth Module  │                  │
│  │  - SaasPlanService    │  │  - GymProfileService  │  │  - AuthService        │                  │
│  │  - TenantProvisioner  │  │  - BranchService      │  │  - UserProfileService │                  │
│  └───────────┬───────────┘  └───────────┬───────────┘  └───────────┬───────────┘                  │
│              │                          │                          │                              │
│  ┌───────────┴───────────┐  ┌───────────┴───────────┐  ┌───────────┴───────────┐                  │
│  │   Membership Module   │  │   Attendance Module   │  │   Class Schedule      │                  │
│  │  - PlanCatalogService │  │  - CheckInService     │  │  - TimetableService   │                  │
│  │  - BillingService     │  │  - LiveOccupancyEngine│  │  - BookingService     │                  │
│  └───────────┬───────────┘  └───────────┬───────────┘  └───────────┬───────────┘                  │
│              │                          │                          │                              │
│  ┌───────────┴───────────┐  ┌───────────┴───────────┐  ┌───────────┴───────────┐                  │
│  │     Workout Module    │  │   Nutrition Module    │  │    Analytics Module   │                  │
│  │  - ExerciseCatalog    │  │  - DietPlannerService │  │  - OwnerDashboardAgg  │                  │
│  │  - RoutineBuilder     │  │  - MacroCalculator    │  │  - PlatformRevenueAgg │                  │
│  │  - SessionSetLogger   │  │  - MetricTrendEngine  │  │                       │                  │
│  └───────────────────────┘  └───────────────────────┘  └───────────────────────┘                  │
│                                                                                                   │
│                    Spring ApplicationEventPublisher (In-Memory Event Bus)                         │
└─────────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                                  │ Spring Data JPA (Hibernate Tenant Filter)
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │         Relational Storage Layer       │
                              │                MySQL 8.x               │
                              │    Shared DB / Shared Schema (gym_id)  │
                              └────────────────────────────────────────┘
```

---

## 2. Cross-Cutting Technical Decisions

### 2.1 Decoupled Module Communication
Modules interact through:
1. **Service Interfaces**: Public interfaces exported by domain modules (e.g., `MembershipVerificationService`), keeping internal implementation packages protected.
2. **Spring Domain Events**: Asynchronous or decoupled workflows (e.g., when `MemberCheckedInEvent` is published, the `LiveOccupancyEngine` updates in-memory counters without the attendance module coupling directly to the occupancy module).

### 2.2 Strict Tenancy Boundary
All tenant-scoped entities implement `TenantScoped` and declare a foreign key `gym_id`. The tenant ID is established early in the request pipeline and propagated using a `ThreadLocal` context (`TenantContext`), ensuring that zero queries can accidentally leak cross-tenant data.
