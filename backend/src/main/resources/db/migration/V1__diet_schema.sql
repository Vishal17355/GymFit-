CREATE TABLE user_profiles (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(180) NOT NULL UNIQUE,
 age INT NOT NULL CHECK (age BETWEEN 14 AND 100), sex_for_bmr VARCHAR(32) NOT NULL,
 height_cm DOUBLE NOT NULL CHECK (height_cm > 0), weight_kg DOUBLE NOT NULL CHECK (weight_kg > 0),
 activity_level VARCHAR(64) NOT NULL, fitness_goal VARCHAR(64) NOT NULL, dietary_preference VARCHAR(64) NOT NULL,
 daily_budget DOUBLE CHECK (daily_budget > 0), pregnant_or_breastfeeding BOOLEAN NOT NULL, medical_diet_required BOOLEAN NOT NULL,
 allergies TEXT NOT NULL, excluded_foods TEXT NOT NULL, available_foods TEXT NOT NULL,
 created_at TIMESTAMP(6) NOT NULL, updated_at TIMESTAMP(6) NOT NULL, version BIGINT NOT NULL DEFAULT 0
);
CREATE TABLE foods (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(512) NOT NULL, source VARCHAR(64) NOT NULL,
 external_food_id VARCHAR(128) NOT NULL, calories DOUBLE CHECK (calories >= 0), protein DOUBLE CHECK (protein >= 0),
 carbohydrates DOUBLE CHECK (carbohydrates >= 0), fat DOUBLE CHECK (fat >= 0), fiber DOUBLE CHECK (fiber >= 0),
 serving_unit VARCHAR(32) NOT NULL, serving_quantity DOUBLE NOT NULL CHECK (serving_quantity > 0),
 original_serving_quantity DOUBLE, original_serving_unit VARCHAR(64), diet_type VARCHAR(64) NOT NULL,
 preparation_state VARCHAR(255), source_url VARCHAR(255), reviewed BOOLEAN NOT NULL DEFAULT FALSE,
 allergens TEXT NOT NULL, last_updated TIMESTAMP(6) NOT NULL,
 CONSTRAINT uq_food_source UNIQUE (source, external_food_id)
);
CREATE INDEX idx_food_name ON foods(name);
CREATE TABLE user_food_prices (
 profile_id BIGINT NOT NULL, food_id BIGINT NOT NULL, price_per_100g DOUBLE NOT NULL CHECK(price_per_100g >= 0),
 PRIMARY KEY(profile_id, food_id), FOREIGN KEY(profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
 FOREIGN KEY(food_id) REFERENCES foods(id)
);
CREATE TABLE recipes (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE, instructions TEXT NOT NULL,
 meal_category VARCHAR(32) NOT NULL, dietary_type VARCHAR(64) NOT NULL,
 preparation_time INT NOT NULL, servings DOUBLE NOT NULL CHECK(servings > 0), source VARCHAR(64) NOT NULL,
 external_recipe_id VARCHAR(128)
);
CREATE INDEX idx_recipe_category ON recipes(meal_category, dietary_type);
CREATE TABLE recipe_ingredients (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, recipe_id BIGINT NOT NULL, food_id BIGINT NOT NULL,
 quantity DOUBLE NOT NULL CHECK(quantity > 0), unit VARCHAR(32) NOT NULL,
 FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE, FOREIGN KEY(food_id) REFERENCES foods(id)
);
CREATE TABLE diet_plans (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(180) NOT NULL,
 start_date DATE NOT NULL, end_date DATE NOT NULL, target_calories DOUBLE NOT NULL, target_protein DOUBLE NOT NULL,
 target_carbs DOUBLE NOT NULL, target_fat DOUBLE NOT NULL, bmr DOUBLE NOT NULL, tdee DOUBLE NOT NULL,
 activity_factor DOUBLE NOT NULL, status VARCHAR(32) NOT NULL, created_at TIMESTAMP(6) NOT NULL, updated_at TIMESTAMP(6) NOT NULL,
 profile_snapshot TEXT NOT NULL, version BIGINT NOT NULL DEFAULT 0,
 CHECK(end_date >= start_date)
);
CREATE INDEX idx_plan_user_date ON diet_plans(user_id, created_at);
CREATE TABLE diet_plan_meals (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, diet_plan_id BIGINT NOT NULL, recipe_id BIGINT NOT NULL,
 meal_date DATE NOT NULL, meal_type VARCHAR(32) NOT NULL, serving_multiplier DOUBLE NOT NULL CHECK(serving_multiplier > 0),
 total_calories DOUBLE NOT NULL, total_protein DOUBLE NOT NULL, total_carbs DOUBLE NOT NULL, total_fat DOUBLE NOT NULL,
 estimated_cost DOUBLE, eaten BOOLEAN NOT NULL DEFAULT FALSE, customized BOOLEAN NOT NULL DEFAULT FALSE, ingredient_snapshot TEXT NOT NULL,
 FOREIGN KEY(diet_plan_id) REFERENCES diet_plans(id) ON DELETE CASCADE, FOREIGN KEY(recipe_id) REFERENCES recipes(id),
 CONSTRAINT uq_plan_meal UNIQUE(diet_plan_id, meal_date, meal_type)
);
CREATE TABLE weight_progress (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(180) NOT NULL, weight DOUBLE NOT NULL CHECK(weight > 0), recorded_at DATE NOT NULL,
 CONSTRAINT uq_weight_user_date UNIQUE(user_id, recorded_at)
);
CREATE TABLE legacy_diet_imports (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(180) NOT NULL, fingerprint VARCHAR(64) NOT NULL,
 payload LONGTEXT NOT NULL, imported_at TIMESTAMP(6) NOT NULL, CONSTRAINT uq_legacy_import UNIQUE(user_id, fingerprint)
);
CREATE TABLE food_search_cache (query_key VARCHAR(120) PRIMARY KEY, food_ids TEXT NOT NULL, expires_at TIMESTAMP(6) NOT NULL);
