import api from './api';

const FORM_ENDPOINTS = {
  forms: '/forms',
  form: (id) => `/forms/${id}`,
  fields: (formId) => `/forms/${formId}/fields`,
  field: (formId, fieldId) => `/forms/${formId}/fields/${fieldId}`,
};

export const getForms = () => {
  return api.get(FORM_ENDPOINTS.forms);
};

export const createForm = (data) => {
  return api.post(FORM_ENDPOINTS.forms, data);
};

export const getForm = (id) => {
  return api.get(FORM_ENDPOINTS.form(id));
};

export const updateForm = (id, data) => {
  return api.put(FORM_ENDPOINTS.form(id), data);
};

export const deleteForm = (id) => {
  return api.delete(FORM_ENDPOINTS.form(id));
};

export const addField = (formId, data) => {
  return api.post(FORM_ENDPOINTS.fields(formId), data);
};

export const updateField = (formId, fieldId, data) => {
  return api.put(FORM_ENDPOINTS.field(formId, fieldId), data);
};

export const deleteField = (formId, fieldId) => {
  return api.delete(FORM_ENDPOINTS.field(formId, fieldId));
};
