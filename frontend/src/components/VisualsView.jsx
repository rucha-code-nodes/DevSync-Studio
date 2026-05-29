import React from 'react';

export default function VisualsView({ projects }) {
  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div className="card-panel">
        <h2 style={{ marginBottom: '0.5rem' }}>Dynamic Data Visualizations</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Visual representation of relational calculations compiled directly inside the relational engine.</p>
      </div>

      <div className="card-panel">
        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--accent-indigo)' }}>Live Overlap Match Distributions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {projects.map(p => (
            <div key={p.project_id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: '500' }}>{p.title}</span>
                <span style={{ fontWeight: 'bold', color: p.match_percentage > 50 ? 'var(--accent-emerald)' : 'var(--accent-indigo)' }}>{p.match_percentage}% Match Score</span>
              </div>
              <div className="progress-container" style={{ height: '20px', borderRadius: '6px' }}>
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${p.match_percentage}%`, 
                    backgroundColor: p.match_percentage > 50 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                    borderRight: p.match_percentage > 50 ? '2px solid var(--accent-emerald)' : '2px solid var(--accent-indigo)'
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-panel">
        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--accent-purple)' }}>Architecture Node Interconnections</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', position: 'relative' }}>
          <div className="topo-node">
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', fontWeight: 'bold' }}>UI LAYER</span>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: '600' }}>React Components</p>
          </div>
          <div className="topo-node" style={{ borderStyle: 'solid', borderColor: 'var(--accent-purple)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 'bold' }}>LOGIC LAYER</span>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: '600' }}>Express API Pool</p>
          </div>
          <div className="topo-node" style={{ borderStyle: 'solid', borderColor: 'var(--accent-emerald)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 'bold' }}>DATA STORE</span>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: '600' }}>MySQL Server Engine</p>
          </div>
        </div>
      </div>
    </main>
  );
}