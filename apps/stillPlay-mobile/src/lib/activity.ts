import type { LoanItem, RepaymentItem } from "./api";

export function formatCurrency(amount: number): string {
  const n = typeof amount === "number" && !Number.isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return "—";
  }
  return d.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export type ActivityStatus =
  | "pending"
  | "approved"
  | "disbursed"
  | "repaid"
  | "rejected"
  | "repayment";

export type ActivityItem = {
  key: string;
  date: string;
  label: string;
  sublabel: string;
  amount: number;
  status: ActivityStatus;
};

/** Build activity timeline from loans and repayments (for notifications / recent activity). */
export function buildActivity(
  loans: LoanItem[],
  repayments: RepaymentItem[]
): ActivityItem[] {
  const events: ActivityItem[] = [];

  for (const l of loans) {
    const principal =
      typeof l.amount === "number" && !Number.isNaN(l.amount) ? l.amount : 0;
    const credited =
      typeof l.netDisbursed === "number" &&
      !Number.isNaN(l.netDisbursed) &&
      l.netDisbursed > 0
        ? l.netDisbursed
        : principal;
    const pendingSublabel = `Loan · ${formatCurrency(principal)}`;
    const created = l.createdAt ?? new Date().toISOString();

    if (l.status === "PENDING") {
      events.push({
        key: `loan-${l.id}-requested`,
        date: created,
        label: "Loan requested",
        sublabel: pendingSublabel,
        amount: principal,
        status: "pending",
      });
    }

    if (l.status === "REJECTED") {
      events.push({
        key: `loan-${l.id}-rejected`,
        date: l.updatedAt ?? created,
        label: "Loan rejected",
        sublabel: pendingSublabel,
        amount: principal,
        status: "rejected",
      });
    } else if (["APPROVED", "DISBURSED", "REPAID"].includes(l.status)) {
      const approvedAt =
        l.approvedAt ?? l.updatedAt ?? l.disbursedAt ?? created;
      const grantedSublabel =
        credited !== principal
          ? `${formatCurrency(credited)} to wallet · repay ${formatCurrency(principal)}`
          : `Loan · ${formatCurrency(principal)}`;
      events.push({
        key: `loan-${l.id}-approved`,
        date: approvedAt,
        label: "Loan granted",
        sublabel: grantedSublabel,
        amount: credited,
        status: "approved",
      });

      if (["DISBURSED", "REPAID"].includes(l.status) && l.disbursedAt) {
        events.push({
          key: `loan-${l.id}-disbursed`,
          date: l.disbursedAt,
          label: "Loan disbursed",
          sublabel: grantedSublabel,
          amount: credited,
          status: "disbursed",
        });
      }

      if (l.status === "REPAID" && l.repaidAt) {
        events.push({
          key: `loan-${l.id}-repaid`,
          date: l.repaidAt,
          label: "Loan fully repaid",
          sublabel: `Loan · ${formatCurrency(principal)}`,
          amount: principal,
          status: "repaid",
        });
      }
    }
  }

  for (const r of repayments) {
    const loanTail =
      typeof r.loanId === "string" && r.loanId.length > 0
        ? r.loanId.slice(-6)
        : "—";
    const repaidAt = r.repaidAt ?? new Date().toISOString();
    const repAmount =
      typeof r.amount === "number" && !Number.isNaN(r.amount) ? r.amount : 0;
    events.push({
      key: `repayment-${r.id}`,
      date: repaidAt,
      label: "Repayment made",
      sublabel: `Repayment · Loan #${loanTail}`,
      amount: repAmount,
      status: "repayment",
    });
  }

  return events.sort((a, b) => {
    const tb = new Date(b.date).getTime();
    const ta = new Date(a.date).getTime();
    const safeB = Number.isNaN(tb) ? 0 : tb;
    const safeA = Number.isNaN(ta) ? 0 : ta;
    return safeB - safeA;
  });
}

export function getDateSection(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (dateOnly.getTime() === today.getTime()) return "Today";
  if (dateOnly.getTime() === yesterday.getTime()) return "Yesterday";
  if (dateOnly.getTime() >= weekAgo.getTime()) return "This week";
  return "Earlier";
}
