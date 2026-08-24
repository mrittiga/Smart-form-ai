import React, { useState } from 'react';
import Layout from '../components/Layout.js';
import { Download, Inbox } from 'lucide-react';
import { useForms } from '../context/FormContext.js';

export default function Submissions({ onNavigate, onCreateForm }) {
  const { submissions } = useForms();
  const [filter, setFilter] = useState('All');

  const filteredSubmissions = filter === 'All' 
    ? submissions 
    : submissions.filter(sub => sub.status === filter);

  const handleExport = () => {
    if (submissions.length === 0) return alert('No submission data to export.');
    
    const headers = ['Submission ID', 'Form Title', 'Status', 'Submitted At', 'Data'];
    const rows = submissions.map(s => [
      s.id,
      `"${s.formTitle}"`,
      s.status,
      `"${s.submittedAt}"`,
      `"${JSON.stringify(s.data).replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout currentPath="/submissions" onNavigate={onNavigate} onCreateForm={onCreateForm}>
      <h1 className="text-pink-100 text-lg font-medium mb-6">Track and manage all form submissions</h1>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#291024] border border-pink-950/70 p-4 rounded-2xl">
          <p className="text-xs font-semibold text-pink-200/80 mb-1">Total Submissions</p>
          <p className="text-2xl font-bold text-pink-400">{submissions.length}</p>
        </div>

        <div className="bg-[#291024] border border-pink-950/70 p-4 rounded-2xl">
          <p className="text-xs font-semibold text-pink-200/80 mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-pink-400">{submissions.length > 0 ? '100%' : '0%'}</p>
        </div>

        <div className="bg-[#291024] border border-pink-950/70 p-4 rounded-2xl">
          <p className="text-xs font-semibold text-pink-200/80 mb-1">Avg. Time</p>
          <p className="text-2xl font-bold text-pink-400">{submissions.length > 0 ? '45s' : '0s'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-pink-950/60 pb-3 mb-4">
        <div className="flex space-x-6">
          {['All', 'Submitted', 'Draft'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-sm font-medium transition ${
                filter === tab ? 'text-white border-b-2 border-pink-500 pb-1' : 'text-pink-300/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button 
          onClick={handleExport}
          className="flex items-center space-x-2 px-3 py-1.5 bg-[#291024] hover:bg-[#35152f] text-pink-300 rounded-xl border border-pink-500/30 text-xs font-medium transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="bg-[#291024] border border-pink-950/70 rounded-2xl p-8 flex flex-col items-center text-center">
          <Inbox className="w-8 h-8 text-pink-400/60 mb-2" />
          <p className="text-sm text-white font-medium">No submissions found</p>
          <p className="text-xs text-pink-300/60">Fill out a form from the Forms tab to generate data.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubmissions.map((sub) => (
            <div key={sub.id} className="bg-[#291024] border border-pink-950/70 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs text-pink-300/60">
                <span className="font-semibold text-pink-300">{sub.formTitle}</span>
                <span>{sub.submittedAt}</span>
              </div>
              <div className="bg-[#180814] p-3 rounded-lg text-xs space-y-1">
                {Object.entries(sub.data).map(([k, v]) => (
                  <p key={k} className="text-pink-200">
                    <strong className="text-pink-400">{k}:</strong> {v || '—'}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
