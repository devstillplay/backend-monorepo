"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
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
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "../../../lib/queries";
import { isCustomerSupportRole, useAuthStore } from "../../../store/auth";
import { useUserStore } from "../../../store/user";
import {
  STAFF_ROLES,
  type Employee,
} from "../../../lib/api";

type EditFormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

export default function StaffPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const authUser = useAuthStore((s) => s.user);
  const profile = useUserStore((s) => s.profile);
  const currentUserId = authUser?.id;
  useEffect(() => {
    if (isCustomerSupportRole(profile?.role ?? authUser?.role)) {
      router.replace("/dashboard");
    }
  }, [router, profile?.role, authUser?.role]);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<string>(STAFF_ROLES[0]);

  const [editing, setEditing] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: STAFF_ROLES[0],
  });
  const [deleting, setDeleting] = useState<Employee | null>(null);

  const { data: employees = [], isLoading, isError, error, refetch, isFetching } = useEmployees();
  const createMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

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

  const openEdit = (employee: Employee) => {
    setEditing(employee);
    setEditForm({
      firstName: employee.firstName ?? "",
      lastName: employee.lastName ?? "",
      email: employee.email ?? "",
      password: "",
      role: employee.role || STAFF_ROLES[0],
    });
    updateEmployeeMutation.reset();
  };

  const closeEdit = () => {
    if (updateEmployeeMutation.isPending) return;
    setEditing(null);
    setEditForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: STAFF_ROLES[0],
    });
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

  const handleSaveEdit = () => {
    if (!editing) return;
    const firstName = editForm.firstName.trim();
    const lastName = editForm.lastName.trim();
    const email = editForm.email.trim();
    if (!firstName || !lastName || !email) return;
    if (editForm.password && editForm.password.length < 6) return;

    const payload: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      password: string;
    }> = {
      firstName,
      lastName,
      email,
      role: editForm.role,
    };
    if (editForm.password.trim()) {
      payload.password = editForm.password;
    }

    updateEmployeeMutation.mutate(
      { id: editing.id, payload },
      { onSuccess: () => closeEdit() }
    );
  };

  const handleConfirmDelete = () => {
    if (!deleting) return;
    deleteEmployeeMutation.mutate(deleting.id, {
      onSuccess: () => {
        setDeleting(null);
      },
    });
  };

  const renderActions = (e: Employee) => {
    const isSelf = e.id === currentUserId;
    return (
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          disabled={updateEmployeeMutation.isPending}
          onClick={() => openEdit(e)}
        >
          Edit
        </Button>
        {!isSelf && (
          <>
            {e.active ? (
              <Button
                size="small"
                color="warning"
                variant="outlined"
                disabled={updateEmployeeMutation.isPending}
                onClick={() =>
                  updateEmployeeMutation.mutate({
                    id: e.id,
                    payload: { active: false },
                  })
                }
              >
                Suspend
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                disabled={updateEmployeeMutation.isPending}
                onClick={() =>
                  updateEmployeeMutation.mutate({
                    id: e.id,
                    payload: { active: true },
                  })
                }
                sx={{ backgroundColor: "#0b7b4c" }}
              >
                Reinstate
              </Button>
            )}
            <Button
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
              disabled={deleteEmployeeMutation.isPending}
              onClick={() => {
                deleteEmployeeMutation.reset();
                setDeleting(e);
              }}
            >
              Delete
            </Button>
          </>
        )}
        {isSelf && (
          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center" }}>
            Current account
          </Typography>
        )}
      </Stack>
    );
  };

  return (
    <Box
      component={motion.div}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <DashboardHeader search={search} onSearchChange={setSearch} />

      <Box
        sx={{
          background: "#ffffff",
          borderRadius: { xs: 2, md: 2 },
          padding: { xs: 1.5, md: 3.5 },
          paddingBottom: { xs: 3, md: 4 },
          marginTop: { xs: 1, md: 3 },
          minHeight: { xs: "auto", md: "calc(100vh - 220px)" },
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack spacing={2}>
          {updateEmployeeMutation.isError && !editing && (
            <Alert severity="error" onClose={() => updateEmployeeMutation.reset()}>
              {(updateEmployeeMutation.error as Error).message}
            </Alert>
          )}
          {deleteEmployeeMutation.isError && !deleting && (
            <Alert severity="error" onClose={() => deleteEmployeeMutation.reset()}>
              {(deleteEmployeeMutation.error as Error).message}
            </Alert>
          )}
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
                gridTemplateColumns: { md: "1.2fr 1.1fr 0.75fr 0.9fr 0.55fr 1.6fr" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>Name</Box>
              <Box>Email</Box>
              <Box>Employee #</Box>
              <Box>Role</Box>
              <Box>Status</Box>
              <Box>Actions</Box>
            </Box>

            <Box
              sx={{
                marginTop: 1,
                overflowX: "hidden",
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
                        gridTemplateColumns: { md: "1.2fr 1.1fr 0.75fr 0.9fr 0.55fr 1.6fr" },
                        alignItems: { md: "center" },
                        gap: { md: 1 },
                        backgroundColor: "#ffffff",
                        borderRadius: { xs: 2, md: 1 },
                        border: { xs: "1px solid", md: "none" },
                        borderColor: { xs: "divider", md: "transparent" },
                        "&:hover": { backgroundColor: "#fafafa" },
                      }}
                    >
                      <Box
                        sx={{
                          display: { xs: "grid", md: "none" },
                          gridTemplateColumns: "minmax(72px, 88px) minmax(0, 1fr)",
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
                            color: e.active ? "#0b7b4c" : "#c62828",
                            fontWeight: 500,
                          }}
                        >
                          {e.active ? "Active" : "Suspended"}
                        </span>
                        <span className="label">Actions</span>
                        <span className="value">{renderActions(e)}</span>
                      </Box>
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
                          <Typography variant="body2">{e.role ?? "—"}</Typography>
                        </Box>
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: e.active ? "#0b7b4c" : "#c62828",
                              fontWeight: 500,
                            }}
                          >
                            {e.active ? "Active" : "Suspended"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                            gap: 0.5,
                            flexWrap: "wrap",
                          }}
                        >
                          {renderActions(e)}
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
        PaperProps={{ sx: { borderRadius: { xs: 2, sm: 2 } } }}
        maxWidth="sm"
        fullWidth
        scroll="paper"
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

      <Dialog
        open={!!editing}
        onClose={closeEdit}
        PaperProps={{ sx: { borderRadius: { xs: 2, sm: 2 } } }}
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>Edit staff account</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="First name"
              required
              fullWidth
              value={editForm.firstName}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, firstName: e.target.value }))
              }
            />
            <TextField
              label="Last name"
              required
              fullWidth
              value={editForm.lastName}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, lastName: e.target.value }))
              }
            />
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              value={editForm.email}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <TextField
              label="New password"
              type="password"
              fullWidth
              value={editForm.password}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Leave blank to keep current password"
              helperText={
                editForm.password && editForm.password.length < 6
                  ? "Password must be at least 6 characters"
                  : "Optional — only fill if you want to change it"
              }
              error={!!editForm.password && editForm.password.length < 6}
            />
            <FormControl fullWidth required>
              <InputLabel id="edit-staff-role-label">Role</InputLabel>
              <Select
                labelId="edit-staff-role-label"
                value={editForm.role}
                label="Role"
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, role: e.target.value }))
                }
              >
                {STAFF_ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {updateEmployeeMutation.isError && (
              <Alert severity="error">
                {(updateEmployeeMutation.error as Error).message}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeEdit} disabled={updateEmployeeMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={
              !editForm.firstName.trim() ||
              !editForm.lastName.trim() ||
              !editForm.email.trim() ||
              (!!editForm.password && editForm.password.length < 6) ||
              updateEmployeeMutation.isPending
            }
            sx={{ backgroundColor: "#0b7b4c" }}
          >
            {updateEmployeeMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!deleting}
        onClose={() => {
          if (!deleteEmployeeMutation.isPending) setDeleting(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete staff account?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            This permanently deletes{" "}
            <strong>
              {[deleting?.firstName, deleting?.lastName].filter(Boolean).join(" ") ||
                deleting?.email}
            </strong>{" "}
            ({deleting?.email}). They will no longer be able to sign in.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            This cannot be undone.
          </Typography>
          {deleteEmployeeMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {(deleteEmployeeMutation.error as Error).message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleting(null)}
            disabled={deleteEmployeeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={deleteEmployeeMutation.isPending}
          >
            {deleteEmployeeMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
