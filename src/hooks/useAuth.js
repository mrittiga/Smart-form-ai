import { useCallback } from 'react';
import { useAuth as useAuthStore } from '../store/useAuth';

/**
 * Custom hook for authentication
 * Provides easy access to auth state and actions
 */
export const useAuth = () => {
  const authStore = useAuthStore();

  // Get authentication status
  const isLoggedIn = useCallback(() => {
    return authStore.isLoggedIn && authStore.isLoggedIn();
  }, [authStore]);

  // Get user
  const getUser = useCallback(() => {
    return authStore.getUser ? authStore.getUser() : authStore.user;
  }, [authStore]);

  // Get token
  const getToken = useCallback(() => {
    return authStore.getToken ? authStore.getToken() : authStore.token;
  }, [authStore]);

  // Check if user has permission
  const hasPermission = useCallback((permission) => {
    const user = getUser();
    // Add your permission logic here
    return user?.role === 'admin' || user?.permissions?.includes(permission);
  }, [getUser]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    const user = getUser();
    return user?.role === 'admin';
  }, [getUser]);

  return {
    // State
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    loading: authStore.loading,
    error: authStore.error,
    lastLogin: authStore.lastLogin,

    // Actions
    signup: authStore.signup,
    login: authStore.login,
    logout: authStore.logout,
    updateProfile: authStore.updateProfile,
    fetchProfile: authStore.fetchProfile,
    setError: authStore.setError,
    clearError: authStore.clearError,

    // Methods
    isLoggedIn,
    getUser,
    getToken,
    hasPermission,
    isAdmin,
  };
};

export default useAuth;
