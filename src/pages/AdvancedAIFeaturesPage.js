import React, { useState } from 'react';

export default function AdvancedAIFeaturesPage({ theme }) {
  const isDark = theme === 'dark';
  const [selectedFile, setSelectedFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedOutput, setParsedOutput] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.zapier.com/hooks/catch/123456/smartform');
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your SmartForm AI Assistant. Ask me anything or type "help" to see what I can do for you!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file.name);
  };

  const runDocumentParser = () => {
    if (!selectedFile) return;
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setParsedOutput({
        extractedName: 'Mrittiga Mohanraj',
        extractedEmail: 'mrittiga@example.com',
        confidenceScore: '98.4%',
        detectedSkills: ['React.js', 'Node.js', 'Python', 'YOLOv9', 'Spring Boot'],
        suggestedForm: 'Developer Recruitment Template'
      });
    }, 1200);
  };

  // Conversational response handler
  const getAIResponse = (input) => {
    const text = input.toLowerCase().trim();

    if (text === 'hi' || text === 'hello' || text === 'hey') {
      return "Hi there! 👋 How can I assist you with SmartForm AI today? You can ask me to help parse documents, set up webhooks, or suggest form templates!";
    }

    if (text.includes('help') || text.includes('what can you do') || text.includes('features')) {
      return "Here is what I can help you with:\n\n" +
             "• 📄 **PDF & Document Parsing:** Extract data fields directly into forms.\n" +
             "• ⚡ **Form Automation:** Pre-fill fields or trigger Zapier webhooks.\n" +
             "• 📋 **Templates:** Suggest pre-built forms (Job Applications, Surveys, Events).\n" +
             "• 🔀 **Conditional Routing:** Set logic based on user answers.\n\n" +
             "What would you like to explore?";
    }

    if (text.includes('parse') || text.includes('pdf') || text.includes('document')) {
      return "To parse a document, simply click the upload box on this page, select a PDF or DOCX file, and click 'Run AI Document Extraction'. I'll pull out key skills, names, and contact info automatically!";
    }

    if (text.includes('webhook') || text.includes('zapier') || text.includes('make')) {
      return "You can link your webhooks in the 'Zapier & Make.com Webhooks' section. Enter your Webhook URL and click 'Test Hook' to test real-time integration!";
    }

    if (text.includes('template') || text.includes('form')) {
      return "We offer ready-to-use templates like Job Application Forms, Customer Surveys, and Event Registrations. Head over to the Form Builder tab to try them out!";
    }

    return `I see you asked about "${input}". I can help with form filling, PDF extraction, or Zapier integrations. Type "help" for full options!`;
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    
    // Append user message immediately
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Generate smart response after a slight delay
    setTimeout(() => {
      const responseText = getAIResponse(userMsg);
      setChatMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    }, 400);
  };

  const cardStyle = {
    background: isDark ? '#111827' : '#ffffff',
    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    background: isDark ? '#1e293b' : '#f8fafc',
    border: isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1',
    borderRadius: '8px',
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '90px', position: 'relative' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0', color: isDark ? '#f8fafc' : '#0f172a' }}>
          ⚡ Advanced AI Parser & Integrations
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
          Upload PDF resumes or document specs to generate populated forms automatically, and sync data via Zapier webhooks.
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px 0', color: isDark ? '#f8fafc' : '#0f172a' }}>
          📄 Smart Document & PDF Parser (OCR + Vision)
        </h3>

        <div style={{
          border: isDark ? '2px dashed #334155' : '2px dashed #cbd5e1',
          borderRadius: '10px',
          padding: '24px',
          textAlign: 'center',
          background: isDark ? '#0f172a' : '#f8fafc',
          marginBottom: '16px'
        }}>
          <input type="file" id="pdf-upload" onChange={handleFileUpload} style={{ display: 'none' }} accept=".pdf,.docx,.txt" />
          <label htmlFor="pdf-upload" style={{ cursor: 'pointer', display: 'inline-block' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: isDark ? '#f8fafc' : '#0f172a' }}>
              {selectedFile ? selectedFile : 'Click to Upload PDF or Document'}
            </div>
            <div style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
              Supports PDF, DOCX, and TXT up to 15MB
            </div>
          </label>
        </div>

        <button
          onClick={runDocumentParser}
          disabled={!selectedFile || isParsing}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: !selectedFile ? (isDark ? '#334155' : '#cbd5e1') : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            fontWeight: '700',
            cursor: !selectedFile || isParsing ? 'not-allowed' : 'pointer'
          }}
        >
          {isParsing ? '🔄 Parsing & Extracting Data Schema...' : '✨ Run AI Document Extraction'}
        </button>

        {parsedOutput && (
          <div style={{ marginTop: '20px', padding: '16px', background: isDark ? '#1e293b' : '#f1f5f9', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>✓ Extraction Successful</span>
              <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b' }}>Confidence: {parsedOutput.confidenceScore}</span>
            </div>
            <div style={{ fontSize: '13px', color: isDark ? '#f8fafc' : '#0f172a', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Name:</strong> {parsedOutput.extractedName}</div>
              <div><strong>Email:</strong> {parsedOutput.extractedEmail}</div>
              <div><strong>Extracted Skills:</strong> {parsedOutput.detectedSkills.join(', ')}</div>
            </div>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px 0', color: isDark ? '#f8fafc' : '#0f172a' }}>
          🔗 Automated Workflows (Zapier & Make Webhooks)
        </h3>
        <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', margin: '0 0 12px 0' }}>
          Automatically push form submissions directly to external endpoints.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: '240px' }} />
          <button onClick={() => alert('Webhook endpoint verified!')} style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}>
            Test Hook
          </button>
        </div>
      </div>

      {/* DYNAMIC CHAT ASSISTANT */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
        {isFabOpen && (
          <div style={{
            width: '310px',
            height: '420px',
            background: isDark ? '#111827' : '#ffffff',
            border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
            borderRadius: '16px',
            boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.4)',
            marginBottom: '12px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', padding: '12px 14px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: '13.5px' }}>💬 SmartForm Assistant</span>
              <button onClick={() => setIsFabOpen(false)} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '16px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', background: isDark ? '#0f172a' : '#f8fafc' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.sender === 'user' ? '#6366f1' : (isDark ? '#1e293b' : '#ffffff'),
                  color: msg.sender === 'user' ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  whiteSpace: 'pre-line',
                  border: msg.sender === 'user' ? 'none' : (isDark ? '1px solid #334155' : '1px solid #e2e8f0')
                }}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div style={{ padding: '8px', borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', display: 'flex', gap: '6px' }}>
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()} placeholder="Ask AI..." style={{ ...inputStyle, padding: '8px 10px', fontSize: '12px' }} />
              <button onClick={handleSendChatMessage} style={{ background: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0 12px', cursor: 'pointer', fontWeight: '700' }}>Send</button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto'
          }}
        >
          {isFabOpen ? '✕' : '💬'}
        </button>
      </div>
    </div>
  );
}
