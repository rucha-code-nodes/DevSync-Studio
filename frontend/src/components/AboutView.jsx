import React from 'react';

export default function AboutView() {
  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card-panel" style={{ borderLeft: '4px solid var(--accent-indigo)' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Platform Documentation</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          An optimized solution map designed to showcase advanced backend system architecture and structural query capabilities.
        </p>
      </div>

      <div className="card-panel">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'white' }}>What This Project Does</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
          DevSync serves as a highly scalable resource matching engine. Instead of offloading data cross-referencing to heavy runtime computation layers, this application pushes processing requirements down into indexed database structures.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          By mapping entities through unified associative tables, the architecture calculates overlapping tech dependencies instantly, rendering a tailored engagement index for any active authentication context.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card-panel" style={{ background: '#0F1524' }}>
          <h4 style={{ color: 'var(--accent-indigo)', marginBottom: '0.5rem' }}>Relational Mapping Blocks</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Utilizes precise target indexing via many-to-many junction layers to decouple individual entities from permanent direct system bindings.
          </p>
        </div>
        <div className="card-panel" style={{ background: '#0F1524' }}>
          <h4 style={{ color: 'var(--accent-emerald)', marginBottom: '0.5rem' }}>Dynamic Mathematical Unions</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Computes overlapping intersection properties on the fly using multi-tier joins and conditional asset parameters.
          </p>
        </div>
      </div>
    </main>
  );
}