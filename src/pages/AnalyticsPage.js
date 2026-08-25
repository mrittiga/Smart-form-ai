import React from 'react';

export default function AnalyticsPage() {
  const stats = [
    { label: 'Total Form Views', value: '1,428', change: '+14% this week', color: '#6366f1' },
    { label: 'Conversion Rate', value: '68.4%', change: '+5.2% vs avg', color: '#10b981' },
    { label: 'AI Form Generations', value: '342', change: 'Active engine', color: '#f59e0b' }
  ];

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', color: '#f8fafc' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>📈 Analytics & Insights</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px', margin: 0 }}>
          Real-time metrics tracking engagement, interaction rates, and completion performance.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: stat.color, margin: '8px 0 4px 0' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>{stat.change}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#f8fafc' }}>Dwell Time & Heatmap Overview</h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
          Users spend an average of <strong>42 seconds</strong> completing generated forms. Field-level tracking indicates highest focus on custom dropdown selections and text input areas.
        </p>
      </div>
    </div>
  );
}
