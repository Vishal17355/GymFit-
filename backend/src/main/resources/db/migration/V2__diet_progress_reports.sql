CREATE TABLE diet_progress_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    diet_plan_id BIGINT NOT NULL,
    baseline_weight_kg DOUBLE NOT NULL CHECK (baseline_weight_kg > 0),
    baseline_recorded_at DATE NOT NULL,
    baseline_source VARCHAR(64) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    metrics_snapshot LONGTEXT NOT NULL,
    CONSTRAINT uq_progress_plan UNIQUE (diet_plan_id),
    CONSTRAINT fk_progress_plan FOREIGN KEY (diet_plan_id) REFERENCES diet_plans(id) ON DELETE CASCADE
);
