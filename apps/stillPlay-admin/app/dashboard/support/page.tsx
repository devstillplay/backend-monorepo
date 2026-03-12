"use client";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SendIcon from "@mui/icons-material/Send";
import { Avatar, Box, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import Pusher from "pusher-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import { pusherConfig } from "../../../lib/env";
import type { ChatMessage, ChatThread } from "../../../lib/api";
import {
  useChatThreads,
  useChatMessages,
  useSendChatMessage,
  useCreateChatThread,
  useAdminUsers,
} from "../../../lib/queries";
import { useAuthStore } from "../../../store/auth";

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  return isToday ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : d.toLocaleDateString("en-NG", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function getUserDisplay(u: { id: string; firstName?: string; lastName?: string; email?: string }) {
  if (u.firstName || u.lastName) return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  return u.email ?? u.id.slice(-6);
}

export default function SupportPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<Pusher | null>(null);

  const { data: threadsData, isLoading: threadsLoading, refetch: refetchThreads } = useChatThreads();
  const { data: usersData } = useAdminUsers();
  const { data: messagesData, isLoading: messagesLoading, isFetching: messagesFetching, refetch } = useChatMessages(selectedThreadId, undefined, selectedUserId);
  const sendMutation = useSendChatMessage();
  const createThreadMutation = useCreateChatThread();

  const threads = threadsData?.threads ?? [];
  const selectedThread = threads.find((t) => t.id === selectedThreadId);
  // Only show messages when thread belongs to selected user, or when selectedThread is missing
  // (e.g. newly created - threads not refetched yet) but we have messages for selectedThreadId
  const threadBelongsToUser =
    selectedThread && selectedUserId
      ? String(selectedThread.userId) === String(selectedUserId)
      : false;
  const canShowMessages =
    selectedThreadId &&
    selectedUserId &&
    !messagesFetching &&
    messagesData?.messages &&
    (threadBelongsToUser || !selectedThread);
  const messages = canShowMessages
    ? messagesData!.messages.filter((m) => m.chatSupportId === selectedThreadId)
    : [];
  const showMessagesLoader = selectedThreadId && (messagesLoading || messagesFetching);
  const currentUserId = useAuthStore((s) => s.user?.id);
  const users = (usersData ?? [])
    .filter((u) => u.role === "Customer" && String(u.id) !== String(currentUserId));

  const customerIds = useCallback(
    () => new Set(users.map((u) => String(u.id))),
    [users]
  );
  const threadByUserId = useCallback(
    (userId: string) => {
      const ids = customerIds();
      return threads.find(
        (t) => String(t.userId) === String(userId) && ids.has(String(t.userId))
      );
    },
    [threads, customerIds]
  );

  const selectedUser = users.find((u) => String(u.id) === String(selectedUserId));

  // Pre-select user from ?userId= query (runs when URL has userId and users loaded)
  const urlUserId = searchParams.get("userId");
  const urlProcessedRef = useRef<string | null>(null);
  if (urlUserId !== urlProcessedRef.current && urlProcessedRef.current !== null) {
    urlProcessedRef.current = null;
  }
  useEffect(() => {
    if (!urlUserId || !users.some((u) => String(u.id) === String(urlUserId))) return;
    if (urlProcessedRef.current === urlUserId) return;
    // Wait for threads to load before lookup, so we find existing thread instead of creating
    if (threadsLoading) return;
    urlProcessedRef.current = urlUserId;
    setSelectedUserId(urlUserId);
    const existing = threadByUserId(urlUserId);
    if (existing) {
      setSelectedThreadId(existing.id);
    } else {
      setSelectedThreadId(null);
      createThreadMutation.mutate(
        { userId: urlUserId },
        {
          onSuccess: (data) => {
            setSelectedThreadId(data.thread.id);
            refetchThreads();
          },
        }
      );
    }
  }, [urlUserId, users.length, threadsLoading, threadByUserId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Pusher real-time subscription
  useEffect(() => {
    if (!pusherConfig.key || !selectedThreadId) return;

    if (!pusherRef.current) {
      pusherRef.current = new Pusher(pusherConfig.key, {
        cluster: pusherConfig.cluster,
      });
    }

    const channel = pusherRef.current.subscribe(`chat-${selectedThreadId}`);
    const handler = () => refetch();
    channel.bind("new-message", handler);

    return () => {
      channel.unbind("new-message", handler);
      pusherRef.current?.unsubscribe(`chat-${selectedThreadId}`);
    };
  }, [selectedThreadId, refetch]);

  const creatingForUserIdRef = useRef<string | null>(null);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setInputValue("");
    const existing = threadByUserId(userId);
    if (existing) {
      setSelectedThreadId(existing.id);
      creatingForUserIdRef.current = null;
    } else {
      setSelectedThreadId(null);
      creatingForUserIdRef.current = userId;
      createThreadMutation.mutate(
        { userId },
        {
          onSuccess: (data) => {
            if (creatingForUserIdRef.current === userId) {
              setSelectedThreadId(data.thread.id);
              creatingForUserIdRef.current = null;
            }
            refetchThreads();
          },
        }
      );
    }
  };

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content || !selectedThreadId || !selectedUserId || sendMutation.isPending) return;
    sendMutation.mutate(
      { chatSupportId: selectedThreadId, content, recipientUserId: selectedUserId },
      {
        onSuccess: () => {
          setInputValue("");
          refetch();
        },
      }
    );
  };

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const name = getUserDisplay(u).toLowerCase();
    return name.includes(search.toLowerCase()) || (u.email ?? "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Box>
      <DashboardHeader search={search} onSearchChange={setSearch} />
      <Box
        sx={{
          background: "#ffffff",
          borderRadius: 4,
          padding: { xs: 2, md: 3.5 },
          paddingBottom: { xs: 3, md: 4 },
          marginTop: { xs: 2, md: 3 },
          minHeight: "calc(100vh - 220px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            borderRadius: 3,
            padding: 2,
            backgroundColor: "#f3f3f3",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* User list */}
          <Box
            sx={{
              flex: { xs: "0 0 auto", md: "0 0 280px" },
              maxHeight: { xs: 200, md: "100%" },
              overflowY: "auto",
              borderRight: { md: "1px solid #e0e0e0" },
              pr: { md: 2 },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              SUPPORT
            </Typography>
            {threadsLoading && users.length === 0 ? (
              <Stack alignItems="center" py={4}>
                <CircularProgress size={32} />
              </Stack>
            ) : filteredUsers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No users found.
              </Typography>
            ) : (
              <Stack spacing={0.5}>
                {filteredUsers.map((u) => {
                  const thread = threadByUserId(u.id);
                  const isSelected = String(u.id) === String(selectedUserId);
                  return (
                    <UserRow
                      key={u.id}
                      user={u}
                      thread={thread}
                      isSelected={isSelected}
                      onClick={() => handleSelectUser(u.id)}
                    />
                  );
                })}
              </Stack>
            )}
          </Box>

          {/* Message area */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            {!selectedThreadId ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                }}
              >
                {createThreadMutation.isPending ? (
                  <Stack alignItems="center" spacing={1}>
                    <CircularProgress size={28} />
                    <Typography variant="body2">Opening chat...</Typography>
                  </Stack>
                ) : (
                  <Typography>
                    {selectedUserId ? "Select a user to start chatting" : "Select a user from the list to view or start a conversation"}
                  </Typography>
                )}
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    py: 1.5,
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Avatar sx={{ width: 36, height: 36 }} />
                  <Typography fontWeight={600}>
                    {selectedUser ? getUserDisplay(selectedUser) : "Customer"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    py: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {showMessagesLoader ? (
                    <Stack alignItems="center" justifyContent="center" py={6} spacing={1}>
                      <CircularProgress size={36} sx={{ color: "#0F8B4C" }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading messages...
                      </Typography>
                    </Stack>
                  ) : (
                    messages.map((m) => (
                      <MessageBubble key={m.id} message={m} isAdmin={m.senderType === "admin"} />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Box
                    component="button"
                    onClick={handleSend}
                    disabled={!inputValue.trim() || sendMutation.isPending}
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      border: "none",
                      backgroundColor: "#0F8B4C",
                      color: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "&:hover:not(:disabled)": { backgroundColor: "#0a6b3a" },
                      "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
                    }}
                  >
                    {sendMutation.isPending ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      <SendIcon fontSize="small" />
                    )}
                  </Box>
                </Stack>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function UserRow({
  user,
  thread,
  isSelected,
  onClick,
}: {
  user: { id: string; firstName?: string; lastName?: string; email?: string; picture?: string | null };
  thread?: ChatThread | null;
  isSelected: boolean;
  onClick: () => void;
}) {
  const name = getUserDisplay(user);
  const lastMsg = thread?._count?.messages ? `${thread._count.messages} message(s)` : "No messages yet";
  return (
    <Box
      onClick={onClick}
      sx={{
        padding: 1.5,
        borderRadius: 2,
        cursor: "pointer",
        backgroundColor: isSelected ? "#e8f5e9" : "transparent",
        "&:hover": { backgroundColor: isSelected ? "#e8f5e9" : "#f5f5f5" },
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Avatar src={user.picture ?? undefined} sx={{ width: 40, height: 40 }}>
        {(name?.[0] ?? "?").toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {lastMsg}
        </Typography>
      </Box>
      <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: "#6b6b6b" }} />
    </Box>
  );
}

function MessageBubble({ message, isAdmin }: { message: ChatMessage; isAdmin: boolean }) {
  return (
    <Box
      sx={{
        alignSelf: isAdmin ? "flex-end" : "flex-start",
        maxWidth: "75%",
        px: 2,
        py: 1,
        borderRadius: 2,
        backgroundColor: isAdmin ? "#0F8B4C" : "#e8f5e9",
        color: isAdmin ? "#fff" : "text.primary",
      }}
    >
      <Typography variant="body2">{message.content}</Typography>
      <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mt: 0.5 }}>
        {formatTime(message.createdAt)}
      </Typography>
    </Box>
  );
}
