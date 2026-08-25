import React, { useState } from 'react';

export default function FormBuilderCanvasPage({ theme }) {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('builder'); 
  const [selectedFieldId, setSelectedFieldId] = useState(1);
  const [submittedData, setSubmittedData] = useState(null);

  const [formFields, setFormFields] = useState([
    { id: 1, type: 'text', label: 'Full Name', placeholder: 'Enter your name...', required: true },
    { id: 2, type: 'email', label: 'Email Address', placeholder: 'name@domain.com', required: true },
    { id: 3, type: 'select', label: 'Role', options: ['Developer', 'Designer', 'Manager'], required: false },
    { id: 4, type: 'textarea', label: 'Notes', placeholder: 'Additional info...', required: false }
  ]);

  const [formInputs, setFormInputs] = useState({});

  const activeField = formFields.find(f => f.id === selectedFieldId);

  const updateSelectedField = (key, value) => {
    setFormFields(prev =>
      prev.map(f => (f.id === selectedFieldId ? { ...f, [key]: value } : f))
    );
  };

  const addField = (type) => {
    const newId = Date.now();
    const newField = {
      id: newId,
      type,
      label: `New ${type.toUpperCase()} Field`,
      placeholder: 'Enter text here...',
      required: false,
      options: type === 'select' ? ['Option 1', 'Option 2'] : []
    };
    setFormFields([...formFields, newField]);
    setSelectedFieldId(newId);
  };

  const removeField = (id, e) => {
    e.stopPropagation();
    const updated = formFields.filter(f => f.id !== id);
    setFormFields(updated);
    if (selectedFieldId === id && updated.length > 0) {
      setSelectedFieldId(updated[0].id);
    }
  };

  const handleInputChange = (fieldId, val) => {
    setFormInputs(prev => ({ ...prev, [fieldId]: val }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formInputs);
  };

  const colors = {
    cardBg: isDark ? '#1e293b' : '#ffffff',
    cardBorder: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
    inputBg: isDark ? '#0f172a' : '#f8fafc',
    inputBorder: isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1',
    textPrimary: isDark ? '#f8fafc' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    selectedBg: isDark ? '#1e1b4b' : '#eef2ff',
    selectedBorder: '#6366f1',
    subtleBg: isDark ? '#334155' : '#e2e8f0'
  };

  const cardStyle = {
    background: colors.cardBg,
    border: colors.cardBorder,
    borderRadius: '14px',
    padding: '24px',
    boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    background: colors.inputBg,
    border: colors.inputBorder,
    borderRadius: '8px',
    color: colors.textPrimary,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '90px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0', color: colors.textPrimary }}>
          🛠️ Interactive Form Canvas
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: colors.textSecondary }}>
          {activeTab === 'builder' && 'Add elements and edit form rules.'}
          {activeTab === 'preview' && 'Fill out and test your live end-user form.'}
          {activeTab === 'share' && 'Export live URLs and embed codes.'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ background: colors.subtleBg, padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px', marginBottom: '24px' }}>
        {['builder', 'preview', 'share'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab ? '#6366f1' : 'transparent',
              color: activeTab === tab ? '#ffffff' : colors.textSecondary,
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'builder' && '🏗️ Builder'}
            {tab === 'preview' && '👁️ Preview'}
            {tab === 'share' && '🚀 Share'}
          </button>
        ))}
      </div>

      {/* BUILDER MODE */}
      {activeTab === 'builder' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={cardStyle}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: colors.textSecondary, display: 'block', marginBottom: '12px' }}>
              + ADD FIELD ELEMENTS
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
              {['text', 'email', 'select', 'textarea'].map(type => (
                <button
                  key={type}
                  onClick={() => addField(type)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: colors.inputBorder,
                    background: colors.cardBg,
                    color: colors.textPrimary,
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  + {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px 0', color: colors.textPrimary }}>
              Form Canvas (Tap to Edit)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {formFields.map(field => {
                const isSelected = field.id === selectedFieldId;
                return (
                  <div
                    key={field.id}
                    onClick={() => setSelectedFieldId(field.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: isSelected ? `2px solid ${colors.selectedBorder}` : colors.cardBorder,
                      background: isSelected ? colors.selectedBg : colors.cardBg,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: colors.textPrimary }}>
                        {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10px', background: colors.subtleBg, color: colors.textPrimary, padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                          {field.type.toUpperCase()}
                        </span>
                        <button
                          onClick={(e) => removeField(field.id, e)}
                          style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '15px', cursor: 'pointer' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: '12.5px', color: colors.textSecondary }}>
                      Placeholder: "{field.placeholder}"
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px 0', color: colors.textPrimary }}>
              ⚙️ Field Settings & Rules
            </h3>

            {activeField ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: colors.textSecondary }}>Label Title</label>
                  <input
                    type="text"
                    value={activeField.label}
                    onChange={(e) => updateSelectedField('label', e.target.value)}
                    style={{ ...inputStyle, marginTop: '6px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: colors.textSecondary }}>Placeholder Text</label>
                  <input
                    type="text"
                    value={activeField.placeholder || ''}
                    onChange={(e) => updateSelectedField('placeholder', e.target.value)}
                    style={{ ...inputStyle, marginTop: '6px' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="req-check"
                    checked={activeField.required}
                    onChange={(e) => updateSelectedField('required', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#6366f1' }}
                  />
                  <label htmlFor="req-check" style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary, cursor: 'pointer' }}>
                    Mark as Required Field
                  </label>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: colors.textSecondary, textAlign: 'center', padding: '16px' }}>
                Select a field above to edit properties.
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('preview')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: '#6366f1',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Go to Preview & Test Form ➔
          </button>

        </div>
      )}

      {/* PREVIEW MODE */}
      {activeTab === 'preview' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: colors.cardBorder, paddingBottom: '12px' }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary }}>
              📋 Live Interactive Form
            </span>
            <span style={{ fontSize: '11px', background: '#10b981', color: '#ffffff', padding: '3px 10px', borderRadius: '12px', fontWeight: '800' }}>
              PREVIEW MODE
            </span>
          </div>

          {submittedData ? (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
              <h3 style={{ color: colors.textPrimary, margin: '0 0 8px 0' }}>Form Submitted!</h3>
              <pre style={{ textAlign: 'left', background: colors.inputBg, padding: '16px', borderRadius: '8px', border: colors.inputBorder, color: colors.textPrimary, fontSize: '13px', overflowX: 'auto' }}>
                {JSON.stringify(submittedData, null, 2)}
              </pre>
              <button
                onClick={() => setSubmittedData(null)}
                style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}
              >
                Reset Form
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {formFields.map(field => (
                <div key={field.id}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: colors.textPrimary }}>
                    {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      required={field.required}
                      placeholder={field.placeholder}
                      rows={4}
                      value={formInputs[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      required={field.required}
                      value={formInputs[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">Select an option...</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formInputs[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#6366f1',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '15px',
                  marginTop: '10px',
                  cursor: 'pointer'
                }}
              >
                Submit Form Data
              </button>
            </form>
          )}
        </div>
      )}

      {/* SHARE MODE */}
      {activeTab === 'share' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px 0', color: colors.textPrimary }}>
              🔗 Live Link Sharing
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" readOnly value="http://localhost:3000/form-preview" style={{ ...inputStyle, flex: 1 }} />
              <button 
                onClick={() => alert('Link copied!')} 
                style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
