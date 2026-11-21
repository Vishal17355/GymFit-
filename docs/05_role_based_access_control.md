# GymFit - Role-Based Access Control (RBAC) & Role Modules

## 1. Role Module Definitions

GymFit partitions application capabilities across four explicit roles:

```
                            ┌────────────────────────┐
                            │    PLATFORM_ADMIN      │
                            │ (Global Multi-Tenant)  │
                            └───────────┬────────────┘
                                        │ Governs
                                        ▼
                            ┌────────────────────────┐
                            │       GYM_OWNER        │
                            │   (Tenant Authority)   │
                            └─────┬────────────┬─────┘
                                  │            │
                         Manages  │            │ Enrolls
                                  ▼            ▼
                     ┌──────────────────┐  ┌──────────────────┐
                     │     TRAINER      │  │      MEMBER      │
                     │ (Staff / Coach)  │  │  (End Customer)  │
                     └──────────────────┘  └──────────────────┘
```

### 1.1 Role 1: Platform Admin
Operates above individual gym tenants. Responsible for the overall health, commercial operations, and configuration of the SaaS platform.
- **Tenant Management Module**: Onboard gym organizations, create tenant slugs, configure SaaS plan associations, toggle tenant status (`ACTIVE`, `SUSPENDED`).
- **SaaS Subscription & Pricing Module**: Define SaaS pricing tiers (`Starter`, `Pro`, `Enterprise`), feature flags, resource limits (max members, max trainers, max branches).
- **Platform Telemetry & Revenue Module**: System-wide aggregation of active gyms, global user count, SaaS Monthly Recurring Revenue (MRR), and annual projections.
- **Global Audit & Compliance Module**: Cross-tenant activity audits, security anomaly alerts, platform-wide user status overrides.

### 1.2 Role 2: Gym Owner
Highest authority within a specific gym tenant. Holds administrative and financial control over the gym and its branches.
- **Gym & Branch Administration Module**: Gym profile, contact details, branding, operational hours, branch creation and management.
- **Membership Plan & Pricing Module**: Create and manage membership tiers, pricing, duration, renewal rules.
- **Member Management Module**: Member onboarding, profile verification, membership assignment, freeze/cancellation, digital pass generation.
- **Staff & Trainer Management Module**: Onboard trainers, define compensation/hourly rates, assign member clients to trainers.
- **Facility Scheduling Module**: Schedule group classes, assign trainers, room allocations, capacity enforcement.
- **Attendance & Access Monitoring Module**: Live headcount dashboard, check-in history, QR check-in overrides, peak-hour analytics.
- **Billing & Revenue Reporting Module**: Cash collections, payment transactions, member renewal forecasting, churn analytics.

### 1.3 Role 3: Trainer
Fitness coach and instructor within a specific gym.
- **Client Roster Module**: View assigned members, review client health history, goals, and injury/medical notes.
- **Workout Plan Builder Module**: Design routine splits (days, exercises, sets, reps, target RPE, rest intervals), assign plans to individual clients or create reusable templates.
- **Nutrition & Diet Assignment Module**: Configure target calories, macro breakdowns (carbs/protein/fat), meal plans.
- **Client Progress & Metrics Module**: Monitor client workout logs, review logged weights/reps, analyze 1RM progression and body measurement trends.
- **Class Instruction Module**: View schedule of group classes assigned to them, manage attendee rosters, mark attendance.

### 1.4 Role 4: Member
End consumer utilizing gym facilities and tracking athletic journey.
- **Digital Pass & Access Module**: Personal QR code generation for gate/front-desk check-in, check-in history, active membership status and expiration countdown.
- **Workout Logging & PR Module**: View assigned workout routine, log actual weights and reps completed per set, flag personal records (PRs), freestyle workout logging.
- **Nutrition & Diet Tracker Module**: View assigned daily calorie and macro goals, track meal compliance.
- **Body Metrics & Progress Module**: Self-record weight, body fat %, and tape measurements; visualize historical progress graphs.
- **Class Timetable & Booking Module**: Browse upcoming group classes, book slots, join waitlists, cancel bookings.
- **Account & Billing Profile Module**: View payment history, invoice receipts, update personal contact and emergency details.

---

## 2. Granular Permissions Matrix

| Domain Capability | Platform Admin | Gym Owner | Trainer | Member |
| :--- | :---: | :---: | :---: | :---: |
| **Platform / SaaS Management** | | | | |
| Onboard New Gyms | **CRUD** | - | - | - |
| Configure SaaS Plans | **CRUD** | - | - | - |
| Suspend / Activate Tenants | **U** | - | - | - |
| View Platform Global Analytics | **R** | - | - | - |
| **Gym & Branch Operations** | | | | |
| View Gym Profile | **R** (All) | **R** | **R** | **R** |
| Update Gym Info & Branding | **U** (All) | **U** (Own) | - | - |
| Create / Manage Branches | **CRUD** (All) | **CRUD** (Own) | **R** (Own) | **R** (Own) |
| **Memberships & Billing** | | | | |
| Create Membership Plans | - | **CRUD** | **R** | **R** |
| Assign / Renew Memberships | - | **CRUD** | - | - |
| View Gym Financial Analytics | - | **R** | - | - |
| View Personal Invoices | - | **R** (All Gym) | - | **R** (Self) |
| **Member Administration** | | | | |
| Onboard New Member | - | **C** | - | - |
| View Member List | - | **R** (All) | **R** (Assigned) | - |
| Edit Member Medical Notes | - | **U** | **U** (Assigned) | **U** (Self) |
| Generate / Regenerate QR Pass | - | **U** | - | **R** (Self) |
| **Attendance & Check-in** | | | | |
| Perform Front-Desk Check-in | - | **C** | - | **C** (Self-QR) |
| View Live Facility Headcount | - | **R** | **R** | - |
| View Full Gym Attendance Logs | - | **R** | - | - |
| View Personal Attendance Logs | - | **R** | - | **R** (Self) |
| **Trainers & Assignments** | | | | |
| Onboard / Manage Trainers | - | **CRUD** | - | - |
| Assign Trainer to Member | - | **C/U** | - | - |
| View Trainer List & Bios | - | **R** | **R** | **R** |
| **Classes & Timetable** | | | | |
| Create / Schedule Classes | - | **CRUD** | **C/U** (Assigned) | - |
| View Class Timetable | - | **R** | **R** | **R** |
| Book / Cancel Class Slot | - | **C/D** (Any) | - | **C/D** (Self) |
| Mark Class Attendance | - | **U** | **U** (Assigned) | - |
| **Workouts & Exercises** | | | | |
| Manage Custom Exercises | - | **CRUD** | **CRUD** | **R** |
| Create Workout Plan Templates| - | **CRUD** | **CRUD** | **C** (Personal) |
| Assign Workout to Member | - | **C/U** | **C/U** (Assigned) | - |
| Log Workout Session Sets | - | - | **C/U** (Assigned) | **CRUD** (Self) |
| View Workout History | - | **R** (All) | **R** (Assigned) | **R** (Self) |
| **Nutrition & Progress** | | | | |
| Assign Nutrition Targets | - | **CRUD** | **CRUD** (Assigned) | - |
| View Nutrition Plan | - | **R** | **R** (Assigned) | **R** (Self) |
| Record Body Metrics | - | **C** | **C** (Assigned) | **C/U** (Self) |
| View Metric Graphs | - | **R** | **R** (Assigned) | **R** (Self) |

*Key: **C** = Create, **R** = Read, **U** = Update, **D** = Delete, **Self** = Restricted to own data, **Assigned** = Restricted to assigned trainer-client relation.*

---

## 3. JWT Claims Structure & Security Enforcement Pattern

### 3.1 Token Payload Schema
```json
{
  "sub": "user_id_1092",
  "iss": "gymfit-auth-service",
  "email": "marcus.trainer@apexfitness.com",
  "gymId": 42,
  "branchId": 5,
  "role": "ROLE_TRAINER",
  "name": "Marcus Vance",
  "iat": 1793620800,
  "exp": 1793621700
}
```
*Note: For `PLATFORM_ADMIN`, `gymId` and `branchId` are explicitly null.*

### 3.2 Spring Security Implementation Blueprint
Spring Method Security (`@PreAuthorize`) pairs with custom Security Evaluators:

```java
// Controller-level role enforcement
@PreAuthorize("hasRole('GYM_OWNER')")
@PostMapping("/branches")
public ResponseEntity<BranchDTO> createBranch(@Valid @RequestBody CreateBranchRequest request) { ... }

// Granular resource ownership and relationship validation
@PreAuthorize("hasAnyRole('GYM_OWNER') or (hasRole('TRAINER') and @securityService.isTrainerOfClient(principal, #memberId)) or (hasRole('MEMBER') and @securityService.isCurrentMember(principal, #memberId))")
@GetMapping("/members/{memberId}/workout-logs")
public ResponseEntity<List<WorkoutLogDTO>> getWorkoutLogs(@PathVariable Long memberId) { ... }
```

### 3.3 Security Evaluation Service Logic
`SecurityService.java` verifies that:
1. The requested entity exists within the caller's `gymId` (preventing IDOR attacks across tenants).
2. If role is `TRAINER`, an active record in `trainer_clients` links `principal.userId` to `memberId`.
3. If role is `MEMBER`, `principal.userId` equals the `member.userId`.
