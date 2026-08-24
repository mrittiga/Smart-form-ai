import React, { useState } from 'react';
import Layout from '../components/Layout.js';
import { FileText, Plus, Trash2, Eye, X, Send } from 'lucide-react';
import { useForms } from '../context/FormContext.js';

export default function Forms({ onNavigate, onCreateForm }) {
  const { forms, deleteForm, addSubmission } = useForms();
  const [activeFormModal, setActiveFormModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleInputChange = (label, value) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeFormModal) return;
    addSubmission(activeFormModal.id, activeFormModal.title, formData);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setActiveFormModal(null);
      setFormData({});
    }, 1500);
  };

  return (
    <Layout currentPath="/forms" onNavigate={onNavigate} onCreateForm={onCreateForm}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Forms</h1>
          <p className="text-xs text-pink-300/70">Build, preview, test submit, and manage your forms</p>
        </div>

        <button 
          onClick={onCreateForm}
          className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-pink-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Form</span>
        </button>
      </div>

      {forms.length === 0 ? (
        <div className="bg-[#291024] border border-dashed border-pink-800/40 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-pink-950/80 text-pink-400 flex items-center justify-center mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">No forms created yet</h3>
          <p className="text-xs text-pink-300/70 mb-6 max-w-sm">
            Get started by creating your first form to collect submissions and track insights.
          </p>
          <button 
            onClick={onCreateForm}
            className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Build Your First Form</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {forms.map((form) => (
            <div key={form.id} className="bg-[#291024] border border-pink-950/70 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-sm">{form.title}</h3>
                <p className="text-xs text-pink-300/70">{form.description || 'No description'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    setActiveFormModal(form);
                    setFormData({});
                  }}
                  className="flex items-center space-x-1 text-xs bg-pink-950/80 hover:bg-pink-900/60 text-pink-300 px-3 py-1.5 rounded-lg border border-pink-800/40 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview & Fill</span>
                </button>
                <button 
                  onClick={() => deleteForm(form.id)}
                  className="text-pink-400/60 hover:text-red-400 p-2 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Submission Modal */}
      {activeFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#250d20] border border-pink-900/60 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setActiveFormModal(null)}
              className="absolute top-4 right-4 text-pink-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedMessage ? (
              <div className="py-8 text-center text-pink-300">
                <p className="text-lg font-bold text-white mb-2">Submission Successful!</p>
                <p className="text-xs">Your data has been sent to the Submissions database.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{activeFormModal.title}</h2>
                  <p className="text-xs text-pink-300/70">{activeFormModal.description}</p>
                </div>

                <div className="space-y-3">
                  {activeFormModal.fields?.map((field) => (
                    <div key={field.id}>
                      <label className="text-xs font-semibold text-pink-200 block mb-1">
                        {field.label} {field.required && <span className="text-pink-500">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          required={field.required}
                          onChange={(e) => handleInputChange(field.label, e.target.value)}
                          className="w-full bg-[#180814] text-sm text-white p-2.5 rounded-xl border border-pink-950 focus:border-pink-500 outline-none"
                          rows={3}
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          required={field.required}
                          onChange={(e) => handleInputChange(field.label, e.target.value)}
                          className="w-full bg-[#180814] text-sm text-white p-2.5 rounded-xl border border-pink-950 focus:border-pink-500 outline-none"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-pink-600/30 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Form</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
