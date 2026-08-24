import { create } from 'zustand';

export const useUI = create((set) => ({
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Modal
  modals: {
    createForm: false,
    editForm: false,
    deleteConfirm: false,
    settings: false,
  },
  
  openModal: (modal) => set(state => ({
    modals: { ...state.modals, [modal]: true },
  })),
  
  closeModal: (modal) => set(state => ({
    modals: { ...state.modals, [modal]: false },
  })),
  
  closeAllModals: () => set({
    modals: {
      createForm: false,
      editForm: false,
      deleteConfirm: false,
      settings: false,
    },
  }),

  // Notifications
  notifications: [],
  
  addNotification: (notification) => set(state => ({
    notifications: [
      ...state.notifications,
      {
        id: Date.now(),
        ...notification,
      },
    ],
  })),
  
  removeNotification: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),

  // Theme
  theme: localStorage.getItem('theme') || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },

  // View mode
  viewMode: localStorage.getItem('viewMode') || 'grid',
  setViewMode: (mode) => {
    localStorage.setItem('viewMode', mode);
    set({ viewMode: mode });
  },

  // Loading states
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // Active item
  activeItem: null,
  setActiveItem: (item) => set({ activeItem: item }),
}));
