import React, { useState } from 'react';

export default function AIFormFillerPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedFields, setGeneratedFields] = useState(null);

  const handleGenerateAIForm = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setSuccessMessage('');

    // Simulate AI processing delay for realistic feedback
    setTimeout(() => {
      setLoading(false);
      setGeneratedFields([
        { label: 'Full Name', type: 'text', placeholder: 'Enter full name' },
        { label: 'Work Email', type: 'email', placeholder: 'name@company.com' },
        { label: 'Project Description', type: 'textarea', placeholder: 'Describe your project...' },
        { label: 'Preferred Tech Stack', type: 'select', options: ['React & Node.js', 'Python & FastAPI', 'Java Spring Boot'] }
      ]);
      setSuccessMessage('✨ AI form successfully generated and ready for deployment!');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', color: '#f8fafc' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>🤖 AI Form Filler & Generator</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px', margin: 0 }}>
          Prompt the engine to instantly scaffold interactive form schemas and auto-populate fields.
        </p>
      </div>

      {successMessage && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#34d399',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✅</span> {successMessage}
        </div>
      )}

      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '24px' }}>
        <form onSubmit={handleGenerateAIForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Describe the form you want to create
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a developer hiring application form with tech stack selection and GitHub profile link..."
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: '#0f172a',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: loading ? '#475569' : '#6366f1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                Generating AI Schema...
              </>
            ) : (
              <>Generate with AI ⚡</>
            )}
          </button>
        </form>
      </div>

      {generatedFields && (
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#f8fafc' }}>Generated Form Preview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {generatedFields.map((field, idx) => (
              <div key={idx}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }}>
                    {field.options.map((opt, i) => <option key={i}>{opt}</option>)}
                  </select>
                ) : (
                  <input type={field.type} placeholder={field.placeholder} style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
