'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  Alert,
  Box,
  Button,
  Chip,
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
  type LoanItem,
  recordLoanRepayment,
  type RecordLoanRepaymentPayload,
  verifyPaystackRepayment,
  type VerifyPaystackRepaymentPayload,
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

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

const PAY_PERCENT_STEP = 5;
const MIN_PAY_PERCENT = 5;

function makeBudPayReference(loanId: string, amount: number): string {
  const suffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '')
      : `${Date.now()}_${Math.random().toString(36).slice(2, 14)}`;
  return `REPAY_${loanId}_${round2(amount)}_${suffix}`;
}

function makePaystackReference(loanId: string, amount: number): string {
  const suffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '')
      : `${Date.now()}_${Math.random().toString(36).slice(2, 14)}`;
  return `PS_REPAY_${loanId}_${round2(amount)}_${suffix}`;
}

function loanRemaining(l: LoanItem): number {
  return round2(Math.max(0, l.amount - l.amountRepaid));
}

function isRepayableStatus(status: string): boolean {
  return status === 'APPROVED' || status === 'DISBURSED';
}

type PaySelection =
  | { kind: 'full' }
  | { kind: 'batch'; loanId: string }
  | { kind: 'percent'; percent: number };

type PaymentCommit = {
  mode: 'portfolio' | 'single';
  loanId?: string;
  userId: string;
  amount: number;
};

export default function RepaymentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? '';

  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paySelection, setPaySelection] = useState<PaySelection>({ kind: 'full' });
  const [lastPaidAmount, setLastPaidAmount] = useState(0);
  const [checkoutReference, setCheckoutReference] = useState(() =>
    makeBudPayReference('pending', 0)
  );
  const paymentCommitRef = useRef<PaymentCommit>({
    mode: 'portfolio',
    userId: '',
    amount: 0,
  });
  const initiatePaymentRef = useRef<(() => void) | null>(null);

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

  const { data: loans = [], isLoading: loansLoading } = useQuery({
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

  const creditCap = eligibility?.maxAmount ?? 0;
  /** Headroom under the cap (same as loan request screen — cap minus total outstanding). */
  const leftToBorrow = round2(Math.max(0, eligibility?.availableAmount ?? 0));

  const repayableLoans = useMemo(() => {
    return loans
      .filter((l) => isRepayableStatus(l.status) && loanRemaining(l) > 0.005)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }, [loans]);

  const repayableLoansRef = useRef<LoanItem[]>([]);
  repayableLoansRef.current = repayableLoans;

  const totalOwed = useMemo(
    () =>
      round2(
        repayableLoans.reduce((s, l) => s + loanRemaining(l), 0)
      ),
    [repayableLoans]
  );

  const hasDebt = totalOwed > 0.005;

  /** Stable primitive so the effect dependency array length never changes (avoids React 19 dev warning). */
  const repayableLoanIdsKey = useMemo(
    () => repayableLoans.map((l) => l.id).join(','),
    [repayableLoans]
  );

  useEffect(() => {
    setPaySelection((prev) => {
      if (prev.kind !== 'batch') return prev;
      const list = repayableLoansRef.current;
      const still = list.some((l) => l.id === prev.loanId);
      return still ? prev : { kind: 'full' };
    });
  }, [repayableLoanIdsKey]);

  const payAmount = useMemo(() => {
    if (!hasDebt) return 0;
    if (paySelection.kind === 'full') return totalOwed;
    if (paySelection.kind === 'percent') {
      return round2(
        Math.min(totalOwed, (paySelection.percent / 100) * totalOwed)
      );
    }
    const loan = repayableLoans.find((l) => l.id === paySelection.loanId);
    return loan ? loanRemaining(loan) : 0;
  }, [hasDebt, paySelection, repayableLoans, totalOwed]);

  const chargedAmount = round2(Math.max(0, payAmount));

  const currentPercentStepper =
    paySelection.kind === 'percent'
      ? paySelection.percent
      : paySelection.kind === 'full'
        ? 100
        : MIN_PAY_PERCENT;

  const canDecreasePayPercent =
    hasDebt && totalOwed > 0 && currentPercentStepper > MIN_PAY_PERCENT;
  const canIncreasePayPercent =
    hasDebt && totalOwed > 0 && currentPercentStepper < 100;

  const adjustPayPercent = (deltaSteps: number) => {
    if (totalOwed <= 0) return;
    setPaySelection((prev) => {
      let base: number;
      if (prev.kind === 'percent') base = prev.percent;
      else if (prev.kind === 'full') base = 100;
      else return { kind: 'percent', percent: MIN_PAY_PERCENT };
      const next = Math.min(
        100,
        Math.max(MIN_PAY_PERCENT, base + deltaSteps * PAY_PERCENT_STEP)
      );
      return { kind: 'percent', percent: next };
    });
  };

  const repayMutation = useMutation({
    mutationFn: (payload: RecordLoanRepaymentPayload) =>
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
    mutationFn: (payload: VerifyPaystackRepaymentPayload) =>
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
      setPaymentError(
        (err as Error).message ?? 'Failed to verify Paystack payment'
      );
    },
  });

  const initiateBudPayPayment = useBudPayPayment({
    api_key: BUDPAY_PUBLIC_KEY,
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
      const c = paymentCommitRef.current;
      if (data?.status !== 'success' || !c.userId || c.amount <= 0) return;
      setPaymentError(null);
      if (c.mode === 'portfolio') {
        repayMutation.mutate({
          scope: 'portfolio',
          userId: c.userId,
          amount: c.amount,
        });
      } else if (c.loanId) {
        repayMutation.mutate({ loanId: c.loanId, amount: c.amount });
      }
    },
    onCancel: () => {},
  });

  initiatePaymentRef.current = initiateBudPayPayment;

  const paystackHookConfig = useMemo(
    () => ({
      reference: '__paystack_pending__',
      email: user?.email ?? 'customer@example.com',
      amount: 100,
      publicKey: PAYSTACK_PUBLIC_KEY,
      currency: 'NGN' as const,
      metadata: {
        user_id: userId,
        repayment_scope: 'portfolio',
        custom_fields: [
          {
            display_name: 'Scope',
            variable_name: 'repayment_scope',
            value: 'portfolio',
          },
        ],
      },
      firstname: user?.firstName ?? 'Customer',
      lastname: user?.lastName ?? 'User',
    }),
    [user?.email, user?.firstName, user?.lastName, userId]
  );

  const initiatePaystackPayment = usePaystackPayment(paystackHookConfig);

  const primaryGateway =
    gatewaySelection?.primary ?? gatewaySelection?.gateway ?? 'budpay';
  const fallbackOrder = gatewaySelection?.fallbackOrder ?? [];
  const gatewayChain: GatewayId[] = [primaryGateway, ...fallbackOrder].filter(
    (g, idx, arr): g is GatewayId => arr.indexOf(g) === idx
  );
  const firstAvailableGateway = gatewayChain.find((g) => {
    if (g === 'flutterwave') return false;
    if (g === 'paystack') return !!PAYSTACK_PUBLIC_KEY;
    return true;
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
    const c = paymentCommitRef.current;
    if (!c.userId || c.amount <= 0 || !referenceData?.reference) {
      setPaymentError('Unable to verify Paystack payment. Missing reference.');
      return;
    }
    if (c.mode === 'portfolio') {
      verifyPaystackMutation.mutate({
        scope: 'portfolio',
        userId: c.userId,
        amount: c.amount,
        reference: referenceData.reference,
      });
    } else if (c.loanId) {
      verifyPaystackMutation.mutate({
        loanId: c.loanId,
        amount: c.amount,
        reference: referenceData.reference,
      });
    }
  };

  const handleStartRepayment = () => {
    if (!userId || chargedAmount <= 0 || !hasDebt) return;
    if (!firstAvailableGateway) {
      setPaymentError(
        'No available payment gateway. Update payment gateway settings.'
      );
      return;
    }

    const isPortfolio =
      paySelection.kind === 'full' || paySelection.kind === 'percent';
    const batchLoanId =
      paySelection.kind === 'batch' ? paySelection.loanId : undefined;
    const refKey = batchLoanId ?? 'portfolio';

    paymentCommitRef.current = {
      mode: isPortfolio ? 'portfolio' : 'single',
      loanId: batchLoanId,
      userId,
      amount: chargedAmount,
    };
    setPaymentError(null);

    if (selectedGateway === 'paystack') {
      const uniqueRef = makePaystackReference(refKey, chargedAmount);
      try {
        initiatePaystackPayment({
          onSuccess: handlePaystackSuccess,
          onClose: () => {},
          config: {
            reference: uniqueRef,
            amount: Math.max(Math.round(chargedAmount * 100), 100),
            email: user?.email ?? 'customer@example.com',
            currency: 'NGN',
            metadata: isPortfolio
              ? {
                  user_id: userId,
                  repayment_scope: 'portfolio',
                  custom_fields: [
                    {
                      display_name: 'Scope',
                      variable_name: 'repayment_scope',
                      value: 'portfolio',
                    },
                  ],
                }
              : {
                  loan_id: batchLoanId!,
                  user_id: userId,
                  repayment_scope: 'single',
                  custom_fields: [
                    {
                      display_name: 'Loan ID',
                      variable_name: 'loan_id',
                      value: batchLoanId!,
                    },
                    {
                      display_name: 'Scope',
                      variable_name: 'repayment_scope',
                      value: 'single',
                    },
                  ],
                },
          },
        });
      } catch {
        setPaymentError(
          'Paystack checkout could not start. Try again or switch gateway.'
        );
      }
      return;
    }

    const uniqueRef = makeBudPayReference(refKey, chargedAmount);
    setCheckoutReference(uniqueRef);
    window.setTimeout(() => {
      initiatePaymentRef.current?.();
    }, 0);
  };

  const payButtonKey =
    paySelection.kind === 'full'
      ? 'full'
      : paySelection.kind === 'batch'
        ? `batch-${paySelection.loanId}`
        : `pct-${paySelection.percent}`;

  const renderSkeleton = () => (
    <Stack spacing={2}>
      <Skeleton variant="rounded" height={140} />
      <Skeleton variant="rounded" height={100} />
      <Skeleton variant="rounded" height={52} />
    </Stack>
  );

  const cardPaperSx = {
    borderRadius: 3,
    backgroundColor: '#fff',
    boxShadow: { md: 1 },
    border: { md: 1 },
    borderColor: { md: 'divider' },
  };

  const renderNoDebt = () => (
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
          Nothing to repay
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your balance is clear. New draws will show here as separate batches.
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
          Payment recorded
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatCurrency(lastPaidAmount)} was applied to your loan balance.
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

  const renderMain = () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: { md: 560 }, mx: { md: 'auto' } }}>
      <Paper elevation={0} sx={mergeSx(cardPaperSx, { p: 2.5 })}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Total owed now
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
          {formatCurrency(totalOwed)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Sum of what you still owe on every active draw. Pay everything at once, by the original
          draw amount (batch), or choose a percentage below.
        </Typography>
        <Stack spacing={0.75} sx={{ mt: 1.5 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 400, fontSize: '0.8125rem', lineHeight: 1.45 }}
          >
            Credit cap{' '}
            <Box component="span" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              {formatCurrency(creditCap)}
            </Box>
            {' — '}
            maximum total outstanding allowed on your account; it moves as you borrow and repay.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 400, fontSize: '0.8125rem', lineHeight: 1.45 }}
          >
            Left to borrow{' '}
            <Box component="span" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              {formatCurrency(leftToBorrow)}
            </Box>
            {' — '}
            how much more you can draw right now under your cap (repaying increases this).
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={mergeSx(cardPaperSx, { p: 2 })}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Pay by % of total owed
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
          <IconButton
            aria-label="Decrease percent"
            onClick={() => adjustPayPercent(-1)}
            disabled={!canDecreasePayPercent}
            color="primary"
            sx={{ border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
          <Box sx={{ textAlign: 'center', minWidth: 140 }}>
            <Typography variant="h5" fontWeight={800} component="span">
              {currentPercentStepper}
            </Typography>
            <Typography
              variant="body2"
              component="span"
              color="text.secondary"
              fontWeight={600}
            >
              %
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Pays {formatCurrency(round2((currentPercentStepper / 100) * totalOwed))}
            </Typography>
          </Box>
          <IconButton
            aria-label="Increase percent"
            onClick={() => adjustPayPercent(1)}
            disabled={!canIncreasePayPercent}
            color="primary"
            sx={{ border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        </Stack>
        <Button
          fullWidth
          variant={paySelection.kind === 'percent' ? 'contained' : 'outlined'}
          onClick={() =>
            setPaySelection({ kind: 'percent', percent: currentPercentStepper })
          }
          sx={{ mt: 2, borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
        >
          Use {currentPercentStepper}% payment
        </Button>
      </Paper>

      <Paper elevation={0} sx={mergeSx(cardPaperSx, { p: 2 })}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Pay everything owed
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          One payment clears all remaining tranches (oldest draw first on the server).
        </Typography>
        <Chip
          label={formatCurrency(totalOwed)}
          onClick={() => setPaySelection({ kind: 'full' })}
          color={paySelection.kind === 'full' ? 'primary' : 'default'}
          variant={paySelection.kind === 'full' ? 'filled' : 'outlined'}
          sx={{ fontWeight: 700 }}
        />
      </Paper>

      {repayableLoans.length > 0 && (
        <Paper elevation={0} sx={mergeSx(cardPaperSx, { p: 2 })}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Pay by draw (batch)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Each chip is how much you originally borrowed in that request. When a draw is fully
            repaid, it disappears from this list.
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {repayableLoans.map((l) => {
              const rem = loanRemaining(l);
              const selected =
                paySelection.kind === 'batch' && paySelection.loanId === l.id;
              return (
                <Chip
                  key={l.id}
                  label={`${formatCurrency(l.amount)} draw · ${formatCurrency(rem)} left`}
                  onClick={() => setPaySelection({ kind: 'batch', loanId: l.id })}
                  color={selected ? 'primary' : 'default'}
                  variant={selected ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 600 }}
                />
              );
            })}
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
          Using <strong>{formatGatewayLabel(selectedGateway)}</strong> instead of{' '}
          <strong>{formatGatewayLabel(gatewayChain[0])}</strong> — {fallbackReason}.
        </Alert>
      )}

      <Box>
        <Button
          key={payButtonKey}
          variant="contained"
          size="large"
          disabled={
            chargedAmount <= 0 ||
            repayMutation.isPending ||
            verifyPaystackMutation.isPending
          }
          onClick={handleStartRepayment}
          sx={mergeSx(containedCtaSx, { py: { md: 1.75 } })}
        >
          {repayMutation.isPending || verifyPaystackMutation.isPending
            ? 'Recording…'
            : `Pay ${formatCurrency(chargedAmount)}`}
        </Button>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
          {selectedGateway === 'budpay'
            ? 'Secured by BudPay'
            : selectedGateway === 'paystack'
              ? 'Secured by Paystack'
              : 'Flutterwave pending'}
        </Typography>
      </Box>
    </Stack>
  );

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
      <Stack spacing={2} sx={{ width: '100%', flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton aria-label="Back" onClick={() => router.back()} sx={{ borderRadius: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700}>
              Repayment
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              Total owed updates as you borrow or repay.
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ width: '100%', flex: 1 }}>
          {isLoading ? (
            renderSkeleton()
          ) : paymentSuccess ? (
            renderSuccess()
          ) : !hasDebt ? (
            renderNoDebt()
          ) : (
            renderMain()
          )}
        </Box>
      </Stack>
    </Box>
  );
}
