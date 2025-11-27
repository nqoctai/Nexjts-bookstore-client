import z from "zod";

// Enums
export const ChatRoomStatus = z.enum(["OPEN", "ACTIVE", "CLOSED"]);
export const SenderType = z.enum(["CUSTOMER", "EMPLOYEE", "ADMIN"]);
export const MessageType = z.enum(["TEXT", "IMAGE", "FILE"]);

// Chat Room Schema
export const ChatRoomSchema = z.object({
  id: z.number(),
  accountId: z.number(),
  accountName: z.string().optional().nullable(),
  assignedEmployeeAccountId: z.number().optional().nullable(),
  assignedEmployeeName: z.string().optional().nullable(),
  status: ChatRoomStatus,
  createdAt: z.string(),
  updatedAt: z.string(),
  closedAt: z.string().optional().nullable(),
  unreadCountCustomer: z.number().default(0),
  unreadCountEmployee: z.number().default(0),
});

export const CreateChatRoomSchema = z.object({
  accountId: z.number(),
});

export const AssignEmployeeSchema = z.object({
  roomId: z.number(),
  employeeAccountId: z.number(),
});

// Chat Message Schema
export const ChatMessageSchema = z.object({
  id: z.number(),
  chatRoomId: z.number(),
  senderType: SenderType,
  senderId: z.number(),
  senderName: z.string(),
  message: z.string(),
  messageType: MessageType,
  fileUrl: z.string().optional().nullable(),
  isRead: z.boolean().default(false),
  createdAt: z.string(),
});

export const SendMessageSchema = z.object({
  roomId: z.number(),
  message: z.string().min(1, "Tin nhắn không được để trống"),
  senderType: SenderType,
  senderId: z.number(),
  senderName: z.string(),
  messageType: MessageType.default("TEXT"),
  fileUrl: z.string().optional().nullable(),
});

// Socket Event Schemas
export const JoinRoomSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
});

export const LeaveRoomSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
});

export const TypingSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
  userName: z.string(),
});

export const MarkAsReadSchema = z.object({
  roomId: z.number(),
  senderType: SenderType,
});

// Response Types
export const ChatRoomListResponseSchema = z.array(ChatRoomSchema);
export const ChatMessageListResponseSchema = z.array(ChatMessageSchema);

// Type exports
export type ChatRoom = z.infer<typeof ChatRoomSchema>;
export type CreateChatRoom = z.infer<typeof CreateChatRoomSchema>;
export type AssignEmployee = z.infer<typeof AssignEmployeeSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type SendMessage = z.infer<typeof SendMessageSchema>;
export type JoinRoom = z.infer<typeof JoinRoomSchema>;
export type LeaveRoom = z.infer<typeof LeaveRoomSchema>;
export type Typing = z.infer<typeof TypingSchema>;
export type MarkAsRead = z.infer<typeof MarkAsReadSchema>;
export type ChatRoomStatus = z.infer<typeof ChatRoomStatus>;
export type SenderType = z.infer<typeof SenderType>;
export type MessageType = z.infer<typeof MessageType>;
