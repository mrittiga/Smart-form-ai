import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TemplatesPage({ colors, theme }) {
  const navigate = useNavigate();

  const templates = [
    {id:1,name:'Contact Form',desc:'Collect contact information',icon:'📧',fields:['Name','Email','Phone','Message']},
    {id:2,name:'Job Application',desc:'Hiring and recruitment',icon:'💼',fields:['Full Name','Email','Phone','Resume','Experience']},
    {id:3,name:'Customer Survey',desc:'Gather feedback',icon:'📊',fields:['Name','Rating','Feedback','Recommend']},
    {id:4,name:'Registration Form',desc:'User signup',icon:'📝',fields:['Username','Email','Password','Confirm Password']},
    {id:5,name:'Event Registration',desc:'Event attendance',icon:'🎫',fields:['Name','Email','Number of Guests','Dietary Needs']},
    {id:6,name:'Bug Report',desc:'Report technical issues',icon:'🐛',fields:['Title','Description','Steps to Reproduce','Expected vs Actual']},
    {id:7,name:'Feedback Form',desc:'Product feedback',icon:'💬',fields:['Name','Email','Feedback','Rating']},
    {id:8,name:'Lead Capture',desc:'Sales lead generation',icon:'🎯',fields:['Company','Contact Name','Email','Phone','Industry']},
    {id:9,name:'Support Ticket',desc:'Technical support',icon:'🆘',fields:['Ticket ID','Issue','Urgency','Attachment']},
    {id:10,name:'Appointment Booking',desc:'Schedule appointments',icon:'📅',fields:['Name','Email','Date','Time','Service']},
    {id:11,name:'Newsletter Signup',desc:'Email subscriptions',icon:'📬',fields:['Email','First Name','Last Name','Interests']},
    {id:12,name:'Course Enrollment',desc:'Course registration',icon:'🎓',fields:['Name','Email','Course','Experience Level']}
  ];

  const handleSelectTemplate = (template) => {
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    navigate('/form-builder');
  };

  return (
    <div style={{padding:'40px',background:theme==='dark'?'linear-gradient(135deg,#0f172a 0%,#1e293b 50%)':'linear-gradient(135deg,#f9fafb 0%,#f3f4f6 50%)',minHeight:'100vh',color:colors?.text || '#fff'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <h1 style={{color:colors?.primary || '#6366f1',marginBottom:'10px'}}>📋 Form Templates</h1>
        <p style={{color:colors?.textSecondary || '#ccc',marginBottom:'40px'}}>Choose from 12+ pre-built templates or create from scratch</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'20px'}}>
          {templates.map(template=>(
            <div key={template.id} style={{background:colors?.glass || 'rgba(255,255,255,0.1)',border:`1px solid ${colors?.border || '#333'}`,borderRadius:'12px',padding:'25px',textAlign:'center',cursor:'pointer'}}>
              <div style={{fontSize:'40px',marginBottom:'15px'}}>{template.icon}</div>
              <h3 style={{color:colors?.text || '#fff',marginBottom:'8px'}}>{template.name}</h3>
              <p style={{color:colors?.textTertiary || '#aaa',marginBottom:'15px',fontSize:'13px'}}>{template.desc}</p>
              <div style={{marginBottom:'15px',minHeight:'40px'}}>
                {template.fields.map((field,idx)=>(
                  <span key={idx} style={{display:'inline-block',background:colors?.primary || '#6366f1',color:'white',padding:'3px 8px',marginRight:'5px',marginBottom:'5px',borderRadius:'4px',fontSize:'11px'}}>{field}</span>
                ))}
              </div>
              <button onClick={()=>handleSelectTemplate(template)} style={{width:'100%',padding:'10px',background:colors?.primary || '#6366f1',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'600',fontSize:'14px'}}>Use Template</button>
            </div>
          ))}
        </div>

        <div style={{marginTop:'40px',textAlign:'center'}}>
          <button onClick={()=>navigate('/form-builder')} style={{padding:'12px 30px',background:'#10b981',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'600'}}>+ Create Blank Form</button>
        </div>
      </div>
    </div>
  );
}
