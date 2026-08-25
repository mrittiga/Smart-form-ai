import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function PageWrapper({ children, theme, toggleTheme, userProfile, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#030712' : '#f8fafc',
      color: isDark ? '#f8fafc' : '#0f172a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Responsive Top Bar */}
      <header style={{
        height: '60px',
        background: isDark ? '#0b0f17' : '#ffffff',
        borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 900
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => setSidebarOpen(true)} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: isDark ? '#f8fafc' : '#0f172a', 
              fontSize: '24px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            ☰
          </button>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366f1' }}>SmartForm AI</span>
        </div>

        <button 
          onClick={toggleTheme} 
          style={{ 
            background: isDark ? '#1e293b' : '#f1f5f9', 
            border: 'none', 
            padding: '8px 14px', 
            borderRadius: '20px', 
            color: isDark ? '#f8fafc' : '#0f172a', 
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      {/* Slide-out Drawer */}
      <Sidebar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        userProfile={userProfile} 
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Body */}
      <main style={{ padding: '24px 16px', maxWidth: '100%', boxSizing: 'border-box' }}>
        {children}
      </main>
    </div>
  );
}
