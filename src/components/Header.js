import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header = () => {
  return (
    <header style={{
      padding: '24px 40px',
      display: 'flex',
      justify: 'space-between',
      alignItems: 'center'
    }}>
      <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', width: '300px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '14px',
            width: '100%'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="glass-card" style={{ padding: '10px', border: '1px solid var(--glass-border)', cursor: 'pointer', display: 'flex' }}>
          <Bell size={18} color="var(--text-primary)" />
        </button>
        <div className="glass-card" style={{ padding: '6px 14px 6px 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>
            M
          </div>
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>User</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
