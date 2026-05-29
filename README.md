```markdown
# DevSync Studio — Optimized Relational Matching Engine

DevSync Studio is a project collaboration marketplace designed to match developers with open project opportunities based on overlapping skill stacks. Rather than performing heavy resource processing on the frontend, this system leverages advanced relational aggregation, analytics window functions, and database-level triggers inside **MySQL** to perform real-time matchmaking calculations.

---

## 🛠️ System Architecture Diagram


```

```
   [ React Frontend ] ──( Form Submissions & View Filters )
           │
           ▼
   [ Express API Pool ] ──( Using Connection Pooling & Async Promises )
           │
           ▼

```

┌────────────────────────────────────────────────────────┐
│                   MYSQL SERVER ENGINE                  │
│                                                        │
│  ┌─────────────────┐             ┌──────────────────┐  │
│  │ projects Table  │ ◄─────────► │ skills Table     │  │
│  └────────┬────────┘             └────────┬─────────┘  │
│           │                               │            │
│           ▼                               ▼            │
│   [ log_new_projects ] Trigger    [ Matching Aggregate ]│
│           │                                            │
│           ▼                                            │
│  ┌─────────────────┐                                   │
│  │ platform_audit  │                                   │
│  └─────────────────┘                                   │
└────────────────────────────────────────────────────────┘

```

---

## ⚡ Enterprise SQL Implementations

This project focuses heavily on database engineering optimization. Key SQL features include:

### 1. Dynamic Intersection Aggregation (Skill Matching)
Calculates exact overlap metrics on multi-tier junction tables using a single query loop. Uses `LEFT JOIN` and conditional denominators to handle unassigned assets gracefully:
```sql
SELECT 
    p.project_id, 
    COUNT(ps.skill_id) AS total_skills_needed,
    COUNT(ds.skill_id) AS skills_matched,
    COALESCE(ROUND((COUNT(ds.skill_id) / NULLIF(COUNT(ps.skill_id), 0)) * 100), 0) AS match_percentage
FROM projects p
LEFT JOIN project_skills ps ON p.project_id = ps.project_id
LEFT JOIN developer_skills ds ON ps.skill_id = ds.skill_id AND ds.dev_id = ?
GROUP BY p.project_id;

```

### 2. Analytics Window Functions (Leaderboard)

Utilizes the view abstraction `v_developer_leaderboard` to process mathematical distributions and relative sorting across all active rows without adding frontend compute overhead:

```sql
CREATE OR REPLACE VIEW v_developer_leaderboard AS
SELECT 
    d.dev_id, d.name, COALESCE(AVG(r.rating), 0) AS avg_rating,
    RANK() OVER(ORDER BY COALESCE(AVG(r.rating), 0) DESC) AS ranking
FROM developers d
LEFT JOIN ratings r ON d.dev_id = r.given_to
GROUP BY d.dev_id, d.name;

```

### 3. Data Auditing Infrastructure (Transactional Ledger)

Tracks platform activity automatically at the data layer using a native background trigger. Ensures transaction logs are maintained securely and independently of application code logic:

```sql
CREATE TRIGGER log_new_projects
AFTER INSERT ON projects
FOR EACH ROW
BEGIN
   INSERT INTO platform_audit_logs (action_performed, details)
   VALUES ('PROJECT_CREATION', CONCAT('New project added: "', NEW.title, '" created by Dev ID: ', COALESCE(NEW.created_by, 'System')));
END;

```

---

## ⚙️ Tech Stack & Dependencies

* **Frontend:** React 18, Native Modern CSS Variables, Modular Page State Mapping
* **Backend:** Node.js, Express, MySQL2 Pool Connection Driver (Promise-based Wrapper)
* **Configuration:** Dotenv protection protocols

---

## 🚀 Local Installation & Setup

### 1. Database Initialization

Open your MySQL client, run the complete schema script found inside your source configuration, and apply your local constraints.

### 2. Backend Configurations

Navigate to the backend directory, install packages, and create your environment variable secrets:

```bash
cd backend
npm install

```

Create a `.env` file referencing the structure specified inside `.env.example`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=dev_marketplace

```

Start the server:

```bash
node server.js

```

### 3. Frontend Configurations

Navigate to the frontend directory, compile assets, and launch your Vite workspace:

```bash
cd ../frontend
npm install
npm run dev

```
