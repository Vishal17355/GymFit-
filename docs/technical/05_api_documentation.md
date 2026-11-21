# GymFit - Technical API Documentation

## 1. Global Specifications

- **Protocol**: HTTPS (TLS 1.3)
- **Base Endpoint**: `/api/v1`
- **Authentication**: Stateless Bearer JWT (`Authorization: Bearer <token>`)
- **Payload Encoding**: UTF-8 JSON
- **Standard HTTP Codes**:
  - `200 OK`: Successful read or update.
  - `201 Created`: Entity successfully created.
  - `400 Bad Request`: Input validation failure or malformed payload.
  - `401 Unauthorized`: Missing, invalid, or expired JWT.
  - `403 Forbidden`: Authenticated user lacks permission or attempted cross-tenant access.
  - `404 Not Found`: Resource does not exist in the tenant's scope.
  - `409 Conflict`: Business rule violation (e.g., class capacity full or duplicate email).
  - `500 Internal Server Error`: Unhandled server exception (masked details).

---

## 2. API Endpoints Catalog by Domain

### 2.1 Identity & Security
- `POST /api/v1/auth/login`: Authenticate email/password. Returns `{ token, refreshToken, user }`.
- `POST /api/v1/auth/refresh`: Submit refresh token. Returns rotated `{ token, refreshToken }`.
- `POST /api/v1/auth/logout`: Revoke active refresh token.
- `GET /api/v1/users/me`: Return authenticated user details and tenant affiliations.

### 2.2 Platform Administration (Platform Admin Only)
- `GET /api/v1/platform/gyms`: Paginated list of gym tenants with SaaS status filter.
- `POST /api/v1/platform/gyms`: Provision new gym tenant and initial Gym Owner.
- `PUT /api/v1/platform/gyms/{gymId}/status`: Modify gym status (`ACTIVE`, `SUSPENDED`).
- `GET /api/v1/platform/plans`: List all SaaS tier packages.
- `POST /api/v1/platform/plans`: Create/update SaaS tier configurations.
- `GET /api/v1/platform/analytics`: Global revenue metrics and active tenant aggregates.

### 2.3 Gym & Branch Operations
- `GET /api/v1/gym/profile`: Return current tenant details and operational hours.
- `PUT /api/v1/gym/profile`: Update gym branding and contact info (Gym Owner).
- `GET /api/v1/gym/branches`: List all physical branch locations.
- `POST /api/v1/gym/branches`: Create a branch location (Gym Owner).

### 2.4 Memberships & Member Management
- `GET /api/v1/members`: Search gym members (filterable by branch, status, keyword).
- `POST /api/v1/members`: Enroll a new member and generate digital credentials.
- `GET /api/v1/members/{id}`: Detailed member profile (Owner, assigned Trainer, self Member).
- `GET /api/v1/members/{id}/digital-pass`: Retrieve member pass and dynamic QR code token.
- `GET /api/v1/membership-plans`: Catalog of available membership tiers.
- `POST /api/v1/membership-plans`: Create a membership tier (Gym Owner).
- `POST /api/v1/members/{id}/memberships`: Assign membership duration to a member.

### 2.5 Attendance & Check-In
- `POST /api/v1/attendance/check-in`: Process QR scan or desk check-in. Validates membership validity in real-time.
- `POST /api/v1/attendance/check-out`: Record exit timestamp.
- `GET /api/v1/attendance/live`: Live occupancy counter and active occupant roster.
- `GET /api/v1/attendance/history`: Historical log of gym check-ins.

### 2.6 Trainers & Classes
- `GET /api/v1/trainers`: List all trainers and specializations.
- `POST /api/v1/trainers`: Onboard a new trainer (Gym Owner).
- `POST /api/v1/trainers/{id}/assign-client`: Bind a member to a trainer.
- `GET /api/v1/classes`: Timetable of group fitness classes.
- `POST /api/v1/classes`: Schedule a class session.
- `POST /api/v1/classes/{classId}/book`: Reserve a slot in a group class (Member).
- `DELETE /api/v1/classes/{classId}/cancel-booking`: Release class reservation (Member).

### 2.7 Fitness Tracking (Workouts, Nutrition & Metrics)
- `GET /api/v1/exercises`: Search exercise library by muscle group and equipment.
- `POST /api/v1/exercises`: Create a custom exercise entry for the gym.
- `POST /api/v1/workouts/plans`: Create a workout routine split.
- `GET /api/v1/workouts/my-plan`: Retrieve active workout routine for member.
- `POST /api/v1/workouts/logs`: Log completed sets, weights, and reps for an exercise.
- `GET /api/v1/nutrition/my-plan`: View active nutrition macros.
- `POST /api/v1/nutrition/plans`: Assign nutrition targets to a member (Trainer).
- `POST /api/v1/metrics`: Record body measurement entry.
- `GET /api/v1/metrics/history`: Retrieve chronological progression data for graphing.
