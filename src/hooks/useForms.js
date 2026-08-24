import { useCallback } from 'react';
import { useForms as useFormsStore } from '../store/useForms';

/**
 * Custom hook for form management
 * Provides easy access to forms state and actions
 */
export const useForms = () => {
  const formsStore = useFormsStore();

  // Get forms count
  const getFormsCount = useCallback(() => {
    return formsStore.forms?.length || 0;
  }, [formsStore]);

  // Get active forms count
  const getActiveFormsCount = useCallback(() => {
    return formsStore.forms?.filter(f => f.status === 'active').length || 0;
  }, [formsStore]);

  // Get draft forms count
  const getDraftFormsCount = useCallback(() => {
    return formsStore.forms?.filter(f => f.status === 'draft').length || 0;
  }, [formsStore]);

  // Check if form exists
  const formExists = useCallback((id) => {
    return formsStore.forms?.some(f => f.id === id) || false;
  }, [formsStore]);

  // Get form by ID
  const getFormById = useCallback((id) => {
    return formsStore.forms?.find(f => f.id === id) || null;
  }, [formsStore]);

  return {
    // State
    forms: formsStore.forms,
    currentForm: formsStore.currentForm,
    loading: formsStore.loading,
    error: formsStore.error,
    filters: formsStore.filters,
    sortBy: formsStore.sortBy,

    // Actions
    fetchForms: formsStore.fetchForms,
    createForm: formsStore.createForm,
    getForm: formsStore.getForm,
    updateForm: formsStore.updateForm,
    deleteForm: formsStore.deleteForm,
    addField: formsStore.addField,
    updateField: formsStore.updateField,
    deleteField: formsStore.deleteField,
    setFilter: formsStore.setFilter,
    setSortBy: formsStore.setSortBy,
    getFilteredForms: formsStore.getFilteredForms,
    clearError: formsStore.clearError,

    // Methods
    getFormsCount,
    getActiveFormsCount,
    getDraftFormsCount,
    formExists,
    getFormById,
  };
};

export default useForms;
