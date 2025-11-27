import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import chatApiRequests from "@/apiRequests/chat";
import {
  CreateChatRoom,
  AssignEmployee,
  SendMessage,
  ChatRoomStatus,
  SenderType,
} from "@/schemaValidations/chat.schema";
import { toast } from "sonner";

// Query keys
export const chatKeys = {
  all: ["chat"] as const,
  rooms: () => [...chatKeys.all, "rooms"] as const,
  room: (id: number) => [...chatKeys.all, "room", id] as const,
  myRooms: (accountId: number, status?: ChatRoomStatus[]) =>
    [...chatKeys.all, "rooms", "my", accountId, status] as const,
  messages: (roomId: number) => [...chatKeys.all, "messages", roomId] as const,
  openCount: () => [...chatKeys.all, "openCount"] as const,
};

// Get all chat rooms
export const useGetAllChatRooms = (status?: ChatRoomStatus[]) => {
  return useQuery({
    queryKey: [...chatKeys.rooms(), status],
    queryFn: () => chatApiRequests.getAllChatRooms(status),
  });
};

// Get my chat rooms (works for both customer and employee)
export const useGetMyChatRooms = (
  accountId: number,
  status?: ChatRoomStatus[]
) => {
  return useQuery({
    queryKey: chatKeys.myRooms(accountId, status),
    queryFn: () => chatApiRequests.getMyChatRooms(accountId, status),
    enabled: !!accountId,
  });
};

// Get chat room by id
export const useGetChatRoomById = (roomId: number) => {
  return useQuery({
    queryKey: chatKeys.room(roomId),
    queryFn: () => chatApiRequests.getChatRoomById(roomId),
    enabled: !!roomId,
  });
};

// Get messages by room
export const useGetMessagesByRoom = (roomId: number) => {
  return useQuery({
    queryKey: chatKeys.messages(roomId),
    queryFn: () => chatApiRequests.getMessagesByRoom(roomId),
    enabled: !!roomId,
  });
};

// Get open room count
export const useGetOpenRoomCount = () => {
  return useQuery({
    queryKey: chatKeys.openCount(),
    queryFn: () => chatApiRequests.getOpenRoomCount(),
  });
};

// Create chat room
export const useCreateChatRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateChatRoom) => chatApiRequests.createChatRoom(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
      queryClient.invalidateQueries({
        queryKey: chatKeys.myRooms(data.payload.data.accountId),
      });
      toast.success("Đã tạo phòng chat thành công");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Có lỗi xảy ra khi tạo phòng chat");
    },
  });
};

// Assign employee to room
export const useAssignEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AssignEmployee) => chatApiRequests.assignEmployee(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
      queryClient.invalidateQueries({
        queryKey: chatKeys.room(data.payload.data.id),
      });
      toast.success("Đã gán nhân viên thành công");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Có lỗi xảy ra khi gán nhân viên");
    },
  });
};

// Close chat room
export const useCloseChatRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: number) => chatApiRequests.closeChatRoom(roomId),
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
      queryClient.invalidateQueries({
        queryKey: chatKeys.room(roomId),
      });
      toast.success("Đã đóng phòng chat");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Có lỗi xảy ra khi đóng phòng chat");
    },
  });
};

// Send message (REST API backup)
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SendMessage) => chatApiRequests.sendMessage(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(data.payload.data.chatRoomId),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Có lỗi xảy ra khi gửi tin nhắn");
    },
  });
};

// Mark as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      senderType,
    }: {
      roomId: number;
      senderType: SenderType;
    }) => chatApiRequests.markAsRead(roomId, senderType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.room(variables.roomId),
      });
    },
    onError: (error: any) => {
      console.error("Error marking as read:", error);
    },
  });
};
