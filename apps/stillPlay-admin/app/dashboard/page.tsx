"use client";

import BlockIcon from "@mui/icons-material/Block";
import CloseIcon from "@mui/icons-material/Close";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import RefreshIcon from "@mui/icons-material/Refresh";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Pagination,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import RowActions from "../../components/dashboard/RowActions";
import {
  useAdminUsers,
  useUpdateAdminUser,
  useDeleteAdminUser,
  useUserLoanHistory,
  useUserWallet,
  useUserRepayments,
  useRequestLoanForUser,
} from "../../lib/queries";
import { useAuthStore } from "../../store/auth";
import { uploadImage, type AdminUser, type Loan } from "../../lib/api";

function toTableRow(u: AdminUser): {
  id: string;
  name: string;
  code: string;
  behaviour: string;
  suspended: boolean;
  picture?: string | null;
} {
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || "—";
  return {
    id: u.id,
    name,
    code: u.userNumber ?? u.id,
    behaviour: "Good",
    suspended: u.suspended ?? false,
    picture: u.picture ?? null,
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [search, setSearch] = useState("");
  const [userListTab, setUserListTab] = useState<"all" | "suspended">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatUser, setChatUser] = useState<null | {
    id: string;
    name: string;
    code: string;
  }>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [messages, setMessages] = useState<
    { id: number; sender: "user" | "admin"; text: string; time: string }[]
  >([]);
  const [chatMessage, setChatMessage] = useState("");
  const [deleteConfirmRow, setDeleteConfirmRow] = useState<{
    id: string;
    name: string;
    code: string;
  } | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    picture: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [loansUser, setLoansUser] = useState<{ id: string; name: string } | null>(null);
  const [requestLoanAmount, setRequestLoanAmount] = useState("");
  const [requestLoanPurpose, setRequestLoanPurpose] = useState("");

  const { data: users = [], isLoading, isError, error, refetch, isFetching } = useAdminUsers();
  const updateUserMutation = useUpdateAdminUser();
  const deleteUserMutation = useDeleteAdminUser();
  const { data: loansData } = useUserLoanHistory(loansUser?.id ?? null);
  const { data: walletData } = useUserWallet(loansUser?.id ?? null);
  const { data: repaymentsData } = useUserRepayments(loansUser?.id ?? null);
  const requestLoanMutation = useRequestLoanForUser();
  const loans = loansData?.loans ?? [];
  const wallet = walletData;
  const repayments = repaymentsData?.repayments ?? [];
  const hasActiveLoan = loans.some((l: Loan) =>
    ["PENDING", "APPROVED", "DISBURSED"].includes(l.status)
  );

  // If users request failed due to invalid token (401), auth store was reset — lock out to login
  useEffect(() => {
    if (isError && !token) {
      router.replace("/");
    }
  }, [isError, token, router]);

  const rows = useMemo(() => users.map(toTableRow), [users]);
  const filteredRows = useMemo(() => {
    let list = rows;
    if (userListTab === "suspended") {
      list = list.filter((r) => r.suspended);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q)
      );
    }
    return list;
  }, [rows, search, userListTab]);

  const rowsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const pageRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  const handleUserListTabChange = (_: React.SyntheticEvent, value: "all" | "suspended") => {
    setUserListTab(value);
    setPage(1);
  };

  useEffect(() => {
    if (!chatUser) {
      return;
    }
    setIsChatLoading(true);
    const timeoutId = window.setTimeout(() => {
      setMessages([
        {
          id: 1,
          sender: "user",
          text: "Hi, I need help with my loan approval.",
          time: "09:20",
        },
        {
          id: 2,
          sender: "admin",
          text: "Sure, can you confirm your offline code?",
          time: "09:22",
        },
        {
          id: 3,
          sender: "user",
          text: chatUser.code,
          time: "09:23",
        },
      ]);
      setIsChatLoading(false);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [chatUser]);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <DashboardHeader search={search} onSearchChange={setSearch} />

      <Box
        sx={{
          background: "#ffffff",
          borderRadius: { xs: 0, md: 2 },
          padding: { xs: 2, md: 3.5 },
          paddingBottom: { xs: 3, md: 4 },
          marginTop: { xs: 2, md: 3 },
          marginX: { xs: -2, md: 0 },
          minHeight: "calc(100vh - 220px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack sx={{ marginTop: "auto" }} spacing={2}>
          <Box
            sx={{
              borderRadius: 3,
              padding: 2,
              backgroundColor: "#f3f3f3",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack
              spacing={2}
              sx={{ marginBottom: 2, paddingTop: 2, paddingLeft: 2 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={1}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, marginTop: { xs: 1, md: 2 } }}
                >
                  USERS
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  aria-label="Refresh list"
                >
                  <RefreshIcon />
                </IconButton>
              </Stack>
              <Tabs
                value={userListTab}
                onChange={handleUserListTabChange}
                sx={{
                  minHeight: 36,
                  "& .MuiTab-root": { minHeight: 36, textTransform: "none", fontWeight: 600 },
                  "& .MuiTabs-indicator": { backgroundColor: "#0b7b4c" },
                  "& .Mui-selected": { color: "#0b7b4c" },
                }}
              >
                <Tab label="All profiles" value="all" />
                <Tab label="Suspended" value="suspended" />
              </Tabs>
            </Stack>
            <Box
              sx={{
                fontSize: 12,
                color: "text.secondary",
                marginBottom: 2,
                backgroundColor: "#fff",
                borderRadius: 999,
                paddingY: 1.2,
                paddingX: 3,
                display: { xs: "none", md: "grid" },
                gridTemplateColumns: { md: "2fr 1fr 1fr 0.9fr 1fr" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>Name</Box>
              <Box>Offline code</Box>
              <Box>Behaviour</Box>
              <Box>Status</Box>
              <Box>Action</Box>
            </Box>
            <Box
              sx={{
                marginTop: 1,
                maxHeight: { xs: 420, sm: "none" },
                overflowY: { xs: "auto", sm: "visible" },
              }}
            >
              {isLoading ? (
                <Stack alignItems="center" py={4}>
                  <CircularProgress sx={{ color: "#0b7b4c" }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Loading users...
                  </Typography>
                </Stack>
              ) : isError ? (
                <Stack alignItems="center" py={4} spacing={2}>
                  <Typography color="error">
                    {(error as Error).message}
                  </Typography>
                  <Button variant="outlined" onClick={() => refetch()} size="small">
                    Retry
                  </Button>
                </Stack>
              ) : (
              <Stack spacing={0}>
                {pageRows.map((row, index) => {
                  const absoluteIndex = startIndex + index;
                  return (
                    <Box
                      key={`${row.id}`}
                      onClick={() => setSelectedIndex(absoluteIndex)}
                      sx={{
                        paddingY: 2,
                        paddingX: { xs: 2, md: 3 },
                        borderBottom:
                          index === pageRows.length - 1
                            ? "none"
                            : "1px solid #fff",
                        backgroundColor:
                          selectedIndex === absoluteIndex
                            ? "#ffffff"
                            : "transparent",
                        display: { xs: "flex", md: "grid" },
                        flexDirection: { xs: "column", md: "unset" },
                        gridTemplateColumns: { md: "2fr 1fr 1fr 0.9fr 1fr" },
                        alignItems: "center",
                        gap: { xs: 1.5, md: 1 },
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                        borderRadius: 1,
                        outline:
                          selectedIndex === absoluteIndex
                            ? "1px solid #32b25c"
                            : "1px solid transparent",
                        outlineOffset: "-1px",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          outline: "1px solid #32b25c",
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          src={row.picture || undefined}
                          sx={{ width: 32, height: 32 }}
                        >
                          {(row.name?.[0] ?? "?").toUpperCase()}
                        </Avatar>
                        <Typography variant="body2">{row.name}</Typography>
                      </Stack>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: { xs: "block", md: "none" } }}
                        >
                          Offline code
                        </Typography>
                        <Typography variant="body2">{row.code}</Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: { xs: "block", md: "none" } }}
                        >
                          Behaviour
                        </Typography>
                        {selectedIndex === absoluteIndex ? (
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <RowActions
                              isVisible
                              suspended={row.suspended}
                              onChatClick={() => {
                                setChatUser({
                                  id: row.id,
                                  name: row.name,
                                  code: row.code,
                                });
                                setIsChatOpen(true);
                              }}
                              onLoansClick={() => {
                                setLoansUser({ id: row.id, name: row.name });
                                setRequestLoanAmount("");
                                setRequestLoanPurpose("");
                              }}
                              onEditClick={() => {
                                const user = users.find((u) => u.id === row.id);
                                if (user) {
                                  setEditUser(user);
                                  setEditForm({
                                    firstName: user.firstName ?? "",
                                    lastName: user.lastName ?? "",
                                    picture: user.picture ?? "",
                                  });
                                }
                              }}
                              onDeleteClick={() => {
                                setDeleteConfirmRow({
                                  id: row.id,
                                  name: row.name,
                                  code: row.code,
                                });
                              }}
                            />
                          </Box>
                        ) : (
                          <Typography variant="body2">
                            {row.behaviour}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: { xs: "none", md: "flex" },
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: row.suspended ? "error.main" : "#0b7b4c",
                            fontWeight: 500,
                          }}
                        >
                          {row.suspended ? "Suspended" : "Active"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gridColumn: { xs: "1 / -1", md: "auto" },
                          justifyContent: { xs: "flex-start", md: "center" },
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          color={row.suspended ? "success" : "warning"}
                          startIcon={
                            row.suspended ? (
                              <LockOpenIcon sx={{ fontSize: 18 }} />
                            ) : (
                              <BlockIcon sx={{ fontSize: 18 }} />
                            )
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            updateUserMutation.mutate({
                              id: row.id,
                              payload: { suspended: !row.suspended },
                            });
                          }}
                          disabled={updateUserMutation.isPending}
                          sx={{ minWidth: 0, px: 1 }}
                        >
                          {row.suspended ? "Unsuspend" : "Suspend"}
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
              )}
            </Box>
            <Stack alignItems="center" sx={{ marginTop: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => {
                  setPage(value);
                  setSelectedIndex((value - 1) * rowsPerPage);
                }}
                color="primary"
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Drawer
        anchor="right"
        open={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatMessage("");
        }}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 360 },
            padding: 3,
          },
        }}
      >
        <Stack spacing={3} sx={{ height: "100%" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={700}>
                {chatUser ? chatUser.name : "User chat"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User ID: {chatUser?.id ?? "--"}
              </Typography>
            </Stack>
            <IconButton
              aria-label="Close chat"
              onClick={() => {
                setIsChatOpen(false);
                setChatMessage("");
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <Box
            sx={{
              flex: 1,
              backgroundColor: "#f3f3f3",
              borderRadius: 1,
              padding: 2,
              overflowY: "auto",
            }}
          >
            <Stack spacing={2}>
              {isChatLoading ? (
                <Typography color="text.secondary">Loading chat...</Typography>
              ) : (
                messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      alignSelf:
                        message.sender === "admin" ? "flex-end" : "flex-start",
                      backgroundColor:
                        message.sender === "admin" ? "#0b7b4c" : "#ffffff",
                      color:
                        message.sender === "admin" ? "#ffffff" : "text.primary",
                      padding: 1.5,
                      borderRadius: 1,
                      maxWidth: "80%",
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {message.time}
                    </Typography>
                  </Box>
                ))
              )}
            </Stack>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              fullWidth
              placeholder="Type a message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  backgroundColor: "#fff",
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={() => {
                if (!chatMessage.trim()) return;
                const now = new Date();
                const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
                setMessages((prev) => [
                  ...prev,
                  {
                    id: prev.length + 1,
                    sender: "admin",
                    text: chatMessage.trim(),
                    time,
                  },
                ]);
                setChatMessage("");
              }}
              sx={{
                backgroundColor: "#0b7b4c",
                color: "#fff",
                "&:hover": { backgroundColor: "#096b3d" },
              }}
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Drawer>

      <Drawer
        anchor="right"
        open={!!loansUser}
        onClose={() => setLoansUser(null)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420 },
            padding: 2,
          },
        }}
      >
        <Stack spacing={2} sx={{ height: "100%", overflow: "hidden" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>
              {loansUser?.name ?? "User"} – Loans & wallet
            </Typography>
            <IconButton aria-label="Close" onClick={() => setLoansUser(null)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {loansUser && (
              <Stack spacing={2}>
                {wallet != null && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "#f3f3f3",
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Wallet
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#0b7b4c" }}>
                      {wallet.currency} {Number(wallet.balance).toLocaleString()}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Loan history
                  </Typography>
                  {loans.length === 0 ? (
                    <Typography variant="body2">No loans yet.</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {loans.map((loan: Loan) => (
                        <Box
                          key={loan.id}
                          sx={{
                            p: 1.5,
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" fontWeight={600}>
                              NGN {Number(loan.amount).toLocaleString()}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  loan.status === "REPAID"
                                    ? "#22c55e"
                                    : loan.status === "PENDING" || loan.status === "APPROVED"
                                      ? "#f59e0b"
                                      : "#6b7280",
                                fontWeight: 600,
                              }}
                            >
                              {loan.status}
                            </Typography>
                          </Stack>
                          {loan.purpose && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {loan.purpose}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            Repaid: {Number(loan.amountRepaid).toLocaleString()} · Created{" "}
                            {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : "—"}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Repayment history
                  </Typography>
                  {repayments.length === 0 ? (
                    <Typography variant="body2">No repayments yet.</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {repayments.slice(0, 10).map((r: { id: string; amount: number; repaidAt: string }) => (
                        <Box
                          key={r.id}
                          sx={{
                            py: 0.5,
                            px: 1,
                            borderRadius: 1,
                            backgroundColor: "#f9fafb",
                          }}
                        >
                          <Typography variant="body2">
                            {Number(r.amount).toLocaleString()} ·{" "}
                            {new Date(r.repaidAt).toLocaleString()}
                          </Typography>
                        </Box>
                      ))}
                      {repayments.length > 10 && (
                        <Typography variant="caption" color="text.secondary">
                          +{repayments.length - 10} more
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Request loan for user
                  </Typography>
                  {hasActiveLoan && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, p: 1.5, bgcolor: "action.hover", borderRadius: 1 }}
                    >
                      This user already has a pending or active loan. Complete or
                      reject it before requesting another.
                    </Typography>
                  )}
                  <Stack spacing={1.5}>
                    <TextField
                      label="Amount"
                      type="number"
                      size="small"
                      fullWidth
                      value={requestLoanAmount}
                      onChange={(e) => setRequestLoanAmount(e.target.value)}
                      placeholder="e.g. 50000"
                      inputProps={{ min: 1 }}
                      disabled={hasActiveLoan}
                    />
                    <TextField
                      label="Purpose (optional)"
                      size="small"
                      fullWidth
                      value={requestLoanPurpose}
                      onChange={(e) => setRequestLoanPurpose(e.target.value)}
                      placeholder="e.g. Working capital"
                      disabled={hasActiveLoan}
                    />
                    {requestLoanMutation.isError && (
                      <Typography variant="body2" color="error">
                        {(requestLoanMutation.error as Error).message}
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      disabled={
                        hasActiveLoan ||
                        requestLoanMutation.isPending ||
                        !requestLoanAmount ||
                        Number(requestLoanAmount) <= 0
                      }
                      onClick={() => {
                        if (!loansUser || !requestLoanAmount || Number(requestLoanAmount) <= 0)
                          return;
                        requestLoanMutation.mutate(
                          {
                            userId: loansUser.id,
                            amount: Number(requestLoanAmount),
                            purpose: requestLoanPurpose.trim() || undefined,
                          },
                          {
                            onSuccess: () => {
                              setRequestLoanAmount("");
                              setRequestLoanPurpose("");
                            },
                          }
                        );
                      }}
                      sx={{ backgroundColor: "#0b7b4c" }}
                    >
                      {requestLoanMutation.isPending ? "Submitting..." : "Request loan"}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            )}
          </Box>
        </Stack>
      </Drawer>

      <Dialog
        open={!!deleteConfirmRow}
        onClose={() => !deleteUserMutation.isPending && setDeleteConfirmRow(null)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Delete user</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{deleteConfirmRow?.name ?? ""}</strong>? Their wallet and
            loan history will also be deleted. This action cannot be undone.
          </Typography>
          {deleteUserMutation.isError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {(deleteUserMutation.error as Error).message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteConfirmRow(null)}
            disabled={deleteUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleteUserMutation.isPending}
            onClick={() => {
              if (!deleteConfirmRow) return;
              deleteUserMutation.mutate(deleteConfirmRow.id, {
                onSuccess: () => {
                  setDeleteConfirmRow(null);
                  setSelectedIndex(-1);
                },
              });
            }}
          >
            {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!editUser}
        onClose={() => !updateUserMutation.isPending && setEditUser(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 360 } }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit user</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Stack alignItems="center" spacing={1}>
              <Avatar
                src={editForm.picture || undefined}
                sx={{ width: 80, height: 80 }}
              >
                {(editForm.firstName?.[0] || editForm.lastName?.[0] || editUser?.email?.[0] || "?").toUpperCase()}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {editUser?.email}
              </Typography>
              <input
                key={imageInputKey}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="edit-user-image-upload"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !editUser) return;
                  setUploadingImage(true);
                  try {
                    const result = await uploadImage(file, {
                      folder: "stillplay/avatars",
                      token,
                    });
                    setEditForm((f) => ({ ...f, picture: result.secureUrl }));
                    updateUserMutation.mutate(
                      { id: editUser.id, payload: { picture: result.secureUrl } },
                      {
                        onSuccess: () => {
                          setEditUser((u) =>
                            u ? { ...u, picture: result.secureUrl } : null
                          );
                        },
                      }
                    );
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setUploadingImage(false);
                    setImageInputKey((k) => k + 1);
                  }
                }}
              />
              <Button
                size="small"
                variant="outlined"
                component="label"
                htmlFor="edit-user-image-upload"
                disabled={uploadingImage || updateUserMutation.isPending}
                sx={{ mt: 0.5 }}
              >
                {uploadingImage
                  ? "Uploading..."
                  : updateUserMutation.isPending
                    ? "Saving..."
                    : "Upload image"}
              </Button>
            </Stack>
            <TextField
              label="First name"
              value={editForm.firstName}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, firstName: e.target.value }))
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Last name"
              value={editForm.lastName}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, lastName: e.target.value }))
              }
              fullWidth
              size="small"
            />
            {updateUserMutation.isError && (
              <Typography color="error" variant="body2">
                {(updateUserMutation.error as Error).message}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setEditUser(null)}
            disabled={updateUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={updateUserMutation.isPending}
            onClick={() => {
              if (!editUser) return;
              updateUserMutation.mutate(
                {
                  id: editUser.id,
                  payload: {
                    firstName: editForm.firstName.trim() || undefined,
                    lastName: editForm.lastName.trim() || undefined,
                    picture: editForm.picture.trim() || undefined,
                  },
                },
                {
                  onSuccess: () => setEditUser(null),
                }
              );
            }}
            sx={{ backgroundColor: "#0b7b4c" }}
          >
            {updateUserMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
