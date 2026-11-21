CREATE TABLE home_workout_profiles (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(180) NOT NULL UNIQUE,
 profile_json LONGTEXT NOT NULL, updated_at TIMESTAMP(6) NOT NULL, version BIGINT NOT NULL DEFAULT 0
);
CREATE TABLE home_exercises (
 id VARCHAR(90) PRIMARY KEY, content_json LONGTEXT NOT NULL, catalog_version INT NOT NULL
);
CREATE TABLE home_workout_plans (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(180) NOT NULL,
 start_date DATE NOT NULL, created_at TIMESTAMP(6) NOT NULL, updated_at TIMESTAMP(6) NOT NULL,
 profile_json LONGTEXT NOT NULL, notices_json LONGTEXT NOT NULL,
 version BIGINT NOT NULL DEFAULT 0
);
CREATE INDEX idx_home_plan_user_date ON home_workout_plans(user_id,created_at);
CREATE TABLE home_workout_days (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, plan_id BIGINT NOT NULL,
 scheduled_date DATE NOT NULL, title VARCHAR(120) NOT NULL, kind VARCHAR(30) NOT NULL,
 exercises_json LONGTEXT NOT NULL, estimated_minutes DOUBLE NOT NULL,
 CONSTRAINT fk_home_day_plan FOREIGN KEY(plan_id) REFERENCES home_workout_plans(id),
 CONSTRAINT uq_home_plan_date UNIQUE(plan_id,scheduled_date)
);
CREATE TABLE home_workout_sessions (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(180) NOT NULL,
 plan_id BIGINT NOT NULL, day_id BIGINT NOT NULL, session_date DATE NOT NULL,
 started_at TIMESTAMP(6) NOT NULL, ended_at TIMESTAMP(6), running_since TIMESTAMP(6),
 status VARCHAR(30) NOT NULL, active_seconds BIGINT NOT NULL DEFAULT 0,
 cursor_index INT NOT NULL DEFAULT 0, exercises_json LONGTEXT NOT NULL,
 sets_json LONGTEXT NOT NULL, skipped_json LONGTEXT NOT NULL,
 notes VARCHAR(2000) NOT NULL, pain_reported BOOLEAN NOT NULL DEFAULT FALSE,
 weight_kg DOUBLE NOT NULL, version BIGINT NOT NULL DEFAULT 0,
 CONSTRAINT fk_home_session_plan FOREIGN KEY(plan_id) REFERENCES home_workout_plans(id),
 CONSTRAINT fk_home_session_day FOREIGN KEY(day_id) REFERENCES home_workout_days(id)
);
CREATE INDEX idx_home_session_owner_status ON home_workout_sessions(user_id,status,session_date);
CREATE TABLE home_challenge_enrollments (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(180) NOT NULL,
 challenge_id VARCHAR(60) NOT NULL, start_date DATE NOT NULL,
 CONSTRAINT uq_home_challenge_user UNIQUE(user_id,challenge_id)
);
