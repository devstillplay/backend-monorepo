"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import { useProviders, useCreateProvider, useDeleteProvider, useBudpayBanks } from "../../../lib/queries";
import { isCustomerSupportRole, useAuthStore } from "../../../store/auth";
import { useUserStore } from "../../../store/user";
import { getProviderFinalAmount, getCompanyCutAmount, type Provider } from "../../../lib/api";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString();
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

/** Row in the provider table */
function ProviderRow({
  p,
  onDelete,
}: {
  p: Provider;
  onDelete?: (p: Provider) => void;
}) {
  const totalPct = p.percentageToAdd ?? 0;
  const providerPct = p.providerCutPercentage ?? 0;
  const companyPct = Math.max(0, totalPct - providerPct);
  const providerFinal = getProviderFinalAmount(p);
  const companyCut = getCompanyCutAmount(p);

  return (
    <Box
      sx={{
        paddingY: 2,
        paddingX: { xs: 2, md: 3 },
        borderBottom: "1px solid #f3f3f3",
        display: { xs: "flex", md: "grid" },
        flexDirection: { xs: "column", md: "unset" },
        gridTemplateColumns: { md: "1.2fr 0.8fr 1fr 0.9fr 1fr 1.1fr 1.1fr 0.9fr 0.8fr 0.6fr" },
        alignItems: "center",
        gap: { xs: 0.5, md: 1 },
        backgroundColor: "#ffffff",
        borderRadius: 1,
        "&:hover": { backgroundColor: "#fafafa" },
      }}
    >
      {/* Name */}
      <Stack spacing={0.2}>
        <Typography variant="body2" fontWeight={600}>
          {p.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {p.providerNumber ?? "—"}
        </Typography>
      </Stack>

      {/* Email */}
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, wordBreak: "break-all" }}>
        {p.email ?? "—"}
      </Typography>

      {/* Bank / Account */}
      <Stack spacing={0.2}>
        <Typography variant="body2" fontWeight={500}>
          {p.bankName ?? "—"}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
          {p.accountNumber ?? "—"}
        </Typography>
      </Stack>

      {/* Amount funded (initial) */}
      <Typography variant="body2">{formatMoney(p.agreedAmount)}</Typography>

      {/* Percentage split */}
      <Stack spacing={0.2}>
        <Typography variant="body2" fontWeight={500}>
          {totalPct > 0 ? `${totalPct}% total` : "—"}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography variant="caption" sx={{ color: "#0b7b4c", fontWeight: 600 }}>
            {providerPct}% provider
          </Typography>
          <Typography variant="caption" color="text.secondary">
            /
          </Typography>
          <Typography variant="caption" sx={{ color: "#b45309", fontWeight: 600 }}>
            {companyPct}% company
          </Typography>
        </Stack>
      </Stack>

      {/* Provider return */}
      <Tooltip title="Amount returned to provider (principal + their cut)" placement="top">
        <Stack spacing={0.2}>
          <Typography variant="body2" fontWeight={500} sx={{ color: "#0b7b4c" }}>
            {formatMoney(providerFinal)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            provider return
          </Typography>
        </Stack>
      </Tooltip>

      {/* Company earnings */}
      <Tooltip title="Company's earnings from this provider's loans" placement="top">
        <Stack spacing={0.2}>
          <Typography variant="body2" fontWeight={500} sx={{ color: "#b45309" }}>
            {formatMoney(companyCut)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            company cut
          </Typography>
        </Stack>
      </Tooltip>

      {/* Amount owed (funded - paid) / Total paid */}
      <Stack spacing={0.2}>
        <Typography variant="body2" fontWeight={500} sx={{ color: "#0b7b4c" }}>
          {formatMoney(p.balance ?? 0)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          owed
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
          paid: {formatMoney(p.totalPaid ?? 0)}
        </Typography>
      </Stack>

      {/* Agreed date */}
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
        {formatDate(p.agreedAt)}
      </Typography>

      {/* Delete */}
      {onDelete && (
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(p)}
          aria-label="Delete provider"
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}

export default function ProvidersPage() {
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const profile = useUserStore((s) => s.profile);
  useEffect(() => {
    if (isCustomerSupportRole(profile?.role ?? authUser?.role)) {
      router.replace("/dashboard");
    }
  }, [router, profile?.role, authUser?.role]);

  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Provider | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAccountNumber, setFormAccountNumber] = useState("");
  const [formBankName, setFormBankName] = useState("");
  const [formBankCode, setFormBankCode] = useState("");
  const [formAgreedAmount, setFormAgreedAmount] = useState("");
  const [formTotalPct, setFormTotalPct] = useState("");
  const [formProviderPct, setFormProviderPct] = useState("");
  const [formAgreedAt, setFormAgreedAt] = useState("");
  const [formAgreedTerms, setFormAgreedTerms] = useState("");

  const { data: providers = [], isLoading, isError, error, refetch, isFetching } = useProviders();
  const createMutation = useCreateProvider();
  const deleteMutation = useDeleteProvider();
  const { data: banksData } = useBudpayBanks("NGN");
  const banks = banksData?.banks ?? [];

  const filtered = useMemo(() => {
    if (!search.trim()) return providers;
    const q = search.trim().toLowerCase();
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.email ?? "").toLowerCase().includes(q) ||
        (p.providerNumber ?? "").toLowerCase().includes(q) ||
        (p.bankName ?? "").toLowerCase().includes(q) ||
        (p.accountNumber ?? "").includes(q)
    );
  }, [providers, search]);

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormAccountNumber("");
    setFormBankName("");
    setFormBankCode("");
    setFormAgreedAmount("");
    setFormTotalPct("");
    setFormProviderPct("");
    setFormAgreedAt("");
    setFormAgreedTerms("");
    setOpenCreate(false);
  };

  // Derived split preview
  const totalPctNum = parseFloat(formTotalPct) || 0;
  const providerPctNum = parseFloat(formProviderPct) || 0;
  const companyPctNum = Math.max(0, totalPctNum - Math.min(providerPctNum, totalPctNum));

  const pctError =
    formTotalPct && formProviderPct && providerPctNum > totalPctNum
      ? "Provider % cannot exceed total %"
      : null;

  const handleCreate = () => {
    const name = formName.trim();
    if (!name) return;
    const amount = formAgreedAmount.trim() ? parseFloat(formAgreedAmount) : undefined;
    if (amount !== undefined && (isNaN(amount) || amount < 0)) return;
    const totalPct = formTotalPct.trim() ? parseFloat(formTotalPct) : undefined;
    if (totalPct !== undefined && (isNaN(totalPct) || totalPct < 0)) return;
    const providerPct = formProviderPct.trim() ? parseFloat(formProviderPct) : undefined;
    if (providerPct !== undefined && (isNaN(providerPct) || providerPct < 0)) return;
    if (pctError) return;

    createMutation.mutate(
      {
        name,
        email: formEmail.trim() || undefined,
        accountNumber: formAccountNumber.trim() || undefined,
        bankName: formBankName.trim() || undefined,
        bankCode: formBankCode.trim() || undefined,
        agreedAmount: amount,
        percentageToAdd: totalPct,
        providerCutPercentage: providerPct,
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

            {/* Table header */}
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
                gridTemplateColumns: { md: "1.2fr 0.8fr 1fr 0.9fr 1.1fr 1.1fr 1.1fr 0.9fr 0.8fr 0.6fr" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>Name / #</Box>
              <Box>Email</Box>
              <Box>Bank / Account</Box>
              <Box>Amount funded</Box>
              <Box>% split</Box>
              <Box>Provider return</Box>
              <Box>Company cut</Box>
              <Box>Owed / Paid</Box>
              <Box>Date</Box>
              <Box />
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
                    <ProviderRow
                      key={p.id}
                      p={p}
                      onDelete={(prov) => setDeleteTarget(prov)}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* ── Create provider dialog ── */}
      <Dialog
        open={openCreate}
        onClose={resetForm}
        PaperProps={{ sx: { borderRadius: 2 } }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={700}>Register provider</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {/* Basic info */}
            <TextField
              label="Provider / company name"
              required
              fullWidth
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="StillPlay Capital Partners"
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="provider@example.com"
            />

            <Divider>
              <Typography variant="caption" color="text.secondary">
                Payment details
              </Typography>
            </Divider>

            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <Autocomplete
                options={banks}
                getOptionLabel={(opt) =>
                  typeof opt === "string" ? opt : `${opt.bank_name} (${opt.bank_code})`
                }
                value={
                  formBankCode && formBankName
                    ? { bank_name: formBankName, bank_code: formBankCode }
                    : null
                }
                onChange={(_, val) => {
                  if (val) {
                    setFormBankName(val.bank_name);
                    setFormBankCode(val.bank_code);
                  } else {
                    setFormBankName("");
                    setFormBankCode("");
                  }
                }}
                isOptionEqualToValue={(opt, val) =>
                  opt.bank_code === val.bank_code && opt.bank_name === val.bank_name
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bank"
                    placeholder="Search or select bank"
                    helperText="Select bank for provider payouts"
                  />
                )}
                sx={{ minWidth: 220, flex: 1 }}
              />
              <TextField
                label="Account number"
                fullWidth
                sx={{ minWidth: 160, flex: 1 }}
                value={formAccountNumber}
                onChange={(e) =>
                  setFormAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                inputProps={{ inputMode: "numeric", maxLength: 10 }}
                placeholder="0123456789"
              />
            </Stack>

            <Divider>
              <Typography variant="caption" color="text.secondary">
                Agreement
              </Typography>
            </Divider>

            <TextField
              label="Amount funded to our account (NGN)"
              type="number"
              inputProps={{ min: 0, step: 1000 }}
              fullWidth
              value={formAgreedAmount}
              onChange={(e) => setFormAgreedAmount(e.target.value)}
              placeholder="e.g. 1,000,000"
              helperText="Capital the provider has funded to our account"
            />

            {/* Percentage split */}
            <Stack spacing={1.5}>
              <TextField
                label="Total interest % (charged on loans)"
                type="number"
                inputProps={{ min: 0, step: 0.5, max: 100 }}
                fullWidth
                value={formTotalPct}
                onChange={(e) => setFormTotalPct(e.target.value)}
                placeholder="e.g. 30"
                helperText="Total interest added on top of repayments for loans funded by this provider"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
              <TextField
                label="Provider payout % (provider's share)"
                type="number"
                inputProps={{ min: 0, step: 0.5, max: totalPctNum || 100 }}
                fullWidth
                value={formProviderPct}
                onChange={(e) => setFormProviderPct(e.target.value)}
                error={!!pctError}
                helperText={
                  pctError ?? "The portion paid out to the provider — must be ≤ total %"
                }
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />

              {/* Live preview of the split */}
              {(totalPctNum > 0 || providerPctNum > 0) && (
                <Box
                  sx={{
                    backgroundColor: "#f8f9fb",
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    border: "1px solid #e4e7ec",
                  }}
                >
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    SPLIT PREVIEW
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                    <Stack>
                      <Typography variant="body2" fontWeight={600} sx={{ color: "#0b7b4c" }}>
                        Provider gets: {Math.min(providerPctNum, totalPctNum).toFixed(1)}%
                      </Typography>
                      {formAgreedAmount && parseFloat(formAgreedAmount) > 0 && (
                        <Typography variant="caption" sx={{ color: "#0b7b4c" }}>
                          ≈{" "}
                          {formatMoney(
                            parseFloat(formAgreedAmount) *
                              (Math.min(providerPctNum, totalPctNum) / 100)
                          )}
                        </Typography>
                      )}
                    </Stack>
                    <Stack alignItems="flex-end">
                      <Typography variant="body2" fontWeight={600} sx={{ color: "#b45309" }}>
                        Company keeps: {companyPctNum.toFixed(1)}%
                      </Typography>
                      {formAgreedAmount && parseFloat(formAgreedAmount) > 0 && (
                        <Typography variant="caption" sx={{ color: "#b45309" }}>
                          ≈ {formatMoney(parseFloat(formAgreedAmount) * (companyPctNum / 100))}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <TextField
                label="Agreed date"
                type="date"
                fullWidth
                value={formAgreedAt}
                onChange={(e) => setFormAgreedAt(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

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
            disabled={!formName.trim() || !!pctError || createMutation.isPending}
            sx={{ backgroundColor: "#0b7b4c" }}
          >
            {createMutation.isPending ? "Creating..." : "Register"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete provider dialog ── */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
        PaperProps={{ sx: { borderRadius: 2 } }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={700}>Delete provider</DialogTitle>
        <DialogContent>
          {deleteTarget && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography variant="body2">
                Delete <strong>{deleteTarget.name}</strong> ({deleteTarget.providerNumber})?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Amount owed: {formatMoney(deleteTarget.balance ?? 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Choose how to handle the amount owed:
              </Typography>
              {deleteMutation.isError && (
                <Alert severity="error">
                  {(deleteMutation.error as Error).message}
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexDirection: "column", alignItems: "stretch", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!deleteTarget || deleteMutation.isPending}
            onClick={() => {
              if (!deleteTarget) return;
              deleteMutation.mutate(
                { providerId: deleteTarget.id, payoutFirst: true },
                { onSuccess: () => setDeleteTarget(null) }
              );
            }}
            sx={{ backgroundColor: "#0b7b4c" }}
          >
            {deleteMutation.isPending ? "Processing..." : "Complete payout & delete"}
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
            Pay full amount owed from company balance, then delete
          </Typography>
          <Button
            variant="outlined"
            color="error"
            disabled={!deleteTarget || deleteMutation.isPending}
            onClick={() => {
              if (!deleteTarget) return;
              deleteMutation.mutate(
                { providerId: deleteTarget.id, payoutFirst: false },
                { onSuccess: () => setDeleteTarget(null) }
              );
            }}
          >
            Delete & leave balance
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
            Delete provider, keep amount in company account
          </Typography>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
