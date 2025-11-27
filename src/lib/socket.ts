import { io, Socket } from "socket.io-client";
import { ChatMessage } from "@/schemaValidations/chat.schema";

// Socket Event Types
interface ServerToClientEvents {
  new_message: (message: ChatMessage) => void;
  new_customer_message: (message: ChatMessage) => void;
  user_joined: (data: { userId: string; roomId: string }) => void;
  user_left: (data: { userId: string; roomId: string }) => void;
  user_typing: (data: { userId: string; userName: string }) => void;
  user_stop_typing: (data: { userId: string; userName: string }) => void;
  messages_read: (data: { roomId: number; senderType: string }) => void;
  error: (error: { message: string }) => void;
}

interface ClientToServerEvents {
  join_room: (data: { roomId: string; userId: string }) => void;
  leave_room: (data: { roomId: string; userId: string }) => void;
  send_message: (data: {
    roomId: number;
    message: string;
    senderType: string;
    senderId: number;
    senderName: string;
    messageType: string;
    fileUrl?: string | null;
  }) => void;
  typing: (data: { roomId: string; userId: string; userName: string }) => void;
  stop_typing: (data: { roomId: string; userId: string }) => void;
  mark_as_read: (data: { roomId: number; senderType: string }) => void;
}

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

class SocketService {
  private socket: SocketType | null = null;
  private socketUrl: string;

  constructor(socketUrl: string) {
    this.socketUrl = socketUrl;
  }

  connect(userId: string, token?: string): Promise<SocketType> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      const options: any = {
        query: { userId },
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      };

      if (token) {
        options.query.token = token;
      }

      this.socket = io(this.socketUrl, options);

      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket?.id);
        resolve(this.socket!);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        reject(error);
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket disconnected");
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): SocketType | null {
    return this.socket;
  }

  // Room management
  joinRoom(roomId: string, userId: string) {
    if (!this.socket) {
      throw new Error("Socket not connected");
    }
    this.socket.emit("join_room", { roomId, userId });
  }

  leaveRoom(roomId: string, userId: string) {
    if (!this.socket) {
      throw new Error("Socket not connected");
    }
    this.socket.emit("leave_room", { roomId, userId });
  }

  // Message handling
  sendMessage(data: {
    roomId: number;
    message: string;
    senderType: string;
    senderId: number;
    senderName: string;
    messageType?: string;
    fileUrl?: string | null;
  }) {
    if (!this.socket) {
      throw new Error("Socket not connected");
    }
    this.socket.emit("send_message", {
      ...data,
      messageType: data.messageType || "TEXT",
    });
  }

  // Typing indicators
  typing(roomId: string, userId: string, userName: string) {
    if (!this.socket) {
      throw new Error("Socket not connected");
    }
    this.socket.emit("typing", { roomId, userId, userName });
  }

  stopTyping(roomId: string, userId: string) {
    if (!this.socket) {
      throw new Error("Socket not connected");
    }
    this.socket.emit("stop_typing", { roomId, userId });
  }

  // Mark as read
  markAsRead(roomId: number, senderType: string) {
    if (!this.socket) {
      throw new Error("Socket not connected");
    }
    this.socket.emit("mark_as_read", { roomId, senderType });
  }

  // Event listeners
  onNewMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) return;
    this.socket.on("new_message", callback);
  }

  onNewCustomerMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) return;
    this.socket.on("new_customer_message", callback);
  }

  onUserJoined(callback: (data: { userId: string; roomId: string }) => void) {
    if (!this.socket) return;
    this.socket.on("user_joined", callback);
  }

  onUserLeft(callback: (data: { userId: string; roomId: string }) => void) {
    if (!this.socket) return;
    this.socket.on("user_left", callback);
  }

  onUserTyping(callback: (data: { userId: string; userName: string }) => void) {
    if (!this.socket) return;
    this.socket.on("user_typing", callback);
  }

  onUserStopTyping(
    callback: (data: { userId: string; userName: string }) => void
  ) {
    if (!this.socket) return;
    this.socket.on("user_stop_typing", callback);
  }

  onMessagesRead(
    callback: (data: { roomId: number; senderType: string }) => void
  ) {
    if (!this.socket) return;
    this.socket.on("messages_read", callback);
  }

  onError(callback: (error: { message: string }) => void) {
    if (!this.socket) return;
    this.socket.on("error", callback);
  }

  // Remove listeners
  offNewMessage(callback?: (message: ChatMessage) => void) {
    if (!this.socket) return;
    this.socket.off("new_message", callback);
  }

  offNewCustomerMessage(callback?: (message: ChatMessage) => void) {
    if (!this.socket) return;
    this.socket.off("new_customer_message", callback);
  }

  offUserJoined(
    callback?: (data: { userId: string; roomId: string }) => void
  ) {
    if (!this.socket) return;
    this.socket.off("user_joined", callback);
  }

  offUserLeft(callback?: (data: { userId: string; roomId: string }) => void) {
    if (!this.socket) return;
    this.socket.off("user_left", callback);
  }

  offUserTyping(
    callback?: (data: { userId: string; userName: string }) => void
  ) {
    if (!this.socket) return;
    this.socket.off("user_typing", callback);
  }

  offUserStopTyping(
    callback?: (data: { userId: string; userName: string }) => void
  ) {
    if (!this.socket) return;
    this.socket.off("user_stop_typing", callback);
  }

  offMessagesRead(
    callback?: (data: { roomId: number; senderType: string }) => void
  ) {
    if (!this.socket) return;
    this.socket.off("messages_read", callback);
  }

  offError(callback?: (error: { message: string }) => void) {
    if (!this.socket) return;
    this.socket.off("error", callback);
  }
}

// Singleton instance
let socketService: SocketService | null = null;

export const getSocketService = (socketUrl?: string): SocketService => {
  if (!socketService && socketUrl) {
    socketService = new SocketService(socketUrl);
  }
  if (!socketService) {
    throw new Error("Socket service not initialized. Provide socketUrl first.");
  }
  return socketService;
};

export default SocketService;
