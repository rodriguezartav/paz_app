import { cn } from "@/lib/utils"
import type { IngredientType, Measurement, MealType, ShoppingItemStatus } from "@/lib/types"

interface IngredientTypeBadgeProps {
  type: IngredientType
  className?: string
}

export function IngredientTypeBadge({ type, className }: IngredientTypeBadgeProps) {
  const labels: Record<IngredientType, string> = {
    staple: "Staple",
    protein: "Protein",
    vegetable: "Vegetable",
    fruit: "Fruit",
    condiment: "Condiment",
    dairy: "Dairy",
    cleaning: "Cleaning",
    other: "Other",
  }

  const colors: Record<IngredientType, string> = {
    staple: "bg-primary/10 text-primary",
    protein: "bg-destructive/10 text-destructive",
    vegetable: "bg-secondary/20 text-secondary-foreground",
    fruit: "bg-accent/20 text-accent-foreground",
    condiment: "bg-muted text-muted-foreground",
    dairy: "bg-primary/20 text-primary",
    cleaning: "bg-accent/10 text-accent-foreground",
    other: "bg-border text-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        colors[type],
        className
      )}
    >
      {labels[type]}
    </span>
  )
}

interface MeasurementBadgeProps {
  measurement: Measurement
  className?: string
}

export function MeasurementBadge({ measurement, className }: MeasurementBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground",
        className
      )}
    >
      {measurement}
    </span>
  )
}

interface MealTypeBadgeProps {
  mealType: MealType
  className?: string
}

export function MealTypeBadge({ mealType, className }: MealTypeBadgeProps) {
  const labels: Record<MealType, string> = {
    breakfast: "Breakfast",
    brunch: "Brunch",
    dinner: "Dinner",
  }

  const colors: Record<MealType, string> = {
    breakfast: "bg-primary/20 text-primary",
    brunch: "bg-secondary/20 text-secondary-foreground",
    dinner: "bg-accent/20 text-accent-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold",
        colors[mealType],
        className
      )}
    >
      {labels[mealType]}
    </span>
  )
}

interface ShoppingStatusBadgeProps {
  status: ShoppingItemStatus
  className?: string
}

export function ShoppingStatusBadge({ status, className }: ShoppingStatusBadgeProps) {
  const labels: Record<ShoppingItemStatus, string> = {
    needed: "Needed",
    bought: "Bought",
    in_stock: "In Stock",
  }

  const colors: Record<ShoppingItemStatus, string> = {
    needed: "bg-primary/20 text-primary",
    bought: "bg-success/20 text-success",
    in_stock: "bg-secondary/20 text-secondary-foreground",
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
