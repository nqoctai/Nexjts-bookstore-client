"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Minus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { getSocketService } from "@/lib/socket";
import {
  useGetMyChatRooms,
  useCreateChatRoom,
  useGetMessagesByRoom,
  useMarkAsRead,
} from "@/queries/useChat";
import { ChatMessage } from "@/schemaValidations/chat.schema";
import { cn } from "@/lib/utils";
import envConfig from "@/config";

const SOCKET_URL = envConfig.NEXT_PUBLIC_SOCKET_URL;

export default function ChatWidget() {
  const { user } = useUserStore();
  const {
    isOpen,
    isMinimized,
    messages,
    currentRoom,
    isTyping,
    typingUser,
    unreadCount,
    setIsOpen,
    setIsMinimized,
    setCurrentRoom,
    setMessages,
    addMessage,
    setIsTyping,
    resetUnreadCount,
    updateMessageReadStatus,
  } = useChatStore();

  const [messageInput, setMessageInput] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: roomsData, refetch: refetchRooms } = useGetMyChatRooms(
    user?.id || 0
  );
  const { data: messagesData, refetch: refetchMessages } = useGetMessagesByRoom(
    currentRoom?.id || 0
  );
  const createRoomMutation = useCreateChatRoom();
  const markAsReadMutation = useMarkAsRead();

  // Initialize socket
  useEffect(() => {
    if (!user) return;

    const initSocket = async () => {
      try {
        const socketService = getSocketService(SOCKET_URL);
        await socketService.connect(`customer_${user.id}`);

        // Setup listeners
        socketService.onNewMessage((message: ChatMessage) => {
          addMessage(message);

          // Mark as read if chat is open
          if (isOpen && !isMinimized && currentRoom?.id === message.chatRoomId) {
            markAsReadMutation.mutate({
              roomId: message.chatRoomId,
              senderType: "CUSTOMER",
            });
          }
        });

        socketService.onUserTyping((data) => {
          setIsTyping(true, data.userName);
        });

        socketService.onUserStopTyping(() => {
          setIsTyping(false);
        });

        socketService.onMessagesRead((data) => {
          updateMessageReadStatus(data.roomId, data.senderType);
        });
      } catch (error) {
        console.error("Failed to connect socket:", error);
      }
    };

    initSocket();

    return () => {
      const socketService = getSocketService(SOCKET_URL);
      socketService.disconnect();
    };
  }, [user?.id]);

  // Load room and messages
  useEffect(() => {
    if (!user) return;

    if (roomsData?.payload.data && roomsData.payload.data.length > 0) {
      // Get the first room (customer should only have one active room)
      const room = roomsData.payload.data[0];
      setCurrentRoom(room);

      // Join room
      const socketService = getSocketService(SOCKET_URL);
      if (socketService.isConnected()) {
        socketService.joinRoom(String(room.id), `customer_${user.id}`);
      }
    }
  }, [roomsData]);

  useEffect(() => {
    if (messagesData?.payload.data) {
      setMessages(messagesData.payload.data);
    }
  }, [messagesData]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpen = async () => {
    if (!user) return;

    setIsOpen(true);
    resetUnreadCount();

    // Create room if not exists
    if (!currentRoom) {
      try {
        const result = await createRoomMutation.mutateAsync({
          accountId: user.id,
        });
        const newRoom = result.payload.data;
        setCurrentRoom(newRoom);

        // Join room
        const socketService = getSocketService(SOCKET_URL);
        socketService.joinRoom(String(newRoom.id), `customer_${user.id}`);

        // Load messages
        refetchMessages();
      } catch (error) {
        console.error("Failed to create room:", error);
      }
    } else {
      // Mark as read
      markAsReadMutation.mutate({
        roomId: currentRoom.id,
        senderType: "CUSTOMER",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentRoom || !user) return;

    try {
      const socketService = getSocketService(SOCKET_URL);
      socketService.sendMessage({
        roomId: currentRoom.id,
        message: messageInput,
        senderType: "CUSTOMER",
        senderId: user.id,
        senderName: user.name || "Khách hàng",
        messageType: "TEXT",
      });

      setMessageInput("");

      // Stop typing
      socketService.stopTyping(String(currentRoom.id), `customer_${user.id}`);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleTyping = () => {
    if (!currentRoom || !user) return;

    const socketService = getSocketService(SOCKET_URL);

    // Send typing event
    socketService.typing(
      String(currentRoom.id),
      `customer_${user.id}`,
      user.name || "Khách hàng"
    );

    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing
    const timeout = setTimeout(() => {
      socketService.stopTyping(String(currentRoom.id), `customer_${user.id}`);
    }, 2000);

    setTypingTimeout(timeout);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex w-[380px] h-[600px] flex-col rounded-lg bg-white shadow-2xl border">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-lg bg-blue-600 px-4 py-3 text-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Chat hỗ trợ</h3>
                <p className="text-xs opacity-90">
                  {currentRoom?.status === "ACTIVE"
                    ? "Đang kết nối..."
                    : "Chờ hỗ trợ"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-700"
                onClick={handleMinimize}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-700"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.senderType === "CUSTOMER";
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2",
                          isOwnMessage ? "justify-end" : "justify-start"
                        )}
                      >
                        {!isOwnMessage && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {message.senderName?.[0] || "S"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-3 py-2",
                            isOwnMessage
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          )}
                        >
                          {!isOwnMessage && (
                            <p className="text-xs font-semibold mb-1">
                              {message.senderName}
                            </p>
                          )}
                          <p className="text-sm break-words">{message.message}</p>
                          <p
                            className={cn(
                              "mt-1 text-xs",
                              isOwnMessage ? "text-blue-100" : "text-gray-500"
                            )}
                          >
                            {new Date(message.createdAt).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {isOwnMessage && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              {user.name?.[0] || "B"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })}

                  {/* Typing indicator */}
                  {isTyping && typingUser && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                      <span>{typingUser} đang nhập...</span>
                    </div>
                  )}
                  {/* Invisible element to scroll to */}
                  <div ref={messagesEndRef} />
                </div>
                </ScrollArea>
              </div>

              {/* Input */}
              <div className="border-t p-3 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
