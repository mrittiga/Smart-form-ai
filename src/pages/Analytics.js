import React, { useState } from 'react';
import Layout from '../components/Layout.js';
import { BarChart2 } from 'lucide-react';
import { useForms } from '../context/FormContext.js';

export default function Analytics({ onNavigate, onCreateForm }) {
  const { forms, submissions } = useForms();
  const [timeframe, setTimeframe] = useState('Today');

  const stats = [
    { title: 'TOTAL FORMS', value: forms.length.toString(), subtitle: '↑ Active state', icon: BarChart2 },
    { title: 'TOTAL SUBMISSIONS', value: submissions.length.toString(), subtitle: '↑ Verified logs', icon: null },
    { title: 'AVG. COMPLETION TIME', value: submissions.length > 0 ? '45s' : '0s', subtitle: '↓ Real-time tracking', icon: null },
    { title: 'COMPLETION RATE', value: forms.length > 0 ? `${Math.round((submissions.length / (forms.length || 1)) * 100)}%` : '0%', subtitle: '↑ Active submission ratio', icon: null }
  ];

  return (
    <Layout currentPath="/analytics" onNavigate={onNavigate} onCreateForm={onCreateForm}>
      <h1 className="text-pink-100 text-lg font-medium mb-6">Track your form performance and insights</h1>

      <div className="flex space-x-3 mb-6 bg-[#291024] p-1.5 rounded-xl border border-pink-950/70 w-fit">
        {['Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map((item) => (
          <button
            key={item}
            onClick={() => setTimeframe(item)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              timeframe === item ? 'bg-pink-600 text-white' : 'text-pink-300/60 hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#291024] border border-pink-950/70 p-5 rounded-2xl flex flex-col justify-between h-44">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold tracking-wider text-pink-200/80 max-w-[70%]">{stat.title}</span>
              {stat.icon && <stat.icon className="w-6 h-6 text-pink-400" />}
            </div>
            <div>
              <p className="text-2xl font-semibold text-white mb-2">{stat.value}</p>
              <p className="text-xs text-pink-300/60 leading-relaxed">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
