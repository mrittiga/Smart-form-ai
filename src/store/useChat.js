import { create } from 'zustand';

export const useChat = create((set, get) => ({
  // State
  messages: [],
  chatOpen: false,
  loading: false,
  currentTopic: null,

  // Actions
  addMessage: (message) => {
    set(state => ({
      messages: [
        ...state.messages,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...message,
        },
      ],
    }));
  },

  addBotMessage: (content) => {
    get().addMessage({
      sender: 'bot',
      content,
      type: 'text',
    });
  },

  addUserMessage: (content) => {
    get().addMessage({
      sender: 'user',
      content,
      type: 'text',
    });
  },

  clearMessages: () => set({ messages: [] }),

  openChat: () => set({ chatOpen: true }),
  closeChat: () => set({ chatOpen: false }),
  toggleChat: () => set(state => ({ chatOpen: !state.chatOpen })),

  setLoading: (loading) => set({ loading }),

  setTopic: (topic) => set({ currentTopic: topic }),

  getMessages: () => get().messages,
  getLastMessage: () => {
    const messages = get().messages;
    return messages[messages.length - 1] || null;
  },
}));
