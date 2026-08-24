import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../services/authService';

export const useAuth = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      lastLogin: null,

      // Actions
      signup: async (email, fullName, password) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.signup({
            email,
            full_name: fullName,
            password,
            confirm_password: password,
          });
          
          const { user, access_token } = response.data;
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            loading: false,
            lastLogin: new Date().toISOString(),
          });
          
          localStorage.setItem('token', access_token);
          localStorage.setItem('user', JSON.stringify(user));
          
          return response.data;
        } catch (error) {
          const message = error.response?.data?.error || 'Signup failed';
          set({ 
            error: message, 
            loading: false,
            isAuthenticated: false 
          });
          throw error;
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          
          const { user, access_token } = response.data;
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            loading: false,
            lastLogin: new Date().toISOString(),
            error: null,
          });
          
          localStorage.setItem('token', access_token);
          localStorage.setItem('user', JSON.stringify(user));
          
          return response.data;
        } catch (error) {
          const message = error.response?.data?.error || 'Login failed';
          set({ 
            error: message, 
            loading: false,
            isAuthenticated: false 
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      },

      updateProfile: async (data) => {
        set({ loading: true });
        try {
          const response = await authService.updateProfile(data);
          const updatedUser = response.data.user || response.data;
          
          set({ 
            user: updatedUser, 
            loading: false,
            error: null 
          });
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Update failed', 
            loading: false 
          });
          throw error;
        }
      },

      fetchProfile: async () => {
        set({ loading: true });
        try {
          const response = await authService.getProfile();
          const user = response.data;
          
          set({ 
            user, 
            loading: false,
            isAuthenticated: true,
            error: null 
          });
          
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        } catch (error) {
          set({ 
            error: error.message, 
            loading: false,
            isAuthenticated: false 
          });
          throw error;
        }
      },

      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Helpers
      isLoggedIn: () => get().isAuthenticated && get().token !== null,
      getUser: () => get().user,
      getToken: () => get().token,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        lastLogin: state.lastLogin,
      }),
    }
  )
);
