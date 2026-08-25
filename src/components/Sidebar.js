import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ theme, toggleTheme, userProfile, onLogout, isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'AI Form Filler', path: '/ai-filler', icon: '🤖' },
    { name: 'Advanced AI', path: '/advanced-ai', icon: '⚡' },
    { name: 'Forms', path: '/form-builder', icon: '📝' },
    { name: 'Submissions', path: '/submissions', icon: '📥' },
    { name: 'Analytics', path: '/analytics', icon: '📈' },
    { name: 'Profile', path: '/profile', icon: '👤' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose} 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 998
          }} 
        />
      )}

      <aside style={{
        width: '260px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-270px',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: isDark ? '#0b0f17' : '#ffffff',
        borderRight: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        boxSizing: 'border-box',
        zIndex: 999,
        color: isDark ? '#f8fafc' : '#0f172a',
        boxShadow: isOpen ? '4px 0 25px rgba(0,0,0,0.3)' : 'none'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', padding: '0 8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#6366f1' }}>SmartForm AI</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                {isDark ? '☀️' : '🌙'}
              </button>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: '22px', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive ? (isDark ? '#1e293b' : '#f1f5f9') : 'transparent',
                    color: isActive ? '#6366f1' : (isDark ? '#94a3b8' : '#64748b'),
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '15px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div style={{ borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', paddingTop: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: isDark ? '#111827' : '#f8fafc',
            borderRadius: '12px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#6366f1',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {userProfile?.name ? userProfile.name.charAt(0) : 'M'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {userProfile?.name || 'Mrittiga M'}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {userProfile?.email || 'mrittigam@gmail.com'}
              </div>
            </div>
          </div>

          <button 
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
