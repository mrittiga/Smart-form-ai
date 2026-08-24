import api from './api';

const SUBMISSION_ENDPOINTS = {
  submissions: '/submissions',
  submission: (id) => `/submissions/${id}`,
  submitForm: (formId) => `/forms/${formId}/submit`,
};

export const getSubmissions = () => {
  return api.get(SUBMISSION_ENDPOINTS.submissions);
};

export const submitForm = (formId, data) => {
  return api.post(SUBMISSION_ENDPOINTS.submitForm(formId), data);
};

export const getSubmission = (id) => {
  return api.get(SUBMISSION_ENDPOINTS.submission(id));
};

export const deleteSubmission = (id) => {
  return api.delete(SUBMISSION_ENDPOINTS.submission(id));
};
