# GymFit - Project Vision & Requirements Specification

## 1. Executive Summary & Vision Statement

### 1.1 Executive Summary
**GymFit** is a multi-tenant, B2B2C Software-as-a-Service (SaaS) fitness tracking and gym management platform. It bridges the operational divide between fitness facility management and personal member fitness progression. Designed for modern multi-branch gym chains, independent fitness clubs, personal trainers, and active members, GymFit centralizes business administration (memberships, billing, staff, class scheduling, attendance) alongside athletic and health tracking (workout logging, nutrition, body measurements, progress analytics).

### 1.2 Vision Statement
To empower fitness business owners with an enterprise-grade, scalable operations engine while delivering an intuitive, motivating, and personalized health tracking experience to trainers and gym members.

### 1.3 Key Personas & Value Proposition
| Persona | Key Pain Points Solved | Core Value Delivered |
| :--- | :--- | :--- |
| **Platform Admin** | Complex SaaS management, manual tenant provisioning, lack of system-wide health and revenue observability. | Unified multi-tenant control plane, subscription tier management, tenant telemetry, automated audit logs. |
| **Gym Owner** | High member churn, manual check-ins, disjointed billing/invoicing, lack of trainer accountability, scattered member records. | Centralized branch administration, recurring membership management, revenue reporting, staff scheduling, automated attendance. |
| **Trainer** | Tracking client workouts on paper/spreadsheets, irregular client communication, lack of structured client progress tracking. | Client assignment dashboard, workout & diet plan builder, client progress visualization, personal session scheduler. |
| **Member** | Fragmented workout logs, lack of visibility into membership validity, difficulty booking classes or personal training slots. | Seamless mobile-responsive member portal, interactive workout/nutrition diary, class booking, QR-based check-in, attendance and progress history. |

---

## 2. Functional Requirements (FR)

### FR-1: Multi-Tenancy & Tenant Management (Gyms & Branches)
- **FR-1.1**: Platform Admins must be able to onboard new Gym Tenants, set up gym profiles, contact info, and assign initial Gym Owners.
- **FR-1.2**: Platform Admins must be able to define, update, and enforce SaaS subscription tiers (e.g., Free Trial, Starter, Pro, Enterprise) with quotas (max members, max trainers, max branches).
- **FR-1.3**: Gym Owners must be able to configure their gym's operational settings (operating hours, branding colors, logo, branch locations, emergency contacts).
- **FR-1.4**: Platform Admins can suspend, activate, or archive gym tenants based on SaaS subscription status.

### FR-2: Identity, Authentication & Role-Based Access Control (RBAC)
- **FR-2.1**: User registration and login utilizing email/password with secure stateless JWT (JSON Web Tokens).
- **FR-2.2**: Role allocation adhering strictly to 4 core roles: `PLATFORM_ADMIN`, `GYM_OWNER`, `TRAINER`, `MEMBER`.
- **FR-2.3**: Password reset flow via secure, time-limited cryptographic reset tokens.
- **FR-2.4**: Session invalidation via token expiry and refresh token rotation with blacklist/revocation support.
- **FR-2.5**: Audit trails for all authentication events (login failures, password updates, permission changes).

### FR-3: Membership & Subscription Management (Gym-Level)
- **FR-3.1**: Gym Owners can create and manage membership plans (duration, price, billing cycle, renewal terms, included amenities).
- **FR-3.2**: Gym Owners can assign memberships to members, track renewal dates, handle manual payments or record gateway transactions.
- **FR-3.3**: Automatic membership status calculation (`ACTIVE`, `EXPIRED`, `FROZEN`, `CANCELLED`).
- **FR-3.4**: Configurable freeze period and grace periods for membership renewals.

### FR-4: Member Management & Check-in / Attendance
- **FR-4.1**: Gym staff/owners can onboard members, capture health profiles (medical conditions, emergency contacts), and issue digital membership passes.
- **FR-4.2**: Digital check-in system supporting dynamic QR code generation/scanning or manual desk check-in.
- **FR-4.3**: Real-time attendance dashboard showing current active occupants in the gym facility.
- **FR-4.4**: Member attendance history logs with exportable CSV/PDF reports for gym management.

### FR-5: Trainer Management & Client Assignment
- **FR-5.1**: Gym Owners can invite, create, and manage Trainer profiles, specializations, certifications, and working shifts.
- **FR-5.2**: Gym Owners can allocate members to specific trainers for 1-on-1 personal training or group monitoring.
- **FR-5.3**: Trainers can view assigned client lists, client medical notes, and compliance metrics.

### FR-6: Workout & Diet Plan Engineering
- **FR-6.1**: Standard exercise library with categorization (Muscle Groups, Equipment, Difficulty) and custom exercise creation per gym.
- **FR-6.2**: Trainers and Members can create modular Workout Plans (Day-by-Day routine: sets, reps, load, rest interval).
- **FR-6.3**: Trainers can assign tailored workout routines to designated clients.
- **FR-6.4**: Nutrition & Diet plan builder allowing daily calorie goals, macro distributions (protein, carbs, fats), and scheduled meals.
- **FR-6.5**: Members can log completed workouts (actual reps/weight logged per set) and track personal records (PRs / 1RMs).

### FR-7: Class Scheduling & Facility Booking
- **FR-7.1**: Gym Owners and Trainers can create scheduled group classes (e.g., CrossFit, Yoga, Spinning) with instructor, room, time slot, and capacity limit.
- **FR-7.2**: Members can view the weekly/monthly class timetable and book a slot.
- **FR-7.3**: Automated waitlist management when class capacity reaches maximum threshold.
- **FR-7.4**: Class cancellation and attendee notification rules.

### FR-8: Progress Tracking & Body Metrics
- **FR-8.1**: Members and Trainers can record periodic body metrics (weight, body fat %, muscle mass, waist, chest, arms, hips).
- **FR-8.2**: Time-series historical charts comparing body measurements over time.
- **FR-8.3**: Workout adherence and volume load progression analytics over 7-day, 30-day, and 1-year windows.

### FR-9: Reporting & Financial Analytics
- **FR-9.1**: Gym Owners can view revenue dashboards (monthly recurring revenue, cash collections, pending renewals).
- **FR-9.2**: Member churn rate, new sign-ups, and active vs. dormant member analytics.
- **FR-9.3**: Trainer utilization rates and session completion statistics.
- **FR-9.4**: Platform Admin global dashboard: total active gyms, global member count, platform ARR/MRR.

---

## 3. Non-Functional Requirements (NFR)

### 3.1 Security & Compliance
- **NFR-S1 Data Isolation**: Zero cross-tenant data leakage. Every business transaction and query must be strictly scoped to `gym_id` for tenant data.
- **NFR-S2 Credential Protection**: Passwords must be hashed using `BCrypt` with an adaptive work factor (minimum 12 rounds).
- **NFR-S3 Token Security**: Stateless JWTs using HMAC-SHA256 (or RSA/ECDSA) signed with minimum 256-bit entropy secret keys. Access token validity: 15 minutes; Refresh token validity: 7 days with rotation.
- **NFR-S4 Transport Layer Security**: Mandatory HTTPS (TLS 1.3) across all endpoints with HSTS (HTTP Strict Transport Security) enabled.
- **NFR-S5 Injection Defense**: All database queries must be executed via parameterized JPA Criteria/JPQL or prepared statements. Full prevention of SQL injection, XSS (via React sanitized DOM), and CSRF (via stateless Bearer headers).

### 3.2 Performance & Scalability
- **NFR-P1 Latency**: 95th percentile (p95) API response time < 200ms for read operations; < 350ms for write operations under standard load.
- **NFR-P2 Concurrency**: Backend must support at least 500 concurrent active requests per instance without performance degradation.
- **NFR-P3 Throughput**: Check-in and scanning endpoints must execute within < 100ms to eliminate physical entrance bottlenecks.
- **NFR-P4 Database Indexing**: Strategic compound indexes on `(gym_id, id)`, `(gym_id, member_id)`, and `(gym_id, created_at)` to guarantee constant query times even as tables scale to millions of rows.

### 3.3 Reliability & Availability
- **NFR-R1 Uptime Target**: 99.9% monthly availability for core check-in and membership validation services.
- **NFR-R2 Fault Tolerance**: Graceful failure handling with uniform API error responses (`RFC 7807 Problem Details`). Unhandled exceptions must never expose internal stack traces.
- **NFR-R3 Database Backups**: Automated daily snapshots with Point-In-Time-Recovery (PITR) capable of restoring state to within 15 minutes of an incident.

### 3.4 Maintainability & Extensibility
- **NFR-M1 Modular Monolith**: Clear package boundaries separating bounded contexts. No circular dependencies across domain packages.
- **NFR-M2 Code Standards**: Follow strict Java 21 idiomatic standards (records, sealed interfaces, pattern matching) and clean architecture principles.
- **NFR-M3 API Versioning**: URI-based API versioning (e.g., `/api/v1/...`) to ensure backward compatibility for future client evolutions.
- **NFR-M4 Frontend Maintainability**: Component-driven design, separation of UI presentational components from custom data fetching hooks, and strict Tailwind CSS design tokens.
