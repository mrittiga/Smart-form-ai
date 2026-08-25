import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children, theme, toggleTheme, setTheme, colors }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleThemeToggle = () => {
    if (typeof toggleTheme === 'function') {
      toggleTheme();
    } else if (typeof setTheme === 'function') {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Forms', path: '/form-builder', icon: '📝' },
    { name: 'Templates', path: '/templates', icon: '📋' },
    { name: 'Submissions', path: '/submissions', icon: '📥' },
    { name: 'Analytics', path: '/analytics', icon: '📈' },
    { name: 'Profile', path: '/profile', icon: '👤' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div style={{ background: colors.bgPrimary, minHeight: '100vh', color: colors.text, fontFamily: 'sans-serif' }}>
      {/* Top Bar */}
      <div style={{ height: '60px', background: colors.bgSecondary, borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: colors.text, fontSize: '24px', cursor: 'pointer' }}>☰</button>
          <h2 style={{ fontSize: '18px', margin: 0, color: colors.primary, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>SmartForm AI</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={handleThemeToggle} style={{ background: colors.glass, border: `1px solid ${colors.border}`, color: colors.text, borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' }}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>M</div>
        </div>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
      )}

      {/* Sidebar Drawer */}
      <div style={{ position: 'fixed', top: 0, left: sidebarOpen ? 0 : '-260px', width: '240px', height: '100%', background: colors.bgSecondary, borderRight: `1px solid ${colors.border}`, transition: 'left 0.3s ease', zIndex: 200, padding: '20px 10px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '0 10px' }}>
          <span style={{ fontWeight: 'bold', color: colors.primary }}>Navigation</span>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: colors.text, fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>
        {navItems.map(item => (
          <div key={item.path} onClick={() => { navigate(item.path); setSidebarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', marginBottom: '5px', background: location.pathname === item.path ? colors.primary : 'transparent', color: location.pathname === item.path ? '#fff' : colors.textSecondary }}>
            <span>{item.icon}</span>
            <span style={{ fontWeight: location.pathname === item.path ? '600' : '400' }}>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '25px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}
