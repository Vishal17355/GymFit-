# GymFit - Database Schema & Data Dictionary

## 1. Schema Specifications Overview

- **Engine**: MySQL 8.0+ (InnoDB Storage Engine)
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`
- **Naming Conventions**: `snake_case` for tables and columns; singular nouns with pluralized table names.
- **Auditing Columns**: Present on all primary tables (`created_at DATETIME`, `updated_at DATETIME`).

---

## 2. Table Schemas & Foreign Keys

### 2.1 Multi-Tenancy Core
```sql
CREATE TABLE saas_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tier_code VARCHAR(50) NOT NULL UNIQUE,
    monthly_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    max_branches INT NOT NULL DEFAULT 1,
    max_members INT NOT NULL DEFAULT 100,
    max_trainers INT NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gyms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(30),
    saas_plan_id BIGINT NOT NULL,
    saas_status ENUM('TRIAL', 'ACTIVE', 'PAST_DUE', 'SUSPENDED') NOT NULL DEFAULT 'TRIAL',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_gyms_saas_plan FOREIGN KEY (saas_plan_id) REFERENCES saas_plans(id)
);

CREATE TABLE gym_branches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gym_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(30),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_branches_gym FOREIGN KEY (gym_id) REFERENCES gyms(id) ON DELETE CASCADE,
    INDEX idx_branches_gym (gym_id)
);
```

### 2.2 Users & Profiles
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gym_id BIGINT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    role_code ENUM('PLATFORM_ADMIN', 'GYM_OWNER', 'TRAINER', 'MEMBER') NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_gym FOREIGN KEY (gym_id) REFERENCES gyms(id) ON DELETE RESTRICT,
    INDEX idx_users_gym_role (gym_id, role_code),
    INDEX idx_users_email (email)
);

CREATE TABLE member_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    gym_id BIGINT NOT NULL,
    primary_branch_id BIGINT NOT NULL,
    membership_number VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER', 'UNDISCLOSED'),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(30),
    medical_notes TEXT,
    qr_code_hash VARCHAR(64) NOT NULL UNIQUE,
    join_date DATE NOT NULL,
    CONSTRAINT fk_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_members_gym FOREIGN KEY (gym_id) REFERENCES gyms(id),
    CONSTRAINT fk_members_branch FOREIGN KEY (primary_branch_id) REFERENCES gym_branches(id),
    INDEX idx_members_gym (gym_id),
    INDEX idx_members_qr (qr_code_hash),
    UNIQUE uk_gym_member_no (gym_id, membership_number)
);

CREATE TABLE trainer_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    gym_id BIGINT NOT NULL,
    specialization VARCHAR(255),
    bio TEXT,
    certification VARCHAR(255),
    hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_trainers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_trainers_gym FOREIGN KEY (gym_id) REFERENCES gyms(id),
    INDEX idx_trainers_gym (gym_id)
);

CREATE TABLE trainer_clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gym_id BIGINT NOT NULL,
    trainer_profile_id BIGINT NOT NULL,
    member_profile_id BIGINT NOT NULL,
    assigned_date DATE NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT fk_tc_gym FOREIGN KEY (gym_id) REFERENCES gyms(id),
    CONSTRAINT fk_tc_trainer FOREIGN KEY (trainer_profile_id) REFERENCES trainer_profiles(id),
    CONSTRAINT fk_tc_member FOREIGN KEY (member_profile_id) REFERENCES member_profiles(id),
    INDEX idx_tc_lookup (gym_id, trainer_profile_id, member_profile_id)
);
```

### 2.3 Memberships, Attendance & Bookings
```sql
CREATE TABLE membership_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gym_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_days INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    renewal_type ENUM('AUTO_RENEW', 'MANUAL') NOT NULL DEFAULT 'MANUAL',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_plans_gym FOREIGN KEY (gym_id) REFERENCES gyms(id),
    INDEX idx_plans_gym (gym_id)
);

CREATE TABLE member_memberships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_profile_id BIGINT NOT NULL,
    gym_id BIGINT NOT NULL,
    membership_plan_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('ACTIVE', 'EXPIRED', 'FROZEN', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    amount_paid DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_mm_member FOREIGN KEY (member_profile_id) REFERENCES member_profiles(id),
    CONSTRAINT fk_mm_gym FOREIGN KEY (gym_id) REFERENCES gyms(id),
    CONSTRAINT fk_mm_plan FOREIGN KEY (membership_plan_id) REFERENCES membership_plans(id),
    INDEX idx_mm_status (gym_id, member_profile_id, status)
);

CREATE TABLE attendances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gym_id BIGINT NOT NULL,
    branch_id BIGINT NOT NULL,
    member_profile_id BIGINT NOT NULL,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME NULL,
    check_in_method ENUM('QR', 'MANUAL_DESK', 'RFID_CARD') NOT NULL DEFAULT 'QR',
    CONSTRAINT fk_attend_gym FOREIGN KEY (gym_id) REFERENCES gyms(id),
    CONSTRAINT fk_attend_branch FOREIGN KEY (branch_id) REFERENCES gym_branches(id),
    CONSTRAINT fk_attend_member FOREIGN KEY (member_profile_id) REFERENCES member_profiles(id),
    INDEX idx_attend_gym_date (gym_id, check_in_time),
    INDEX idx_attend_member (member_profile_id)
);

CREATE TABLE classes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gym_id BIGINT NOT NULL,
    branch_id BIGINT NOT NULL,
    trainer_profile_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    capacity INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    room VARCHAR(50),
    CONSTRAINT fk_class_gym FOREIGN KEY (gym_id) REFERENCES gyms(id),
    CONSTRAINT fk_class_branch FOREIGN KEY (branch_id) REFERENCES gym_branches(id),
    CONSTRAINT fk_class_trainer FOREIGN KEY (trainer_profile_id) REFERENCES trainer_profiles(id),
    INDEX idx_class_schedule (gym_id, start_time)
);

CREATE TABLE class_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gym_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    member_profile_id BIGINT NOT NULL,
    booking_status ENUM('CONFIRMED', 'WAITLISTED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    checked_in BOOLEAN NOT NULL DEFAULT FALSE,
    booked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cb_gym FOREIGN KEY (gym_id) REFERENCES gyms(id),
    CONSTRAINT fk_cb_class FOREIGN KEY (class_id) REFERENCES classes(id),
    CONSTRAINT fk_cb_member FOREIGN KEY (member_profile_id) REFERENCES member_profiles(id),
    UNIQUE uk_class_member_booking (class_id, member_profile_id)
);
```

### 2.4 Workouts, Nutrition & Body Metrics
```sql
CREATE TABLE exercises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gym_id BIGINT NULL, -- NULL implies Global System Default Exercise
    name VARCHAR(100) NOT NULL,
    muscle_group VARCHAR(50) NOT NULL,
    equipment VARCHAR(50),
    instructions TEXT,
    video_url VARCHAR(255),
    INDEX idx_exercises_gym (gym_id, muscle_group)
);

CREATE TABLE workout_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gym_id BIGINT NOT NULL,
    created_by_user_id BIGINT NOT NULL,
    member_profile_id BIGINT NULL, -- NULL implies Reusable Gym Template
    title VARCHAR(150) NOT NULL,
    description TEXT,
    goal VARCHAR(100),
    duration_weeks INT DEFAULT 4,
    CONSTRAINT fk_wp_gym FOREIGN KEY (gym_id) REFERENCES gyms(id),
    CONSTRAINT fk_wp_creator FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    CONSTRAINT fk_wp_member FOREIGN KEY (member_profile_id) REFERENCES member_profiles(id),
    INDEX idx_wp_member (gym_id, member_profile_id)
);

CREATE TABLE workout_plan_days (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    workout_plan_id BIGINT NOT NULL,
    day_number INT NOT NULL,
    day_name VARCHAR(50) NOT NULL,
    CONSTRAINT fk_wpd_plan FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE
);

CREATE TABLE workout_plan_exercises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    workout_plan_day_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    sets INT NOT NULL DEFAULT 3,
    reps_target INT NOT NULL DEFAULT 10,
    rpe_target VARCHAR(20),
    rest_seconds INT DEFAULT 60,
    order_index INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_wpe_day FOREIGN KEY (workout_plan_day_id) REFERENCES workout_plan_days(id) ON DELETE CASCADE,
    CONSTRAINT fk_wpe_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE workout_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gym_id BIGINT NOT NULL,
    member_profile_id BIGINT NOT NULL,
    workout_plan_day_id BIGINT NULL,
    log_date DATE NOT NULL,
    duration_minutes INT,
    notes TEXT,
    CONSTRAINT fk_wl_gym FOREIGN KEY (gym_id) REFERENCES gyms(id),
    CONSTRAINT fk_wl_member FOREIGN KEY (member_profile_id) REFERENCES member_profiles(id),
    INDEX idx_wl_member_date (gym_id, member_profile_id, log_date)
);

CREATE TABLE workout_set_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    workout_log_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    set_number INT NOT NULL,
    weight_kg DECIMAL(6,2) NOT NULL,
    reps_completed INT NOT NULL,
    is_pr BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_wsl_log FOREIGN KEY (workout_log_id) REFERENCES workout_logs(id) ON DELETE CASCADE,
    CONSTRAINT fk_wsl_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE nutrition_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gym_id BIGINT NOT NULL,
    created_by_user_id BIGINT NOT NULL,
    member_profile_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    daily_calories INT NOT NULL,
    protein_grams INT NOT NULL,
    carbs_grams INT NOT NULL,
    fats_grams INT NOT NULL,
    notes TEXT,
    CONSTRAINT fk_np_gym FOREIGN KEY (gym_id) REFERENCES gyms(id),
    CONSTRAINT fk_np_creator FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    CONSTRAINT fk_np_member FOREIGN KEY (member_profile_id) REFERENCES member_profiles(id),
    INDEX idx_np_member (gym_id, member_profile_id)
);

CREATE TABLE body_metrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gym_id BIGINT NOT NULL,
    member_profile_id BIGINT NOT NULL,
    recorded_at DATE NOT NULL,
    weight_kg DECIMAL(5,2) NOT NULL,
    body_fat_percentage DECIMAL(4,2),
    muscle_mass_kg DECIMAL(5,2),
    waist_cm DECIMAL(5,2),
    chest_cm DECIMAL(5,2),
    arms_cm DECIMAL(5,2),
    hips_cm DECIMAL(5,2),
    photo_url VARCHAR(255),
    CONSTRAINT fk_bm_gym FOREIGN KEY (gym_id) REFERENCES gyms(id),
    CONSTRAINT fk_bm_member FOREIGN KEY (member_profile_id) REFERENCES member_profiles(id),
    INDEX idx_bm_member (gym_id, member_profile_id, recorded_at)
);
```
