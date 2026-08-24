import React from 'react';
import { Download, Filter } from 'lucide-react';

const SubmissionsPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>Submissions</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>Track and manage all form responses</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {[
          { label: 'Total Submissions', val: '128' },
          { label: 'Success Rate', val: '94%' },
          { label: 'Avg. Time', val: '1m 12s' }
        ].map((item, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{item.label}</span>
            <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '10px', color: 'var(--primary)' }}>{item.val}</div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['All', 'Submitted', 'Draft'].map((tab, i) => (
              <button
                key={i}
                style={{
                  padding: '10px 20px',
                  borderRadius: '14px',
                  border: '1px solid var(--glass-border)',
                  background: i === 0 ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.4)',
                  color: i === 0 ? '#fff' : 'var(--text-secondary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: i === 0 ? '0 8px 20px rgba(124, 92, 255, 0.25)' : 'none'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '14px', border: '1px solid var(--glass-border)', background: 'rgba(255, 255, 255, 0.7)', color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
          No recent submission logs found.
        </div>
      </div>
    </div>
  );
};

export default SubmissionsPage;
