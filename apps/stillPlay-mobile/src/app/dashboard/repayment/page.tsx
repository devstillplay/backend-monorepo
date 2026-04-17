'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  Alert,
  Box,
  Button,
  Chip,
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
import { useEffect, useMemo, useRef, useState } from 'react';

import useAuthStore from '@/store/useAuthStore';
import {
  getLoanEligibility,
  listLoans,
  recordLoanRepayment,
} from '@/lib/api';
import { mergeSx } from '@/lib/desktopLayout';

const containedCtaSx = {
  borderRadius: 999,
  py: 1.5,
  textTransform: 'none' as const,
  fontWeight: 700,
  fontSize: '1rem',
  width: '100%',
};

const outlinedCtaSx = {
  borderRadius: 999,
  py: 1.5,
  textTransform: 'none' as const,
  fontWeight: 700,
  fontSize: '1rem',
  width: '100%',
};

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

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** BudPay rejects duplicate references — must be unique per checkout attempt (including retries). */
function makeBudPayReference(loanId: string, amount: number): string {
  const suffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '')
      : `${Date.now()}_${Math.random().toString(36).slice(2, 14)}`;
  return `REPAY_${loanId}_${round2(amount)}_${suffix}`;
}

/**
 * Partial repayment amounts: equal slices of the original loan total (how the obligation is structured),
 * capped so each chip is at most what's left. Excludes the full payoff (handled separately).
 */
function buildInstallmentChipAmounts(
  loanAmount: number,
  remaining: number,
  segments = 4
): number[] {
  if (remaining <= 0 || loanAmount <= 0) return [];
  const n = Math.min(Math.max(2, segments), 12);
  const unit = round2(loanAmount / n);
  if (unit < 1) return [];
  const chips = new Set<number>();
  for (let k = 1; k < n; k++) {
    const pay = round2(Math.min(k * unit, remaining));
    if (pay >= 1 && pay < remaining - 0.005) {
      chips.add(pay);
    }
  }
  const single = round2(Math.min(unit, remaining));
  if (single >= 1 && single < remaining - 0.005) {
    chips.add(single);
  }
  return Array.from(chips).sort((a, b) => a - b);
}

/** Total-outstanding chip vs an installment amount — avoids ambiguity with numeric state. */
type PaySelection =
  | { kind: 'totalOutstanding' }
  | { kind: 'installment'; amount: number };

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
  const [paySelection, setPaySelection] = useState<PaySelection>({
    kind: 'totalOutstanding',
  });
  const [lastPaidAmount, setLastPaidAmount] = useState(0);
  /** New value before each BudPay open so the iframe always gets a fresh reference (avoids “Reference Already Exist”). */
  const [checkoutReference, setCheckoutReference] = useState(() =>
    makeBudPayReference('pending', 0)
  );
  const paymentCommitRef = useRef({ loanId: '', amount: 0 });
  const initiatePaymentRef = useRef<(() => void) | null>(null);

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
  /** Sum of remaining principal on every active loan (PENDING/APPROVED/DISBURSED) — from eligibility. */
  const totalOwedAllActiveLoans =
    eligibility?.totalOutstanding ?? activeLoan?.remaining ?? 0;
  const overdueDays = daysOverdue(loanDetail?.dueDate);
  const isOverdue = overdueDays > 0;

  // ── Repayment mutation ─────────────────────────────────────────────────────
  const repayMutation = useMutation({
    mutationFn: (payload: { loanId: string; amount: number }) =>
      recordLoanRepayment(token!, payload),
    onSuccess: (_data, variables) => {
      setLastPaidAmount(variables.amount);
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
  const loanRemaining = activeLoan?.remaining ?? 0;
  const loanAmountNominal = activeLoan?.amount ?? 0;
  /** Max we can apply to this loan in one checkout (this loan’s remaining, capped by API totals if ever inconsistent). */
  const payAllAmount = round2(
    Math.min(totalOwedAllActiveLoans, loanRemaining)
  );
  const installmentChipAmounts = useMemo(
    () => buildInstallmentChipAmounts(loanAmountNominal, loanRemaining, 4),
    [loanAmountNominal, loanRemaining]
  );
  /** Eligibility total across loans is higher than this loan’s balance alone. */
  const hasMultipleActiveLoansOwed =
    totalOwedAllActiveLoans > loanRemaining + 0.01;

  // Only reset when switching to a different loan — do NOT depend on loanRemaining or refetches
  // would constantly reset chips and make the Pay button appear stuck or fight the user’s tap.
  useEffect(() => {
    setPaySelection({ kind: 'totalOutstanding' });
  }, [activeLoan?.id]);

  // If this loan’s remaining drops below the chosen installment, fall back to total-outstanding mode.
  useEffect(() => {
    setPaySelection((prev) => {
      if (prev.kind !== 'installment') return prev;
      if (prev.amount > loanRemaining + 0.01) {
        return { kind: 'totalOutstanding' };
      }
      return prev;
    });
  }, [loanRemaining]);

  const payAmount =
    paySelection.kind === 'totalOutstanding'
      ? payAllAmount
      : round2(Math.min(paySelection.amount, loanRemaining));

  /** Shown on the Pay CTA — always the amount BudPay / record repayment will use for this checkout. */
  const selectedCheckoutAmount = round2(payAmount);

  const payButtonSelectionKey =
    paySelection.kind === 'totalOutstanding'
      ? 'total'
      : `installment-${round2(paySelection.amount)}`;

  // Always call the hook unconditionally; we guard the button click instead.
  const initiateBudPayPayment = useBudPayPayment({
    api_key: BUDPAY_PUBLIC_KEY,
    // Pass at least 1 so the hook never receives 0 (disabled state guards the button)
    amount: Math.max(payAmount, 1),
    currency: 'NGN',
    reference: checkoutReference,
    customer: {
      email: user?.email ?? 'customer@example.com',
      first_name: user?.firstName ?? 'Customer',
      last_name: user?.lastName ?? 'User',
      phone: '08000000000',
    },
    onComplete: (data) => {
      const { loanId, amount } = paymentCommitRef.current;
      if (data?.status === 'success' && loanId && amount > 0) {
        setPaymentError(null);
        repayMutation.mutate({ loanId, amount });
      }
    },
    onCancel: () => {
      // User closed the modal — no action needed
    },
  });

  initiatePaymentRef.current = initiateBudPayPayment;

  const handleStartRepayment = () => {
    if (!activeLoan?.id || payAmount <= 0 || !isRepayable) return;
    paymentCommitRef.current = {
      loanId: activeLoan.id,
      amount: payAmount,
    };
    const uniqueRef = makeBudPayReference(activeLoan.id, payAmount);
    setCheckoutReference(uniqueRef);
    // @budpay/react registers the postMessage handler in useEffect([config]). Calling initiate()
    // in the same synchronous turn as setState can leave the iframe using the *previous* reference.
    // Defer opening checkout until after commit + effect so BudPay receives the new reference (fixes
    // “Reference Already Exist” on retry after cancel / failed payment).
    window.setTimeout(() => {
      initiatePaymentRef.current?.();
    }, 0);
  };

  // ── Render helpers ─────────────────────────────────────────────────────────
  const renderSkeleton = () => (
    <Stack spacing={2}>
      <Skeleton variant="rounded" height={160} />
      <Skeleton variant="rounded" height={120} />
      <Skeleton variant="rounded" height={52} />
    </Stack>
  );

  const renderNoLoan = () => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 3,
        backgroundColor: '#fff',
        textAlign: 'center',
        width: '100%',
        maxWidth: { xs: '100%', md: 560 },
        mx: { md: 'auto' },
        boxShadow: { md: 1 },
        border: { md: 1 },
        borderColor: { md: 'divider' },
      }}
    >
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
          sx={{
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 600,
            width: { xs: '100%', md: 'auto' },
            px: { md: 3 },
          }}
        >
          Request a loan
        </Button>
      </Stack>
    </Paper>
  );

  const renderSuccess = () => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 3,
        backgroundColor: '#E8F5EF',
        textAlign: 'center',
        width: '100%',
        maxWidth: { xs: '100%', md: 560 },
        mx: { md: 'auto' },
        boxShadow: { md: 1 },
        border: { md: 1 },
        borderColor: { md: 'success.light' },
      }}
    >
      <Stack spacing={2} alignItems="center">
        <CheckCircleOutlineIcon sx={{ color: '#22C55E', fontSize: 48 }} />
        <Typography variant="subtitle1" fontWeight={700} color="#22C55E">
          Repayment recorded!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your payment of {formatCurrency(lastPaidAmount)} has been applied to
          your loan.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.replace('/dashboard')}
          sx={{
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 600,
            width: { xs: '100%', md: 'auto' },
            px: { md: 4 },
          }}
        >
          Back to dashboard
        </Button>
      </Stack>
    </Paper>
  );

  const cardPaperSx = {
    borderRadius: 3,
    backgroundColor: '#fff',
    boxShadow: { md: 1 },
    border: { md: 1 },
    borderColor: { md: 'divider' },
  };

  const renderLoan = () => (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 2, md: 3 }}
      alignItems={{ xs: 'stretch', md: 'flex-start' }}
      sx={{ width: '100%' }}
    >
      {/* Mobile: balance + breakdown stacked; Desktop: left column = hero balance only */}
      <Paper
        elevation={0}
        sx={mergeSx(cardPaperSx, {
          overflow: 'hidden',
          flex: { md: '1 1 42%' },
          minWidth: 0,
          width: '100%',
        })}
      >
        <Box sx={{ px: { xs: 3, md: 3.5 }, pt: { xs: 3, md: 3.5 }, pb: { xs: 2, md: 3 } }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            Due on this loan
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              mt: 0.5,
              color: isOverdue ? '#EF4444' : 'text.primary',
              fontSize: { xs: '2rem', md: '2.75rem' },
            }}
          >
            {formatCurrency(loanRemaining)}
          </Typography>
          {hasMultipleActiveLoansOwed && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.4 }}>
              Total across all your active loans:{' '}
              <Box component="span" fontWeight={700} color="text.primary">
                {formatCurrency(totalOwedAllActiveLoans)}
              </Box>
              . This screen repays the loan shown in your details below.
            </Typography>
          )}
          {isOverdue && (
            <Typography variant="caption" color="error" fontWeight={600} sx={{ display: 'block', mt: 0.5 }}>
              {overdueDays} day{overdueDays !== 1 ? 's' : ''} overdue
            </Typography>
          )}
        </Box>

        {/* Loan breakdown: show under balance on mobile only; desktop shows in right column */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
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
                label={
                  hasMultipleActiveLoansOwed
                    ? 'Remaining on this loan'
                    : 'Remaining'
                }
                value={formatCurrency(loanRemaining)}
                valueColor={isOverdue ? '#EF4444' : undefined}
              />
              {hasMultipleActiveLoansOwed && (
                <InfoRow
                  label="Total owed (all active loans)"
                  value={formatCurrency(totalOwedAllActiveLoans)}
                  valueColor={isOverdue ? '#EF4444' : undefined}
                />
              )}
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
        </Box>
      </Paper>

      {/* Right column (desktop): details, warnings, pay CTA — full width stack on mobile */}
      <Stack spacing={2} sx={{ flex: { md: '1 1 58%' }, minWidth: 0, width: '100%' }}>
        <Paper
          elevation={0}
          sx={mergeSx(cardPaperSx, {
            display: { xs: 'none', md: 'block' },
            p: 0,
            overflow: 'hidden',
          })}
        >
          <Box sx={{ px: 3, py: 2.5 }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
              Loan details
            </Typography>
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
                label={
                  hasMultipleActiveLoansOwed
                    ? 'Remaining on this loan'
                    : 'Remaining'
                }
                value={formatCurrency(loanRemaining)}
                valueColor={isOverdue ? '#EF4444' : undefined}
              />
              {hasMultipleActiveLoansOwed && (
                <InfoRow
                  label="Total owed (all active loans)"
                  value={formatCurrency(totalOwedAllActiveLoans)}
                  valueColor={isOverdue ? '#EF4444' : undefined}
                />
              )}
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

        {isOverdue && (
          <Paper
            elevation={0}
            sx={mergeSx(cardPaperSx, {
              p: 2.5,
            })}
          >
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
              <Box sx={{ minWidth: 0 }}>
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

        {paymentError && (
          <Alert severity="error" onClose={() => setPaymentError(null)}>
            {paymentError}
          </Alert>
        )}

        {isRepayable && loanRemaining > 0 && (
          <Paper
            elevation={0}
            sx={mergeSx(cardPaperSx, {
              p: 2,
            })}
          >
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Choose amount
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
              Pay this loan in full or in smaller amounts — each smaller badge is a share of this loan’s original amount.
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              <Chip
                label={`Full payment (this loan) · ${formatCurrency(payAllAmount)}`}
                onClick={() => setPaySelection({ kind: 'totalOutstanding' })}
                color={
                  paySelection.kind === 'totalOutstanding' ? 'primary' : 'default'
                }
                variant={
                  paySelection.kind === 'totalOutstanding' ? 'filled' : 'outlined'
                }
                sx={{ fontWeight: 600 }}
              />
              {installmentChipAmounts.map((amt) => (
                <Chip
                  key={amt}
                  label={formatCurrency(amt)}
                  onClick={() =>
                    setPaySelection({ kind: 'installment', amount: amt })
                  }
                  color={
                    paySelection.kind === 'installment' &&
                    round2(paySelection.amount) === round2(amt)
                      ? 'primary'
                      : 'default'
                  }
                  variant={
                    paySelection.kind === 'installment' &&
                    round2(paySelection.amount) === round2(amt)
                      ? 'filled'
                      : 'outlined'
                  }
                  sx={{ fontWeight: 600 }}
                />
              ))}
            </Stack>
            {hasMultipleActiveLoansOwed && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
                You owe {formatCurrency(totalOwedAllActiveLoans)} across all active loans. Each payment here
                only reduces this loan (up to {formatCurrency(loanRemaining)}).
              </Typography>
            )}
          </Paper>
        )}

        <Box sx={{ pt: { xs: 0, md: 0.5 } }}>
          <Stack direction="column" spacing={1.5} alignItems="stretch">
            <Button
              key={payButtonSelectionKey}
              variant="contained"
              size="large"
              disabled={
                !isRepayable ||
                payAmount <= 0 ||
                repayMutation.isPending
              }
              onClick={handleStartRepayment}
              sx={mergeSx(containedCtaSx, {
                width: '100%',
                py: { md: 1.75 },
                fontSize: { md: '1.05rem' },
                whiteSpace: 'normal',
              })}
            >
              {repayMutation.isPending ? (
                'Recording payment…'
              ) : (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.25,
                    py: 0.25,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      opacity: 0.92,
                      textTransform: 'none',
                      letterSpacing: 0.2,
                      lineHeight: 1.2,
                    }}
                  >
                    {paySelection.kind === 'totalOutstanding'
                      ? 'Pay full balance'
                      : 'Pay selected amount'}
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '1.15rem', md: '1.25rem' },
                      textTransform: 'none',
                      lineHeight: 1.2,
                    }}
                  >
                    {formatCurrency(selectedCheckoutAmount)}
                  </Box>
                </Box>
              )}
            </Button>
            {eligibility?.canRequest && (eligibility?.availableAmount ?? 0) > 0 && (
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => router.push('/dashboard/loan')}
                sx={mergeSx(outlinedCtaSx, {
                  whiteSpace: 'normal',
                  textAlign: 'center',
                  py: { md: 1.75 },
                })}
              >
                Request a loan (up to {formatCurrency(eligibility.availableAmount)})
              </Button>
            )}
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 1.5, textAlign: { xs: 'center', md: 'left' } }}
          >
            Secured by BudPay · Payments are non-refundable
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <Box
      className="screen-content"
      sx={{
        backgroundColor: { xs: '#F5F5F5', md: 'transparent' },
        overflow: 'auto',
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <Stack
        sx={{
          spacing: { xs: 2.5, md: 3 },
          width: '100%',
          maxWidth: '100%',
          flex: 1,
        }}
      >
        {/* Header — full width on desktop to match dashboard column */}
        <Stack spacing={0.5} sx={{ width: '100%' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              aria-label="Back"
              onClick={() => router.back()}
              sx={{ borderRadius: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.15rem', md: '1.5rem' } }}>
                Repayment
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: 'none', md: 'block' }, mt: 0.25 }}
              >
                Pay down your active loan or check your balance.
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Body */}
        <Box sx={{ width: '100%', flex: 1 }}>
          {isLoading ? (
            renderSkeleton()
          ) : paymentSuccess ? (
            renderSuccess()
          ) : !activeLoan || !isRepayable ? (
            renderNoLoan()
          ) : (
            renderLoan()
          )}
        </Box>
      </Stack>
    </Box>
  );
}
