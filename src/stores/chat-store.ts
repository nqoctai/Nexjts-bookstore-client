import { create } from "zustand";
import { ChatRoom, ChatMessage } from "@/schemaValidations/chat.schema";

interface ChatState {
  // Chat state
  currentRoom: ChatRoom | null;
  messages: ChatMessage[];
  isOpen: boolean;
  isMinimized: boolean;
  isTyping: boolean;
  typingUser: string | null;
  unreadCount: number;

  // Actions
  setCurrentRoom: (room: ChatRoom | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsMinimized: (isMinimized: boolean) => void;
  setIsTyping: (isTyping: boolean, userName?: string) => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  updateMessageReadStatus: (roomId: number, senderType: string) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  currentRoom: null,
  messages: [],
  isOpen: false,
  isMinimized: false,
  isTyping: false,
  typingUser: null,
  unreadCount: 0,

  // Actions
  setCurrentRoom: (room) => set({ currentRoom: room }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));

    // Increment unread count if chat is not open
    if (!get().isOpen) {
      get().incrementUnreadCount();
    }
  },

  setIsOpen: (isOpen) => {
    set({ isOpen });
    // Reset unread count when opening chat
    if (isOpen) {
      set({ unreadCount: 0, isMinimized: false });
    }
  },

  setIsMinimized: (isMinimized) => set({ isMinimized }),

  setIsTyping: (isTyping, userName) =>
    set({ isTyping, typingUser: userName || null }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),

  resetUnreadCount: () => set({ unreadCount: 0 }),

  updateMessageReadStatus: (roomId, senderType) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.chatRoomId === roomId && msg.senderType !== senderType
          ? { ...msg, isRead: true }
          : msg
      ),
    }));
  },

  clearChat: () =>
    set({
      currentRoom: null,
      messages: [],
      isOpen: false,
      isMinimized: false,
      isTyping: false,
      typingUser: null,
      unreadCount: 0,
    }),
}));
