import React from 'react';

const ProfilePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>Profile</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>Manage personal account details</p>
      </div>

      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          fontWeight: '800',
          color: '#fff',
          marginBottom: '20px',
          boxShadow: '0 12px 28px rgba(124, 92, 255, 0.35)'
        }}>
          M
        </div>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '800' }}>Mrittiga Mohanraj</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Active Account</p>
      </div>
    </div>
  );
};

export default ProfilePage;
