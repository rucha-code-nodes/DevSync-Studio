import React, { useState } from 'react';

export default function DashboardView({
  devForm, setDevForm, handleDevSubmit,
  projectForm, setProjectForm, handleProjectSubmit,
  availableSkills, projects
}) {
  const [customDevSkill, setCustomDevSkill] = useState('');
  const [customProjSkill, setCustomProjSkill] = useState('');

  // Add custom typed skill to Developer array
  const addDevSkill = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && customDevSkill.trim() !== '') {
      e.preventDefault();
      if (!devForm.selected_skills.includes(customDevSkill.trim())) {
        setDevForm({ ...devForm, selected_skills: [...devForm.selected_skills, customDevSkill.trim()] });
      }
      setCustomDevSkill('');
    }
  };

  // Add custom typed skill to Project array
  const addProjSkill = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && customProjSkill.trim() !== '') {
      e.preventDefault();
      if (!projectForm.required_skills.includes(customProjSkill.trim())) {
        setProjectForm({ ...projectForm, required_skills: [...projectForm.required_skills, customProjSkill.trim()] });
      }
      setCustomProjSkill('');
    }
  };

  // Remove skill badge if clicked
  const removeSkill = (name, type) => {
    if (type === 'dev') {
      setDevForm({ ...devForm, selected_skills: devForm.selected_skills.filter(s => s !== name) });
    } else {
      setProjectForm({ ...projectForm, required_skills: projectForm.required_skills.filter(s => s !== name) });
    }
  };

  return (
    <main className="main-layout">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* DEVELOPER FORM */}
        <div className="card-panel">
          <h3 style={{ color: 'var(--accent-indigo)', marginBottom: '1rem' }}>Onboard New Developer</h3>
          <form onSubmit={handleDevSubmit} className="form-group">
            <input type="text" placeholder="Full Name" required className="form-input" value={devForm.name} onChange={e => setDevForm({ ...devForm, name: e.target.value })} />
            <input type="email" placeholder="Email Address" required className="form-input" value={devForm.email} onChange={e => setDevForm({ ...devForm, email: e.target.value })} />
            <input type="number" placeholder="Years of Experience" required className="form-input" value={devForm.experience || ''} onChange={e => setDevForm({ ...devForm, experience: parseInt(e.target.value) || 0 })} />
            <input type="text" placeholder="Github Profile Link" required className="form-input" value={devForm.github_link} onChange={e => setDevForm({ ...devForm, github_link: e.target.value })} />
            
            {/* Dynamic Custom Skill Input Box */}
            <div>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Type a core skill & press Enter:</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input 
                  type="text" placeholder="e.g. Docker, Spring Boot, Figma" className="form-input" 
                  value={customDevSkill} onChange={e => setCustomDevSkill(e.target.value)} onKeyDown={addDevSkill} 
                />
                <button type="button" onClick={addDevSkill} className="submit-btn btn-indigo" style={{ width: 'auto', padding: '0 1rem' }}>+</button>
              </div>
              <div className="skills-wrapper">
                {devForm.selected_skills.map(skill => (
                  <button key={skill} type="button" onClick={() => removeSkill(skill, 'dev')} className="skill-pill-btn active-dev">
                    {skill} ×
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="submit-btn btn-indigo">Save Profile to DB</button>
          </form>
        </div>

        {/* PROJECT FORM */}
        <div className="card-panel">
          <h3 style={{ color: 'var(--accent-emerald)', marginBottom: '1rem' }}>Post Project Opportunity</h3>
          <form onSubmit={handleProjectSubmit} className="form-group">
            <input type="text" placeholder="Project Title" required className="form-input" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} />
            <textarea placeholder="Project Description..." required rows="3" className="form-textarea" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
            <input type="number" placeholder="Required Team Size" required className="form-input" value={projectForm.required_members || ''} onChange={e => setProjectForm({ ...projectForm, required_members: parseInt(e.target.value) || 1 })} />
            
            {/* Dynamic Custom Skill Input Box */}
            <div>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Type target stack dependency & press Enter:</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input 
                  type="text" placeholder="e.g. AWS, Kubernetes, Solidity" className="form-input" 
                  value={customProjSkill} onChange={e => setCustomProjSkill(e.target.value)} onKeyDown={addProjSkill} 
                />
                <button type="button" onClick={addProjSkill} className="submit-btn btn-emerald" style={{ width: 'auto', padding: '0 1rem' }}>+</button>
              </div>
              <div className="skills-wrapper">
                {projectForm.required_skills.map(skill => (
                  <button key={skill} type="button" onClick={() => removeSkill(skill, 'project')} className="skill-pill-btn active-proj">
                    {skill} ×
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="submit-btn btn-emerald">Launch Project Openings</button>
          </form>
        </div>
      </div>

      {/* Projects Feed column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Active Platform Engagements</h2>
        <div className="project-feed">
          {projects.map((project) => (
            <div key={project.project_id} className={`project-card ${project.match_percentage > 50 ? 'high-match' : 'low-match'}`}>
              <div className="card-header">
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500' }}>{project.title}</h3>
                <span className={`match-pill ${project.match_percentage > 50 ? 'match-high' : 'match-low'}`}>
                  {project.match_percentage}% Match
                </span>
              </div>
              <p className="project-desc">{project.description}</p>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${project.match_percentage}%`, backgroundColor: project.match_percentage > 50 ? 'var(--accent-emerald)' : 'var(--accent-indigo)' }} />
              </div>
              <div className="card-footer" style={{ marginTop: '0.5rem' }}>
                Target Stack Size: {project.total_skills_needed} ⚡ Overlapping Match Count: {project.skills_matched}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}