CREATE DATABASE IF NOT EXISTS dev_marketplace;
USE dev_marketplace;

-- 1. Developers Table
CREATE TABLE developers (
    dev_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    experience INT DEFAULT 0,
    github_link VARCHAR(255)
);

-- 2. Skills Table
CREATE TABLE skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(50) UNIQUE NOT NULL
);

-- 3. Developer Skills (Many-to-Many)
CREATE TABLE developer_skills (
    dev_id INT,
    skill_id INT,
    PRIMARY KEY (dev_id, skill_id),
    FOREIGN KEY (dev_id) REFERENCES developers(dev_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

-- 4. Projects Table
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    required_members INT DEFAULT 1,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES developers(dev_id) ON DELETE SET NULL
);

-- 5. Project Skills (Many-to-Many)
CREATE TABLE project_skills (
    project_id INT,
    skill_id INT,
    PRIMARY KEY (project_id, skill_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

-- 6. Applications Table
CREATE TABLE applications (
    app_id INT AUTO_INCREMENT PRIMARY KEY,
    dev_id INT,
    project_id INT,
    status VARCHAR(20) DEFAULT 'Pending',
    FOREIGN KEY (dev_id) REFERENCES developers(dev_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- 7. Ratings Table
CREATE TABLE ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    given_to INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (given_to) REFERENCES developers(dev_id) ON DELETE CASCADE
);

-- Triggers & Procedures
DELIMITER $$
CREATE TRIGGER delete_rejected
AFTER UPDATE ON applications
FOR EACH ROW
BEGIN
   IF NEW.status = 'Rejected' THEN
      DELETE FROM applications WHERE app_id = NEW.app_id;
   END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE recommend_projects(IN developer_id INT)
BEGIN
   SELECT DISTINCT p.project_id, p.title, p.description
   FROM projects p
   JOIN project_skills ps ON p.project_id = ps.project_id
   JOIN developer_skills ds ON ps.skill_id = ds.skill_id
   WHERE ds.dev_id = developer_id;
END$$
DELIMITER ;

CREATE OR REPLACE VIEW v_developer_leaderboard AS
SELECT 
    d.dev_id,
    d.name,
    COALESCE(AVG(r.rating), 0) AS avg_rating,
    RANK() OVER(ORDER BY COALESCE(AVG(r.rating), 0) DESC) AS ranking
FROM developers d
LEFT JOIN ratings r ON d.dev_id = r.given_to
GROUP BY d.dev_id, d.name;





USE dev_marketplace;

-- Safely clear out corrupt entries
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE project_skills;
TRUNCATE TABLE projects;
TRUNCATE TABLE platform_audit_logs;
SET FOREIGN_KEY_CHECKS = 1;

-- Re-insert standard demo projects to verify the dashboard
INSERT INTO projects (project_id, title, description, required_members, created_by) VALUES 
(1, 'E-Commerce Engine', 'Looking for an engineer proficient in React and Node.js.', 3, 1),
(2, 'AI Analytics Dashboard', 'Requires massive data ingestion utilizing Python and MySQL.', 2, 2);

INSERT INTO project_skills (project_id, skill_id) VALUES 
(1, 1), (1, 2), -- React and Node
(2, 4), (2, 3); -- Python and MySQL

-- SELECT * FROM developers ORDER BY dev_id DESC;

-- SELECT * FROM developer_skills;




USE dev_marketplace;

-- Create an isolated audit log table
CREATE TABLE IF NOT EXISTS platform_audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action_performed VARCHAR(50) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to automatically catch new project insertions
DELIMITER $$
CREATE TRIGGER log_new_projects
AFTER INSERT ON projects
FOR EACH ROW
BEGIN
   INSERT INTO platform_audit_logs (action_performed, details)
   VALUES ('PROJECT_CREATION', CONCAT('New project added: "', NEW.title, '" created by Dev ID: ', COALESCE(NEW.created_by, 'System')));
END$$
DELIMITER ;




USE dev_marketplace;

-- 1. Ensure the skill_name column has a UNIQUE constraint
ALTER TABLE skills ADD CONSTRAINT unique_skill_name UNIQUE (skill_name);












