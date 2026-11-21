# GymFit - Database Design & Entity Relationship Specifications

## 1. Relational Schema Architecture (MySQL 8.x / InnoDB)

The database schema is engineered with strict foreign key constraints, UTF8MB4 collation, and multi-tenant isolation through indexed `gym_id` foreign keys.

---

## 2. Mermaid Entity Relationship (ER) Diagram

```mermaid
erDiagram
    SAAS_PLANS ||--o{ GYMS : "subscribes to"
    GYMS ||--o{ GYM_BRANCHES : "operates"
    GYMS ||--o{ USERS : "employs or enrolls"
    GYMS ||--o{ MEMBERSHIP_PLANS : "offers"
    GYMS ||--o{ EXERCISES : "owns custom"
    
    USERS ||--o| MEMBER_PROFILES : "has"
    USERS ||--o| TRAINER_PROFILES : "has"
    
    GYM_BRANCHES ||--o{ ATTENDANCES : "records"
    GYM_BRANCHES ||--o{ CLASSES : "hosts"
    
    MEMBER_PROFILES ||--o{ MEMBER_MEMBERSHIPS : "holds"
    MEMBERSHIP_PLANS ||--o{ MEMBER_MEMBERSHIPS : "defines"
    MEMBER_MEMBERSHIPS ||--o{ PAYMENTS : "generates"
    
    MEMBER_PROFILES ||--o{ ATTENDANCES : "logs"
    MEMBER_PROFILES ||--o{ CLASS_BOOKINGS : "books"
    CLASSES ||--o{ CLASS_BOOKINGS : "contains"
    
    TRAINER_PROFILES ||--o{ TRAINER_CLIENTS : "mentors"
    MEMBER_PROFILES ||--o{ TRAINER_CLIENTS : "guided by"
    TRAINER_PROFILES ||--o{ CLASSES : "instructs"
    
    MEMBER_PROFILES ||--o{ WORKOUT_PLANS : "assigned"
    WORKOUT_PLANS ||--o{ WORKOUT_PLAN_DAYS : "contains"
    WORKOUT_PLAN_DAYS ||--o{ WORKOUT_PLAN_EXERCISES : "schedules"
    EXERCISES ||--o{ WORKOUT_PLAN_EXERCISES : "references"
    
    MEMBER_PROFILES ||--o{ WORKOUT_LOGS : "records"
    WORKOUT_LOGS ||--o{ WORKOUT_SET_LOGS : "contains sets"
    EXERCISES ||--o{ WORKOUT_SET_LOGS : "logs activity for"
    
    MEMBER_PROFILES ||--o{ NUTRITION_PLANS : "follows"
    MEMBER_PROFILES ||--o{ BODY_METRICS : "tracks"

    SAAS_PLANS {
        bigint id PK
        varchar name
        varchar tier_code
        decimal monthly_price
        int max_branches
        int max_members
        int max_trainers
        boolean is_active
    }

    GYMS {
        bigint id PK
        varchar name
        varchar slug UK
        varchar contact_email
        varchar contact_phone
        bigint saas_plan_id FK
        varchar saas_status
        datetime created_at
    }

    GYM_BRANCHES {
        bigint id PK
        bigint gym_id FK
        varchar name
        varchar address
        varchar phone
        boolean is_active
    }

    USERS {
        bigint id PK
        bigint gym_id FK "nullable for platform admin"
        varchar email UK
        varchar password_hash
        varchar first_name
        varchar last_name
        varchar phone
        varchar role_code
        boolean is_active
        datetime created_at
    }

    MEMBER_PROFILES {
        bigint id PK
        bigint user_id FK, UK
        bigint gym_id FK
        bigint primary_branch_id FK
        varchar membership_number UK
        date date_of_birth
        varchar gender
        varchar emergency_contact_name
        varchar emergency_contact_phone
        text medical_notes
        varchar qr_code_hash UK
        date join_date
    }

    TRAINER_PROFILES {
        bigint id PK
        bigint user_id FK, UK
        bigint gym_id FK
        varchar specialization
        text bio
        varchar certification
        decimal hourly_rate
        boolean is_active
    }

    MEMBERSHIP_PLANS {
        bigint id PK
        bigint gym_id FK
        varchar name
        text description
        int duration_days
        decimal price
        varchar renewal_type
        boolean is_active
    }

    MEMBER_MEMBERSHIPS {
        bigint id PK
        bigint member_profile_id FK
        bigint gym_id FK
        bigint membership_plan_id FK
        date start_date
        date end_date
        varchar status
        decimal amount_paid
    }

    PAYMENTS {
        bigint id PK
        bigint gym_id FK
        bigint member_membership_id FK
        decimal amount
        varchar payment_method
        varchar transaction_reference
        varchar payment_status
        datetime paid_at
    }

    ATTENDANCES {
        bigint id PK
        bigint gym_id FK
        bigint branch_id FK
        bigint member_profile_id FK
        datetime check_in_time
        datetime check_out_time
        varchar check_in_method
    }

    CLASSES {
        bigint id PK
        bigint gym_id FK
        bigint branch_id FK
        bigint trainer_profile_id FK
        varchar name
        text description
        int capacity
        datetime start_time
        datetime end_time
        varchar room
    }

    CLASS_BOOKINGS {
        bigint id PK
        bigint gym_id FK
        bigint class_id FK
        bigint member_profile_id FK
        varchar booking_status
        boolean checked_in
        datetime booked_at
    }

    TRAINER_CLIENTS {
        bigint id PK
        bigint gym_id FK
        bigint trainer_profile_id FK
        bigint member_profile_id FK
        date assigned_date
        varchar status
    }

    EXERCISES {
        bigint id PK
        bigint gym_id FK "nullable for global exercises"
        varchar name
        varchar muscle_group
        varchar equipment
        text instructions
        varchar video_url
    }

    WORKOUT_PLANS {
        bigint id PK
        bigint gym_id FK
        bigint created_by_user_id FK
        bigint member_profile_id FK "nullable for global templates"
        varchar title
        text description
        varchar goal
        int duration_weeks
    }

    WORKOUT_PLAN_DAYS {
        bigint id PK
        bigint workout_plan_id FK
        int day_number
        varchar day_name
    }

    WORKOUT_PLAN_EXERCISES {
        bigint id PK
        bigint workout_plan_day_id FK
        bigint exercise_id FK
        int sets
        int reps_target
        varchar rpe_target
        int rest_seconds
        int order_index
    }

    WORKOUT_LOGS {
        bigint id PK
        bigint gym_id FK
        bigint member_profile_id FK
        bigint workout_plan_day_id FK
        date log_date
        int duration_minutes
        text notes
    }

    WORKOUT_SET_LOGS {
        bigint id PK
        bigint workout_log_id FK
        bigint exercise_id FK
        int set_number
        decimal weight_kg
        int reps_completed
        boolean is_pr
    }

    NUTRITION_PLANS {
        bigint id PK
        bigint gym_id FK
        bigint created_by_user_id FK
        bigint member_profile_id FK
        varchar title
        int daily_calories
        int protein_grams
        int carbs_grams
        int fats_grams
        text notes
    }

    BODY_METRICS {
        bigint id PK
        bigint gym_id FK
        bigint member_profile_id FK
        date recorded_at
        decimal weight_kg
        decimal body_fat_percentage
        decimal muscle_mass_kg
        decimal waist_cm
        decimal chest_cm
        decimal arms_cm
        decimal hips_cm
        varchar photo_url
    }
```

---

## 3. Detailed Entity Dictionary & Constraints

### 3.1 Tenancy & Organization Tables
1. **`saas_plans`**
   - `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
   - `name`: `VARCHAR(100) NOT NULL` (e.g., 'Starter', 'Growth', 'Enterprise')
   - `tier_code`: `VARCHAR(50) NOT NULL UNIQUE`
   - `monthly_price`: `DECIMAL(10,2) NOT NULL DEFAULT 0.00`
   - `max_branches`: `INT NOT NULL DEFAULT 1`
   - `max_members`: `INT NOT NULL DEFAULT 100`
   - `max_trainers`: `INT NOT NULL DEFAULT 5`
   - `is_active`: `BOOLEAN NOT NULL DEFAULT TRUE`

2. **`gyms`**
   - `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
   - `name`: `VARCHAR(150) NOT NULL`
   - `slug`: `VARCHAR(100) NOT NULL UNIQUE` (used for subdomain or unique identifier)
   - `contact_email`: `VARCHAR(150) NOT NULL`
   - `contact_phone`: `VARCHAR(30)`
   - `saas_plan_id`: `BIGINT NOT NULL REFERENCES saas_plans(id)`
   - `saas_status`: `ENUM('TRIAL', 'ACTIVE', 'PAST_DUE', 'SUSPENDED') NOT NULL DEFAULT 'TRIAL'`
   - `created_at`: `DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`
   - *Index*: `INDEX idx_gyms_slug (slug)`, `INDEX idx_gyms_status (saas_status)`

3. **`gym_branches`**
   - `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
   - `gym_id`: `BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE`
   - `name`: `VARCHAR(150) NOT NULL`
   - `address`: `VARCHAR(255)`
   - `phone`: `VARCHAR(30)`
   - `is_active`: `BOOLEAN NOT NULL DEFAULT TRUE`
   - *Index*: `INDEX idx_branches_gym (gym_id)`

### 3.2 Identity & Role Entities
4. **`users`**
   - `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
   - `gym_id`: `BIGINT NULL REFERENCES gyms(id) ON DELETE RESTRICT` (NULL only for `PLATFORM_ADMIN`)
   - `email`: `VARCHAR(150) NOT NULL UNIQUE`
   - `password_hash`: `VARCHAR(255) NOT NULL`
   - `first_name`: `VARCHAR(100) NOT NULL`
   - `last_name`: `VARCHAR(100) NOT NULL`
   - `phone`: `VARCHAR(30)`
   - `role_code`: `ENUM('PLATFORM_ADMIN', 'GYM_OWNER', 'TRAINER', 'MEMBER') NOT NULL`
   - `is_active`: `BOOLEAN NOT NULL DEFAULT TRUE`
   - `created_at`: `DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`
   - `updated_at`: `DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
   - *Index*: `INDEX idx_users_gym_role (gym_id, role_code)`, `INDEX idx_users_email (email)`

5. **`member_profiles`**
   - `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
   - `user_id`: `BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE`
   - `gym_id`: `BIGINT NOT NULL REFERENCES gyms(id)`
   - `primary_branch_id`: `BIGINT NOT NULL REFERENCES gym_branches(id)`
   - `membership_number`: `VARCHAR(50) NOT NULL`
   - `date_of_birth`: `DATE`
   - `gender`: `ENUM('MALE', 'FEMALE', 'OTHER', 'UNDISCLOSED')`
   - `emergency_contact_name`: `VARCHAR(100)`
   - `emergency_contact_phone`: `VARCHAR(30)`
   - `medical_notes`: `TEXT`
   - `qr_code_hash`: `VARCHAR(64) NOT NULL UNIQUE`
   - `join_date`: `DATE NOT NULL`
   - *Index*: `INDEX idx_members_gym (gym_id)`, `INDEX idx_members_qr (qr_code_hash)`, `UNIQUE uk_gym_member_no (gym_id, membership_number)`

6. **`trainer_profiles`**
   - `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
   - `user_id`: `BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE`
   - `gym_id`: `BIGINT NOT NULL REFERENCES gyms(id)`
   - `specialization`: `VARCHAR(255)`
   - `bio`: `TEXT`
   - `certification`: `VARCHAR(255)`
   - `hourly_rate`: `DECIMAL(10,2) DEFAULT 0.00`
   - `is_active`: `BOOLEAN NOT NULL DEFAULT TRUE`
   - *Index*: `INDEX idx_trainers_gym (gym_id)`

### 3.3 Operations, Attendance & Scheduling
7. **`membership_plans`**
   - `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
   - `gym_id`: `BIGINT NOT NULL REFERENCES gyms(id)`
   - `name`: `VARCHAR(100) NOT NULL`
   - `description`: `TEXT`
   - `duration_days`: `INT NOT NULL` (e.g., 30, 90, 365)
   - `price`: `DECIMAL(10,2) NOT NULL`
   - `renewal_type`: `ENUM('AUTO_RENEW', 'MANUAL') NOT NULL DEFAULT 'MANUAL'`
   - `is_active`: `BOOLEAN NOT NULL DEFAULT TRUE`
   - *Index*: `INDEX idx_plans_gym (gym_id)`

8. **`member_memberships`**
   - `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
   - `member_profile_id`: `BIGINT NOT NULL REFERENCES member_profiles(id)`
   - `gym_id`: `BIGINT NOT NULL REFERENCES gyms(id)`
   - `membership_plan_id`: `BIGINT NOT NULL REFERENCES membership_plans(id)`
   - `start_date`: `DATE NOT NULL`
   - `end_date`: `DATE NOT NULL`
   - `status`: `ENUM('ACTIVE', 'EXPIRED', 'FROZEN', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE'`
   - `amount_paid`: `DECIMAL(10,2) NOT NULL`
   - *Index*: `INDEX idx_member_mem_status (gym_id, member_profile_id, status)`

9. **`attendances`**
   - `id`: `BIGINT AUTO_INCREMENT PRIMARY KEY`
   - `gym_id`: `BIGINT NOT NULL REFERENCES gyms(id)`
   - `branch_id`: `BIGINT NOT NULL REFERENCES gym_branches(id)`
   - `member_profile_id`: `BIGINT NOT NULL REFERENCES member_profiles(id)`
   - `check_in_time`: `DATETIME NOT NULL`
   - `check_out_time`: `DATETIME NULL`
   - `check_in_method`: `ENUM('QR', 'MANUAL_DESK', 'RFID_CARD') NOT NULL DEFAULT 'QR'`
   - *Index*: `INDEX idx_attend_gym_date (gym_id, check_in_time)`, `INDEX idx_attend_member (member_profile_id)`

10. **`classes` & `class_bookings`**
    - `classes`: `id`, `gym_id`, `branch_id`, `trainer_profile_id`, `name`, `capacity`, `start_time`, `end_time`, `room`.
    - `class_bookings`: `id`, `gym_id`, `class_id`, `member_profile_id`, `booking_status` (`CONFIRMED`, `WAITLISTED`, `CANCELLED`), `checked_in`, `booked_at`.
    - *Index*: `INDEX idx_class_gym_time (gym_id, start_time)`, `UNIQUE uk_booking (class_id, member_profile_id)`

### 3.4 Fitness Tracking (Workouts & Nutrition)
11. **`exercises`**: `id`, `gym_id` (NULL = global system exercise), `name`, `muscle_group`, `equipment`, `instructions`, `video_url`.
12. **`workout_plans`**: `id`, `gym_id`, `created_by_user_id`, `member_profile_id` (NULL = reusable template), `title`, `goal`, `duration_weeks`.
13. **`workout_plan_days`**: `id`, `workout_plan_id`, `day_number`, `day_name`.
14. **`workout_plan_exercises`**: `id`, `workout_plan_day_id`, `exercise_id`, `sets`, `reps_target`, `rpe_target`, `rest_seconds`, `order_index`.
15. **`workout_logs`**: `id`, `gym_id`, `member_profile_id`, `workout_plan_day_id`, `log_date`, `duration_minutes`, `notes`.
16. **`workout_set_logs`**: `id`, `workout_log_id`, `exercise_id`, `set_number`, `weight_kg`, `reps_completed`, `is_pr`.
17. **`nutrition_plans`**: `id`, `gym_id`, `created_by_user_id`, `member_profile_id`, `title`, `daily_calories`, `protein_grams`, `carbs_grams`, `fats_grams`, `notes`.
18. **`body_metrics`**: `id`, `gym_id`, `member_profile_id`, `recorded_at`, `weight_kg`, `body_fat_percentage`, `muscle_mass_kg`, `waist_cm`, `chest_cm`, `arms_cm`, `hips_cm`, `photo_url`.
