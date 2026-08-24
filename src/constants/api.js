/**
 * API Endpoints Configuration
 * Centralized API endpoint definitions
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // Users
  USER: {
    PROFILE: '/users/me',
    UPDATE_PROFILE: '/users/me',
    SETTINGS: '/users/settings',
    UPDATE_SETTINGS: '/users/settings',
    VERIFY_EMAIL: '/users/verify-email',
    RESET_PASSWORD: '/users/reset-password',
  },

  // Forms
  FORMS: {
    LIST: '/forms',
    CREATE: '/forms',
    GET: (id) => `/forms/${id}`,
    UPDATE: (id) => `/forms/${id}`,
    DELETE: (id) => `/forms/${id}`,
    DUPLICATE: (id) => `/forms/${id}/duplicate`,
    PUBLISH: (id) => `/forms/${id}/publish`,
    UNPUBLISH: (id) => `/forms/${id}/unpublish`,
  },

  // Form Fields
  FIELDS: {
    LIST: (formId) => `/forms/${formId}/fields`,
    CREATE: (formId) => `/forms/${formId}/fields`,
    GET: (formId, fieldId) => `/forms/${formId}/fields/${fieldId}`,
    UPDATE: (formId, fieldId) => `/forms/${formId}/fields/${fieldId}`,
    DELETE: (formId, fieldId) => `/forms/${formId}/fields/${fieldId}`,
  },

  // Submissions
  SUBMISSIONS: {
    LIST: '/submissions',
    CREATE: (formId) => `/forms/${formId}/submit`,
    GET: (id) => `/submissions/${id}`,
    UPDATE: (id) => `/submissions/${id}`,
    DELETE: (id) => `/submissions/${id}`,
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    FORMS_COMPLETED: '/analytics/forms-completed',
    TIME_SAVED: '/analytics/time-saved',
    USAGE: '/analytics/usage',
    EXPORT: '/analytics/export',
  },

  // AI Features
  AI: {
    SUGGESTIONS: '/ai/suggestions',
    FILL_FORM: '/ai/fill-form',
    GENERATE_CONTENT: '/ai/generate-content',
    VOICE_TRANSCRIBE: '/ai/voice-transcribe',
    TEXT_TO_SPEECH: '/ai/text-to-speech',
  },

  // Health
  HEALTH: {
    CHECK: '/health',
    STATUS: '/',
  },
};

// API Request Timeouts
export const API_TIMEOUTS = {
  SHORT: 5000,      // 5 seconds
  NORMAL: 30000,    // 30 seconds
  LONG: 60000,      // 60 seconds
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You need to log in again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  FORM_CREATED: 'Form created successfully!',
  FORM_UPDATED: 'Form updated successfully!',
  FORM_DELETED: 'Form deleted successfully!',
  SUBMISSION_SENT: 'Submission sent successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  API_TIMEOUTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  getApiUrl,
};
