import React from 'react';
import Layout from '../components/Layout.js';
import { FileText, Clock, TrendingUp, Plus } from 'lucide-react';
import { useForms } from '../context/FormContext.js';

export default function Dashboard({ onNavigate, onCreateForm }) {
  const { forms } = useForms();

  const cards = [
    { title: 'FORMS CREATED', value: forms.length.toString(), subtitle: '↑ +2 this week', icon: FileText },
    { title: 'SUBMISSIONS SENT', value: '0', subtitle: '↑ +5 this week', icon: Clock },
    { title: 'TIME SAVED', value: '0 min', subtitle: '↑ +30 min this week', icon: Clock },
    { title: 'ACTIVE FORMS', value: forms.length.toString(), subtitle: '↓ 2 awaiting responses', icon: TrendingUp }
  ];

  return (
    <Layout currentPath="/dashboard" onNavigate={onNavigate} onCreateForm={onCreateForm}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-pink-100 text-lg font-semibold">Welcome back, Mrittiga M!</h1>
          <p className="text-sm text-pink-300/70">Here's your form activity.</p>
        </div>

        <button 
          onClick={onCreateForm}
          className="flex items-center justify-center space-x-2 bg-pink-600 hover:bg-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-pink-600/30 transition border border-pink-400/20"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Form</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-[#291024] border border-pink-950/70 p-5 rounded-2xl flex flex-col justify-between h-44 shadow-lg shadow-pink-950/20">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold tracking-wider text-pink-200/80 max-w-[70%]">
                  {card.title}
                </span>
                <Icon className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-white mb-2">{card.value}</p>
                <p className="text-xs text-pink-300/60 whitespace-pre-line leading-relaxed">
                  {card.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
