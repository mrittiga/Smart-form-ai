import api from './api';

const ANALYTICS_ENDPOINTS = {
  dashboard: '/analytics/dashboard',
  formsCompleted: '/analytics/forms-completed',
  timeSaved: '/analytics/time-saved',
  usage: '/analytics/usage',
};

export const getDashboard = () => {
  return api.get(ANALYTICS_ENDPOINTS.dashboard);
};

export const getFormsCompleted = (days = 30) => {
  return api.get(ANALYTICS_ENDPOINTS.formsCompleted, {
    params: { days },
  });
};

export const getTimeSaved = (days = 30) => {
  return api.get(ANALYTICS_ENDPOINTS.timeSaved, {
    params: { days },
  });
};

export const getUsageStats = () => {
  return api.get(ANALYTICS_ENDPOINTS.usage);
};
