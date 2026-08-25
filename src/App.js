import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import FormBuilderCanvasPage from './pages/FormBuilderCanvasPage';
import TemplatesPage from './pages/TemplatesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SubmissionsPage from './pages/SubmissionsPage';
import AIFormFillerPage from './pages/AIFormFillerPage';
import AdvancedAIFeaturesPage from './pages/AdvancedAIFeaturesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import PublicFormViewPage from './pages/PublicFormViewPage';
import WelcomeModal from './components/WelcomeModal';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('smartform_theme') || 'dark');
  
  // Track login state globally
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('smartform_is_logged_in') === 'true';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartform_auth_user');
    return saved ? JSON.parse(saved) : { name: 'Mrittiga Mohanraj', email: 'mrittiga@example.com', avatarUrl: '' };
  });

  const location = useLocation();

  // Listen for storage changes or updates to sync header & sidebar instantly
  useEffect(() => {
    const checkAuth = () => {
      const logged = localStorage.getItem('smartform_is_logged_in') === 'true';
      setIsLoggedIn(logged);
      const savedUser = localStorage.getItem('smartform_auth_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    };
    window.addEventListener('storage', checkAuth);
    const interval = setInterval(checkAuth, 500); // Poll for local state sync
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('smartform_theme', theme);
  }, [theme]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('smartform_seen_tour');
    if (!hasSeenTour && isLoggedIn) {
      setShowWelcome(true);
    }
  }, [isLoggedIn]);

  const handleCloseWelcome = () => {
    localStorage.setItem('smartform_seen_tour', 'true');
    setShowWelcome(false);
  };

  const handleSignOut = () => {
    localStorage.setItem('smartform_is_logged_in', 'false');
    setIsLoggedIn(false);
    setSidebarOpen(false);
    window.location.href = '/profile';
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const headerBg = isDark ? '#1e293b' : '#ffffff';
  const borderColor = isDark ? '#334155' : '#cbd5e1';

  const navItems = [
    { path: '/', label: '📊 Dashboard' },
    { path: '/builder', label: '🛠️ Form Builder' },
    { path: '/templates', label: '📑 Templates' },
    { path: '/analytics', label: '📈 Analytics' },
    { path: '/submissions', label: '📥 Submissions' },
    { path: '/ai-filler', label: '🤖 AI Form Filler' },
    { path: '/ai-features', label: '⚡ Advanced AI' },
    { path: '/profile', label: '👤 Profile & Auth' },
    { path: '/settings', label: '⚙️ Settings' }
  ];

  // If user is not logged in, enforce redirect or render ProfilePage directly as entry gate
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px' }}>
        <ProfilePage theme={theme} onLoginSuccess={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, fontFamily: 'system-ui, -apple-system, sans-serif', transition: 'background-color 0.2s ease' }}>
      {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}

      {/* Header with Branding & Dynamic Profile Avatar Badge */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        backgroundColor: headerBg,
        borderBottom: `1px solid ${borderColor}`,
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: `1px solid ${borderColor}`,
              color: textColor,
              fontSize: '20px',
              padding: '6px 10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#6366f1' }}>
            ⚡ SmartForm AI
          </span>
        </div>

        {/* Header Profile Initial / Photo Badge */}
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#6366f1',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '2px solid #818cf8',
            cursor: 'pointer'
          }}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user?.name ? user.name.charAt(0).toUpperCase() : 'U'
            )}
          </div>
        </Link>
      </header>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 49 }}
        />
      )}

      {/* Sidebar with Profile Footer & Logout Button at Bottom */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? 0 : '-280px',
        width: '260px',
        height: '100%',
        backgroundColor: isDark ? '#020617' : '#ffffff',
        borderRight: `1px solid ${borderColor}`,
        zIndex: 50,
        transition: 'left 0.25s ease',
        padding: '20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto'
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#6366f1' }}>Navigation</span>
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: textColor, fontSize: '20px', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    backgroundColor: active ? '#6366f1' : 'transparent',
                    color: active ? '#ffffff' : textColor,
                    textDecoration: 'none',
                    fontWeight: active ? '700' : '500',
                    fontSize: '14px'
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer: Profile Widget & Logout Button */}
        <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '16px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#6366f1',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            🔒 Sign Out
          </button>
        </div>
      </aside>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/builder" element={<FormBuilderCanvasPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
          <Route path="/ai-filler" element={<AIFormFillerPage />} />
          <Route path="/ai-features" element={<AdvancedAIFeaturesPage />} />
          <Route path="/profile" element={<ProfilePage theme={theme} />} />
          <Route path="/settings" element={<SettingsPage theme={theme} setTheme={setTheme} />} />
          <Route path="/view/:formId" element={<PublicFormViewPage />} />
        </Routes>
      </main>
    </div>
  );
}
