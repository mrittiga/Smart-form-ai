import React, { useState } from 'react';
import { Bell, Shield, Palette } from 'lucide-react';

const SettingsPage = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>Customize application preferences</p>
      </div>

      <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <div style={{ padding: '8px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Bell size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Notifications</h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px' }}>Email Notifications</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Receive activity updates via email</div>
          </div>
          <input
            type="checkbox"
            checked={emailNotifs}
            onChange={(e) => setEmailNotifs(e.target.checked)}
            style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </div>

        <hr style={{ borderColor: 'var(--glass-border)', borderStyle: 'solid', borderWidth: '1px 0 0 0', margin: '4px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px' }}>Push Notifications</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Receive desktop alerts</div>
          </div>
          <input
            type="checkbox"
            checked={pushNotifs}
            onChange={(e) => setPushNotifs(e.target.checked)}
            style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
