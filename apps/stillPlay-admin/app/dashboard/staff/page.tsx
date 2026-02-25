"use client";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import { useEmployees, useCreateEmployee } from "../../../lib/queries";
import { useAuthStore } from "../../../store/auth";
import {
  STAFF_ROLES,
  type Employee,
} from "../../../lib/api";

export default function StaffPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<string>(STAFF_ROLES[0]);

  const { data: employees = [], isLoading, isError, error, refetch, isFetching } = useEmployees();
  const createMutation = useCreateEmployee();

  // If staff request failed due to invalid token (401), auth store was reset — lock out to login
  useEffect(() => {
    if (isError && !token) {
      router.replace("/");
    }
  }, [isError, token, router]);

  const filtered = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.trim().toLowerCase();
    return employees.filter(
      (e) =>
        e.firstName?.toLowerCase().includes(q) ||
        e.lastName?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.employeeNumber?.toLowerCase().includes(q) ||
        e.role?.toLowerCase().includes(q)
    );
  }, [employees, search]);

  const resetForm = () => {
    setFormFirstName("");
    setFormLastName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole(STAFF_ROLES[0]);
    setOpenCreate(false);
  };

  const handleCreate = () => {
    const firstName = formFirstName.trim();
    const lastName = formLastName.trim();
    const email = formEmail.trim();
    const password = formPassword;
    if (!firstName || !lastName || !email || !password) return;
    createMutation.mutate(
      {
        firstName,
        lastName,
        email,
        password,
        role: formRole,
      },
      { onSuccess: () => resetForm() }
    );
  };

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
        <Stack spacing={2}>
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
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
              sx={{ marginBottom: 2, paddingTop: 2, paddingLeft: { xs: 1, md: 2 } }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.25rem" } }}>
                STAFF
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <IconButton
                  size="small"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  aria-label="Refresh list"
                >
                  <RefreshIcon />
                </IconButton>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenCreate(true)}
                  sx={{ backgroundColor: "#0b7b4c" }}
                >
                  Create Admin Account
                </Button>
              </Stack>
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
                gridTemplateColumns: { md: "1.5fr 1.2fr 0.9fr 1.2fr 0.6fr" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>Name</Box>
              <Box>Email</Box>
              <Box>Employee #</Box>
              <Box>Role</Box>
              <Box>Status</Box>
            </Box>

            <Box
              sx={{
                marginTop: 1,
                overflowX: { xs: "auto", md: "visible" },
                overflowY: { xs: "auto", md: "visible" },
                maxHeight: { xs: "70vh", md: "none" },
                WebkitOverflowScrolling: "touch",
              }}
            >
              {isLoading ? (
                <Stack alignItems="center" py={4}>
                  <CircularProgress sx={{ color: "#0b7b4c" }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Loading staff...
                  </Typography>
                </Stack>
              ) : isError ? (
                <Stack alignItems="center" py={4} spacing={2}>
                  <Typography color="error">{(error as Error).message}</Typography>
                  <Button variant="outlined" onClick={() => refetch()} size="small">
                    Retry
                  </Button>
                </Stack>
              ) : filtered.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                  No staff yet. Create an admin account to get started.
                </Typography>
              ) : (
                <Stack spacing={{ xs: 1.5, md: 0 }}>
                  {filtered.map((e: Employee) => (
                    <Box
                      key={e.id}
                      sx={{
                        paddingY: { xs: 1.5, md: 2 },
                        paddingX: { xs: 2, md: 3 },
                        borderBottom: { xs: "none", md: "1px solid #fff" },
                        display: { xs: "block", md: "grid" },
                        gridTemplateColumns: { md: "1.5fr 1.2fr 0.9fr 1.2fr 0.6fr" },
                        alignItems: { md: "center" },
                        gap: { md: 1 },
                        backgroundColor: "#ffffff",
                        borderRadius: { xs: 2, md: 1 },
                        border: { xs: "1px solid", md: "none" },
                        borderColor: { xs: "divider", md: "transparent" },
                        "&:hover": { backgroundColor: "#fafafa" },
                      }}
                    >
                      {/* Mobile: label-value card rows */}
                      <Box
                        sx={{
                          display: { xs: "grid", md: "none" },
                          gridTemplateColumns: "100px 1fr",
                          gap: "4px 12px",
                          alignItems: "baseline",
                          "& > .label": { color: "text.secondary", fontSize: "0.75rem" },
                          "& > .value": { fontSize: "0.875rem", wordBreak: "break-word" },
                        }}
                      >
                        <span className="label">Name</span>
                        <span className="value" style={{ fontWeight: 600 }}>
                          {[e.firstName, e.lastName].filter(Boolean).join(" ") || "—"}
                        </span>
                        <span className="label">Email</span>
                        <span className="value">{e.email ?? "—"}</span>
                        <span className="label">Employee #</span>
                        <span className="value">{e.employeeNumber ?? "—"}</span>
                        <span className="label">Role</span>
                        <span className="value">{e.role ?? "—"}</span>
                        <span className="label">Status</span>
                        <span
                          className="value"
                          style={{
                            color: e.active ? "#0b7b4c" : undefined,
                            fontWeight: 500,
                          }}
                        >
                          {e.active ? "Active" : "Inactive"}
                        </span>
                      </Box>
                      {/* Desktop: table row */}
                      <>
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                          <Typography variant="body2" fontWeight={600}>
                            {[e.firstName, e.lastName].filter(Boolean).join(" ") || "—"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                          <Typography variant="body2" color="text.secondary">
                            {e.email ?? "—"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                          <Typography variant="body2" color="text.secondary">
                            {e.employeeNumber ?? "—"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                          <Typography variant="body2">
                            {e.role ?? "—"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: e.active ? "#0b7b4c" : "text.secondary",
                              fontWeight: 500,
                            }}
                          >
                            {e.active ? "Active" : "Inactive"}
                          </Typography>
                        </Box>
                      </>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Box>
        </Stack>
      </Box>

      <Dialog
        open={openCreate}
        onClose={resetForm}
        PaperProps={{ sx: { borderRadius: 2 } }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Admin Account</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="First name"
              required
              fullWidth
              value={formFirstName}
              onChange={(e) => setFormFirstName(e.target.value)}
              placeholder="Jane"
            />
            <TextField
              label="Last name"
              required
              fullWidth
              value={formLastName}
              onChange={(e) => setFormLastName(e.target.value)}
              placeholder="Doe"
            />
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="admin@example.com"
            />
            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              placeholder="••••••••"
            />
            <FormControl fullWidth required>
              <InputLabel id="staff-role-label">Role</InputLabel>
              <Select
                labelId="staff-role-label"
                value={formRole}
                label="Role"
                onChange={(e) => setFormRole(e.target.value)}
              >
                {STAFF_ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {createMutation.isError && (
              <Alert severity="error">
                {(createMutation.error as Error).message}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetForm}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={
              !formFirstName.trim() ||
              !formLastName.trim() ||
              !formEmail.trim() ||
              !formPassword ||
              createMutation.isPending
            }
            sx={{ backgroundColor: "#0b7b4c" }}
          >
            {createMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
