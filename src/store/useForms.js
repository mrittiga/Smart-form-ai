import { create } from 'zustand';
import * as formService from '../services/formService';

export const useForms = create((set, get) => ({
  // State
  forms: [],
  currentForm: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    category: 'all',
    search: '',
  },
  sortBy: 'recent',

  // Actions
  fetchForms: async () => {
    set({ loading: true, error: null });
    try {
      const response = await formService.getForms();
      const forms = Array.isArray(response.data) ? response.data : [];
      set({ forms, loading: false });
      return forms;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch forms', 
        loading: false 
      });
      throw error;
    }
  },

  createForm: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await formService.createForm(data);
      const newForm = response.data.form || response.data;
      
      set(state => ({ 
        forms: [newForm, ...state.forms],
        currentForm: newForm,
        loading: false,
      }));
      
      return newForm;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to create form', 
        loading: false 
      });
      throw error;
    }
  },

  getForm: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await formService.getForm(id);
      const form = response.data;
      
      set({ 
        currentForm: form, 
        loading: false,
        error: null 
      });
      
      return form;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to load form', 
        loading: false 
      });
      throw error;
    }
  },

  updateForm: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await formService.updateForm(id, data);
      const updatedForm = response.data.form || response.data;
      
      set(state => ({
        forms: state.forms.map(f => f.id === id ? updatedForm : f),
        currentForm: updatedForm,
        loading: false,
        error: null,
      }));
      
      return updatedForm;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to update form', 
        loading: false 
      });
      throw error;
    }
  },

  deleteForm: async (id) => {
    set({ loading: true, error: null });
    try {
      await formService.deleteForm(id);
      
      set(state => ({
        forms: state.forms.filter(f => f.id !== id),
        currentForm: state.currentForm?.id === id ? null : state.currentForm,
        loading: false,
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to delete form', 
        loading: false 
      });
      throw error;
    }
  },

  addField: async (formId, fieldData) => {
    try {
      const response = await formService.addField(formId, fieldData);
      const newField = response.data.field || response.data;
      
      set(state => ({
        currentForm: state.currentForm ? {
          ...state.currentForm,
          fields: [...(state.currentForm.fields || []), newField],
        } : null,
      }));
      
      return newField;
    } catch (error) {
      throw error;
    }
  },

  updateField: async (formId, fieldId, fieldData) => {
    try {
      const response = await formService.updateField(formId, fieldId, fieldData);
      const updatedField = response.data.field || response.data;
      
      set(state => ({
        currentForm: state.currentForm ? {
          ...state.currentForm,
          fields: state.currentForm.fields.map(f => 
            f.id === fieldId ? updatedField : f
          ),
        } : null,
      }));
      
      return updatedField;
    } catch (error) {
      throw error;
    }
  },

  deleteField: async (formId, fieldId) => {
    try {
      await formService.deleteField(formId, fieldId);
      
      set(state => ({
        currentForm: state.currentForm ? {
          ...state.currentForm,
          fields: state.currentForm.fields.filter(f => f.id !== fieldId),
        } : null,
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

  setSortBy: (sortBy) => set({ sortBy }),

  getFilteredForms: () => {
    const state = get();
    let filtered = [...state.forms];
    
    // Apply filters
    const { filters, sortBy } = state;
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(f => f.status === filters.status);
    }
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(f => f.category === filters.category);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(f => 
        f.title.toLowerCase().includes(search) ||
        f.description?.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return filtered;
  },

  clearError: () => set({ error: null }),
}));
