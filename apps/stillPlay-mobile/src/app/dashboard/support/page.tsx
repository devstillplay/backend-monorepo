"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Pusher from "pusher-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { pusherConfig } from "@/lib/env";
import {
  createChatThread,
  getChatMessages,
  getChatThreads,
  sendChatMessage,
  type ChatMessage,
} from "@/lib/api";
import useAuthStore from "@/store/useAuthStore";

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  return isToday
    ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

export default function SupportPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<Pusher | null>(null);

  const { data: threadsData, isLoading: threadsLoading } = useQuery({
    queryKey: ["chat-threads"],
    queryFn: () => getChatThreads(token!),
    enabled: !!token,
    staleTime: 15 * 1000,
  });

  const thread = threadsData?.threads?.[0] ?? null;
  const threadId = thread?.id ?? null;

  const { data: messagesData, isLoading: messagesLoading, refetch } = useQuery({
    queryKey: ["chat-messages", threadId],
    queryFn: () => getChatMessages(token!, threadId!, 100),
    enabled: !!token && !!threadId,
    staleTime: 5 * 1000,
  });

  const createThreadMutation = useMutation({
    mutationFn: () => createChatThread(token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-threads"] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: (payload: { chatSupportId: string; content: string }) =>
      sendChatMessage(token!, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chat-messages", variables.chatSupportId],
      });
    },
  });

  const messages = messagesData?.messages ?? [];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Pusher real-time
  useEffect(() => {
    if (!pusherConfig.key || !threadId) return;

    if (!pusherRef.current) {
      pusherRef.current = new Pusher(pusherConfig.key, {
        cluster: pusherConfig.cluster,
      });
    }

    const channel = pusherRef.current.subscribe(`chat-${threadId}`);
    const handler = () => refetch();
    channel.bind("new-message", handler);

    return () => {
      channel.unbind("new-message", handler);
      pusherRef.current?.unsubscribe(`chat-${threadId}`);
    };
  }, [threadId, refetch]);

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content || sendMutation.isPending) return;

    if (!threadId) {
      setInputValue("");
      createThreadMutation.mutate(undefined, {
        onSuccess: (data) => {
          const newThreadId = data.thread.id;
          queryClient.invalidateQueries({ queryKey: ["chat-threads"] });
          sendMutation.mutate(
            { chatSupportId: newThreadId, content },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["chat-messages", newThreadId] });
              },
            }
          );
        },
      });
      return;
    }

    sendMutation.mutate(
      { chatSupportId: threadId, content },
      {
        onSuccess: () => {
          setInputValue("");
          refetch();
        },
      }
    );
  };

  if (threadsLoading && !thread) {
    return (
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid #e8e8e8",
          backgroundColor: "#f9f9f9",
        }}
      >
        <IconButton onClick={() => router.back()} size="small" sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Avatar sx={{ width: 36, height: 36, mr: 1.5 }} />
        <Typography fontWeight={700}>Support</Typography>
      </Stack>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {!threadId ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              textAlign: "center",
              py: 4,
            }}
          >
            <Typography variant="body2" gutterBottom>
              No active chat. Send a message below to start a conversation with our support team.
            </Typography>
          </Box>
        ) : messagesLoading && messages.length === 0 ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress size={32} />
          </Stack>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              isOwn={m.senderType === "customer" && m.senderId === user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          p: 2,
          borderTop: "1px solid #e8e8e8",
          backgroundColor: "#f9f9f9",
        }}
      >
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
          disabled={!inputValue.trim() || sendMutation.isPending || createThreadMutation.isPending}
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
          {sendMutation.isPending || createThreadMutation.isPending ? (
            <CircularProgress size={20} sx={{ color: "#fff" }} />
          ) : (
            <SendIcon fontSize="small" />
          )}
        </Box>
      </Stack>
    </Box>
  );
}

function MessageBubble({
  message,
  isOwn,
}: {
  message: ChatMessage;
  isOwn: boolean;
}) {
  return (
    <Box
      sx={{
        alignSelf: isOwn ? "flex-end" : "flex-start",
        maxWidth: "80%",
        px: 2,
        py: 1,
        borderRadius: 2,
        backgroundColor: isOwn ? "#0F8B4C" : "#e8f5e9",
        color: isOwn ? "#fff" : "text.primary",
      }}
    >
      <Typography variant="body2">{message.content}</Typography>
      <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mt: 0.5 }}>
        {formatTime(message.createdAt)}
      </Typography>
    </Box>
  );
}
