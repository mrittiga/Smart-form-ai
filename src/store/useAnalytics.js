import { create } from 'zustand';
import * as analyticsService from '../services/analyticsService';

export const useAnalytics = create((set) => ({
  // State
  dashboard: {
    forms_created: 0,
    submissions_sent: 0,
    time_saved_minutes: 0,
    active_forms: 0,
    ai_suggestions_used: 0,
  },
  loading: false,
  error: null,
  chartsData: {
    submissions: [],
    timeSaved: [],
    categories: [],
  },

  // Actions
  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await analyticsService.getDashboard();
      set({
        dashboard: response.data,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to fetch analytics',
        loading: false,
      });
      throw error;
    }
  },

  updateChartsData: (data) => set(state => ({
    chartsData: { ...state.chartsData, ...data },
  })),

  clearError: () => set({ error: null }),
}));
