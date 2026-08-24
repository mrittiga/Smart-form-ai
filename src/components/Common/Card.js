export default function Card({ title, subtitle, children, actions }) {
  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '20px'
    }}>
      {(title || subtitle || actions) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
        }}>
          <div>
            {title && <h3 style={{ color: '#6366f1', margin: 0, marginBottom: '4px' }}>{title}</h3>}
            {subtitle && <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>{subtitle}</p>}
          </div>
          {actions && <div style={{ display: 'flex', gap: '8px' }}>{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
