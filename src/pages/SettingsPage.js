import React, { useState } from 'react';

export default function SettingsPage({ theme, setTheme }) {
  const [selectedModel, setSelectedModel] = useState('Gemini 1.5 Pro');
  const [autoSave, setAutoSave] = useState(true);
  const [heatmapTracking, setHeatmapTracking] = useState(true);
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

  const handleExportConfig = () => {
    const data = { theme, selectedModel, autoSave, heatmapTracking, exportedAt: new Date().toISOString() };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', 'smartform_settings.json');
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    showToast('📥 Settings configuration exported successfully!');
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear local storage cache?')) {
      localStorage.clear();
      showToast('🧹 Local cache cleared successfully.');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', color: textColor }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>⚙️ System Preferences</h1>
        <p style={{ color: subText, fontSize: '14px', marginTop: '4px', margin: 0 }}>
          Customize your appearance, AI engine preferences, and local storage state.
        </p>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Appearance & Theme Section */}
        <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${cardBorder}` }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: textColor }}>🎨 Appearance & Theme</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>Dark Mode Theme</div>
              <div style={{ fontSize: '12px', color: subText }}>Switch between high-contrast dark mode and clean light mode</div>
            </div>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              style={{
                padding: '8px 16px',
                backgroundColor: isDark ? '#6366f1' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {isDark ? '🌙 Dark Mode (Active)' : '☀️ Light Mode (Active)'}
            </button>
          </div>
        </div>

        {/* AI Engine Settings */}
        <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${cardBorder}` }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: textColor }}>🤖 AI Engine Configuration</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: subText, marginBottom: '6px' }}>
                Default AI Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  showToast(`Updated model to ${e.target.value}`);
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                  border: `1px solid ${cardBorder}`,
                  borderRadius: '8px',
                  color: textColor,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option>Gemini 1.5 Pro (Recommended)</option>
                <option>Gemini 1.5 Flash (Ultra Fast)</option>
                <option>OpenAI GPT-4o</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>Heatmap Interaction Tracking</div>
                <div style={{ fontSize: '12px', color: subText }}>Log field-level dwell time for analytics insights</div>
              </div>
              <input
                type="checkbox"
                checked={heatmapTracking}
                onChange={(e) => setHeatmapTracking(e.target.checked)}
                style={{ accentColor: '#6366f1', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>Auto-Save Drafts</div>
                <div style={{ fontSize: '12px', color: subText }}>Persist form edits instantly in browser cache</div>
              </div>
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                style={{ accentColor: '#6366f1', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Data & Backup Section */}
        <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${cardBorder}` }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: textColor }}>📦 Data & Local Storage</h3>
          <p style={{ color: subText, fontSize: '13px', marginBottom: '16px' }}>
            Manage your local-first environment data, backups, and app cache.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportConfig}
              style={{
                padding: '10px 18px',
                backgroundColor: '#334155',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              📥 Export Settings Backup
            </button>

            <button
              onClick={handleClearCache}
              style={{
                padding: '10px 18px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🗑️ Clear App Cache
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
