import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize environment variables configuration
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); 

// Establish connection pool using process.env
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME || 'dev_marketplace',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0 
});

// Create a promise-based wrapper for clean async/await operations
const pool = db.promise();

// ==========================================
// POST ENDPOINTS TO SAVE USER DATA NATIVELY
// ==========================================

// Create a New Developer Profile via UI Form
app.post('/api/developers', async (req, res) => {
    try {
        const { name, email, experience, github_link, selected_skills } = req.body;

        // Step 1: Insert core developer data
        const devQuery = `INSERT INTO developers (name, email, experience, github_link) VALUES (?, ?, ?, ?)`;
        const [devResult] = await pool.query(devQuery, [name, email, experience, github_link]);
        const newDevId = devResult.insertId;

        // Step 2: Handle dynamic custom skills mapping
        if (selected_skills && selected_skills.length > 0) {
            let skillIds = [];

            for (let skillName of selected_skills) {
                // Insert skill if it doesn't exist, ignoring duplicates safely
                await pool.query(`INSERT IGNORE INTO skills (skill_name) VALUES (?)`, [skillName]);
                
                // Retrieve the valid skill_id
                const [skillRows] = await pool.query(`SELECT skill_id FROM skills WHERE skill_name = ?`, [skillName]);
                if (skillRows && skillRows[0]) {
                    skillIds.push(skillRows[0].skill_id);
                }
            }

            // Map keys into the junction bridge table
            if (skillIds.length > 0) {
                const skillMappings = skillIds.map(id => [newDevId, id]);
                await pool.query(`INSERT INTO developer_skills (dev_id, skill_id) VALUES ?`, [skillMappings]);
            }
        }

        return res.status(201).json({ message: 'Developer profile saved successfully!' });
    } catch (err) {
        console.error("❌ Developer Registration Error:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Post a New Project Opportunity via UI Form
app.post('/api/projects', async (req, res) => {
    try {
        const { title, description, required_members, created_by, required_skills } = req.body;

        // Step 1: Insert core project details
        const projectQuery = `INSERT INTO projects (title, description, required_members, created_by) VALUES (?, ?, ?, ?)`;
        const [projectResult] = await pool.query(projectQuery, [title, description, required_members, created_by]);
        const newProjectId = projectResult.insertId;

        // Step 2: Handle dynamic target dependencies mapping
        if (required_skills && required_skills.length > 0) {
            let skillIds = [];

            for (let skillName of required_skills) {
                await pool.query(`INSERT IGNORE INTO skills (skill_name) VALUES (?)`, [skillName]);
                
                const [skillRows] = await pool.query(`SELECT skill_id FROM skills WHERE skill_name = ?`, [skillName]);
                if (skillRows && skillRows[0]) {
                    skillIds.push(skillRows[0].skill_id);
                }
            }

            // Map records into many-to-many junction ledger table
            if (skillIds.length > 0) {
                const projectSkillMappings = skillIds.map(id => [newProjectId, id]);
                await pool.query(`INSERT INTO project_skills (project_id, skill_id) VALUES ?`, [projectSkillMappings]);
            }
        }

        return res.status(201).json({ message: 'Project opening registered successfully!' });
    } catch (err) {
        console.error("❌ Project Creation Error:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Helper Route: Fetch all tracking skills
app.get('/api/skills', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM skills');
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
});

// ==========================================
// ANALYTICS DATA DISPLAY METRICS (GET)
// ==========================================
app.get('/api/projects/:devId', async (req, res) => {
    try {
        const devId = req.params.devId;
        const query = `
            SELECT 
                p.project_id, 
                p.title, 
                p.description,
                COUNT(ps.skill_id) AS total_skills_needed,
                COUNT(ds.skill_id) AS skills_matched,
                COALESCE(ROUND((COUNT(ds.skill_id) / NULLIF(COUNT(ps.skill_id), 0)) * 100), 0) AS match_percentage
            FROM projects p
            LEFT JOIN project_skills ps ON p.project_id = ps.project_id
            LEFT JOIN developer_skills ds ON ps.skill_id = ds.skill_id AND ds.dev_id = ?
            GROUP BY p.project_id, p.title, p.description;
        `;
        const [results] = await pool.query(query, [devId]);
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM v_developer_leaderboard');
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/api/audit-logs', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM platform_audit_logs ORDER BY timestamp DESC');
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Clean Promise API spinning on port ${PORT}`));