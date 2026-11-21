# GymFit - Architectural Decisions & Risk Analysis

## 1. Technical Decisions & Trade-Offs (ADRs)

### ADR-01: Modular Monolith vs. Microservices Architecture
- **Decision**: Adopt a Modular Monolithic architecture packaged as a single Spring Boot application with strict domain package isolation.
- **Context**: GymFit is an early-stage SaaS platform spanning 4 distinct roles and multiple operational domains (billing, attendance, workouts, scheduling).
- **Trade-Off Analysis**:
  - *Microservices Pros*: Independent deployment, isolated process failures, independent scaling.
  - *Microservices Cons*: Distributed tracing complexity, eventual consistency overhead, 2-phase commits, high networking latency, infrastructure cost for multiple cloud runtimes.
  - *Modular Monolith Pros*: Single runtime deployment, atomic database transactions across boundaries (e.g. member registration + payment recording), zero network latency between modules, simple debugging and CI/CD pipelines.
  - *Modular Monolith Cons*: Monolithic build times (manageable with Maven multi-module or clean packages), shared compute resource consumption.
- **Mitigation**: Code boundaries enforce package-private access and domain events (`ApplicationEventPublisher`) rather than tight cross-domain class coupling, allowing straightforward extraction into microservices if individual domains scale disproportionately.

---

### ADR-02: Multi-Tenancy Strategy (Shared Database, Shared Schema with Discriminator)
- **Decision**: Implement multi-tenancy utilizing a shared MySQL database and shared schema, with `gym_id` as the tenant discriminator column.
- **Context**: Cost-efficiency, operational simplicity for migrations, and rapid querying are paramount in early-to-mid SaaS adoption.
- **Trade-Off Analysis**:
  - *Database per Tenant*: Maximum security, but massive infrastructure cost and maintenance burden (running Flyway/Liquibase migrations on hundreds of separate databases).
  - *Schema per Tenant*: Good logical separation, but MySQL connection pool limits and DDL migration latency at scale create administrative bottlenecks.
  - *Shared DB + Discriminator Column*: Lowest hosting cost, instant tenant onboarding (insert row into `gyms`), centralized backups, high connection reuse. However, accidental cross-tenant data leakage is a critical threat if developers omit tenant filters.
- **Mitigation**: Multi-layer defense: Hibernate `@Filter` automatic session activation, Spring Data repository methods incorporating `gym_id`, and `TenantContext` validation interceptors.

---

### ADR-03: Security & Stateless Authentication with JWT & Dual-Token Strategy
- **Decision**: Stateless JWT access tokens (15-minute expiration) paired with persistent, rotatable refresh tokens (7-day expiration).
- **Context**: The frontend is a React Single Page Application (SPA), accessible via desktop browsers and mobile web.
- **Trade-Off Analysis**:
  - *Server-Side Sessions*: Requires sticky sessions or Redis distributed session cache, increasing infrastructure footprint.
  - *Stateless JWT*: Self-contained claims (`role`, `gymId`, `userId`) enable zero DB lookups during route authorization and API requests.
  - *Risk*: JWT cannot be revoked before expiration without a blacklist.
- **Mitigation**: Short 15-minute access token window minimizes the vulnerability surface. Refresh tokens are stored in the database with revocation tracking and rotation upon every refresh request.

---

### ADR-04: Relational Database (MySQL 8.x) vs. NoSQL
- **Decision**: MySQL 8.x with InnoDB storage engine.
- **Context**: GymFit's core domain requires strict ACID compliance: financial payments, membership expiration dates, class capacity bookings (preventing overbooking), and relational integrity between trainers, plans, and members.
- **Trade-Off Analysis**:
  - *NoSQL (MongoDB/Document)*: Flexible schema for workouts, but lacks reliable multi-table relational foreign key constraints and transactional integrity needed for billing and class booking concurrency.
  - *MySQL 8.x*: Proven ACID transactions, foreign keys, row-level locking for class slots, rich JSON support (for flexible workout parameters where appropriate), and advanced indexing (B-Tree composite indexes for multi-tenant queries).

---

## 2. Architectural Risks & Mitigation Strategies

| Risk Identifier | Severity | Likelihood | Impact Description | Mitigation Strategy |
| :--- | :---: | :---: | :--- | :--- |
| **RISK-01: Multi-Tenant Data Leakage (Cross-Tenant IDOR)** | **Critical** | Medium | A bug in a repository query or API controller allows a Gym Owner or Trainer to view/modify records belonging to another gym. | 1. Hibernate automated `@Filter` applied globally on JPA sessions.<br>2. Explicit `TenantContext.getGymId()` verification in custom `@PreAuthorize` evaluators.<br>3. Automated integration test suite running multi-tenant security assertions on every pull request. |
| **RISK-02: Class Booking Concurrency & Overbooking** | **High** | Medium | Multiple members book the last available slot in a high-demand fitness class simultaneously, exceeding room capacity. | 1. Database-level atomic counter checks and pessimistic write locking (`SELECT ... FOR UPDATE`) or optimistic locking (`@Version`) on `Class` capacity.<br>2. Database unique constraint on `(class_id, member_profile_id)` to prevent double booking. |
| **RISK-03: Heavy Attendance Check-in Bottlenecks** | **High** | High | Peak morning/evening check-in rushes cause API latency spikes, slowing turnstile or front-desk check-in throughput. | 1. Lightweight QR payload carrying digitally signed member pass tokens to enable instant verification.<br>2. Dedicated indexed queries on `(gym_id, qr_code_hash)`.<br>3. Asynchronous processing for non-critical post-check-in events (e.g., analytics triggers via Spring Events). |
| **RISK-04: Tenant Growth & Database Scaling Bottlenecks** | **Medium** | Medium | As tenant volume and historical workout log entries expand into millions of rows, table scans degrade overall system throughput. | 1. Mandatory leading `gym_id` on all composite indexes (`gym_id, created_at`).<br>2. Future-proof partition key design on `workout_set_logs` and `attendances` based on `gym_id` or date ranges.<br>3. Read/write replica separation if read traffic surges. |
| **RISK-05: Client-Side Token Exposure (XSS)** | **High** | Low | Injected client scripts intercept JWT access tokens stored insecurely in `localStorage`. | 1. Store refresh tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.<br>2. Keep access tokens in memory (React state) or short-lived storage.<br>3. Standardize React DOM escaping and enable strict Content Security Policy (CSP) headers. |
| **RISK-06: Modular Coupling Degradation** | **Medium** | High | Under rapid feature development, developers create tight cross-domain references, turning the modular monolith into a "spaghetti monolith". | 1. ArchUnit architecture unit tests enforcing package independence rules in the CI pipeline.<br>2. Explicit DTO contracts and Spring domain events for inter-module communication. |
