CREATE TABLE nutrition_diary (
 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 user_id VARCHAR(180) NOT NULL,
 log_date DATE NOT NULL,
 meal_slot VARCHAR(16) NOT NULL,
 food_name VARCHAR(512) NOT NULL,
 source_name VARCHAR(32) NOT NULL,
 grams DOUBLE NOT NULL CHECK (grams > 0),
 calories DOUBLE NOT NULL CHECK (calories >= 0),
 protein DOUBLE NOT NULL CHECK (protein >= 0),
 carbs DOUBLE NOT NULL CHECK (carbs >= 0),
 fat DOUBLE NOT NULL CHECK (fat >= 0),
 fiber DOUBLE,
 favorite BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_nutrition_diary_owner_date ON nutrition_diary(user_id, log_date, id);
CREATE TABLE nutrition_water_logs (
 user_id VARCHAR(180) NOT NULL,
 log_date DATE NOT NULL,
 milliliters INT NOT NULL CHECK (milliliters BETWEEN 0 AND 20000),
 PRIMARY KEY (user_id, log_date)
);
CREATE TABLE nutrition_diary_settings (
 user_id VARCHAR(180) PRIMARY KEY,
 water_goal_ml INT NOT NULL CHECK (water_goal_ml BETWEEN 250 AND 12000),
 fiber_goal_g INT CHECK (fiber_goal_g BETWEEN 1 AND 150)
);
