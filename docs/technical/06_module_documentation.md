# GymFit - Module Documentation

## 1. Domain Module Breakdown

The GymFit modular monolith comprises 9 cohesive domain modules:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              GYMFIT MODULES                                 │
├───────────────────┬───────────────────┬─────────────────────────────────────┤
│ 1. Platform       │ 2. Gym Core       │ 3. User & Auth                      │
│ - SaaS Plans      │ - Profiles        │ - JWT Security                      │
│ - Onboarding      │ - Branches        │ - Role Resolution                   │
├───────────────────┼───────────────────┼─────────────────────────────────────┤
│ 4. Membership     │ 5. Attendance     │ 6. Class Scheduling                 │
│ - Plan Pricing    │ - QR Engine       │ - Timetables                        │
│ - Billing Records │ - Live Headcount  │ - Concurrency-Safe Booking          │
├───────────────────┼───────────────────┼─────────────────────────────────────┤
│ 7. Workout Engine │ 8. Nutrition      │ 9. Analytics Engine                 │
│ - Exercise Bank   │ - Calorie/Macro   │ - Gym Owner Revenue                 │
│ - Set/Rep Logging │ - Meal Schedules  │ - Retention & Churn                 │
└───────────────────┴───────────────────┴─────────────────────────────────────┘
```

---

## 2. Module Specifications

### Module 1: Platform Administration (`com.gymfit.modules.platform`)
- **Scope**: Manages the multi-tenant SaaS foundation.
- **Key Entities**: `SaasPlan`, `Gym`.
- **Services**: `TenantProvisioningService`, `SaasPlanService`, `PlatformMetricsService`.
- **Interactions**: Onboards tenants, establishes initial gym owners, activates/deactivates gym organizations.

### Module 2: Gym & Facility (`com.gymfit.modules.gym`)
- **Scope**: Represents physical fitness facilities, settings, operating hours, and branch locations.
- **Key Entities**: `Gym`, `GymBranch`.
- **Services**: `GymProfileService`, `BranchService`.

### Module 3: User & Identity (`com.gymfit.modules.user`)
- **Scope**: Credential management, profile persistence, and cross-cutting role assignment.
- **Key Entities**: `User`, `MemberProfile`, `TrainerProfile`, `TrainerClient`.
- **Services**: `UserProfileService`, `TrainerAssignmentService`.

### Module 4: Membership & Billing (`com.gymfit.modules.membership`)
- **Scope**: Gym-specific membership tiers, subscription lifecycles, and payment tracking.
- **Key Entities**: `MembershipPlan`, `MemberMembership`, `Payment`.
- **Services**: `MembershipPlanService`, `SubscriptionLifecycleService`, `PaymentRecordingService`.
- **Events Published**: `MembershipExpiredEvent`, `MembershipRenewedEvent`.

### Module 5: Attendance & Access Control (`com.gymfit.modules.attendance`)
- **Scope**: Low-latency check-in verification, dynamic QR pass decoding, and facility occupancy counts.
- **Key Entities**: `Attendance`.
- **Services**: `CheckInService`, `LiveOccupancyEngine`.
- **Performance Guarantee**: < 100ms verification via cached membership validity.

### Module 6: Class Timetable & Booking (`com.gymfit.modules.classschedule`)
- **Scope**: Group classes (CrossFit, Spinning, Yoga), scheduling, capacity limits, and waitlists.
- **Key Entities**: `Class`, `ClassBooking`.
- **Services**: `ClassBookingService`, `TimetableService`.
- **Concurrency Guard**: Pessimistic write locking on `capacity` updates.

### Module 7: Workout Engine (`com.gymfit.modules.workout`)
- **Scope**: Exercise catalog, workout split builder, set/rep execution logs, and PR calculations.
- **Key Entities**: `Exercise`, `WorkoutPlan`, `WorkoutPlanDay`, `WorkoutPlanExercise`, `WorkoutLog`, `WorkoutSetLog`.
- **Services**: `ExerciseCatalogService`, `WorkoutPlanService`, `WorkoutLogService`.

### Module 8: Nutrition & Health Metrics (`com.gymfit.modules.nutrition`)
- **Scope**: Macronutrient planning and periodic body measurement tracking.
- **Key Entities**: `NutritionPlan`, `BodyMetric`.
- **Services**: `NutritionService`, `BodyMetricService`.

### Module 9: Analytics & Reporting (`com.gymfit.modules.analytics`)
- **Scope**: Business KPI aggregation, revenue trends, member retention, and occupancy heatmaps.
- **Services**: `GymAnalyticsService`, `PlatformAnalyticsService`.
