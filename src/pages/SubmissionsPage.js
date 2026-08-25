import React, { useState } from 'react';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('smartform_submissions');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'sub_101', formTitle: 'Developer Hiring Application', submittedAt: '2026-06-06 14:22', status: 'Completed', user: 'Alex Morgan' },
      { id: 'sub_102', formTitle: 'Product Feedback Survey', submittedAt: '2026-06-06 15:10', status: 'Pending', user: 'Sarah Connor' },
      { id: 'sub_103', formTitle: 'AI Feature Early Access', submittedAt: '2026-06-07 09:45', status: 'Completed', user: 'David Miller' }
    ];
  });

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', color: '#f8fafc' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>📥 Form Submissions</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px', margin: 0 }}>
          Inspect live entries, responses, and participant records captured by your forms.
        </p>
      </div>

      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '14px 16px', fontWeight: '650' }}>Submission ID</th>
                <th style={{ padding: '14px 16px', fontWeight: '650' }}>Form Title</th>
                <th style={{ padding: '14px 16px', fontWeight: '650' }}>Respondent</th>
                <th style={{ padding: '14px 16px', fontWeight: '650' }}>Timestamp</th>
                <th style={{ padding: '14px 16px', fontWeight: '650' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, idx) => (
                <tr key={sub.id} style={{ borderBottom: idx < submissions.length - 1 ? '1px solid #334155' : 'none' }}>
                  <td style={{ padding: '14px 16px', color: '#6366f1', fontWeight: '600' }}>{sub.id}</td>
                  <td style={{ padding: '14px 16px', color: '#f8fafc' }}>{sub.formTitle}</td>
                  <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{sub.user}</td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '13px' }}>{sub.submittedAt}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      backgroundColor: sub.status === 'Completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: sub.status === 'Completed' ? '#34d399' : '#fbbf24'
                    }}>
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
