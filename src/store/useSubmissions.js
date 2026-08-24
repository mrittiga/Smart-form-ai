import { create } from 'zustand';
import * as submissionService from '../services/submissionService';

export const useSubmissions = create((set, get) => ({
  // State
  submissions: [],
  currentSubmission: null,
  loading: false,
  error: null,
  stats: {
    totalSubmissions: 0,
    averageTime: 0,
    successRate: 0,
  },
  filters: {
    status: 'all',
    formId: null,
    dateRange: 'all',
  },

  // Actions
  fetchSubmissions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await submissionService.getSubmissions();
      const submissions = Array.isArray(response.data) ? response.data : [];
      
      // Calculate stats
      const stats = {
        totalSubmissions: submissions.length,
        averageTime: submissions.length > 0 
          ? submissions.reduce((sum, s) => sum + (s.time_taken || 0), 0) / submissions.length
          : 0,
        successRate: submissions.length > 0
          ? (submissions.filter(s => s.status === 'submitted').length / submissions.length * 100).toFixed(2)
          : 0,
      };
      
      set({ 
        submissions, 
        stats,
        loading: false,
        error: null,
      });
      
      return submissions;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch submissions', 
        loading: false 
      });
      throw error;
    }
  },

  submitForm: async (formId, submissionData) => {
    set({ loading: true, error: null });
    try {
      const response = await submissionService.submitForm(formId, submissionData);
      const newSubmission = response.data.submission || response.data;
      
      set(state => ({
        submissions: [newSubmission, ...state.submissions],
        stats: {
          ...state.stats,
          totalSubmissions: state.stats.totalSubmissions + 1,
        },
        loading: false,
      }));
      
      return newSubmission;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to submit form', 
        loading: false 
      });
      throw error;
    }
  },

  getSubmission: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await submissionService.getSubmission(id);
      const submission = response.data;
      
      set({ 
        currentSubmission: submission, 
        loading: false 
      });
      
      return submission;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to load submission', 
        loading: false 
      });
      throw error;
    }
  },

  deleteSubmission: async (id) => {
    try {
      await submissionService.deleteSubmission(id);
      
      set(state => ({
        submissions: state.submissions.filter(s => s.id !== id),
        currentSubmission: state.currentSubmission?.id === id ? null : state.currentSubmission,
      }));
    } catch (error) {
      throw error;
    }
  },

  setFilter: (filterKey, value) => {
    set(state => ({
      filters: { ...state.filters, [filterKey]: value },
    }));
  },

  getFilteredSubmissions: () => {
    const state = get();
    let filtered = [...state.submissions];
    const { filters } = state;
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    
    if (filters.formId) {
      filtered = filtered.filter(s => s.form_id === filters.formId);
    }
    
    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  clearError: () => set({ error: null }),
}));
