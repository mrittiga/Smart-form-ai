/**
 * LocalStorage Utilities
 * Simplified localStorage with error handling
 */

const PREFIX = 'smartform_';

export const localStorage_ = {
  // Get item
  get: (key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  // Set item
  set: (key, value) => {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
      return false;
    }
  },

  // Remove item
  remove: (key) => {
    try {
      window.localStorage.removeItem(PREFIX + key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
      return false;
    }
  },

  // Clear all
  clear: () => {
    try {
      const keys = Object.keys(window.localStorage);
      keys.forEach(key => {
        if (key.startsWith(PREFIX)) {
          window.localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage', error);
      return false;
    }
  },

  // Get all keys
  keys: () => {
    try {
      return Object.keys(window.localStorage)
        .filter(key => key.startsWith(PREFIX))
        .map(key => key.replace(PREFIX, ''));
    } catch (error) {
      console.error('Error getting localStorage keys', error);
      return [];
    }
  },
};

// Shortcuts for common storage
export const storage = {
  auth: {
    getToken: () => localStorage_.get('token'),
    setToken: (token) => localStorage_.set('token', token),
    getUser: () => localStorage_.get('user'),
    setUser: (user) => localStorage_.set('user', user),
    clear: () => {
      localStorage_.remove('token');
      localStorage_.remove('user');
    },
  },

  settings: {
    getTheme: () => localStorage_.get('theme', 'dark'),
    setTheme: (theme) => localStorage_.set('theme', theme),
    getViewMode: () => localStorage_.get('viewMode', 'grid'),
    setViewMode: (mode) => localStorage_.set('viewMode', mode),
  },

  cache: {
    getForms: () => localStorage_.get('forms_cache'),
    setForms: (forms) => localStorage_.set('forms_cache', forms),
    getSubmissions: () => localStorage_.get('submissions_cache'),
    setSubmissions: (submissions) => localStorage_.set('submissions_cache', submissions),
  },
};

export default localStorage_;
