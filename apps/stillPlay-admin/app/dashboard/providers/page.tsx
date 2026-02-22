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
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import { useProviders, useCreateProvider } from "../../../lib/queries";
import { getProviderFinalAmount, type Provider } from "../../../lib/api";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return "—";
  }
}

function formatMoney(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ProvidersPage() {
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAgreedAmount, setFormAgreedAmount] = useState("");
  const [formPercentage, setFormPercentage] = useState("");
  const [formAgreedAt, setFormAgreedAt] = useState("");
  const [formAgreedTerms, setFormAgreedTerms] = useState("");

  const { data: providers = [], isLoading, isError, error, refetch, isFetching } = useProviders();
  const createMutation = useCreateProvider();

  const filtered = useMemo(() => {
    if (!search.trim()) return providers;
    const q = search.trim().toLowerCase();
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.email ?? "").toLowerCase().includes(q) ||
        (p.providerNumber ?? "").toLowerCase().includes(q)
    );
  }, [providers, search]);

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormAgreedAmount("");
    setFormPercentage("");
    setFormAgreedAt("");
    setFormAgreedTerms("");
    setOpenCreate(false);
  };

  const handleCreate = () => {
    const name = formName.trim();
    if (!name) return;
    const amount = formAgreedAmount.trim() ? parseFloat(formAgreedAmount) : undefined;
    if (amount !== undefined && (isNaN(amount) || amount < 0)) return;
    const percentage = formPercentage.trim() ? parseFloat(formPercentage) : undefined;
    if (percentage !== undefined && (isNaN(percentage) || percentage < 0)) return;
    createMutation.mutate(
      {
        name,
        email: formEmail.trim() || undefined,
        agreedAmount: amount,
        percentageToAdd: percentage,
        agreedAt: formAgreedAt.trim() || undefined,
        agreedTerms: formAgreedTerms.trim() || undefined,
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
              sx={{ marginBottom: 2, paddingTop: 2, paddingLeft: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                PROVIDERS
              </Typography>
              <Stack direction="row" spacing={1}>
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
                  Register provider
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
                gridTemplateColumns: { md: "1.2fr 0.9fr 1fr 0.9fr 0.7fr 0.9fr 0.9fr 1.2fr" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>Name</Box>
              <Box>Provider #</Box>
              <Box>Email</Box>
              <Box>Amount</Box>
              <Box>Agreed %</Box>
              <Box>Final amount</Box>
              <Box>Agreed date</Box>
              <Box>Agreed terms</Box>
            </Box>

            <Box sx={{ marginTop: 1 }}>
              {isLoading ? (
                <Stack alignItems="center" py={4}>
                  <CircularProgress sx={{ color: "#0b7b4c" }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Loading providers...
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
                  No providers yet. Register one to get started.
                </Typography>
              ) : (
                <Stack spacing={0}>
                  {filtered.map((p: Provider) => (
                    <Box
                      key={p.id}
                      sx={{
                        paddingY: 2,
                        paddingX: { xs: 2, md: 3 },
                        borderBottom: "1px solid #fff",
                        display: { xs: "flex", md: "grid" },
                        flexDirection: { xs: "column", md: "unset" },
                        gridTemplateColumns: { md: "1.2fr 0.9fr 1fr 0.9fr 0.7fr 0.9fr 0.9fr 1.2fr" },
                        alignItems: "center",
                        gap: { xs: 1, md: 1 },
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
                        "&:hover": { backgroundColor: "#fafafa" },
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {p.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {p.providerNumber ?? "—"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {p.email ?? "—"}
                      </Typography>
                      <Typography variant="body2">
                        {formatMoney(p.agreedAmount)}
                      </Typography>
                      <Typography variant="body2">
                        {p.percentageToAdd != null ? `${p.percentageToAdd}%` : "—"}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatMoney(getProviderFinalAmount(p))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(p.agreedAt)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 200,
                        }}
                      >
                        {p.agreedTerms ?? "—"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Box>
        </Stack>
      </Box>

      <Dialog open={openCreate} onClose={resetForm} PaperProps={{ sx: { borderRadius: 2 } }} maxWidth="sm" fullWidth>
        <DialogTitle>Register provider</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              required
              fullWidth
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Provider or company name"
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="provider@example.com"
            />
            <TextField
              label="Agreed amount (NGN)"
              type="number"
              inputProps={{ min: 0, step: 1000 }}
              fullWidth
              value={formAgreedAmount}
              onChange={(e) => setFormAgreedAmount(e.target.value)}
              placeholder="e.g. 1000000"
              helperText="Capital amount the provider is giving"
            />
            <TextField
              label="Agreed percentage (%)"
              type="number"
              inputProps={{ min: 0, step: 0.5 }}
              fullWidth
              value={formPercentage}
              onChange={(e) => setFormPercentage(e.target.value)}
              placeholder="e.g. 5"
              helperText="Percentage added on their share of repayments"
            />
            <TextField
              label="Agreed date"
              type="date"
              fullWidth
              value={formAgreedAt}
              onChange={(e) => setFormAgreedAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Agreed terms / notes"
              multiline
              rows={3}
              fullWidth
              value={formAgreedTerms}
              onChange={(e) => setFormAgreedTerms(e.target.value)}
              placeholder="Optional notes or terms"
            />
            {createMutation.isError && (
              <Alert severity="error">{(createMutation.error as Error).message}</Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetForm}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!formName.trim() || createMutation.isPending}
            sx={{ backgroundColor: "#0b7b4c" }}
          >
            {createMutation.isPending ? "Creating..." : "Register"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
