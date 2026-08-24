import api from './api';

const AUTH_ENDPOINTS = {
  signup: '/auth/signup',
  login: '/auth/login',
  logout: '/auth/logout',
};

const USER_ENDPOINTS = {
  profile: '/users/me',
  settings: '/users/settings',
};

export const signup = (data) => {
  return api.post(AUTH_ENDPOINTS.signup, data);
};

export const login = (data) => {
  return api.post(AUTH_ENDPOINTS.login, data);
};

export const logout = () => {
  return api.post(AUTH_ENDPOINTS.logout);
};

export const getProfile = () => {
  return api.get(USER_ENDPOINTS.profile);
};

export const updateProfile = (data) => {
  return api.put(USER_ENDPOINTS.profile, data);
};

export const getSettings = () => {
  return api.get(USER_ENDPOINTS.settings);
};

export const updateSettings = (data) => {
  return api.put(USER_ENDPOINTS.settings, data);
};
