import { cn } from "@/lib/utils"
import type { Diet, ResidentStatus, PaymentStatus } from "@/lib/types"

interface DietBadgeProps {
  diet: Diet
  className?: string
}

export function DietBadge({ diet, className }: DietBadgeProps) {
  const labels: Record<Diet, string> = {
    eats_all: "Eats All",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
  }

  const colors: Record<Diet, string> = {
    eats_all: "bg-primary/10 text-primary",
    vegetarian: "bg-secondary/20 text-secondary-foreground",
    vegan: "bg-secondary/30 text-secondary-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        colors[diet],
        className
      )}
    >
      {labels[diet]}
    </span>
  )
}

interface StatusBadgeProps {
  status: ResidentStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const labels: Record<ResidentStatus, string> = {
    upcoming: "Upcoming",
    checked_in: "Checked In",
    staying: "Staying",
    checking_out_today: "Checking Out",
    checked_out: "Checked Out",
    cancelled: "Cancelled",
  }

  const colors: Record<ResidentStatus, string> = {
    upcoming: "bg-accent/20 text-accent-foreground",
    checked_in: "bg-primary/20 text-primary",
    staying: "bg-secondary/20 text-secondary-foreground",
    checking_out_today: "bg-primary/30 text-primary",
    checked_out: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        colors[status],
        className
      )}
    >
      {labels[status]}
    </span>
  )
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  className?: string
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const labels: Record<PaymentStatus, string> = {
    unpaid: "Unpaid",
    deposit_paid: "Deposit Paid",
    partially_paid: "Partial",
    paid: "Paid",
    refunded: "Refunded",
  }

  const colors: Record<PaymentStatus, string> = {
    unpaid: "bg-destructive/10 text-destructive",
    deposit_paid: "bg-primary/20 text-primary",
    partially_paid: "bg-primary/30 text-primary",
    paid: "bg-success/20 text-success",
    refunded: "bg-muted text-muted-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        colors[status],
        className
      )}
    >
      {labels[status]}
    </span>
  )
}

interface BalanceDueBadgeProps {
  balanceDue: number
  currency: string
  className?: string
}

export function BalanceDueBadge({ balanceDue, currency, className }: BalanceDueBadgeProps) {
  const isPaid = balanceDue === 0
  const formattedAmount = currency === "CRC" 
    ? `₡${balanceDue.toLocaleString()}`
    : `$${balanceDue.toLocaleString()}`

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold",
        isPaid
          ? "bg-success/20 text-success"
          : "bg-primary/20 text-primary",
        className
      )}
    >
      {isPaid ? "Paid in full" : `Balance Due: ${formattedAmount}`}
    </span>
  )
}
