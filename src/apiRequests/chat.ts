import http from "@/lib/http";
import {
  ChatRoom,
  ChatMessage,
  CreateChatRoom,
  AssignEmployee,
  SendMessage,
  ChatRoomStatus,
  SenderType,
} from "@/schemaValidations/chat.schema";

// Response types
type ChatRoomResponse = { data: ChatRoom };
type ChatRoomListResponse = { data: ChatRoom[] };
type ChatMessageListResponse = { data: ChatMessage[] };
type ChatMessageResponse = { data: ChatMessage };
type CountResponse = { data: { count: number } };

const chatApiRequests = {
  // Chat Room APIs
  createChatRoom: (body: CreateChatRoom) =>
    http.post<ChatRoomResponse>("/api/v1/chat/rooms", body),

  getAllChatRooms: (status?: ChatRoomStatus[]) => {
    const query = status ? `status=${status.join(",")}` : "";
    return http.get<ChatRoomListResponse>(`/api/v1/chat/rooms?${query}`);
  },

  getMyChatRooms: (accountId: number, status?: ChatRoomStatus[]) => {
    const query = status ? `&status=${status.join(",")}` : "";
    return http.get<ChatRoomListResponse>(
      `/api/v1/chat/rooms/my-rooms?accountId=${accountId}${query}`
    );
  },

  getChatRoomById: (roomId: number) =>
    http.get<ChatRoomResponse>(`/api/v1/chat/rooms/${roomId}`),

  closeChatRoom: (roomId: number) =>
    http.put<{ data: void }>(`/api/v1/chat/rooms/${roomId}/close`, {}),

  assignEmployee: (body: AssignEmployee) =>
    http.put<ChatRoomResponse>("/api/v1/chat/rooms/assign", body),

  getOpenRoomCount: () =>
    http.get<CountResponse>("/api/v1/chat/rooms/count/open"),

  // Message APIs
  getMessagesByRoom: (roomId: number) =>
    http.get<ChatMessageListResponse>(`/api/v1/chat/rooms/${roomId}/messages`),

  sendMessage: (body: SendMessage) =>
    http.post<ChatMessageResponse>("/api/v1/chat/messages", body),

  markAsRead: (roomId: number, senderType: SenderType) =>
    http.put<{ data: void }>(
      `/api/v1/chat/rooms/${roomId}/mark-read?senderType=${senderType}`,
      {}
    ),
};

export default chatApiRequests;
