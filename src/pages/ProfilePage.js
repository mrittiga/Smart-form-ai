import React, { useState } from 'react';

export default function ProfilePage({ theme, onLoginSuccess }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartform_auth_user');
    return saved ? JSON.parse(saved) : { name: 'Mrittiga Mohanraj', email: 'mrittiga@example.com', role: 'AI / ML & Full Stack Developer', avatarUrl: '' };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('smartform_is_logged_in') === 'true';
  });

  const [authMode, setAuthMode] = useState('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  
  const [fullName, setFullName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role || 'Full Stack & AI Developer');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [toast, setToast] = useState('');

  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const subText = isDark ? '#94a3b8' : '#64748b';

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = { name: fullName, email, role, avatarUrl };
    setUser(updated);
    localStorage.setItem('smartform_auth_user', JSON.stringify(updated));
    showToast('✨ Profile details & avatar updated successfully!');
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !passwordInput || (authMode === 'signup' && !nameInput)) {
      alert('Please fill in all required fields.');
      return;
    }

    const newUser = {
      name: authMode === 'signup' ? nameInput : (emailInput.split('@')[0] || 'User'),
      email: emailInput,
      role: 'Full Stack & AI Developer',
      avatarUrl: ''
    };

    setUser(newUser);
    setFullName(newUser.name);
    setEmail(newUser.email);

    localStorage.setItem('smartform_auth_user', JSON.stringify(newUser));
    localStorage.setItem('smartform_is_logged_in', 'true');
    setIsLoggedIn(true);

    if (onLoginSuccess) onLoginSuccess();
    window.location.href = '/';
  };

  const handleSignOut = () => {
    localStorage.setItem('smartform_is_logged_in', 'false');
    setIsLoggedIn(false);
    window.location.href = '/profile';
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: '420px', margin: '40px auto', color: textColor }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0 }}>⚡ SmartForm AI</h1>
          <p style={{ color: subText, fontSize: '14px', marginTop: '6px' }}>
            {authMode === 'login' ? 'Please sign in to access your dashboard' : 'Create your account to get started'}
          </p>
        </div>

        <div style={{ backgroundColor: cardBg, padding: '28px', borderRadius: '16px', border: `1px solid ${cardBorder}` }}>
          <div style={{ display: 'flex', marginBottom: '20px', backgroundColor: isDark ? '#0f172a' : '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: authMode === 'login' ? '#6366f1' : 'transparent',
                color: authMode === 'login' ? '#fff' : subText,
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: authMode === 'signup' ? '#6366f1' : 'transparent',
                color: authMode === 'signup' ? '#fff' : subText,
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {authMode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: subText, marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Mrittiga Mohanraj"
                  style={{ width: '100%', padding: '12px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${cardBorder}`, borderRadius: '8px', color: textColor, boxSizing: 'border-box' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: subText, marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@company.com"
                style={{ width: '100%', padding: '12px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${cardBorder}`, borderRadius: '8px', color: textColor, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: subText, marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${cardBorder}`, borderRadius: '8px', color: textColor, boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#6366f1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              {authMode === 'login' ? 'Sign In to Workspace 🚀' : 'Create Account & Start ⚡'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', color: textColor }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>👤 User Profile & Credentials</h1>
          <p style={{ color: subText, fontSize: '14px', marginTop: '4px', margin: 0 }}>
            Manage your account identity, profile photo, and session.
          </p>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            padding: '8px 14px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          🔒 Sign Out
        </button>
      </div>

      {toast && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#34d399',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'start' }}>
        <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${cardBorder}`, textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#6366f1',
            color: '#fff',
            fontSize: '32px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            overflow: 'hidden',
            border: '2px solid #818cf8',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              fullName ? fullName.charAt(0).toUpperCase() : 'U'
            )}
          </div>

          <label style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#334155', color: '#fff', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}>
            📷 Upload Photo
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>

          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{fullName}</h3>
          <p style={{ color: subText, fontSize: '12px', margin: '0 0 16px 0' }}>{email}</p>
          <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
            Verified Creator 🌟
          </div>
        </div>

        <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${cardBorder}` }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Edit Personal Details</h3>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: subText, marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${cardBorder}`, borderRadius: '8px', color: textColor, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: subText, marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${cardBorder}`, borderRadius: '8px', color: textColor, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: subText, marginBottom: '6px' }}>Primary Role / Specialization</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${cardBorder}`, borderRadius: '8px', color: textColor, boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '10px 18px',
                backgroundColor: '#6366f1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                alignSelf: 'flex-start'
              }}
            >
              Save Profile Changes 💾
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
