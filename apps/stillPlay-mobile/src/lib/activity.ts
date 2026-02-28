import type { LoanItem, RepaymentItem } from "./api";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
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
    const amount = l.amount;
    const sublabel = `Loan · ${formatCurrency(amount)}`;

    events.push({
      key: `loan-${l.id}-requested`,
      date: l.createdAt,
      label: "Loan requested",
      sublabel,
      amount,
      status: "pending",
    });

    if (l.status === "REJECTED") {
      events.push({
        key: `loan-${l.id}-rejected`,
        date: l.updatedAt ?? l.createdAt,
        label: "Loan rejected",
        sublabel,
        amount,
        status: "rejected",
      });
    } else if (["APPROVED", "DISBURSED", "REPAID"].includes(l.status)) {
      const approvedAt =
        l.approvedAt ?? l.updatedAt ?? l.disbursedAt ?? l.createdAt;
      events.push({
        key: `loan-${l.id}-approved`,
        date: approvedAt,
        label: "Loan approved",
        sublabel,
        amount,
        status: "approved",
      });

      if (["DISBURSED", "REPAID"].includes(l.status) && l.disbursedAt) {
        events.push({
          key: `loan-${l.id}-disbursed`,
          date: l.disbursedAt,
          label: "Loan disbursed",
          sublabel,
          amount,
          status: "disbursed",
        });
      }

      if (l.status === "REPAID" && l.repaidAt) {
        events.push({
          key: `loan-${l.id}-repaid`,
          date: l.repaidAt,
          label: "Loan fully repaid",
          sublabel,
          amount,
          status: "repaid",
        });
      }
    }
  }

  for (const r of repayments) {
    events.push({
      key: `repayment-${r.id}`,
      date: r.repaidAt,
      label: "Repayment made",
      sublabel: `Repayment · Loan #${r.loanId.slice(-6)}`,
      amount: r.amount,
      status: "repayment",
    });
  }

  return events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
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
