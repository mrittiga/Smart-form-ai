import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useForms } from '../context/FormContext.js';

export default function FormBuilder({ onBack }) {
  const { addForm } = useForms();
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState([
    { id: 1, label: 'Full Name', type: 'text', required: true },
    { id: 2, label: 'Email Address', type: 'email', required: true }
  ]);

  const addField = (type) => {
    setFields([...fields, { id: Date.now(), label: `New ${type} field`, type, required: false }]);
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleSave = () => {
    addForm({ title: formTitle, description: formDescription, fields });
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#180814] text-pink-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-pink-950/60">
        <button onClick={onBack} className="flex items-center space-x-2 text-pink-300 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button 
          onClick={handleSave}
          className="flex items-center space-x-2 px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-pink-600/30 transition"
        >
          <Save className="w-4 h-4" />
          <span>Save Form</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-[#291024] border border-pink-950/70 p-6 rounded-2xl">
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold text-white outline-none border-b border-transparent focus:border-pink-500 pb-1 mb-3"
            />
            <input
              type="text"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full bg-transparent text-sm text-pink-300/70 outline-none border-b border-transparent focus:border-pink-500 pb-1"
              placeholder="Form Description (optional)"
            />
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="bg-[#291024] border border-pink-950/70 p-5 rounded-2xl flex items-center justify-between">
              <div className="flex-1 mr-4">
                <label className="text-xs text-pink-400 font-semibold block mb-1">
                  Field {index + 1} ({field.type})
                </label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    setFields(fields.map(f => f.id === field.id ? { ...f, label } : f));
                  }}
                  className="w-full bg-[#180814] text-sm text-white px-3 py-2 rounded-lg border border-pink-950 outline-none focus:border-pink-500"
                />
              </div>
              <button onClick={() => removeField(field.id)} className="text-pink-400/60 hover:text-red-400 p-2">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-[#291024] border border-pink-950/70 p-5 rounded-2xl">
            <h3 className="text-sm font-semibold text-white mb-4">Add Elements</h3>
            <div className="space-y-2">
              {['Text', 'TextArea', 'Email', 'Radio', 'Checkbox'].map((type) => (
                <button
                  key={type}
                  onClick={() => addField(type.toLowerCase())}
                  className="w-full flex items-center justify-between p-3 bg-[#180814] hover:bg-pink-950/40 text-pink-200 rounded-xl text-sm border border-pink-950 transition"
                >
                  <span>{type}</span>
                  <Plus className="w-4 h-4 text-pink-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
