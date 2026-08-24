import React from 'react';
import { BarChart2, TrendingUp, Users, Clock } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>Track performance and response insights</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {['Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map((range, idx) => (
          <button
            key={idx}
            style={{
              padding: '10px 18px',
              borderRadius: '14px',
              border: '1px solid var(--glass-border)',
              background: idx === 1 ? 'var(--primary-light)' : 'rgba(255, 255, 255, 0.4)',
              color: idx === 1 ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {range}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        {[
          { label: 'TOTAL FORMS', val: '4', sub: '↑ +2 this week', icon: BarChart2 },
          { label: 'TOTAL SUBMISSIONS', val: '128', sub: '↑ +18 this week', icon: TrendingUp },
          { label: 'AVG. COMPLETION TIME', val: '2m 34s', sub: '↓ -15 sec this week', icon: Clock },
          { label: 'COMPLETION RATE', val: '88%', sub: '↑ +5% this week', icon: Users }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.8px' }}>{card.label}</span>
                <Icon size={20} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', margin: '14px 0 6px 0', color: 'var(--text-primary)' }}>{card.val}</div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: card.sub.includes('↑') ? '#10b981' : '#f59e0b' }}>{card.sub}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsPage;
