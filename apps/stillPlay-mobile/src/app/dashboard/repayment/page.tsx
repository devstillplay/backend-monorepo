'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useBudPayPayment } from '@budpay/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import useAuthStore from '@/store/useAuthStore';
import {
  getLoanEligibility,
  listLoans,
  recordLoanRepayment,
} from '@/lib/api';

const BUDPAY_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_BUDPAY_PUBLIC_KEY ||
  'pk_test_ygdkehlstlctycduvnltb1xnq5yye594ev3qqg';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
}

function daysOverdue(dueDate: string | null | undefined): number {
  if (!dueDate) return 0;
  const diff = Date.now() - new Date(dueDate).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function InfoRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} color={valueColor}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function RepaymentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const userId = user?.id ?? '';

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: eligibility, isLoading: eligLoading } = useQuery({
    queryKey: ['loan-eligibility', userId],
    queryFn: () => getLoanEligibility(token!, userId),
    enabled: !!token && !!userId,
  });

  const { data: loans, isLoading: loansLoading } = useQuery({
    queryKey: ['loans', userId],
    queryFn: () => listLoans(token!, userId),
    enabled: !!token && !!userId,
  });

  const isLoading = eligLoading || loansLoading;

  // Combine eligibility (remaining) with loan list (dueDate, disbursedAt, approvedAt)
  const activeLoan = eligibility?.activeLoan;
  const loanDetail = loans?.find((l) => l.id === activeLoan?.id);
  // APPROVED or DISBURSED = customer has received funds (wallet credited at approval)
  const isRepayable =
    activeLoan?.status === 'APPROVED' || activeLoan?.status === 'DISBURSED';
  // Use totalOutstanding (sum across all active loans) so it reflects full amount owed, not just most recent loan
  const outstanding =
    eligibility?.totalOutstanding ?? activeLoan?.remaining ?? 0;
  const overdueDays = daysOverdue(loanDetail?.dueDate);
  const isOverdue = overdueDays > 0;

  // ── Repayment mutation ─────────────────────────────────────────────────────
  const repayMutation = useMutation({
    mutationFn: (payload: { loanId: string; amount: number }) =>
      recordLoanRepayment(token!, payload),
    onSuccess: () => {
      setPaymentSuccess(true);
      setPaymentError(null);
      queryClient.invalidateQueries({ queryKey: ['loan-eligibility'] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['repayments'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
    onError: (err) => {
      setPaymentError((err as Error).message ?? 'Failed to record repayment');
    },
  });

  // ── BudPay ─────────────────────────────────────────────────────────────────
  // Repay amount: cap at active loan's remaining to avoid overpaying a single loan
  const amountToRepay = Math.min(
    outstanding,
    activeLoan?.remaining ?? outstanding
  );

  // Always call the hook unconditionally; we guard the button click instead.
  const initiateBudPayPayment = useBudPayPayment({
    api_key: BUDPAY_PUBLIC_KEY,
    // Pass at least 1 so the hook never receives 0 (disabled state guards the button)
    amount: Math.max(amountToRepay, 1),
    currency: 'NGN',
    reference: `REPAY_${activeLoan?.id ?? 'NONE'}_${Date.now()}`,
    customer: {
      email: user?.email ?? 'customer@example.com',
      first_name: user?.firstName ?? 'Customer',
      last_name: user?.lastName ?? 'User',
      phone: '08000000000',
    },
    onComplete: (data) => {
      if (data?.status === 'success' && activeLoan?.id && amountToRepay > 0) {
        setPaymentError(null);
        repayMutation.mutate({ loanId: activeLoan.id, amount: amountToRepay });
      }
    },
    onCancel: () => {
      // User closed the modal — no action needed
    },
  });

  // ── Render helpers ─────────────────────────────────────────────────────────
  const renderSkeleton = () => (
    <Stack spacing={2}>
      <Skeleton variant="rounded" height={160} />
      <Skeleton variant="rounded" height={120} />
      <Skeleton variant="rounded" height={52} />
    </Stack>
  );

  const renderNoLoan = () => (
    <Paper elevation={0} sx={{ borderRadius: 3, p: 3, backgroundColor: '#fff', textAlign: 'center' }}>
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: '#E8F5EF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ReceiptLongIcon sx={{ color: '#22C55E', fontSize: 28 }} />
        </Box>
        <Typography variant="subtitle1" fontWeight={700}>
          No outstanding loan
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You have no active loan that requires repayment right now.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => router.push('/dashboard/loan')}
          sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 600 }}
        >
          Request a loan
        </Button>
      </Stack>
    </Paper>
  );

  const renderSuccess = () => (
    <Paper elevation={0} sx={{ borderRadius: 3, p: 3, backgroundColor: '#E8F5EF', textAlign: 'center' }}>
      <Stack spacing={2} alignItems="center">
        <CheckCircleOutlineIcon sx={{ color: '#22C55E', fontSize: 48 }} />
        <Typography variant="subtitle1" fontWeight={700} color="#22C55E">
          Repayment recorded!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your payment of {formatCurrency(amountToRepay)} has been applied to
          your loan.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.replace('/dashboard')}
          sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 600 }}
        >
          Back to dashboard
        </Button>
      </Stack>
    </Paper>
  );

  const renderLoan = () => (
    <Stack spacing={2}>
      {/* ── Outstanding balance card ─────────────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{ borderRadius: 3, backgroundColor: '#fff', overflow: 'hidden' }}
      >
        <Box sx={{ px: 3, pt: 3, pb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            Outstanding balance
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mt: 0.5, color: isOverdue ? '#EF4444' : 'text.primary' }}
          >
            {formatCurrency(outstanding)}
          </Typography>
          {isOverdue && (
            <Typography variant="caption" color="error" fontWeight={600}>
              {overdueDays} day{overdueDays !== 1 ? 's' : ''} overdue
            </Typography>
          )}
        </Box>

        <Divider />

        <Box sx={{ px: 3, py: 2 }}>
          <Stack spacing={1.5}>
            <InfoRow
              label="Loan amount"
              value={formatCurrency(activeLoan?.amount ?? 0)}
            />
            <InfoRow
              label="Amount repaid"
              value={formatCurrency(activeLoan?.amountRepaid ?? 0)}
              valueColor="#22C55E"
            />
            <InfoRow
              label="Remaining"
              value={formatCurrency(outstanding)}
              valueColor={isOverdue ? '#EF4444' : undefined}
            />
            <Divider />
            <InfoRow
              label="Due date"
              value={formatDate(loanDetail?.dueDate)}
              valueColor={isOverdue ? '#EF4444' : undefined}
            />
            <InfoRow
              label="Credited on"
              value={formatDate(
                loanDetail?.disbursedAt ?? loanDetail?.approvedAt ?? loanDetail?.createdAt
              )}
            />
          </Stack>
        </Box>
      </Paper>

      {/* ── Overdue warning ──────────────────────────────────────────────── */}
      {isOverdue && (
        <Paper elevation={0} sx={{ borderRadius: 3, backgroundColor: '#fff', p: 2.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#FFE5E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ErrorOutlineIcon sx={{ color: '#E53935', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Loan overdue
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your loan is {overdueDays} day{overdueDays !== 1 ? 's' : ''} past
                its due date. Defaulting can negatively impact your ability to
                borrow in the future. Please make a repayment as soon as possible.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* ── Error alert ──────────────────────────────────────────────────── */}
      {paymentError && (
        <Alert severity="error" onClose={() => setPaymentError(null)}>
          {paymentError}
        </Alert>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <Box sx={{ pt: 1 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={
            !isRepayable ||
            amountToRepay <= 0 ||
            repayMutation.isPending
          }
          onClick={initiateBudPayPayment}
          sx={{
            borderRadius: 999,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '1rem',
          }}
        >
          {repayMutation.isPending
            ? 'Recording payment…'
            : `Pay ${formatCurrency(amountToRepay)}`}
        </Button>
        {eligibility?.canRequest && (eligibility?.availableAmount ?? 0) > 0 && (
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => router.push('/dashboard/loan')}
            sx={{
              borderRadius: 999,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              mt: 1.5,
            }}
          >
            Request a loan (up to {formatCurrency(eligibility.availableAmount)})
          </Button>
        )}
        <Typography
          variant="caption"
          color="text.secondary"
          textAlign="center"
          display="block"
          sx={{ mt: 1 }}
        >
          Secured by BudPay · Payments are non-refundable
        </Typography>
      </Box>
    </Stack>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <Box
      className="screen-content"
      sx={{ backgroundColor: '#F5F5F5', overflow: 'auto' }}
    >
      <Stack sx={{ p: 3 }} spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            aria-label="Back"
            onClick={() => router.back()}
            sx={{ borderRadius: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>
            Repayment
          </Typography>
        </Stack>

        {/* Body */}
        {isLoading
          ? renderSkeleton()
          : paymentSuccess
            ? renderSuccess()
            : !activeLoan || !isRepayable
              ? renderNoLoan()
              : renderLoan()}
      </Stack>
    </Box>
  );
}
