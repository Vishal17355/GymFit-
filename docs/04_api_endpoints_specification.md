# GymFit - REST API Endpoints Specification

## 1. API Standards & Global Conventions

- **Base URL**: `/api/v1`
- **Content Type**: `application/json; charset=UTF-8`
- **Authentication Header**: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Response Format (Success)**:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Operation successful",
    "timestamp": "2026-11-02T19:54:00Z"
  }
  ```
- **Response Format (Paginated)**:
  ```json
  {
    "success": true,
    "data": [ ... ],
    "pagination": {
      "page": 0,
      "size": 20,
      "totalElements": 140,
      "totalPages": 7
    }
  }
  ```
- **Response Format (Error)**:
  ```json
  {
    "success": false,
    "status": 400,
    "error": "BAD_REQUEST",
    "message": "Validation failed on fields",
    "errors": [
      { "field": "email", "message": "Email address format is invalid" }
    ],
    "timestamp": "2026-11-02T19:54:00Z",
    "path": "/api/v1/auth/register"
  }
  ```

---

## 2. Authentication & Profile Endpoints (`/api/v1/auth`, `/api/v1/users`)

| Method | Endpoint | Access Roles | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & issue JWT tokens | `{ email, password }` | `200 OK` `{ token, refreshToken, user }` |
| `POST` | `/api/v1/auth/refresh` | Public | Refresh expired access token | `{ refreshToken }` | `200 OK` `{ token, refreshToken }` |
| `POST` | `/api/v1/auth/logout` | Authenticated | Revoke refresh token | `{ refreshToken }` | `200 OK` |
| `POST` | `/api/v1/auth/forgot-password`| Public | Initiate password recovery | `{ email }` | `200 OK` |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset password with token | `{ token, newPassword }`| `200 OK` |
| `GET` | `/api/v1/users/me` | Authenticated | Get current authenticated profile | None | `200 OK` `{ userProfile }` |
| `PUT` | `/api/v1/users/me` | Authenticated | Update personal profile details | `{ firstName, lastName, phone }` | `200 OK` |
| `PUT` | `/api/v1/users/me/password` | Authenticated | Change current password | `{ currentPassword, newPassword }` | `200 OK` |

---

## 3. Platform Administration Endpoints (`/api/v1/platform`)

| Method | Endpoint | Access Roles | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/platform/gyms` | `PLATFORM_ADMIN` | List all registered gyms with SaaS status | `?page=0&size=20&status=ACTIVE` | `200 OK` `[ GymSummaryDTO ]` |
| `POST` | `/api/v1/platform/gyms` | `PLATFORM_ADMIN` | Onboard a new Gym tenant & Owner | `{ name, slug, email, phone, planId, ownerEmail, ownerFirstName, ownerLastName }` | `201 Created` `{ gymId, ownerUserId }` |
| `GET` | `/api/v1/platform/gyms/{gymId}` | `PLATFORM_ADMIN` | Get detailed gym metrics & config | Path: `gymId` | `200 OK` `{ GymDetailDTO }` |
| `PUT` | `/api/v1/platform/gyms/{gymId}/status` | `PLATFORM_ADMIN` | Suspend, activate, or archive gym | `{ status: 'ACTIVE' \| 'SUSPENDED' }` | `200 OK` |
| `GET` | `/api/v1/platform/plans` | `PLATFORM_ADMIN` | List SaaS pricing tiers | None | `200 OK` `[ SaasPlanDTO ]` |
| `POST` | `/api/v1/platform/plans` | `PLATFORM_ADMIN` | Create or update SaaS pricing tier | `{ name, tierCode, monthlyPrice, maxBranches, maxMembers, maxTrainers }` | `201 Created` |
| `GET` | `/api/v1/platform/analytics` | `PLATFORM_ADMIN` | Global platform metrics (MRR, Gym Count) | `?from=2026-01-01&to=2026-11-01` | `200 OK` `{ PlatformMetricsDTO }` |

---

## 4. Gym Configuration & Branch Endpoints (`/api/v1/gym`)

| Method | Endpoint | Access Roles | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/gym/profile` | `GYM_OWNER`, `TRAINER`, `MEMBER` | Get current gym brand and info | None | `200 OK` `{ GymProfileDTO }` |
| `PUT` | `/api/v1/gym/profile` | `GYM_OWNER` | Update gym brand, logo, hours | `{ name, contactEmail, contactPhone }` | `200 OK` |
| `GET` | `/api/v1/gym/branches` | `GYM_OWNER`, `TRAINER`, `MEMBER` | List branches for current gym | None | `200 OK` `[ BranchDTO ]` |
| `POST` | `/api/v1/gym/branches` | `GYM_OWNER` | Create a new gym branch location | `{ name, address, phone }` | `201 Created` |
| `PUT` | `/api/v1/gym/branches/{branchId}` | `GYM_OWNER` | Update branch configuration | `{ name, address, phone, isActive }` | `200 OK` |

---

## 5. Member Management & Membership Plans (`/api/v1/members`, `/api/v1/membership-plans`)

| Method | Endpoint | Access Roles | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/members` | `GYM_OWNER`, `TRAINER` | Search & list members in gym | `?search=john&branchId=1&status=ACTIVE&page=0` | `200 OK` `[ MemberSummaryDTO ]` |
| `POST` | `/api/v1/members` | `GYM_OWNER` | Register a new member | `{ email, firstName, lastName, phone, branchId, dob, gender, emergencyName, emergencyPhone, planId }` | `201 Created` `{ memberId }` |
| `GET` | `/api/v1/members/{id}` | `GYM_OWNER`, `TRAINER` (assigned), `MEMBER` (self) | Get detailed member profile | Path: `id` | `200 OK` `{ MemberDetailDTO }` |
| `PUT` | `/api/v1/members/{id}` | `GYM_OWNER`, `MEMBER` (self) | Update member profile | `{ phone, emergencyName, emergencyPhone, medicalNotes }` | `200 OK` |
| `GET` | `/api/v1/members/{id}/digital-pass` | `GYM_OWNER`, `MEMBER` (self) | Retrieve digital pass & secure QR token | Path: `id` | `200 OK` `{ qrCodeHash, passDetails }` |
| `GET` | `/api/v1/membership-plans` | `GYM_OWNER`, `TRAINER`, `MEMBER` | List available membership plans | None | `200 OK` `[ MembershipPlanDTO ]` |
| `POST` | `/api/v1/membership-plans` | `GYM_OWNER` | Create membership plan | `{ name, description, durationDays, price, renewalType }` | `201 Created` |
| `POST` | `/api/v1/members/{id}/memberships` | `GYM_OWNER` | Assign/Renew member subscription | `{ planId, startDate, amountPaid, paymentMethod }` | `201 Created` |

---

## 6. Attendance & Check-In Endpoints (`/api/v1/attendance`)

| Method | Endpoint | Access Roles | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/attendance/check-in` | `GYM_OWNER`, `MEMBER` (via scanner) | Check in using QR code token | `{ qrCodeHash, branchId }` | `200 OK` `{ checkInId, memberName, status: 'ALLOWED' }` |
| `POST` | `/api/v1/attendance/check-out` | `GYM_OWNER`, `MEMBER` | Record checkout | `{ memberId, branchId }` | `200 OK` |
| `GET` | `/api/v1/attendance/live` | `GYM_OWNER` | Active head-count & live occupants | `?branchId=1` | `200 OK` `{ count, activeMembers: [...] }` |
| `GET` | `/api/v1/attendance/history` | `GYM_OWNER` | Historical gym check-in logs | `?startDate=2026-11-01&branchId=1` | `200 OK` `[ AttendanceLogDTO ]` |
| `GET` | `/api/v1/attendance/my-history` | `MEMBER` | Member's personal check-in history | `?page=0&size=20` | `200 OK` `[ AttendanceLogDTO ]` |

---

## 7. Trainer Management & Client Assignment (`/api/v1/trainers`)

| Method | Endpoint | Access Roles | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/trainers` | `GYM_OWNER`, `MEMBER` | List active trainers in gym | `?page=0&size=20` | `200 OK` `[ TrainerSummaryDTO ]` |
| `POST` | `/api/v1/trainers` | `GYM_OWNER` | Create and onboard a trainer | `{ email, firstName, lastName, phone, specialization, bio, hourlyRate }` | `201 Created` |
| `GET` | `/api/v1/trainers/{id}` | `GYM_OWNER`, `TRAINER` (self), `MEMBER` | View trainer profile and bio | Path: `id` | `200 OK` `{ TrainerDetailDTO }` |
| `POST` | `/api/v1/trainers/{id}/assign-client` | `GYM_OWNER` | Assign member to a trainer | `{ memberId }` | `200 OK` |
| `GET` | `/api/v1/trainers/my-clients` | `TRAINER` | Get list of clients assigned to current trainer | None | `200 OK` `[ ClientSummaryDTO ]` |

---

## 8. Classes & Timetable Endpoints (`/api/v1/classes`)

| Method | Endpoint | Access Roles | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/classes` | `GYM_OWNER`, `TRAINER`, `MEMBER` | Weekly timetable / upcoming classes | `?branchId=1&from=2026-11-02&to=2026-11-09` | `200 OK` `[ ClassScheduleDTO ]` |
| `POST` | `/api/v1/classes` | `GYM_OWNER`, `TRAINER` | Create a group class session | `{ name, branchId, trainerId, capacity, startTime, endTime, room }` | `201 Created` |
| `POST` | `/api/v1/classes/{classId}/book` | `MEMBER` | Book a spot in a class | Path: `classId` | `200 OK` `{ bookingId, status: 'CONFIRMED' }` |
| `DELETE` | `/api/v1/classes/{classId}/cancel-booking`| `MEMBER` | Cancel class reservation | Path: `classId` | `200 OK` |
| `GET` | `/api/v1/classes/{classId}/attendees` | `GYM_OWNER`, `TRAINER` | View enrolled attendees | Path: `classId` | `200 OK` `[ AttendeeDTO ]` |

---

## 9. Workout & Exercise Library Endpoints (`/api/v1/workouts`, `/api/v1/exercises`)

| Method | Endpoint | Access Roles | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/exercises` | `GYM_OWNER`, `TRAINER`, `MEMBER` | Search exercise catalog | `?muscleGroup=CHEST&equipment=BARBELL` | `200 OK` `[ ExerciseDTO ]` |
| `POST` | `/api/v1/exercises` | `GYM_OWNER`, `TRAINER` | Add custom gym exercise | `{ name, muscleGroup, equipment, instructions, videoUrl }` | `201 Created` |
| `GET` | `/api/v1/workouts/plans` | `GYM_OWNER`, `TRAINER`, `MEMBER` | List plan templates or assigned plans | None | `200 OK` `[ WorkoutPlanDTO ]` |
| `POST` | `/api/v1/workouts/plans` | `GYM_OWNER`, `TRAINER`, `MEMBER` | Create a workout plan routine | `{ title, goal, durationWeeks, targetMemberId, days: [...] }` | `201 Created` |
| `GET` | `/api/v1/workouts/my-plan` | `MEMBER` | Get active workout routine for member | None | `200 OK` `{ ActivePlanDTO }` |
| `POST` | `/api/v1/workouts/logs` | `MEMBER`, `TRAINER` | Log completed workout session | `{ workoutPlanDayId, logDate, durationMinutes, setLogs: [...] }` | `201 Created` |
| `GET` | `/api/v1/workouts/logs` | `MEMBER`, `TRAINER` (assigned) | Retrieve workout history logs | `?memberId=12&page=0&size=10` | `200 OK` `[ WorkoutLogDTO ]` |

---

## 10. Nutrition & Body Metrics Endpoints (`/api/v1/nutrition`, `/api/v1/metrics`)

| Method | Endpoint | Access Roles | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/nutrition/my-plan` | `MEMBER` | Get active diet plan & macros | None | `200 OK` `{ NutritionPlanDTO }` |
| `POST` | `/api/v1/nutrition/plans` | `TRAINER`, `GYM_OWNER` | Assign diet plan to member | `{ memberId, title, dailyCalories, proteinGrams, carbsGrams, fatsGrams, notes }` | `201 Created` |
| `POST` | `/api/v1/metrics` | `MEMBER`, `TRAINER` | Record new body measurement entry | `{ memberId, weightKg, bodyFatPercentage, muscleMassKg, waistCm, chestCm, armsCm }` | `201 Created` |
| `GET` | `/api/v1/metrics/history` | `MEMBER`, `TRAINER` (assigned) | Body metrics historical time-series | `?memberId=12&from=2026-01-01` | `200 OK` `[ BodyMetricDTO ]` |

---

## 11. Reports & Analytics Endpoints (`/api/v1/analytics`)

| Method | Endpoint | Access Roles | Description | Request Body / Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/analytics/owner/overview` | `GYM_OWNER` | High-level KPI summary (Active members, revenue, retention) | `?branchId=1&period=MONTHLY` | `200 OK` `{ OwnerOverviewDTO }` |
| `GET` | `/api/v1/analytics/owner/revenue` | `GYM_OWNER` | Financial revenue breakdown | `?startDate=2026-01-01&endDate=2026-11-01`| `200 OK` `{ RevenueReportDTO }` |
| `GET` | `/api/v1/analytics/owner/attendance` | `GYM_OWNER` | Peak hours and utilization trends | `?branchId=1` | `200 OK` `{ AttendanceTrendsDTO }` |
| `GET` | `/api/v1/analytics/member/progress` | `MEMBER` | Member individual progress stats | None | `200 OK` `{ MemberProgressDTO }` |
