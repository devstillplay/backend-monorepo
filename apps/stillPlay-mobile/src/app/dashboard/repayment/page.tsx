'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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
import { usePaystackPayment } from 'react-paystack';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import useAuthStore from '@/store/useAuthStore';
import {
  getLoanEligibility,
  getRepaymentGateway,
  listLoans,
  recordLoanRepayment,
  verifyPaystackRepayment,
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
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
type GatewayId = 'budpay' | 'paystack' | 'flutterwave';

function formatGatewayLabel(gateway: GatewayId): string {
  if (gateway === 'budpay') return 'BudPay';
  if (gateway === 'paystack') return 'Paystack';
  return 'Flutterwave';
}

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

const PAY_PERCENT_STEP = 5;
const MIN_PAY_PERCENT = 5;

/** BudPay rejects duplicate references — must be unique per checkout attempt (including retries). */
function makeBudPayReference(loanId: string, amount: number): string {
  const suffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '')
      : `${Date.now()}_${Math.random().toString(36).slice(2, 14)}`;
  return `REPAY_${loanId}_${round2(amount)}_${suffix}`;
}

/** Paystack references should also be unique across retries. */
function makePaystackReference(loanId: string, amount: number): string {
  const suffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '')
      : `${Date.now()}_${Math.random().toString(36).slice(2, 14)}`;
  return `PS_REPAY_${loanId}_${round2(amount)}_${suffix}`;
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

/** Full payoff / fixed installment chip / percentage of total due (all loans), capped per loan. */
type PaySelection =
  | { kind: 'totalOutstanding' }
  | { kind: 'installment'; amount: number }
  | { kind: 'percent'; percent: number };

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
  /** Fewer retries + no focus refetch avoids hammering a wrong/missing API in dev (also cuts Next overlay / __nextjs_original-stack-frame noise). */
  const repaymentFetchQueryOptions = {
    retry: 1,
    refetchOnWindowFocus: false,
  } as const;

  const { data: eligibility, isLoading: eligLoading } = useQuery({
    queryKey: ['loan-eligibility', userId],
    queryFn: () => getLoanEligibility(token!, userId),
    enabled: !!token && !!userId,
    ...repaymentFetchQueryOptions,
  });

  const { data: loans, isLoading: loansLoading } = useQuery({
    queryKey: ['loans', userId],
    queryFn: () => listLoans(token!, userId),
    enabled: !!token && !!userId,
    ...repaymentFetchQueryOptions,
  });
  const { data: gatewaySelection } = useQuery({
    queryKey: ['repayment-gateway'],
    queryFn: () => getRepaymentGateway(token!),
    enabled: !!token,
    ...repaymentFetchQueryOptions,
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
  const verifyPaystackMutation = useMutation({
    mutationFn: (payload: { loanId: string; amount: number; reference: string }) =>
      verifyPaystackRepayment(token!, payload),
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
      setPaymentError((err as Error).message ?? 'Failed to verify Paystack payment');
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
      : paySelection.kind === 'installment'
        ? round2(Math.min(paySelection.amount, loanRemaining))
        : round2(
            Math.min(
              (paySelection.percent / 100) * totalOwedAllActiveLoans,
              loanRemaining
            )
          );

  /** Sent to BudPay / record repayment (capped by this loan’s remaining). */
  const chargedAmount = round2(payAmount);
  /** Shown everywhere in the UI for the current choice — total-outstanding uses full portfolio total. */
  const displaySelectionAmount =
    paySelection.kind === 'totalOutstanding'
      ? round2(totalOwedAllActiveLoans)
      : chargedAmount;
  /** When UI shows total due but checkout is capped to this loan. */
  const showCheckoutCapNote =
    paySelection.kind === 'totalOutstanding' &&
    chargedAmount + 0.01 < displaySelectionAmount;

  const currentPercentStepper =
    paySelection.kind === 'percent'
      ? paySelection.percent
      : paySelection.kind === 'totalOutstanding'
        ? 100
        : Math.min(
            100,
            Math.max(
              MIN_PAY_PERCENT,
              Math.round(
                ((paySelection.amount /
                  Math.max(totalOwedAllActiveLoans, 1e-6)) *
                  100) /
                  PAY_PERCENT_STEP
              ) * PAY_PERCENT_STEP
            )
          );

  const canDecreasePayPercent =
    loanRemaining > 0 &&
    totalOwedAllActiveLoans > 0 &&
    currentPercentStepper > MIN_PAY_PERCENT;
  const canIncreasePayPercent =
    loanRemaining > 0 &&
    totalOwedAllActiveLoans > 0 &&
    currentPercentStepper < 100;

  const adjustPayPercent = (deltaSteps: number) => {
    if (totalOwedAllActiveLoans <= 0 || loanRemaining <= 0) return;
    setPaySelection((prev) => {
      let base: number;
      if (prev.kind === 'percent') base = prev.percent;
      else if (prev.kind === 'totalOutstanding') base = 100;
      else {
        const approx =
          (prev.amount / Math.max(totalOwedAllActiveLoans, 1e-6)) * 100;
        base = Math.min(
          100,
          Math.max(
            MIN_PAY_PERCENT,
            Math.round(approx / PAY_PERCENT_STEP) * PAY_PERCENT_STEP
          )
        );
      }
      const next = Math.min(
        100,
        Math.max(MIN_PAY_PERCENT, base + deltaSteps * PAY_PERCENT_STEP)
      );
      return { kind: 'percent', percent: next };
    });
  };

  const payButtonSelectionKey =
    paySelection.kind === 'totalOutstanding'
      ? 'total'
      : paySelection.kind === 'installment'
        ? `installment-${round2(paySelection.amount)}`
        : `percent-${paySelection.percent}`;

  // Always call the hook unconditionally; we guard the button click instead.
  const initiateBudPayPayment = useBudPayPayment({
    api_key: BUDPAY_PUBLIC_KEY,
    // Pass at least 1 so the hook never receives 0 (disabled state guards the button)
    amount: Math.max(chargedAmount, 1),
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

  /** Stable hook config; real reference/amount/metadata are passed in `initiatePaystackPayment({ config })` on click. */
  const paystackHookConfig = useMemo(
    () => ({
      reference: '__paystack_pending__',
      email: user?.email ?? 'customer@example.com',
      amount: 100,
      publicKey: PAYSTACK_PUBLIC_KEY,
      currency: 'NGN' as const,
      metadata: {
        loan_id: activeLoan?.id ?? '',
        user_id: userId,
        custom_fields: [
          {
            display_name: 'Loan ID',
            variable_name: 'loan_id',
            value: activeLoan?.id ?? '',
          },
        ],
      },
      firstname: user?.firstName ?? 'Customer',
      lastname: user?.lastName ?? 'User',
    }),
    [user?.email, user?.firstName, user?.lastName, userId, activeLoan?.id]
  );

  const initiatePaystackPayment = usePaystackPayment(paystackHookConfig);

  const primaryGateway = gatewaySelection?.primary ?? gatewaySelection?.gateway ?? 'budpay';
  const fallbackOrder = gatewaySelection?.fallbackOrder ?? [];
  const gatewayChain: GatewayId[] = [primaryGateway, ...fallbackOrder].filter(
    (g, idx, arr): g is GatewayId => arr.indexOf(g) === idx
  );
  const firstAvailableGateway = gatewayChain.find((g) => {
    if (g === 'flutterwave') return false; // pending integration
    if (g === 'paystack') return !!PAYSTACK_PUBLIC_KEY;
    return true; // budpay
  });
  const selectedGateway: GatewayId = firstAvailableGateway ?? 'budpay';
  const usingFallbackGateway =
    gatewayChain.length > 0 && selectedGateway !== gatewayChain[0];
  const fallbackReason =
    gatewayChain[0] === 'flutterwave'
      ? 'selected gateway is pending'
      : gatewayChain[0] === 'paystack' && !PAYSTACK_PUBLIC_KEY
        ? 'selected gateway is not configured'
        : null;

  const handlePaystackSuccess = (referenceData: { reference: string }) => {
    const { loanId, amount } = paymentCommitRef.current;
    if (!loanId || amount <= 0 || !referenceData?.reference) {
      setPaymentError('Unable to verify Paystack payment. Missing reference.');
      return;
    }
    verifyPaystackMutation.mutate({
      loanId,
      amount,
      reference: referenceData.reference,
    });
  };

  const handleStartRepayment = () => {
    if (!activeLoan?.id || chargedAmount <= 0 || !isRepayable) return;
    if (!firstAvailableGateway) {
      setPaymentError(
        'No available payment gateway. Selected method is pending or not configured. Please update payment gateway settings.'
      );
      return;
    }
    paymentCommitRef.current = {
      loanId: activeLoan.id,
      amount: chargedAmount,
    };
    setPaymentError(null);
    if (selectedGateway === 'paystack') {
      const uniqueRef = makePaystackReference(activeLoan.id, chargedAmount);
      try {
        initiatePaystackPayment({
          onSuccess: handlePaystackSuccess,
          onClose: () => {},
          config: {
            reference: uniqueRef,
            amount: Math.max(Math.round(chargedAmount * 100), 100),
            email: user?.email ?? 'customer@example.com',
            currency: 'NGN',
            metadata: {
              loan_id: activeLoan.id,
              user_id: userId,
              custom_fields: [
                {
                  display_name: 'Loan ID',
                  variable_name: 'loan_id',
                  value: activeLoan.id,
                },
              ],
            },
          },
        });
      } catch {
        setPaymentError(
          'Paystack checkout could not start. Please try again or switch gateway from settings.'
        );
      }
      return;
    }
    const uniqueRef = makeBudPayReference(activeLoan.id, chargedAmount);
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
            Total due (all active loans)
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
            {formatCurrency(totalOwedAllActiveLoans)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.4 }}>
            Sum of every loan you still need to repay. This checkout applies to your current loan only, up
            to{' '}
            <Box component="span" fontWeight={700} color="text.primary">
              {formatCurrency(loanRemaining)}
            </Box>{' '}
            remaining on that loan — pay in full, by badge, or by percentage below.
          </Typography>
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
        {usingFallbackGateway && fallbackReason && (
          <Alert severity="warning">
            Redirecting repayment from{' '}
            <strong>{formatGatewayLabel(gatewayChain[0])}</strong> to{' '}
            <strong>{formatGatewayLabel(selectedGateway)}</strong> because the {fallbackReason}.
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
              Use the arrows for a custom share of your total due, pay the full total outstanding in one
              go, or pick a batch amount collected on this loan (capped by this loan’s remaining balance).
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'grey.50',
                borderColor: 'divider',
                mb: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 1 }}>
                Pay by % of total due (all loans)
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <IconButton
                  aria-label="Decrease repayment percentage"
                  onClick={() => adjustPayPercent(-1)}
                  disabled={!canDecreasePayPercent}
                  color="primary"
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
                <Box sx={{ textAlign: 'center', minWidth: 140 }}>
                  <Typography variant="h5" fontWeight={800} component="span">
                    {currentPercentStepper}
                  </Typography>
                  <Typography variant="body2" component="span" color="text.secondary" fontWeight={600}>
                    %
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 1, fontWeight: 600 }}
                  >
                    Amount to pay
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight={800}
                    display="block"
                    sx={{ lineHeight: 1.3 }}
                  >
                    {formatCurrency(displaySelectionAmount)}
                  </Typography>
                  {showCheckoutCapNote ? (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      This checkout applies {formatCurrency(chargedAmount)} to this loan (portfolio total due{' '}
                      {formatCurrency(displaySelectionAmount)}).
                    </Typography>
                  ) : paySelection.kind === 'installment' ? (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      Batch selected: {formatCurrency(displaySelectionAmount)} · ↑↓ switches to paying by %
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {PAY_PERCENT_STEP}% per tap · max {formatCurrency(loanRemaining)} on this loan
                    </Typography>
                  )}
                </Box>
                <IconButton
                  aria-label="Increase repayment percentage"
                  onClick={() => adjustPayPercent(1)}
                  disabled={!canIncreasePayPercent}
                  color="primary"
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <KeyboardArrowUpIcon />
                </IconButton>
              </Stack>
            </Paper>

            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.75 }}>
              Total outstanding
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
              <Chip
                label={`${formatCurrency(totalOwedAllActiveLoans)} · full payment toward total due`}
                onClick={() => setPaySelection({ kind: 'totalOutstanding' })}
                color={
                  paySelection.kind === 'totalOutstanding' ? 'primary' : 'default'
                }
                variant={
                  paySelection.kind === 'totalOutstanding' ? 'filled' : 'outlined'
                }
                sx={{
                  fontWeight: 600,
                  height: 'auto',
                  py: 0.75,
                  '& .MuiChip-label': { whiteSpace: 'normal', textAlign: 'center' },
                }}
              />
            </Stack>

            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
              Batch collected (this loan)
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Amounts matching how this loan was split for collection — pay one batch at a time.
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {installmentChipAmounts.map((amt) => (
                <Chip
                  key={amt}
                  label={`Batch · ${formatCurrency(amt)}`}
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
                chargedAmount <= 0 ||
                repayMutation.isPending ||
                verifyPaystackMutation.isPending
              }
              onClick={handleStartRepayment}
              sx={mergeSx(containedCtaSx, {
                width: '100%',
                py: { md: 1.75 },
                fontSize: { md: '1.05rem' },
                whiteSpace: 'normal',
              })}
            >
              {repayMutation.isPending || verifyPaystackMutation.isPending ? (
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
                      : paySelection.kind === 'percent'
                        ? `Pay ${paySelection.percent}% of total due`
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
                    {formatCurrency(displaySelectionAmount)}
                  </Box>
                  {showCheckoutCapNote && (
                    <Box
                      component="span"
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        opacity: 0.9,
                        textTransform: 'none',
                        lineHeight: 1.25,
                        maxWidth: 280,
                      }}
                    >
                      Charges {formatCurrency(chargedAmount)} on this loan (capped by remaining balance).
                    </Box>
                  )}
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
            {selectedGateway === 'budpay'
              ? 'Secured by BudPay · Payments are non-refundable'
              : selectedGateway === 'paystack'
                ? 'Secured by Paystack · Payments are non-refundable'
                : 'Flutterwave is pending · choose another gateway in admin settings'}
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
