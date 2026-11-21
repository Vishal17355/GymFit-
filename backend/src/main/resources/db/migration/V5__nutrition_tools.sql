CREATE TABLE nutrition_meal_templates (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, owner_id VARCHAR(180) NOT NULL,
 name VARCHAR(90) NOT NULL, items_json LONGTEXT NOT NULL
);
CREATE INDEX idx_meal_template_owner ON nutrition_meal_templates(owner_id,id);
CREATE TABLE nutrition_reminders (
 owner_id VARCHAR(180) NOT NULL, kind VARCHAR(16) NOT NULL, local_time VARCHAR(5) NOT NULL,
 PRIMARY KEY (owner_id,kind)
);
CREATE TABLE nutrition_progress_photos (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, owner_id VARCHAR(180) NOT NULL,
 photo_date DATE NOT NULL, caption VARCHAR(180) NOT NULL, image_bytes MEDIUMBLOB NOT NULL
);
CREATE INDEX idx_progress_photo_owner ON nutrition_progress_photos(owner_id,photo_date,id);
CREATE TABLE nutrition_activity (
 owner_id VARCHAR(180) NOT NULL, log_date DATE NOT NULL, steps INT NOT NULL, active_minutes INT NOT NULL,
 PRIMARY KEY (owner_id,log_date)
);
CREATE TABLE nutrition_circles (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, owner_id VARCHAR(180) NOT NULL, name VARCHAR(80) NOT NULL,
 kind VARCHAR(12) NOT NULL, discoverable BOOLEAN NOT NULL, invite_code VARCHAR(48) NOT NULL UNIQUE
);
CREATE TABLE nutrition_circle_members (
 circle_id BIGINT NOT NULL, account_id VARCHAR(180) NOT NULL, display_name VARCHAR(40) NOT NULL,
 PRIMARY KEY (circle_id,account_id), CONSTRAINT fk_nutrition_member_circle FOREIGN KEY(circle_id) REFERENCES nutrition_circles(id)
);
CREATE INDEX idx_circle_member_account ON nutrition_circle_members(account_id,circle_id);
CREATE TABLE nutrition_circle_posts (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, circle_id BIGINT NOT NULL, author_id VARCHAR(180) NOT NULL,
 parent_id BIGINT, body VARCHAR(800) NOT NULL, posted_at TIMESTAMP(6) NOT NULL,
 CONSTRAINT fk_nutrition_post_member FOREIGN KEY(circle_id,author_id) REFERENCES nutrition_circle_members(circle_id,account_id),
 CONSTRAINT fk_nutrition_post_parent FOREIGN KEY(parent_id) REFERENCES nutrition_circle_posts(id)
);
CREATE INDEX idx_circle_post_feed ON nutrition_circle_posts(circle_id,id);
CREATE TABLE nutrition_circle_reactions (
 post_id BIGINT NOT NULL, account_id VARCHAR(180) NOT NULL, PRIMARY KEY(post_id,account_id),
 CONSTRAINT fk_nutrition_reaction_post FOREIGN KEY(post_id) REFERENCES nutrition_circle_posts(id)
);
