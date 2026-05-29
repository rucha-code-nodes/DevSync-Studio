// import React, { useState, useEffect } from 'react';

// export default function App() {
//   const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'about' | 'audit'
//   const [projects, setProjects] = useState([]);
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [auditLogs, setAuditLogs] = useState([]);
//   const [availableSkills, setAvailableSkills] = useState([]);
//   const [currentDev, setCurrentDev] = useState(1);

//   const [devForm, setDevForm] = useState({ name: '', email: '', experience: 0, github_link: '', selected_skills: [] });
//   const [projectForm, setProjectForm] = useState({ title: '', description: '', required_members: 1, required_skills: [] });

//   const refreshData = () => {
//     fetch(`http://localhost:5000/api/projects/${currentDev}`)
//       .then(res => res.json())
//       .then(data => setProjects(data));

//     fetch('http://localhost:5000/api/leaderboard')
//       .then(res => res.json())
//       .then(data => setLeaderboard(data));

//     fetch('http://localhost:5000/api/audit-logs')
//       .then(res => res.json())
//       .then(data => setAuditLogs(data));
//   };

//   useEffect(() => {
//     refreshData();
//     fetch('http://localhost:5000/api/skills')
//       .then(res => res.json())
//       .then(data => setAvailableSkills(data));
//   }, [currentDev, activeTab]);

//   const handleDevSubmit = (e) => {
//     e.preventDefault();
//     fetch('http://localhost:5000/api/developers', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(devForm)
//     })
//     .then(res => res.json())
//     .then(() => {
//       alert('Profile registered successfully inside MySQL!');
//       setDevForm({ name: '', email: '', experience: 0, github_link: '', selected_skills: [] });
//       refreshData();
//     });
//   };

//   const handleProjectSubmit = (e) => {
//     e.preventDefault();
//     fetch('http://localhost:5000/api/projects', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ ...projectForm, created_by: currentDev })
//     })
//     .then(res => res.json())
//     .then(() => {
//       alert('Project saved and skills linked natively!');
//       setProjectForm({ title: '', description: '', required_members: 1, required_skills: [] });
//       refreshData();
//     });
//   };

//   const toggleSkillSelection = (id, type) => {
//     if (type === 'dev') {
//       const updated = devForm.selected_skills.includes(id)
//         ? devForm.selected_skills.filter(s => s !== id)
//         : [...devForm.selected_skills, id];
//       setDevForm({ ...devForm, selected_skills: updated });
//     } else {
//       const updated = projectForm.required_skills.includes(id)
//         ? projectForm.required_skills.filter(s => s !== id)
//         : [...projectForm.required_skills, id];
//       setProjectForm({ ...projectForm, required_skills: updated });
//     }
//   };

//   return (
//     <div>
//       {/* Header Bar */}
//       <header className="header" style={{ padding: '0.8rem 2rem' }}>
//         <div className="logo-container">
//           <div className="logo-badge">D</div>
//           <span className="logo-text">DevSync Studio</span>
//         </div>

//         {/* Dynamic Tab Navigation Bar */}
//         <nav style={{ display: 'flex', gap: '1rem' }}>
//           <button 
//             onClick={() => setActiveTab('dashboard')}
//             style={{
//               background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#6366f1' : '#9ca3af',
//               fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', borderBottom: activeTab === 'dashboard' ? '2px solid #6366f1' : 'none', paddingBottom: '4px'
//             }}
//           >
//             Dashboard
//           </button>
//           <button 
//             onClick={() => setActiveTab('audit')}
//             style={{
//               background: 'none', border: 'none', color: activeTab === 'audit' ? '#10b981' : '#9ca3af',
//               fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', borderBottom: activeTab === 'audit' ? '2px solid #10b981' : 'none', paddingBottom: '4px'
//             }}
//           >
//             System Logs & Audit
//           </button>
//           <button 
//             onClick={() => setActiveTab('about')}
//             style={{
//               background: 'none', border: 'none', color: activeTab === 'about' ? '#a855f7' : '#9ca3af',
//               fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', borderBottom: activeTab === 'about' ? '2px solid #a855f7' : 'none', paddingBottom: '4px'
//             }}
//           >
//             About Architecture
//           </button>
//         </nav>

//         <div className="profile-selector">
//           <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Active Session:</span>
//           <select className="select-dropdown" value={currentDev} onChange={(e) => setCurrentDev(e.target.value)}>
//             <option value="1">Alice Smith (MERN Stack)</option>
//             <option value="2">Bob Jones (Data Systems)</option>
//             <option value="3">Rohan Sharma (Lead Dev)</option>
//           </select>
//         </div>
//       </header>

//       {/* RENDER TAB 1: MAIN DASHBOARD CORE */}
//       {activeTab === 'dashboard' && (
//         <main className="main-layout">
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
//             <div className="card-panel">
//               <h3 className="panel-title-dev">Onboard New Developer</h3>
//               <form onSubmit={handleDevSubmit} className="form-group">
//                 <input type="text" placeholder="Full Name" required className="form-input" value={devForm.name} onChange={e => setDevForm({...devForm, name: e.target.value})} />
//                 <input type="email" placeholder="Email Address" required className="form-input" value={devForm.email} onChange={e => setDevForm({...devForm, email: e.target.value})} />
//                 <input type="number" placeholder="Years of Experience" required className="form-input" value={devForm.experience || ''} onChange={e => setDevForm({...devForm, experience: parseInt(e.target.value) || 0})} />
//                 <input type="text" placeholder="Github Profile Link" required className="form-input" value={devForm.github_link} onChange={e => setDevForm({...devForm, github_link: e.target.value})} />
//                 <div>
//                   <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Select Core Skills:</p>
//                   <div className="skills-wrapper">
//                     {availableSkills.map(s => (
//                       <button key={s.skill_id} type="button" onClick={() => toggleSkillSelection(s.skill_id, 'dev')} className={`skill-pill-btn ${devForm.selected_skills.includes(s.skill_id) ? 'active-dev' : ''}`}>
//                         {s.skill_name}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <button type="submit" className="submit-btn btn-indigo">Save Profile to DB</button>
//               </form>
//             </div>

//             <div className="card-panel">
//               <h3 className="panel-title-proj">Post Project Opportunity</h3>
//               <form onSubmit={handleProjectSubmit} className="form-group">
//                 <input type="text" placeholder="Project Title" required className="form-input" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
//                 <textarea placeholder="Project Description..." required rows="3" className="form-textarea" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
//                 <input type="number" placeholder="Required Team Size" required className="form-input" value={projectForm.required_members || ''} onChange={e => setProjectForm({...projectForm, required_members: parseInt(e.target.value) || 1})} />
//                 <div>
//                   <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Target Stack Dependencies:</p>
//                   <div className="skills-wrapper">
//                     {availableSkills.map(s => (
//                       <button key={s.skill_id} type="button" onClick={() => toggleSkillSelection(s.skill_id, 'project')} className={`skill-pill-btn ${projectForm.required_skills.includes(s.skill_id) ? 'active-proj' : ''}`}>
//                         {s.skill_name}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <button type="submit" className="submit-btn btn-emerald">Launch Project Openings</button>
//               </form>
//             </div>
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
//             <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Active Platform Engagements</h2>
//             <div className="project-feed">
//               {projects.map((project) => (
//                 <div key={project.project_id} className={`project-card ${project.match_percentage > 50 ? 'high-match' : 'low-match'}`}>
//                   <div className="card-header">
//                     <h3 style={{ fontSize: '1.125rem', fontWeight: '500' }}>{project.title}</h3>
//                     <span className={`match-pill ${project.match_percentage > 50 ? 'match-high' : 'match-low'}`}>
//                       {project.match_percentage}% Match
//                     </span>
//                   </div>
//                   <p className="project-desc">{project.description}</p>
//                   <div className="card-footer">
//                     Target Stack Size: {project.total_skills_needed} ⚡ Overlapping Match Count: {project.skills_matched}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="card-panel">
//               <h3 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
//                 Live Platform Leaderboard (SQL Window Functions)
//               </h3>
//               <div>
//                 {leaderboard.map((user, idx) => (
//                   <div key={user.dev_id} className="leaderboard-row">
//                     <span className="rank-txt">Rank #{idx + 1} — {user.name}</span>
//                     <span className="score-txt">{Number(user.avg_rating).toFixed(1)} / 5.0 Rating</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </main>
//       )}

//       {/* RENDER TAB 2: SYSTEM LOGS AUDIT TRAIL */}
//       {activeTab === 'audit' && (
//         <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
//           <div className="card-panel" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
//             <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>System Audit Logs & Security Trail</h2>
//             <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
//               This engine processes live tracking events. Every creation or drop action generates immutable logs executed directly inside a <strong>MySQL database trigger</strong>.
//             </p>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
//               {auditLogs.length === 0 ? (
//                 <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
//                   No recent ledger logs found. Go post a project to fire the live trigger!
//                 </p>
//               ) : (
//                 auditLogs.map((log) => (
//                   <div key={log.log_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#0F1524', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
//                     <div>
//                       <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', marginRight: '1rem' }}>
//                         {log.action_performed}
//                       </span>
//                       <span style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>{log.details}</span>
//                     </div>
//                     <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
//                       {new Date(log.timestamp).toLocaleTimeString()}
//                     </span>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </main>
//       )}

//       {/* RENDER TAB 3: ESSENTIAL ABOUT ARCHITECTURE PAGE */}
//       {activeTab === 'about' && (
//         <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
//           <div className="card-panel" style={{ borderLeft: '4px solid var(--accent-indigo)' }}>
//             <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Enterprise System Blueprint</h2>
//             <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
//               An optimized relational mapping stack focusing on data handling performance over resource-heavy application layers.
//             </p>
//           </div>

//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
//             <div className="card-panel" style={{ background: '#0F1524' }}>
//               <h4 style={{ color: 'var(--accent-indigo)', marginBottom: '0.5rem' }}>1. Custom Analytics View</h4>
//               <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
//                 Computes historical ranking distributions using analytics window operations (<code>RANK() OVER</code>) executed right at the schema level.
//               </p>
//             </div>
//             <div className="card-panel" style={{ background: '#0F1524' }}>
//               <h4 style={{ color: 'var(--accent-emerald)', marginBottom: '0.5rem' }}>2. Matching Aggregation Engine</h4>
//               <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
//                 Cross-references bridge tables with a single conditional query, computing overlapping skill stack values instantly.
//               </p>
//             </div>
//           </div>

//           <div className="card-panel" style={{ textAlign: 'center', background: 'linear-gradient(180deg, #161b26 0%, #0f1524 100%)' }}>
//             <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Technical Stack</h3>
//             <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
//               React 18 • Node.js Express Server • MySQL Native Connection Pool Pooler • Dotenv Protection
//             </p>
//           </div>
//         </main>
//       )}
//     </div>
//   );
// }









import React, { useState, useEffect } from 'react';
import DashboardView from './components/DashboardView';
import VisualsView from './components/VisualsView';
import AboutView from './components/AboutView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [currentDev, setCurrentDev] = useState(1);

 const [devForm, setDevForm] = useState({ name: '', email: '', experience: 0, github_link: '', selected_skills: [] });
const [projectForm, setProjectForm] = useState({ title: '', description: '', required_members: 1, required_skills: [] });


  const refreshData = () => {
    fetch(`http://localhost:5000/api/projects/${currentDev}`)
      .then(res => res.json())
      .then(data => setProjects(data));

    fetch('http://localhost:5000/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data));
  };

  useEffect(() => {
    refreshData();
    fetch('http://localhost:5000/api/skills')
      .then(res => res.json())
      .then(data => setAvailableSkills(data));
  }, [currentDev, activeTab]);

  const handleDevSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/developers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(devForm)
    })
    .then(res => res.json())
    .then(() => {
      alert('Profile registered successfully inside MySQL!');
      setDevForm({ name: '', email: '', experience: 0, github_link: '', selected_skills: [] });
      refreshData();
    });
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...projectForm, created_by: currentDev })
    })
    .then(res => res.json())
    .then(() => {
      alert('Project saved and skills linked natively!');
      setProjectForm({ title: '', description: '', required_members: 1, required_skills: [] });
      refreshData();
    });
  };

  const toggleSkillSelection = (id, type) => {
    if (type === 'dev') {
      const updated = devForm.selected_skills.includes(id)
        ? devForm.selected_skills.filter(s => s !== id)
        : [...devForm.selected_skills, id];
      setDevForm({ ...devForm, selected_skills: updated });
    } else {
      const updated = projectForm.required_skills.includes(id)
        ? projectForm.required_skills.filter(s => s !== id)
        : [...projectForm.required_skills, id];
      setProjectForm({ ...projectForm, required_skills: updated });
    }
  };

  return (
    <div>
      {/* Universal Shared Header Navbar */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-badge">D</div>
          <span className="logo-text">DevSync Studio</span>
        </div>

        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setActiveTab('dashboard')} className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}>Dashboard Workspace</button>
          <button onClick={() => setActiveTab('visuals')} className={`nav-link ${activeTab === 'visuals' ? 'active' : ''}`}>Metrics & Visuals</button>
          <button onClick={() => setActiveTab('about')} className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}>System Documentation</button>
        </nav>

        <div className="profile-selector">
          <select className="select-dropdown" value={currentDev} onChange={(e) => setCurrentDev(e.target.value)}>
            <option value="1">Profile: Alice Smith</option>
            <option value="2">Profile: Bob Jones</option>
            <option value="3">Profile: Rohan Sharma</option>
          </select>
        </div>
      </header>

      {/* Conditionally Render Pages Based on State */}
      {activeTab === 'dashboard' && (
        <DashboardView 
          devForm={devForm} setDevForm={setDevForm} handleDevSubmit={handleDevSubmit}
          projectForm={projectForm} setProjectForm={setProjectForm} handleProjectSubmit={handleProjectSubmit}
          availableSkills={availableSkills} toggleSkillSelection={toggleSkillSelection} projects={projects}
        />
      )}

      {activeTab === 'visuals' && <VisualsView projects={projects} />}

      {activeTab === 'about' && <AboutView />}

      {/* Shared Footer Leaderboard Display */}
      {activeTab === 'dashboard' && (
        <footer style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
          <div className="card-panel">
            <h3 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Live Platform Leaderboard (SQL Window Functions)
            </h3>
            <div>
              {leaderboard.map((user, idx) => (
                <div key={user.dev_id} className="leaderboard-row">
                  <span className="rank-txt">Rank #{idx + 1} — {user.name}</span>
                  <span className="score-txt">{Number(user.avg_rating).toFixed(1)} / 5.0 Rating</span>
                </div>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}