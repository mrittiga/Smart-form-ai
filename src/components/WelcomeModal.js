import React from 'react';

export default function WelcomeModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        padding: '28px',
        borderRadius: '16px',
        maxWidth: '420px',
        width: '100%',
        border: '1px solid #334155',
        color: '#f8fafc',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚀</div>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: '800' }}>Welcome to SmartForm AI!</h2>
        <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 20px 0' }}>
          Get ready to experience the future of intelligent form building, real-time analytics, and AI-powered autofill designed for Product Hunt.
        </p>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Explore App ⚡
        </button>
      </div>
    </div>
  );
}
