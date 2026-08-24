import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [forms, setForms] = useState([
    {
      id: 1,
      title: 'Customer Feedback',
      description: 'Collect user thoughts on our service',
      createdAt: new Date(),
      fields: [
        { id: 101, label: 'Full Name', type: 'text', required: true },
        { id: 102, label: 'Email', type: 'email', required: true },
        { id: 103, label: 'Feedback', type: 'textarea', required: false }
      ]
    }
  ]);

  const [submissions, setSubmissions] = useState([
    {
      id: 1001,
      formId: 1,
      formTitle: 'Customer Feedback',
      submittedAt: new Date().toLocaleString(),
      status: 'Submitted',
      data: { 'Full Name': 'Alex Smith', 'Email': 'alex@example.com', 'Feedback': 'Great application flow!' }
    }
  ]);

  const addForm = (newForm) => {
    setForms((prev) => [...prev, { ...newForm, id: Date.now(), createdAt: new Date() }]);
  };

  const deleteForm = (id) => {
    setForms((prev) => prev.filter((form) => form.id !== id));
    setSubmissions((prev) => prev.filter((sub) => sub.formId !== id));
  };

  const addSubmission = (formId, formTitle, formData) => {
    const newSub = {
      id: Date.now(),
      formId,
      formTitle,
      submittedAt: new Date().toLocaleString(),
      status: 'Submitted',
      data: formData
    };
    setSubmissions((prev) => [newSub, ...prev]);
  };

  return (
    <FormContext.Provider value={{ forms, submissions, addForm, deleteForm, addSubmission }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForms = () => useContext(FormContext);
